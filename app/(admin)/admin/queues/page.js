'use client'

import { useState } from 'react'
import { Card, Button, Input, Badge } from '@/components/ui'

/**
 * AdminQueuesPage Component - Monitor all system queues
 * 
 * @returns {JSX.Element} AdminQueuesPage component
 */
export default function AdminQueuesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Mock queue data
  const queues = [
    {
      id: 1,
      name: 'General Checkup',
      business: 'Downtown Dental Clinic',
      industry: 'Healthcare',
      status: 'active',
      waiting: 8,
      served: 45,
      avgWaitTime: '12 min',
      peakTime: '10:00 AM',
      lastUpdated: '2 min ago'
    },
    {
      id: 2,
      name: 'Hair Styling',
      business: 'Beauty Bliss Salon',
      industry: 'Beauty & Wellness',
      status: 'active',
      waiting: 12,
      served: 67,
      avgWaitTime: '25 min',
      peakTime: '2:00 PM',
      lastUpdated: '1 min ago'
    },
    {
      id: 3,
      name: 'Personal Training',
      business: 'Fitness First Gym',
      industry: 'Sports & Fitness',
      status: 'paused',
      waiting: 3,
      served: 28,
      avgWaitTime: '15 min',
      peakTime: '6:00 PM',
      lastUpdated: '5 min ago'
    },
    {
      id: 4,
      name: 'Legal Consultation',
      business: 'Legal Solutions LLC',
      industry: 'Professional Services',
      status: 'closed',
      waiting: 0,
      served: 156,
      avgWaitTime: '30 min',
      peakTime: '11:00 AM',
      lastUpdated: '1 hour ago'
    }
  ]

  const filteredQueues = queues.filter(queue => {
    const matchesSearch = queue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          queue.business.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || queue.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusBadgeColor = (status) => {
    const colors = {
      active: 'green',
      paused: 'orange',
      closed: 'gray',
      full: 'red'
    }
    return colors[status] || 'gray'
  }

  return (
    <div className="space-y-6">
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Queue Management</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">Monitor and manage all system queues in real-time</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search queues by name or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="closed">Closed</option>
              <option value="full">Full</option>
            </select>
            <Button className="w-full sm:w-auto">Refresh</Button>
            <Button className="w-full sm:w-auto">Export CSV</Button>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Active Queues</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">234</div>
          <div className="text-xs sm:text-sm text-green-600 mt-1">↑ 5% from yesterday</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Total Waiting</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">1,847</div>
          <div className="text-xs sm:text-sm text-orange-600 mt-1">Across all queues</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Served Today</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">8,942</div>
          <div className="text-xs sm:text-sm text-purple-600 mt-1">↑ 15% from yesterday</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Avg Wait Time</div>
          <div className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">18 min</div>
          <div className="text-xs sm:text-sm text-blue-600 mt-1">System-wide average</div>
        </Card>
      </div>

      {/* Queues Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Queue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waiting
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Served Today
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Wait
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peak Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredQueues.map((queue) => (
                <tr key={queue.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{queue.name}</div>
                      <div className="text-sm text-gray-500">{queue.industry}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {queue.business}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge color={getStatusBadgeColor(queue.status)}>
                      {queue.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-semibold ${queue.waiting > 10 ? 'text-red-600' : 'text-gray-900'}`}>
                      {queue.waiting}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {queue.served}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {queue.avgWaitTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {queue.peakTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {queue.lastUpdated}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex gap-2 items-center">
                      <button 
                        className="p-1.5 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                        title="Monitor"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </button>
                      <button 
                        className="p-1.5 text-orange-600 hover:text-orange-900 hover:bg-orange-50 rounded transition-colors"
                        title="Pause"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredQueues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No queues found</p>
          </div>
        )}
      </Card>
    </div>
  )
}
