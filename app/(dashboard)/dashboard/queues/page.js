'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { 
  Users, Clock, Play, Pause, SkipForward, AlertCircle, 
  CheckCircle, XCircle, RefreshCw, Settings, Filter,
  Phone, MessageSquare, UserCheck, Calendar
} from 'lucide-react'

/**
 * Queue Management Dashboard
 * Comprehensive queue management for business owners
 */
export default function QueuesPage() {
  const [activeQueues, setActiveQueues] = useState([
    {
      id: 1,
      name: 'General Consultation',
      category: 'Healthcare',
      status: 'active',
      currentServing: { number: 'A001', name: 'John Smith', waitTime: '12 min' },
      nextInLine: { number: 'A002', name: 'Sarah Johnson', waitTime: '8 min' },
      totalWaiting: 8,
      avgWaitTime: '15 min',
      estimatedCompletion: '2:30 PM',
      staff: 'Dr. Emily Rodriguez'
    },
    {
      id: 2,
      name: 'Tax Consultation',
      category: 'Professional Services', 
      status: 'active',
      currentServing: { number: 'B003', name: 'Mike Chen', waitTime: '22 min' },
      nextInLine: { number: 'B004', name: 'Lisa Wang', waitTime: '18 min' },
      totalWaiting: 5,
      avgWaitTime: '25 min',
      estimatedCompletion: '3:15 PM',
      staff: 'Robert Chang'
    },
    {
      id: 3,
      name: 'Personal Training',
      category: 'Sports & Fitness',
      status: 'paused',
      currentServing: null,
      nextInLine: { number: 'C001', name: 'Alex Rodriguez', waitTime: '0 min' },
      totalWaiting: 3,
      avgWaitTime: '0 min',
      estimatedCompletion: 'Paused',
      staff: 'Alex Johnson'
    }
  ])

  const [selectedQueue, setSelectedQueue] = useState(null)

  const handleQueueAction = (queueId, action) => {
    setActiveQueues(prev => prev.map(queue => {
      if (queue.id === queueId) {
        switch (action) {
          case 'pause':
            return { ...queue, status: 'paused' }
          case 'resume':
            return { ...queue, status: 'active' }
          case 'next':
            // Simulate moving to next customer
            return {
              ...queue,
              currentServing: queue.nextInLine,
              totalWaiting: Math.max(0, queue.totalWaiting - 1)
            }
          default:
            return queue
        }
      }
      return queue
    }))
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'paused': return 'text-yellow-600 bg-yellow-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getPriorityColor = (waitTime) => {
    const minutes = parseInt(waitTime)
    if (minutes > 30) return 'border-l-red-500 bg-red-50'
    if (minutes > 15) return 'border-l-yellow-500 bg-yellow-50'
    return 'border-l-green-500 bg-green-50'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Queue Management</h1>
          <p className="text-secondary-600">Monitor and control all active queues in real-time</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter Queues
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Queue Settings
          </Button>
        </div>
      </div>

      {/* Queue Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total in Queue</p>
                <p className="text-2xl font-bold">16</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Avg Wait Time</p>
                <p className="text-2xl font-bold">18min</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Served Today</p>
                <p className="text-2xl font-bold">42</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-2xl font-bold">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {activeQueues.map((queue) => (
          <Card key={queue.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{queue.name}</CardTitle>
                  <p className="text-sm text-gray-600">{queue.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(queue.status)}`}>
                    {queue.status.charAt(0).toUpperCase() + queue.status.slice(1)}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Currently Serving */}
              {queue.currentServing ? (
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Currently Serving</p>
                      <p className="text-lg font-bold text-blue-700">
                        {queue.currentServing.number} - {queue.currentServing.name}
                      </p>
                      <p className="text-sm text-gray-600">Wait time: {queue.currentServing.waitTime}</p>
                    </div>
                    <UserCheck className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded-lg border-l-4 border-l-gray-300">
                  <p className="text-sm font-medium text-gray-500">No one currently being served</p>
                </div>
              )}

              {/* Next in Line */}
              {queue.nextInLine && (
                <div className={`p-3 rounded-lg border-l-4 ${getPriorityColor(queue.nextInLine.waitTime)}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Next in Line</p>
                      <p className="font-semibold text-gray-900">
                        {queue.nextInLine.number} - {queue.nextInLine.name}
                      </p>
                      <p className="text-sm text-gray-600">Waiting: {queue.nextInLine.waitTime}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Phone className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Queue Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Total Waiting</p>
                  <p className="font-semibold">{queue.totalWaiting} people</p>
                </div>
                <div>
                  <p className="text-gray-600">Avg Wait</p>
                  <p className="font-semibold">{queue.avgWaitTime}</p>
                </div>
                <div>
                  <p className="text-gray-600">Staff Member</p>
                  <p className="font-semibold">{queue.staff}</p>
                </div>
                <div>
                  <p className="text-gray-600">Est. Completion</p>
                  <p className="font-semibold">{queue.estimatedCompletion}</p>
                </div>
              </div>

              {/* Queue Controls */}
              <div className="flex gap-2 pt-2 border-t">
                {queue.status === 'active' ? (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleQueueAction(queue.id, 'pause')}
                    className="flex items-center gap-1"
                  >
                    <Pause className="h-3 w-3" />
                    Pause
                  </Button>
                ) : (
                  <Button 
                    size="sm"
                    onClick={() => handleQueueAction(queue.id, 'resume')}
                    className="flex items-center gap-1"
                  >
                    <Play className="h-3 w-3" />
                    Resume
                  </Button>
                )}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleQueueAction(queue.id, 'next')}
                  className="flex items-center gap-1"
                  disabled={!queue.nextInLine}
                >
                  <SkipForward className="h-3 w-3" />
                  Next
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedQueue(queue)}
                  className="flex items-center gap-1"
                >
                  <Users className="h-3 w-3" />
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Users className="h-5 w-5" />
              <span>Create New Queue</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Schedule Appointment</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span>Send Notifications</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}