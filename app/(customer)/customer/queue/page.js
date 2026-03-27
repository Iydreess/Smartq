'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { 
  Clock, Users, MapPin, Bell, RefreshCw, Phone,
  CheckCircle, AlertCircle, User, Calendar, 
  MessageSquare, Eye, TrendingUp, Activity,
  Zap, Timer, Target
} from 'lucide-react'
import { useUser } from '@/lib/supabase/hooks'
import {
  getCustomerQueueEntries,
  snoozeQueueEntry,
  returnFromSnooze,
  expireSnoozedQueueEntries,
  leaveQueueEntry,
} from '@/lib/supabase/queries'
import toast from 'react-hot-toast'

/**
 * Customer Queue Status Page - Real-time queue tracking for customers
 */
export default function CustomerQueue() {
  const SNOOZE_OPTIONS = [5, 10, 15, 20]
  const { user, loading: userLoading } = useUser()
  const [refreshing, setRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [queueEntries, setQueueEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSnoozeMinutes, setSelectedSnoozeMinutes] = useState(10)
  const [stepAwayLoading, setStepAwayLoading] = useState(false)
  const [backLoading, setBackLoading] = useState(false)
  const [leaveLoading, setLeaveLoading] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState('default')

  // Update time every second for snooze countdowns
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  async function fetchQueueEntries() {
    if (!user) return
    
    try {
      await expireSnoozedQueueEntries(user.id)
      const entries = await getCustomerQueueEntries(user.id)
      setQueueEntries(entries || [])
    } catch (error) {
      console.error('Error fetching queue entries:', error)
      toast.error('Failed to load queue status')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQueueEntries()
  }, [user])

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (!('Notification' in window)) {
      setNotificationPermission('unsupported')
      return
    }

    setNotificationPermission(Notification.permission)
  }, [])

  // Keep queue status in sync while on this screen without forcing users to click refresh.
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      fetchQueueEntries()
    }, 15000)

    return () => clearInterval(interval)
  }, [user])

  const handleRefresh = async () => {
    if (!user) return
    setRefreshing(true)
    try {
      await fetchQueueEntries()
      toast.success('Queue status updated')
    } catch (error) {
      console.error('Error refreshing queue:', error)
      toast.error('Failed to refresh')
    } finally {
      setRefreshing(false)
    }
  }

  const currentQueueEntry = queueEntries.find(entry => 
    entry.status === 'waiting' ||
    entry.status === 'called' ||
    entry.status === 'serving' ||
    entry.status === 'snoozed'
  )

  const isSnoozed = currentQueueEntry?.status === 'snoozed'

  const getDisplayText = (value, fallback = 'N/A') => {
    if (value === null || value === undefined) return fallback
    if (typeof value === 'string' || typeof value === 'number') return value
    if (typeof value === 'object') {
      return value.name || value.title || fallback
    }
    return fallback
  }

  const snoozeMsRemaining = currentQueueEntry?.snooze_until
    ? new Date(currentQueueEntry.snooze_until).getTime() - currentTime.getTime()
    : 0

  const snoozeSecondsRemaining = Math.max(0, Math.floor(snoozeMsRemaining / 1000))

  useEffect(() => {
    if (!isSnoozed || !currentQueueEntry?.id) return
    if (snoozeSecondsRemaining > 0) return

    fetchQueueEntries()
  }, [isSnoozed, currentQueueEntry?.id, snoozeSecondsRemaining])

  const formatCountdown = (seconds) => {
    const minutesPart = Math.floor(seconds / 60)
    const secondsPart = seconds % 60
    return `${minutesPart}:${String(secondsPart).padStart(2, '0')}`
  }

  const handleStepAway = async () => {
    if (!currentQueueEntry) return

    if (stepAwayLoading || backLoading) return

    if (currentQueueEntry.status === 'serving') {
      toast.error('Step Away is unavailable while your service is in progress.')
      return
    }

    try {
      setStepAwayLoading(true)
      await snoozeQueueEntry(currentQueueEntry.id, selectedSnoozeMinutes)
      toast.success(`Step Away enabled for ${selectedSnoozeMinutes} minutes`)
      await fetchQueueEntries()
    } catch (error) {
      console.error('Error enabling Step Away mode:', error)
      toast.error(error.message || 'Failed to enable Step Away mode')
    } finally {
      setStepAwayLoading(false)
    }
  }

  const handleImBack = async () => {
    if (!currentQueueEntry) return

    if (stepAwayLoading || backLoading) return

    try {
      setBackLoading(true)
      await returnFromSnooze(currentQueueEntry.id)
      toast.success('Welcome back! You are back in queue.')
      await fetchQueueEntries()
    } catch (error) {
      console.error('Error returning from Step Away mode:', error)
      toast.error(error.message || 'Failed to return to queue')
    } finally {
      setBackLoading(false)
    }
  }

  const handleEnableNotifications = async () => {
    if (typeof window === 'undefined') return

    if (!('Notification' in window)) {
      toast.error('This browser does not support notifications.')
      return
    }

    if (Notification.permission === 'granted') {
      setNotificationPermission('granted')
      toast.success('Notifications are already enabled.')
      return
    }

    const permission = await Notification.requestPermission()
    setNotificationPermission(permission)

    if (permission === 'granted') {
      toast.success('Notifications enabled. You will receive queue updates.')
      return
    }

    toast.error('Notification permission was not granted.')
  }

  const handleContactStaff = () => {
    const phone = currentQueueEntry?.queue?.business?.phone

    if (!phone) {
      toast.error('No contact number available for this business.')
      return
    }

    if (typeof window !== 'undefined') {
      window.location.href = `tel:${phone}`
    }
  }

  const handleLeaveQueue = async () => {
    if (!currentQueueEntry || stepAwayLoading || backLoading || leaveLoading) return

    const shouldLeave = confirm('Are you sure you want to leave this queue?')
    if (!shouldLeave) return

    try {
      setLeaveLoading(true)
      await leaveQueueEntry(currentQueueEntry.id)
      toast.success('You have left the queue.')
      await fetchQueueEntries()
    } catch (error) {
      console.error('Error leaving queue:', error)
      toast.error(error.message || 'Failed to leave queue')
    } finally {
      setLeaveLoading(false)
    }
  }

  const queueData = currentQueueEntry ? {
    customerPosition: currentQueueEntry.position,
    estimatedWaitTime: currentQueueEntry.estimated_wait_time || 0,
    totalInQueue: 8, // TODO: Get from queue
    currentlyServing: 'Customer #001', // TODO: Get from queue
    averageServiceTime: 12,
    queueStatus: currentQueueEntry.queue?.status || 'active',
    joinedAt: new Date(currentQueueEntry.joined_at).toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit' 
    }),
    service: getDisplayText(currentQueueEntry.queue?.service, 'General Service'),
    staff: getDisplayText(currentQueueEntry.queue?.staff || currentQueueEntry.queue?.service, 'Staff Member'),
    location: getDisplayText(currentQueueEntry.queue?.business?.address, 'Main Location'),
    entryStatus: currentQueueEntry.status,
    snoozeUntil: currentQueueEntry.snooze_until,
  } : null

  const queueHistory = []
  const otherQueues = []

  const getQueueStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200'
      case 'paused': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'closed': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading queue status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Queue Status</h1>
          <p className="text-secondary-600">Track your position and wait time in real-time</p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Current Queue Status */}
      {queueData ? (
      <>
      <div className={`rounded-xl p-6 text-white ${
        isSnoozed
          ? 'bg-gradient-to-r from-amber-500 to-orange-600'
          : 'bg-gradient-to-r from-primary-600 to-blue-600'
      }`}>
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold mb-1">
              {isSnoozed ? 'Step Away mode is active ⏸️' : 'You&apos;re in the queue! 🎯'}
            </h2>
            <p className="text-primary-100">Service: {queueData.service}</p>
            <p className="text-primary-100">Staff: {queueData.staff}</p>
            {isSnoozed && queueData.snoozeUntil && (
              <p className="text-amber-100 font-medium mt-2">
                Return by {new Date(queueData.snoozeUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border bg-white ${
            queueData.queueStatus === 'active' ? 'text-green-600 border-green-200' : 
            queueData.queueStatus === 'paused' ? 'text-yellow-600 border-yellow-200' :
            'text-red-600 border-red-200'
          }`}>
            Queue {queueData.queueStatus}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">#{queueData.customerPosition}</div>
            <div className="text-sm text-primary-200">{isSnoozed ? 'Held Position' : 'Your Position'}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">
              {isSnoozed ? formatCountdown(snoozeSecondsRemaining) : queueData.estimatedWaitTime}
            </div>
            <div className="text-sm text-primary-200">{isSnoozed ? 'Return Countdown' : 'Est. Wait (min)'}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{queueData.totalInQueue}</div>
            <div className="text-sm text-primary-200">Total in Queue</div>
          </div>
        </div>

        {isSnoozed && (
          <div className="mt-4 p-3 bg-white/20 border border-white/30 rounded-lg text-sm">
            {snoozeSecondsRemaining > 120
              ? 'Step Away is active. Tap “I\'m Back” before time runs out.'
              : 'Return now! Your Step Away time is almost over.'}
          </div>
        )}
      </div>

      {/* Queue Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Queue Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary-600" />
              Queue Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  ✓
                </div>
                <span className="font-medium text-green-800">Currently Serving</span>
              </div>
              <span className="text-green-600 font-medium">{queueData.currentlyServing}</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Queue Progress</span>
                <span>{queueData.totalInQueue - queueData.customerPosition} of {queueData.totalInQueue} served</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${((queueData.totalInQueue - queueData.customerPosition) / queueData.totalInQueue) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-secondary-900">Queue History</h4>
              {queueHistory.map((entry, index) => (
                <div key={index} className="flex items-center gap-3 p-2 border rounded">
                  <div className={`w-2 h-2 rounded-full ${
                    entry.status === 'current' ? 'bg-primary-600' :
                    entry.status === 'moved' ? 'bg-green-500' : 'bg-gray-400'
                  }`}></div>
                  <span className="text-sm">Position #{entry.position}</span>
                  <span className="text-xs text-gray-500 ml-auto">{entry.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Service Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary-600" />
              Service Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Service</span>
                </div>
                <p className="text-blue-900 font-semibold">{queueData.service}</p>
              </div>
              
              <div className="bg-green-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Staff</span>
                </div>
                <p className="text-green-900 font-semibold">{queueData.staff}</p>
              </div>
              
              <div className="bg-purple-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Location</span>
                </div>
                <p className="text-purple-900 font-semibold">{queueData.location}</p>
              </div>
              
              <div className="bg-orange-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Timer className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Avg. Time</span>
                </div>
                <p className="text-orange-900 font-semibold">{queueData.averageServiceTime} min</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium text-secondary-900 mb-2">Queue Actions</h4>
              <div className="grid grid-cols-1 gap-2">
                {isSnoozed ? (
                  <Button onClick={handleImBack} loading={backLoading} className="justify-start">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    I&apos;m Back
                  </Button>
                ) : (
                  <div className="border rounded-lg p-3 space-y-3">
                    <p className="text-sm text-secondary-700">Step Away mode</p>
                    <div className="flex flex-wrap gap-2">
                      {SNOOZE_OPTIONS.map((minutes) => (
                        <Button
                          key={minutes}
                          size="sm"
                          variant={selectedSnoozeMinutes === minutes ? 'default' : 'outline'}
                          onClick={() => setSelectedSnoozeMinutes(minutes)}
                        >
                          {minutes} min
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="warning"
                      className="justify-start"
                      onClick={handleStepAway}
                      loading={stepAwayLoading}
                      disabled={currentQueueEntry?.status === 'serving' || backLoading}
                    >
                      <Timer className="h-4 w-4 mr-2" />
                      Step Away For {selectedSnoozeMinutes} min
                    </Button>
                  </div>
                )}
                <Button variant="outline" className="justify-start" onClick={handleEnableNotifications}>
                  <Bell className="h-4 w-4 mr-2" />
                  {notificationPermission === 'granted' ? 'Notifications Enabled' : 'Enable Notifications'}
                </Button>
                <Button variant="outline" className="justify-start" onClick={handleContactStaff}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Staff
                </Button>
                <Button
                  variant="outline"
                  className="justify-start text-red-600 hover:text-red-700"
                  onClick={handleLeaveQueue}
                  loading={leaveLoading}
                  disabled={stepAwayLoading || backLoading}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Leave Queue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">No Active Queue</h3>
            <p className="text-secondary-600 mb-4">You&apos;re not currently in any queue</p>
            <Link href="/customer/services">
              <Button>Browse Services</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Other Available Queues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-600" />
            Other Available Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherQueues.map((queue, index) => (
              <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-secondary-900">{getDisplayText(queue.service, 'Service')}</h3>
                    <p className="text-sm text-secondary-600">{getDisplayText(queue.staff, 'Staff')}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Queue Length:</span>
                    <span className="font-medium">{queue.queueLength} people</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">Avg. Wait:</span>
                    <span className="font-medium">{queue.avgWait} min</span>
                  </div>
                  <Link href="/customer/services">
                    <Button size="sm" className="w-full mt-2">
                      Join Queue
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/customer/notifications">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 w-full">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </Button>
            </Link>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2" onClick={handleContactStaff}>
              <Phone className="h-5 w-5" />
              <span>Call Staff</span>
            </Button>
            <Link href="/customer/notifications">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 w-full">
                <MessageSquare className="h-5 w-5" />
                <span>Chat Support</span>
              </Button>
            </Link>
            <Button
              variant="outline"
              className="h-16 flex flex-col items-center justify-center gap-2 text-red-600 hover:text-red-700"
              onClick={handleLeaveQueue}
              loading={leaveLoading}
              disabled={stepAwayLoading || backLoading}
            >
              <Eye className="h-5 w-5" />
              <span>Leave Queue</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}