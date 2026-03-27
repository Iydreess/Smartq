'use client'

import { useState, useEffect, useMemo } from 'react'
import { Card, Button, Badge } from '@/components/ui'
import { predictSystemIssues } from '@/lib/ai/systemMonitoring'
import {
  AlertTriangle,
  CheckCircle,
  Activity,
  AlertCircle,
  RefreshCw,
  Download,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  getAllBusinesses,
  getBusinesses,
  getAllProfiles,
  getQueues,
  getBusinessAppointments,
} from '@/lib/supabase/queries'

/**
 * AdminAnalyticsPage Component - System-wide analytics and insights
 * 
 * @returns {JSX.Element} AdminAnalyticsPage component
 */
export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d')
  const [loadingData, setLoadingData] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [analytics, setAnalytics] = useState({
    totals: {
      users: 0,
      businesses: 0,
      activeQueues: 0,
      bookings: 0,
      revenue: 0,
      avgWait: 0,
    },
    growth: {
      users: 0,
      businesses: 0,
      activeQueues: 0,
      bookings: 0,
      revenue: 0,
    },
    industries: [],
    topBusinesses: [],
    activities: [],
    trendSeries: [],
  })

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
  
  const isPermissionError = (error) => {
    const code = error?.code || ''
    const message = (error?.message || '').toLowerCase()
    return code === '42501' || message.includes('permission denied') || message.includes('row-level security')
  }

  const getErrorMessage = (error) => {
    if (!error) return 'Unknown error'
    if (typeof error === 'string') return error
    return error.message || error.details || error.hint || 'Unknown error'
  }

  const getRangeWindow = (rangeKey) => {
    const now = new Date()
    const msByRange = {
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000,
    }

    const duration = msByRange[rangeKey] || msByRange['7d']
    const currentStart = new Date(now.getTime() - duration)
    const previousEnd = new Date(currentStart.getTime() - 1)
    const previousStart = new Date(previousEnd.getTime() - duration)

    return {
      now,
      currentStart,
      previousStart,
      previousEnd,
    }
  }

  const asDateTime = (value) => {
    if (!value) return 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return date.toLocaleString()
  }

  const calcGrowth = (current, previous) => {
    if (!previous && !current) return 0
    if (!previous) return 100
    return Math.round(((current - previous) / previous) * 1000) / 10
  }

  const extractRevenue = (appointment) => {
    const value = Number(appointment?.service?.price || 0)
    return Number.isFinite(value) ? value : 0
  }

  const buildTrendSeries = (appointments, rangeKey, currentStart) => {
    const now = new Date()
    const bucketCount = rangeKey === '24h' ? 12 : rangeKey === '7d' ? 7 : 10
    const totalWindowMs = now.getTime() - currentStart.getTime()
    const bucketMs = Math.max(Math.floor(totalWindowMs / bucketCount), 1)

    const buckets = Array.from({ length: bucketCount }, (_, index) => {
      const start = new Date(currentStart.getTime() + index * bucketMs)
      const end = new Date(index === bucketCount - 1 ? now.getTime() : currentStart.getTime() + (index + 1) * bucketMs - 1)
      const label = rangeKey === '24h'
        ? start.toLocaleTimeString([], { hour: '2-digit' })
        : start.toLocaleDateString([], { month: 'short', day: 'numeric' })

      return {
        start,
        end,
        label,
        bookings: 0,
        revenue: 0,
      }
    })

    appointments.forEach((appointment) => {
      const appointmentDate = new Date(appointment.created_at || appointment.appointment_date)
      if (Number.isNaN(appointmentDate.getTime())) return

      const index = buckets.findIndex((bucket) => appointmentDate >= bucket.start && appointmentDate <= bucket.end)
      if (index === -1) return

      buckets[index].bookings += 1
      buckets[index].revenue += extractRevenue(appointment)
    })

    return buckets
  }

  useEffect(() => {
    async function loadSystemHealth() {
      setLoadingHealth(true)
      try {
        const health = await predictSystemIssues()
        setSystemHealth(health)
      } catch (error) {
        console.warn('[Admin Analytics] Error loading system health:', error)
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

  const loadAnalytics = async ({ silent = false } = {}) => {
    try {
      if (silent) {
        setRefreshing(true)
      } else {
        setLoadingData(true)
      }

      const { currentStart, previousStart, previousEnd } = getRangeWindow(timeRange)

      const [businessesResult, profilesResult] = await Promise.allSettled([
        getAllBusinesses(),
        getAllProfiles(),
      ])

      let businesses = []
      if (businessesResult.status === 'fulfilled') {
        businesses = businessesResult.value || []
      } else if (isPermissionError(businessesResult.reason)) {
        businesses = await getBusinesses()
        toast.error('Admin access to all businesses is not configured yet. Showing active businesses only.')
      } else {
        throw businessesResult.reason
      }

      const profiles = profilesResult.status === 'fulfilled' ? (profilesResult.value || []) : []
      const businessMap = businesses.reduce((acc, business) => {
        acc[business.id] = business
        return acc
      }, {})

      const [queuesByBusiness, appointmentsByBusiness] = await Promise.all([
        Promise.allSettled(businesses.map((business) => getQueues(business.id))),
        Promise.allSettled(businesses.map((business) => getBusinessAppointments(business.id))),
      ])

      const allQueues = queuesByBusiness
        .filter((result) => result.status === 'fulfilled')
        .flatMap((result) => result.value || [])

      const allAppointments = appointmentsByBusiness
        .filter((result) => result.status === 'fulfilled')
        .flatMap((result) => result.value || [])

      const currentAppointments = allAppointments.filter((appointment) => {
        const date = new Date(appointment.created_at || appointment.appointment_date)
        return !Number.isNaN(date.getTime()) && date >= currentStart
      })

      const previousAppointments = allAppointments.filter((appointment) => {
        const date = new Date(appointment.created_at || appointment.appointment_date)
        return !Number.isNaN(date.getTime()) && date >= previousStart && date <= previousEnd
      })

      const currentBusinesses = businesses.filter((business) => {
        const date = new Date(business.created_at)
        return !Number.isNaN(date.getTime()) && date >= currentStart
      }).length

      const previousBusinesses = businesses.filter((business) => {
        const date = new Date(business.created_at)
        return !Number.isNaN(date.getTime()) && date >= previousStart && date <= previousEnd
      }).length

      const currentUsers = profiles.filter((profile) => {
        const date = new Date(profile.created_at)
        return !Number.isNaN(date.getTime()) && date >= currentStart
      }).length

      const previousUsers = profiles.filter((profile) => {
        const date = new Date(profile.created_at)
        return !Number.isNaN(date.getTime()) && date >= previousStart && date <= previousEnd
      }).length

      const activeQueues = allQueues.filter((queue) => queue.status === 'active').length
      const currentRevenue = currentAppointments.reduce((sum, appointment) => sum + extractRevenue(appointment), 0)
      const previousRevenue = previousAppointments.reduce((sum, appointment) => sum + extractRevenue(appointment), 0)

      const industryMap = businesses.reduce((acc, business) => {
        const key = business.category || 'Uncategorized'
        if (!acc[key]) {
          acc[key] = { name: key, businesses: 0, revenue: 0 }
        }
        acc[key].businesses += 1
        return acc
      }, {})

      currentAppointments.forEach((appointment) => {
        const business = businessMap[appointment.business_id]
        const category = business?.category || 'Uncategorized'
        if (!industryMap[category]) {
          industryMap[category] = { name: category, businesses: 0, revenue: 0 }
        }
        industryMap[category].revenue += extractRevenue(appointment)
      })

      const industries = Object.values(industryMap)
        .map((item) => ({
          ...item,
          percentage: businesses.length ? Math.round((item.businesses / businesses.length) * 1000) / 10 : 0,
        }))
        .sort((a, b) => b.businesses - a.businesses)

      const businessStatsMap = businesses.reduce((acc, business) => {
        acc[business.id] = {
          id: business.id,
          name: business.name || 'Untitled Business',
          customers: new Set(),
          revenue: 0,
          bookings: 0,
          queues: 0,
        }
        return acc
      }, {})

      allQueues.forEach((queue) => {
        if (!businessStatsMap[queue.business_id]) return
        businessStatsMap[queue.business_id].queues += 1
      })

      currentAppointments.forEach((appointment) => {
        const bucket = businessStatsMap[appointment.business_id]
        if (!bucket) return
        if (appointment.customer_id) {
          bucket.customers.add(appointment.customer_id)
        }
        bucket.bookings += 1
        bucket.revenue += extractRevenue(appointment)
      })

      const topBusinesses = Object.values(businessStatsMap)
        .map((item) => ({
          id: item.id,
          name: item.name,
          customers: item.customers.size,
          revenue: item.revenue,
          queues: item.queues,
          bookings: item.bookings,
        }))
        .sort((a, b) => b.revenue - a.revenue || b.bookings - a.bookings)
        .slice(0, 6)

      const activities = [
        ...businesses.slice(0, 10).map((business) => ({
          time: business.created_at,
          action: 'Business registered',
          user: business.name || 'Unknown business',
          type: 'success',
        })),
        ...allQueues.slice(0, 10).map((queue) => ({
          time: queue.updated_at || queue.created_at,
          action: `Queue ${queue.status || 'updated'}`,
          user: businessMap[queue.business_id]?.name || 'Unknown business',
          type: queue.status === 'closed' ? 'warning' : 'info',
        })),
        ...currentAppointments.slice(0, 10).map((appointment) => ({
          time: appointment.created_at || appointment.appointment_date,
          action: 'Appointment created',
          user: businessMap[appointment.business_id]?.name || 'Unknown business',
          type: 'success',
        })),
      ]
        .filter((item) => item.time)
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 10)

      const avgWait = allQueues.length
        ? Math.round(allQueues.reduce((sum, queue) => sum + Number(queue.estimated_wait_time || 0), 0) / allQueues.length)
        : 0

      setAnalytics({
        totals: {
          users: profiles.length,
          businesses: businesses.length,
          activeQueues,
          bookings: currentAppointments.length,
          revenue: currentRevenue,
          avgWait,
        },
        growth: {
          users: calcGrowth(currentUsers, previousUsers),
          businesses: calcGrowth(currentBusinesses, previousBusinesses),
          activeQueues: 0,
          bookings: calcGrowth(currentAppointments.length, previousAppointments.length),
          revenue: calcGrowth(currentRevenue, previousRevenue),
        },
        industries,
        topBusinesses,
        activities,
        trendSeries: buildTrendSeries(currentAppointments, timeRange, currentStart),
      })
    } catch (error) {
      console.warn('[Admin Analytics] Failed to load analytics:', {
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
      })
      toast.error(getErrorMessage(error) || 'Failed to load analytics')
      setAnalytics((prev) => ({
        ...prev,
        industries: [],
        topBusinesses: [],
        activities: [],
        trendSeries: [],
      }))
    } finally {
      if (silent) {
        setRefreshing(false)
      } else {
        setLoadingData(false)
      }
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const getActivityColor = (type) => {
    const colors = {
      success: 'text-green-600 bg-green-100',
      warning: 'text-orange-600 bg-orange-100',
      error: 'text-red-600 bg-red-100',
      info: 'text-blue-600 bg-blue-100'
    }
    return colors[type] || colors.info
  }

  const handleExport = () => {
    if (!analytics.topBusinesses.length) {
      toast.error('No analytics rows to export')
      return
    }

    const rows = analytics.topBusinesses.map((item, index) => ({
      rank: index + 1,
      business: item.name,
      revenue: item.revenue,
      bookings: item.bookings,
      customers: item.customers,
      queues: item.queues,
    }))

    const headers = Object.keys(rows[0])
    const csv = [
      headers.join(','),
      ...rows.map((row) => headers.map((header) => `"${String(row[header] ?? '').replace(/"/g, '""')}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.setAttribute('download', `admin-analytics-${Date.now()}.csv`)
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)

    toast.success('Analytics exported')
  }

  const metricCards = useMemo(() => {
    return [
      {
        title: 'Total Users',
        value: analytics.totals.users.toLocaleString(),
        growth: analytics.growth.users,
      },
      {
        title: 'Total Businesses',
        value: analytics.totals.businesses.toLocaleString(),
        growth: analytics.growth.businesses,
      },
      {
        title: 'Active Queues',
        value: analytics.totals.activeQueues.toLocaleString(),
        growth: analytics.growth.activeQueues,
      },
      {
        title: 'Revenue',
        value: `$${Math.round(analytics.totals.revenue).toLocaleString()}`,
        growth: analytics.growth.revenue,
      },
    ]
  }, [analytics])

  const trendStats = useMemo(() => {
    const series = analytics.trendSeries || []
    const maxBookings = series.reduce((max, item) => Math.max(max, item.bookings), 0)
    const maxRevenue = series.reduce((max, item) => Math.max(max, item.revenue), 0)
    return { series, maxBookings, maxRevenue }
  }, [analytics.trendSeries])

  if (loadingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="pb-2 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">System Analytics</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Comprehensive insights into system performance</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
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
          <Button variant="outline" className="flex items-center gap-2" onClick={() => loadAnalytics({ silent: true })}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="flex items-center gap-2" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
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
                                {String(issue?.type || 'issue').replace(/_/g, ' ').toUpperCase()}
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
                              <span>Probability: <strong>{Number.isFinite(Number(issue?.probability)) ? `${Math.round(Number(issue.probability) * 100)}%` : 'N/A'}</strong></span>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric) => (
          <Card key={metric.title} className="p-4">
            <div className="text-xs sm:text-sm font-medium text-gray-600">{metric.title}</div>
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{metric.value}</div>
            <div className={`text-xs sm:text-sm mt-2 ${metric.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {metric.growth >= 0 ? '↑' : '↓'} {Math.abs(metric.growth)}% from last period
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Bookings In Range</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{analytics.totals.bookings.toLocaleString()}</div>
          <div className={`text-xs sm:text-sm mt-2 ${analytics.growth.bookings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {analytics.growth.bookings >= 0 ? '↑' : '↓'} {Math.abs(analytics.growth.bookings)}% from last period
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs sm:text-sm font-medium text-gray-600">Average Estimated Wait</div>
          <div className="text-2xl sm:text-3xl font-bold text-gray-900 mt-2">{analytics.totals.avgWait} min</div>
          <div className="text-xs sm:text-sm mt-2 text-indigo-600">Across system queues</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Industry Distribution</h2>
          <div className="space-y-4">
            {analytics.industries.length === 0 && (
              <div className="text-sm text-gray-500">No industry data in selected range.</div>
            )}
            {analytics.industries.map((industry) => (
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

        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Top Performing Businesses</h2>
          <div className="space-y-3 sm:space-y-4">
            {analytics.topBusinesses.length === 0 && (
              <div className="text-sm text-gray-500">No business performance rows for selected range.</div>
            )}
            {analytics.topBusinesses.map((business, index) => (
              <div key={business.id || `${business.name}-${index}`} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{business.name}</div>
                  <div className="text-xs text-gray-600">
                    {business.customers} customers · {business.queues} queues · {business.bookings} bookings
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

      <Card className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Compact Trend</h2>
          <div className="text-xs text-gray-500">Bookings + Revenue</div>
        </div>
        {trendStats.series.length === 0 ? (
          <div className="text-sm text-gray-500">No trend data in selected range.</div>
        ) : (
          <div className="space-y-4">
            <div className="h-28 flex items-end gap-1">
              {trendStats.series.map((point, index) => {
                const bookingsHeight = trendStats.maxBookings ? Math.max(6, Math.round((point.bookings / trendStats.maxBookings) * 100)) : 6
                const revenueHeight = trendStats.maxRevenue ? Math.max(6, Math.round((point.revenue / trendStats.maxRevenue) * 100)) : 6

                return (
                  <div key={`${point.label}-${index}`} className="flex-1 min-w-0 flex items-end justify-center gap-0.5">
                    <div className="w-1.5 bg-blue-500/80 rounded-t" style={{ height: `${bookingsHeight}%` }} title={`${point.label}: ${point.bookings} bookings`} />
                    <div className="w-1.5 bg-emerald-500/80 rounded-t" style={{ height: `${revenueHeight}%` }} title={`${point.label}: $${Math.round(point.revenue).toLocaleString()} revenue`} />
                  </div>
                )
              })}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                Bookings
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
                Revenue
              </div>
            </div>
            <div className="flex justify-between gap-2 text-[10px] sm:text-xs text-gray-500 overflow-hidden">
              <span>{trendStats.series[0]?.label}</span>
              <span>{trendStats.series[Math.floor(trendStats.series.length / 2)]?.label}</span>
              <span>{trendStats.series[trendStats.series.length - 1]?.label}</span>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent System Activities</h2>
        <div className="space-y-3">
          {analytics.activities.length === 0 && (
            <div className="text-sm text-gray-500">No recent activity for selected range.</div>
          )}
          {analytics.activities.map((activity, index) => (
            <div key={`${activity.action}-${index}`} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg">
              <div className={`w-2 h-2 rounded-full mt-2 ${getActivityColor(activity.type).split(' ')[1]}`} />
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{activity.action}</div>
                <div className="text-xs text-gray-600 mt-1">
                  by {activity.user} · {asDateTime(activity.time)}
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                {activity.type}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Snapshot</h2>
          <Badge variant="info">Live</Badge>
        </div>
        <p className="text-sm text-gray-600 mt-3">
          Current system snapshot includes {analytics.totals.businesses.toLocaleString()} businesses, {analytics.totals.activeQueues.toLocaleString()} active queues,
          and {analytics.totals.bookings.toLocaleString()} bookings in the selected time range.
        </p>
      </Card>
    </div>
  )
}
