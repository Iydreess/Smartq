'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui'
import { useUser } from '@/lib/supabase/hooks'
import { RefreshCw } from 'lucide-react'

/**
 * Dashboard Overview Page
 */
export default function DashboardPage() {
  const { user, loading } = useUser()

  const stats = [
    {
      title: 'Active Queues',
      value: '12',
      change: '+2 from yesterday',
      changeType: 'positive',
    },
    {
      title: 'People in Queue',
      value: '43',
      change: '+12% from last hour',
      changeType: 'positive',
    },
    {
      title: 'Avg Wait Time',
      value: '8 min',
      change: '-15% from yesterday',
      changeType: 'positive',
    },
    {
      title: 'Appointments Today',
      value: '28',
      change: '+4 from yesterday',
      changeType: 'positive',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">
          Welcome back, {user?.full_name || user?.email || 'Business Owner'}! 👋
        </h1>
        <p className="text-secondary-600">
          Here&apos;s what&apos;s happening with your queues and appointments.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-secondary-600">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary-900 mb-1">
                {stat.value}
              </div>
              <div className={`text-sm ${
                stat.changeType === 'positive' ? 'text-success-600' : 'text-error-600'
              }`}>
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Queue Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">
                      #{index + 1001}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">
                      Customer joined General Service queue
                    </p>
                    <p className="text-xs text-secondary-500">
                      {index + 1} minutes ago
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                    <svg className="h-4 w-4 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">
                      Consultation with John Doe
                    </p>
                    <p className="text-xs text-secondary-500">
                      {2 + index}:00 PM - 30 minutes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}