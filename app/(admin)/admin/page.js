'use client'

import { Card } from '@/components/ui'
import Link from 'next/link'
import { useUser } from '@/lib/supabase/hooks'
import { RefreshCw } from 'lucide-react'

/**
 * AdminPage Component - Admin dashboard overview
 * 
 * @returns {JSX.Element} AdminPage component
 */
export default function AdminPage() {
  const { user, loading } = useUser()

  // Dashboard stats
  const stats = [
    {
      name: 'Total Businesses',
      value: '127',
      change: '+12%',
      changeType: 'increase',
      icon: '🏢'
    },
    {
      name: 'Total Users',
      value: '3,847',
      change: '+8%',
      changeType: 'increase',
      icon: '👥'
    },
    {
      name: 'Active Queues',
      value: '234',
      change: '+5%',
      changeType: 'increase',
      icon: '📋'
    },
    {
      name: 'System Health',
      value: '99.9%',
      change: '0%',
      changeType: 'neutral',
      icon: '💚'
    }
  ]

  const quickActions = [
    { name: 'Manage Users', href: '/admin/users', icon: '👥', color: 'blue' },
    { name: 'Manage Businesses', href: '/admin/businesses', icon: '🏢', color: 'purple' },
    { name: 'View Analytics', href: '/admin/analytics', icon: '📊', color: 'green' },
    { name: 'System Settings', href: '/admin/settings', icon: '⚙️', color: 'orange' },
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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="pb-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Welcome back, {user?.full_name || user?.email || 'Admin'}! 👋
        </h1>
        <p className="mt-2 text-sm sm:text-base text-gray-600">
          Here&apos;s what&apos;s happening with SmartQ today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`mt-2 text-sm ${
                  stat.changeType === 'increase' ? 'text-green-600' : 
                  stat.changeType === 'decrease' ? 'text-red-600' : 
                  'text-gray-600'
                }`}>
                  {stat.change} from last month
                </p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <Link key={action.name} href={action.href}>
              <Card className={`p-6 hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-${action.color}-500`}>
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{action.icon}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{action.name}</h3>
                    <p className="text-sm text-gray-500">Manage and configure</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <Card className="divide-y divide-gray-200">
          {[
            { action: 'New business registered', business: 'ABC Salon', time: '5 minutes ago', type: 'success' },
            { action: 'Queue overflow alert', business: 'XYZ Clinic', time: '15 minutes ago', type: 'warning' },
            { action: 'User report submitted', business: 'Tech Support Inc', time: '1 hour ago', type: 'info' },
            { action: 'System maintenance completed', business: 'System', time: '2 hours ago', type: 'success' },
          ].map((activity, index) => (
            <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'success' ? 'bg-green-500' : 
                    activity.type === 'warning' ? 'bg-yellow-500' : 
                    'bg-blue-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.business}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  )
}