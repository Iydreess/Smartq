'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui'
import { predictSystemIssues } from '@/lib/ai/systemMonitoring'
import { AlertTriangle, CheckCircle, TrendingUp, Activity, AlertCircle } from 'lucide-react'

/**
 * AdminAnalyticsPage Component - System-wide analytics and insights
 * 
 * @returns {JSX.Element} AdminAnalyticsPage component
 */
export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [systemHealth, setSystemHealth] = useState({
    success: false,
    issues: [],
    healthScore: 100,
    insights: {
      summary: 'Initializing...',
      recommendations: []
    }
  })
  const [loadingHealth, setLoadingHealth] = useState(true)
  
  // Load system health predictions
  useEffect(() => {
    async function loadSystemHealth() {
      setLoadingHealth(true)
      try {
        const health = await predictSystemIssues()
        console.log('[Admin Analytics] System health loaded:', {
          success: health.success,
          issueCount: health.issues?.length || 0,
          healthScore: health.healthScore
        })
        setSystemHealth(health)
      } catch (error) {
        console.error('[Admin Analytics] Error loading system health:', error)
        // Set a fallback empty state
        setSystemHealth({
          success: false,
          issues: [],
          healthScore: 0,
          insights: {
            summary: 'Unable to load system health data',
            recommendations: []
          }
        })
      } finally {
        setLoadingHealth(false)
      }
    }
    
    loadSystemHealth()
    
    // Refresh every 5 minutes
    const interval = setInterval(loadSystemHealth, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

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

      {/* System Health - AI Predictive Maintenance */}
      <div className="mb-6">
        <Card className={`border-2 ${
          loadingHealth 
            ? 'border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50' 
            : systemHealth.issues?.length > 0 
              ? 'border-orange-200 bg-gradient-to-r from-orange-50 to-red-50' 
              : 'border-green-200 bg-gradient-to-r from-green-50 to-emerald-50'
        }`}>
          <div className="p-4 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  loadingHealth 
                    ? 'bg-blue-500 animate-pulse' 
                    : systemHealth.issues?.length > 0 
                      ? 'bg-orange-500' 
                      : 'bg-green-500'
                }`}>
                  {loadingHealth ? (
                    <Activity className="h-6 w-6 text-white" />
                  ) : systemHealth.issues?.length > 0 ? (
                    <AlertTriangle className="h-6 w-6 text-white" />
                  ) : (
                    <CheckCircle className="h-6 w-6 text-white" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    🤖 AI System Monitoring
                  </h3>
                  {!loadingHealth && (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      systemHealth.healthScore >= 75 ? 'bg-green-100 text-green-700' :
                      systemHealth.healthScore >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      Health Score: {Number(systemHealth.healthScore) || 0}/100
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  {loadingHealth ? 'Analyzing system health...' : (systemHealth.insights?.summary || 'System health analysis complete')}
                </p>
                
                {/* Loading State */}
                {loadingHealth ? (
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                      <h4 className="font-semibold text-blue-900">Analyzing system metrics...</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-blue-100 rounded animate-pulse w-3/4"></div>
                      <div className="h-3 bg-blue-100 rounded animate-pulse w-1/2"></div>
                      <div className="h-3 bg-blue-100 rounded animate-pulse w-2/3"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Show issues if any exist */}
                    {systemHealth.issues?.length > 0 ? (
                      <div className="space-y-3">{(systemHealth.issues || []).slice(0, 3).map((issue, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {issue.severity === 'high' && <AlertCircle className="h-4 w-4 text-red-500" />}
                              {issue.severity === 'medium' && <AlertTriangle className="h-4 w-4 text-orange-500" />}
                              {issue.severity === 'low' && <Activity className="h-4 w-4 text-yellow-500" />}
                              <span className="font-semibold text-sm text-gray-900">
                                {issue.type.replace(/_/g, ' ').toUpperCase()}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                issue.severity === 'high' ? 'bg-red-100 text-red-700' :
                                issue.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {issue.severity}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              {issue.impact}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>Current: <strong>{String(issue.currentValue)}</strong></span>
                              <span>Threshold: <strong>{String(issue.threshold)}</strong></span>
                              <span>ETA: <strong>{String(issue.estimatedTime)}</strong></span>
                              <span>Probability: <strong>{(issue.probability * 100).toFixed(0)}%</strong></span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-600">
                            <strong>💡 Recommendation:</strong> {issue.recommendation}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(systemHealth.issues || []).length > 3 && (
                      <div className="mt-3 text-sm text-gray-600">
                        + {(systemHealth.issues || []).length - 3} more issue{(systemHealth.issues || []).length - 3 > 1 ? 's' : ''} detected
                      </div>
                    )}
                  </div>
                  ) : (
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <h4 className="font-semibold text-green-900">All Systems Operating Normally</h4>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">
                        No issues detected. AI monitoring is continuously analyzing system performance to predict and prevent potential problems.
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="bg-green-50 rounded p-2">
                          <div className="text-gray-600">Database</div>
                          <div className="font-semibold text-green-700">Optimal</div>
                        </div>
                        <div className="bg-green-50 rounded p-2">
                          <div className="text-gray-600">API</div>
                          <div className="font-semibold text-green-700">Healthy</div>
                        </div>
                        <div className="bg-green-50 rounded p-2">
                          <div className="text-gray-600">Storage</div>
                          <div className="font-semibold text-green-700">Good</div>
                        </div>
                        <div className="bg-green-50 rounded p-2">
                          <div className="text-gray-600">Queues</div>
                          <div className="font-semibold text-green-700">Normal</div>
                        </div>
                      </div>
                    </div>
                  )}
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
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
