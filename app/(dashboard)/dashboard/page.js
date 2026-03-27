'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { useUser } from '@/lib/supabase/hooks'
import { RefreshCw, CalendarClock, Users, Clock, DollarSign, TrendingUp, ListChecks } from 'lucide-react'
import {
  getBusinessesByOwner,
  getBusinessAppointments,
  getQueues,
  getQueueEntries,
} from '@/lib/supabase/queries'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser()
  const router = useRouter()

  const [loadingData, setLoadingData] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [businesses, setBusinesses] = useState([])
  const [selectedBusinessId, setSelectedBusinessId] = useState('all')
  const [dateRange, setDateRange] = useState('30d')
  const [allQueues, setAllQueues] = useState([])
  const [allAppointments, setAllAppointments] = useState([])
  const [queueEntriesByQueue, setQueueEntriesByQueue] = useState({})

  const hasBusiness = businesses.length > 0

  const asText = (value, fallback = 'N/A') => {
    if (value === null || value === undefined) return fallback
    if (typeof value === 'string' || typeof value === 'number') return String(value)
    if (typeof value === 'object') return value.name || value.full_name || fallback
    return fallback
  }

  const getCustomerDetails = (appointment) => {
    const customer = appointment?.customer
    const notesText = String(appointment?.notes || '')
    const nameMatch = notesText.match(/Name:\s*([^,]+)/i)
    const emailMatch = notesText.match(/Email:\s*([^,]+)/i)

    return {
      id: customer?.id || appointment?.customer_id || emailMatch?.[1]?.trim() || appointment?.id,
      name: customer?.full_name || customer?.name || nameMatch?.[1]?.trim() || customer?.email || 'Unknown Customer',
    }
  }

  const formatRelativeTime = (timestamp) => {
    if (!timestamp) return 'Recently'
    const now = new Date()
    const then = new Date(timestamp)
    const diffMs = now.getTime() - then.getTime()
    const minutes = Math.floor(diffMs / 60000)
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
    const days = Math.floor(hours / 24)
    return `${days} day${days === 1 ? '' : 's'} ago`
  }

  const formatTime = (timeValue) => {
    if (!timeValue) return 'TBD'
    const [hourStr, minuteStr] = String(timeValue).split(':')
    const hour = Number(hourStr)
    const minute = Number(minuteStr)
    if (Number.isNaN(hour) || Number.isNaN(minute)) return String(timeValue)
    const period = hour >= 12 ? 'PM' : 'AM'
    const normalizedHour = hour % 12 || 12
    return `${normalizedHour}:${String(minute).padStart(2, '0')} ${period}`
  }

  const getRangeStart = (range, now = new Date()) => {
    const from = new Date(now)
    if (range === '7d') from.setDate(now.getDate() - 7)
    if (range === '30d') from.setDate(now.getDate() - 30)
    if (range === '90d') from.setDate(now.getDate() - 90)
    if (range === '1y') from.setFullYear(now.getFullYear() - 1)
    return from
  }

  const loadDashboardData = async ({ silent = false } = {}) => {
    if (!user?.id) return

    try {
      if (silent) {
        setRefreshing(true)
      } else {
        setLoadingData(true)
      }

      const ownedBusinesses = await getBusinessesByOwner(user.id)
      setBusinesses(ownedBusinesses || [])

      if (!ownedBusinesses?.length) {
        setAllQueues([])
        setAllAppointments([])
        setQueueEntriesByQueue({})
        return
      }

      const businessIds = ownedBusinesses.map((business) => business.id)

      const [queuesByBusiness, appointmentsByBusiness] = await Promise.all([
        Promise.all(businessIds.map((businessId) => getQueues(businessId))),
        Promise.all(businessIds.map((businessId) => getBusinessAppointments(businessId))),
      ])

      const flatQueues = queuesByBusiness.flat()
      const flatAppointments = appointmentsByBusiness.flat()

      const queueEntriesRows = await Promise.all(flatQueues.map((queue) => getQueueEntries(queue.id)))
      const entriesMap = {}
      flatQueues.forEach((queue, index) => {
        entriesMap[queue.id] = queueEntriesRows[index] || []
      })

      setAllQueues(flatQueues)
      setAllAppointments(flatAppointments)
      setQueueEntriesByQueue(entriesMap)

      if (!selectedBusinessId || (selectedBusinessId !== 'all' && !businessIds.includes(selectedBusinessId))) {
        setSelectedBusinessId('all')
      }
    } catch (error) {
      console.error('[Dashboard] Failed to load data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      if (silent) {
        setRefreshing(false)
      } else {
        setLoadingData(false)
      }
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [user?.id])

  const scopedQueues = useMemo(() => {
    if (selectedBusinessId === 'all') return allQueues
    return allQueues.filter((queue) => queue.business_id === selectedBusinessId)
  }, [allQueues, selectedBusinessId])

  const scopedAppointments = useMemo(() => {
    const now = new Date()
    const from = getRangeStart(dateRange, now)

    return allAppointments.filter((appointment) => {
      if (selectedBusinessId !== 'all' && appointment.business_id !== selectedBusinessId) return false
      if (!appointment.appointment_date) return false
      return new Date(appointment.appointment_date) >= from
    })
  }, [allAppointments, selectedBusinessId, dateRange])

  const previousRangeAppointments = useMemo(() => {
    const now = new Date()
    const currentFrom = getRangeStart(dateRange, now)
    const durationMs = now.getTime() - currentFrom.getTime()
    const previousFrom = new Date(currentFrom.getTime() - durationMs)

    return allAppointments.filter((appointment) => {
      if (selectedBusinessId !== 'all' && appointment.business_id !== selectedBusinessId) return false
      if (!appointment.appointment_date) return false
      const d = new Date(appointment.appointment_date)
      return d >= previousFrom && d < currentFrom
    })
  }, [allAppointments, selectedBusinessId, dateRange])

  const kpis = useMemo(() => {
    const activeQueues = scopedQueues.filter((queue) => queue.status === 'active')

    const peopleInQueue = activeQueues.reduce((sum, queue) => {
      const entries = queueEntriesByQueue[queue.id] || []
      return sum + entries.length
    }, 0)

    const waitTimes = activeQueues
      .map((queue) => Number(queue.estimated_wait_time || 0))
      .filter((value) => value > 0)
    const avgWait = waitTimes.length
      ? Math.round(waitTimes.reduce((sum, value) => sum + value, 0) / waitTimes.length)
      : 0

    const completedAppointments = scopedAppointments.filter((appointment) => appointment.status === 'completed')
    const revenue = completedAppointments.reduce((sum, appointment) => sum + Number(appointment?.service?.price || 0), 0)

    const previousCompleted = previousRangeAppointments.filter((appointment) => appointment.status === 'completed')
    const previousRevenue = previousCompleted.reduce((sum, appointment) => sum + Number(appointment?.service?.price || 0), 0)

    const bookingsGrowth = previousRangeAppointments.length
      ? Math.round(((scopedAppointments.length - previousRangeAppointments.length) / previousRangeAppointments.length) * 100)
      : (scopedAppointments.length ? 100 : 0)

    const revenueGrowth = previousRevenue
      ? Math.round(((revenue - previousRevenue) / previousRevenue) * 100)
      : (revenue ? 100 : 0)

    const uniqueCustomers = new Set(scopedAppointments.map((appointment) => getCustomerDetails(appointment).id)).size

    return {
      activeQueues: activeQueues.length,
      peopleInQueue,
      avgWait,
      bookings: scopedAppointments.length,
      revenue,
      uniqueCustomers,
      bookingsGrowth,
      revenueGrowth,
    }
  }, [scopedQueues, scopedAppointments, previousRangeAppointments, queueEntriesByQueue])

  const recentQueueActivity = useMemo(() => {
    return [...scopedAppointments]
      .sort((a, b) => new Date(b.created_at || b.updated_at || 0) - new Date(a.created_at || a.updated_at || 0))
      .slice(0, 5)
      .map((appointment) => ({
        id: appointment.id,
        customerName: getCustomerDetails(appointment).name,
        serviceName: asText(appointment.service, 'Service'),
        createdAt: appointment.created_at || appointment.updated_at,
      }))
  }, [scopedAppointments])

  const upcomingAppointments = useMemo(() => {
    const today = new Date()
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate())

    return scopedAppointments
      .filter((appointment) => {
        if (!appointment.appointment_date) return false
        const date = new Date(appointment.appointment_date)
        return date >= startOfToday && ['pending', 'confirmed', 'in-progress'].includes(appointment.status)
      })
      .sort((a, b) => {
        const dateA = `${a.appointment_date || ''} ${a.start_time || ''}`
        const dateB = `${b.appointment_date || ''} ${b.start_time || ''}`
        return new Date(dateA) - new Date(dateB)
      })
      .slice(0, 5)
  }, [scopedAppointments])

  if (userLoading || loadingData) {
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
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">
            Welcome back, {user?.full_name || user?.email || 'Business Owner'}
          </h1>
          <p className="text-secondary-600">Live overview of queue operations and appointment performance.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={selectedBusinessId}
            onChange={(e) => setSelectedBusinessId(e.target.value)}
            className="px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
            disabled={!hasBusiness}
          >
            <option value="all">All Businesses</option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>{business.name}</option>
            ))}
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => loadDashboardData({ silent: true })}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {!hasBusiness && (
        <Card>
          <CardContent className="p-6">
            <p className="text-secondary-700">No business profile is linked to this account yet. Create or claim a business profile to start tracking queues and bookings.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard title="Revenue" value={`KSh ${kpis.revenue.toLocaleString()}`} subtitle={`${kpis.revenueGrowth >= 0 ? '+' : ''}${kpis.revenueGrowth}% vs previous period`} icon={<DollarSign className="h-6 w-6 text-green-600" />} />
        <KpiCard title="Bookings" value={String(kpis.bookings)} subtitle={`${kpis.bookingsGrowth >= 0 ? '+' : ''}${kpis.bookingsGrowth}% vs previous period`} icon={<CalendarClock className="h-6 w-6 text-blue-600" />} />
        <KpiCard title="Active Queues" value={String(kpis.activeQueues)} subtitle={`${kpis.peopleInQueue} people waiting`} icon={<ListChecks className="h-6 w-6 text-purple-600" />} />
        <KpiCard title="Average Wait" value={`${kpis.avgWait} min`} subtitle="Across active queues" icon={<Clock className="h-6 w-6 text-orange-600" />} />
        <KpiCard title="Customers" value={String(kpis.uniqueCustomers)} subtitle="Unique customers in selected range" icon={<Users className="h-6 w-6 text-indigo-600" />} />
        <KpiCard title="Operational Trend" value={kpis.bookingsGrowth >= 0 ? 'Upward' : 'Downward'} subtitle="Based on booking movement" icon={<TrendingUp className="h-6 w-6 text-emerald-600" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQueueActivity.map((activity, index) => (
                <div key={activity.id || index} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-medium text-sm">#{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">{activity.customerName} booked {activity.serviceName}</p>
                    <p className="text-xs text-secondary-500">{formatRelativeTime(activity.createdAt)}</p>
                  </div>
                </div>
              ))}

              {!recentQueueActivity.length && <p className="text-sm text-secondary-500">No booking activity in this range.</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment, index) => {
                const customerDetails = getCustomerDetails(appointment)
                return (
                  <div key={appointment.id || index} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                      <CalendarClock className="h-4 w-4 text-success-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary-900">{asText(appointment.service, 'Service')} with {customerDetails.name}</p>
                      <p className="text-xs text-secondary-500">{appointment.appointment_date || 'Date TBD'} at {formatTime(appointment.start_time)}</p>
                    </div>
                  </div>
                )
              })}

              {!upcomingAppointments.length && (
                <p className="text-sm text-secondary-500">{hasBusiness ? 'No upcoming appointments in this range.' : 'No business profile found for this account.'}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Button variant="outline" onClick={() => router.push('/dashboard/queues')}>Manage Queues</Button>
            <Button variant="outline" onClick={() => router.push('/dashboard/appointments')}>Open Appointments</Button>
            <Button variant="outline" onClick={() => router.push('/dashboard/services')}>Review Services</Button>
            <Button variant="outline" onClick={() => router.push('/dashboard/analytics')}>View Analytics</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function KpiCard({ title, value, subtitle, icon }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-secondary-600">{title}</p>
            <p className="text-2xl font-bold text-secondary-900 mt-1">{value}</p>
            <p className="text-xs text-secondary-500 mt-1">{subtitle}</p>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  )
}
