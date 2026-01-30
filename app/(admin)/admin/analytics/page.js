'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'

/**
 * AdminAnalyticsPage Component - System-wide analytics and insights
 * 
 * @returns {JSX.Element} AdminAnalyticsPage component
 */
export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')

  // Mock analytics data
  const metrics = {
    totalUsers: {
      current: 3847,
      change: 8.2,
      trend: 'up'
    },
    totalBusinesses: {
      current: 127,
      change: 12.1,
      trend: 'up'
    },
    activeQueues: {
      current: 234,
      change: 5.3,
      trend: 'up'
    },
    totalRevenue: {
      current: 52340,
      change: 15.7,
      trend: 'up'
    }
  }

  const industryData = [
    { name: 'Healthcare', businesses: 34, percentage: 26.8, revenue: 18450 },
    { name: 'Beauty & Wellness', businesses: 28, percentage: 22.0, revenue: 14230 },
    { name: 'Professional Services', businesses: 22, percentage: 17.3, revenue: 9870 },
    { name: 'Sports & Fitness', businesses: 18, percentage: 14.2, revenue: 5340 },
    { name: 'Education', businesses: 15, percentage: 11.8, revenue: 3120 },
    { name: 'Others', businesses: 10, percentage: 7.9, revenue: 1330 }
  ]

  const topBusinesses = [
    { name: 'Beauty Bliss Salon', customers: 892, revenue: 4120, queues: 8 },
    { name: 'Downtown Dental Clinic', customers: 543, revenue: 2450, queues: 12 },
    { name: 'Premier Medical Center', customers: 678, revenue: 3890, queues: 15 },
    { name: 'Elite Fitness Club', customers: 445, revenue: 1980, queues: 6 },
    { name: 'Tech Training Academy', customers: 332, revenue: 1560, queues: 4 }
  ]

  const recentActivities = [
    { time: '2 min ago', action: 'New business registered', user: 'Sarah Johnson', type: 'success' },
    { time: '15 min ago', action: 'Business suspended', user: 'System Admin', type: 'warning' },
    { time: '1 hour ago', action: 'Plan upgraded to Business', user: 'Mike Williams', type: 'success' },
    { time: '2 hours ago', action: 'Queue limit exceeded', user: 'Beauty Salon X', type: 'error' },
    { time: '3 hours ago', action: 'New admin user added', user: 'System Admin', type: 'info' }
  ]

  const getActivityColor = (type) => {
    const colors = {
      success: 'text-green-600 bg-green-100',
      warning: 'text-orange-600 bg-orange-100',
      error: 'text-red-600 bg-red-100',
      info: 'text-blue-600 bg-blue-100'
    }
    return colors[type] || colors.info
  }

  return (
    <div className="space-y-6">
      <div className="pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">System Analytics</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Comprehensive insights into system performance</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Total Users</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            {metrics.totalUsers.current.toLocaleString()}
          </div>
          <div className={`text-xs sm:text-sm mt-2 ${metrics.totalUsers.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            ↑ {metrics.totalUsers.change}% from last period
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Total Businesses</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            {metrics.totalBusinesses.current.toLocaleString()}
          </div>
          <div className={`text-xs sm:text-sm mt-2 ${metrics.totalBusinesses.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            ↑ {metrics.totalBusinesses.change}% from last period
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Active Queues</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            {metrics.activeQueues.current.toLocaleString()}
          </div>
          <div className={`text-xs sm:text-sm mt-2 ${metrics.activeQueues.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            ↑ {metrics.activeQueues.change}% from last period
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Total Revenue</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">
            ${metrics.totalRevenue.current.toLocaleString()}
          </div>
          <div className={`text-xs sm:text-sm mt-2 ${metrics.totalRevenue.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            ↑ {metrics.totalRevenue.change}% from last period
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Industry Distribution */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Industry Distribution</h2>
          <div className="space-y-4">
            {industryData.map((industry) => (
              <div key={industry.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{industry.name}</span>
                  <span className="text-xs sm:text-sm text-gray-600">
                    {industry.businesses} ({industry.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${industry.percentage}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Revenue: ${industry.revenue.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Performing Businesses */}
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Top Performing Businesses</h2>
          <div className="space-y-3 sm:space-y-4">
            {topBusinesses.map((business, index) => (
              <div key={business.name} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{business.name}</div>
                  <div className="text-xs text-gray-600">
                    {business.customers} customers · {business.queues} queues
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-green-600">
                    ${business.revenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">revenue</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent System Activities</h2>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type).split(' ')[1]}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                <div className="text-xs text-gray-600 mt-1">
                  by {activity.user} · {activity.time}
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                {activity.type}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Usage Chart Placeholder */}
      <Card className="mt-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Usage Trends</h2>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-gray-600">Chart visualization would go here</p>
            <p className="text-sm text-gray-500 mt-1">Integrate with a charting library like Chart.js or Recharts</p>
          </div>
        </div>
      </Card>
    </div>
  )
}
