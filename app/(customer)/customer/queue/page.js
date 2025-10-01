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

/**
 * Customer Queue Status Page - Real-time queue tracking for customers
 */
export default function CustomerQueue() {
  const [refreshing, setRefreshing] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Sample customer queue data
  const queueData = {
    customerPosition: 3,
    estimatedWaitTime: 25, // minutes
    totalInQueue: 8,
    currentlyServing: 'Customer #001',
    averageServiceTime: 12, // minutes
    queueStatus: 'active', // active, paused, closed
    joinedAt: '2:15 PM',
    service: 'Strategy Consulting',
    staff: 'James Wilson',
    location: 'Conference Room A'
  }

  const queueHistory = [
    { position: 5, time: '2:15 PM', status: 'joined' },
    { position: 4, time: '2:27 PM', status: 'moved' },
    { position: 3, time: '2:35 PM', status: 'current' }
  ]

  const otherQueues = [
    { service: 'Business Planning', staff: 'Sarah Mitchell', queueLength: 4, avgWait: 15 },
    { service: 'Financial Review', staff: 'Robert Chang', queueLength: 2, avgWait: 8 },
    { service: 'Legal Consultation', staff: 'David Wilson', queueLength: 6, avgWait: 30 }
  ]

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false)
    }, 1000)
  }

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
      <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold mb-1">You're in the queue! 🎯</h2>
            <p className="text-primary-100">Service: {queueData.service}</p>
            <p className="text-primary-100">Staff: {queueData.staff}</p>
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
            <div className="text-sm text-primary-200">Your Position</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{queueData.estimatedWaitTime}</div>
            <div className="text-sm text-primary-200">Est. Wait (min)</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold mb-1">{queueData.totalInQueue}</div>
            <div className="text-sm text-primary-200">Total in Queue</div>
          </div>
        </div>
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
                <Button variant="outline" className="justify-start">
                  <Bell className="h-4 w-4 mr-2" />
                  Enable Notifications
                </Button>
                <Button variant="outline" className="justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Staff
                </Button>
                <Button variant="outline" className="justify-start text-red-600 hover:text-red-700">
                  <Eye className="h-4 w-4 mr-2" />
                  Leave Queue
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                    <h3 className="font-semibold text-secondary-900">{queue.service}</h3>
                    <p className="text-sm text-secondary-600">{queue.staff}</p>
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
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Phone className="h-5 w-5" />
              <span>Call When Ready</span>
            </Button>
            <Link href="/customer/notifications">
              <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 w-full">
                <MessageSquare className="h-5 w-5" />
                <span>Chat Support</span>
              </Button>
            </Link>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 text-red-600 hover:text-red-700">
              <Eye className="h-5 w-5" />
              <span>Leave Queue</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}