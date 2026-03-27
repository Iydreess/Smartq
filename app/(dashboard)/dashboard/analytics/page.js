'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { useUser } from '@/lib/supabase/hooks'
import { getBusinessesByOwner, getBusinessAppointments } from '@/lib/supabase/queries'
import {
  BarChart3,
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Star,
  Download,
  CheckCircle,
  Clock,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function AnalyticsPage() {
  const { user, loading: userLoading } = useUser()
  const [dateRange, setDateRange] = useState('30d')
  const [businessFilter, setBusinessFilter] = useState('all')
  const [businesses, setBusinesses] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const getCustomerDetails = (appointment) => {
    const customer = appointment?.customer
    const notesText = String(appointment?.notes || '')
    const nameMatch = notesText.match(/Name:\s*([^,]+)/i)
    const emailMatch = notesText.match(/Email:\s*([^,]+)/i)

    return {
      id: customer?.id || appointment?.customer_id || emailMatch?.[1]?.trim() || appointment?.id,
      name: customer?.full_name || nameMatch?.[1]?.trim() || customer?.email || 'Unknown Customer',
    }
  }

  const getRangeStart = (range, now = new Date()) => {
    const from = new Date(now)
    if (range === '7d') from.setDate(now.getDate() - 7)
    if (range === '30d') from.setDate(now.getDate() - 30)
    if (range === '90d') from.setDate(now.getDate() - 90)
    if (range === '1y') from.setFullYear(now.getFullYear() - 1)
    return from
  }

  const loadAnalytics = async ({ silent = false } = {}) => {
    if (!user?.id) return

    try {
      if (silent) {
        setRefreshing(true)
      } else {
        setLoading(true)
      }

      const ownerBusinesses = await getBusinessesByOwner(user.id)
      setBusinesses(ownerBusinesses || [])
      const rows = await Promise.all((ownerBusinesses || []).map((business) => getBusinessAppointments(business.id)))
      setAppointments(rows.flat())
    } catch (error) {
      console.error('[Analytics] Failed to load:', error)
      toast.error('Failed to load analytics')
    } finally {
      if (silent) {
        setRefreshing(false)
      } else {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [user?.id])

  const scopedAppointments = useMemo(() => {
    if (!appointments.length) return []
    const from = getRangeStart(dateRange)

    return appointments.filter((appointment) => {
      if (!appointment.appointment_date) return false
      const inDate = new Date(appointment.appointment_date) >= from
      const inBusiness = businessFilter === 'all' || appointment.business_id === businessFilter
      return inDate && inBusiness
    })
  }, [appointments, dateRange, businessFilter])

  const previousRangeAppointments = useMemo(() => {
    if (!appointments.length) return []

    const now = new Date()
    const currentFrom = getRangeStart(dateRange, now)
    const durationMs = now.getTime() - currentFrom.getTime()
    const previousFrom = new Date(currentFrom.getTime() - durationMs)

    return appointments.filter((appointment) => {
      if (!appointment.appointment_date) return false
      const date = new Date(appointment.appointment_date)
      const inDate = date >= previousFrom && date < currentFrom
      const inBusiness = businessFilter === 'all' || appointment.business_id === businessFilter
      return inDate && inBusiness
    })
  }, [appointments, dateRange, businessFilter])

  const metrics = useMemo(() => {
    const totalBookings = scopedAppointments.length
    const completedBookingsRows = scopedAppointments.filter((apt) => apt.status === 'completed')
    const activeBookingsRows = scopedAppointments.filter((apt) => ['pending', 'confirmed', 'in-progress'].includes(apt.status))

    const totalRevenue = completedBookingsRows.reduce((sum, apt) => sum + Number(apt?.service?.price || 0), 0)

    const uniqueCustomers = new Set(scopedAppointments.map((apt) => getCustomerDetails(apt).id)).size

    const previousTotalBookings = previousRangeAppointments.length
    const previousRevenue = previousRangeAppointments
      .filter((apt) => apt.status === 'completed')
      .reduce((sum, apt) => sum + Number(apt?.service?.price || 0), 0)

    const growth = {
      bookings: previousTotalBookings === 0
        ? (totalBookings > 0 ? 100 : 0)
        : Math.round(((totalBookings - previousTotalBookings) / previousTotalBookings) * 100),
      revenue: previousRevenue === 0
        ? (totalRevenue > 0 ? 100 : 0)
        : Math.round(((totalRevenue - previousRevenue) / previousRevenue) * 100),
    }

    const serviceMap = new Map()
    const customerMap = new Map()
    const statusMap = new Map([
      ['pending', 0],
      ['confirmed', 0],
      ['in-progress', 0],
      ['completed', 0],
      ['cancelled', 0],
      ['no-show', 0],
    ])

    for (const apt of scopedAppointments) {
      const serviceName = apt?.service?.name || 'Service'
      const serviceRevenue = Number(apt?.service?.price || 0)
      const serviceItem = serviceMap.get(serviceName) || { name: serviceName, bookings: 0, revenue: 0 }
      serviceItem.bookings += 1
      if (apt.status === 'completed') {
        serviceItem.revenue += serviceRevenue
      }
      serviceMap.set(serviceName, serviceItem)

      const customer = getCustomerDetails(apt)
      const customerItem = customerMap.get(customer.id) || { id: customer.id, name: customer.name, bookings: 0, spent: 0 }
      customerItem.bookings += 1
      if (apt.status === 'completed') {
        customerItem.spent += serviceRevenue
      }
      customerMap.set(customer.id, customerItem)

      statusMap.set(apt.status, (statusMap.get(apt.status) || 0) + 1)
    }

    const topServices = Array.from(serviceMap.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 6)
    const topCustomers = Array.from(customerMap.values()).sort((a, b) => b.spent - a.spent).slice(0, 5)

    const dailyMap = new Map()
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const iso = d.toISOString().split('T')[0]
      dailyMap.set(iso, { date: iso, bookings: 0, revenue: 0 })
    }

    for (const apt of scopedAppointments) {
      if (!dailyMap.has(apt.appointment_date)) continue
      const bucket = dailyMap.get(apt.appointment_date)
      bucket.bookings += 1
      if (apt.status === 'completed') {
        bucket.revenue += Number(apt?.service?.price || 0)
      }
    }

    const dailyTrend = Array.from(dailyMap.values())

    return {
      totalBookings,
      completedBookings: completedBookingsRows.length,
      activeBookings: activeBookingsRows.length,
      totalRevenue,
      uniqueCustomers,
      growth,
      topServices,
      topCustomers,
      statusBreakdown: Array.from(statusMap.entries()).map(([status, count]) => ({ status, count })),
      dailyTrend,
    }
  }, [scopedAppointments, previousRangeAppointments])

  const handleExportAnalytics = () => {
    if (!scopedAppointments.length) {
      toast.error('No analytics rows to export for selected filters')
      return
    }

    const rows = scopedAppointments.map((apt) => ({
      date: apt.appointment_date || '',
      status: apt.status || '',
      service: apt?.service?.name || 'Service',
      customer: getCustomerDetails(apt).name,
      price: Number(apt?.service?.price || 0),
      businessId: apt.business_id || '',
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
    anchor.setAttribute('download', `analytics-export-${Date.now()}.csv`)
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)

    toast.success('Analytics exported')
  }

  if (userLoading || loading) {
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
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Analytics Dashboard</h1>
          <p className="text-secondary-600">Real booking, revenue, and customer insights</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={businessFilter}
            onChange={(e) => setBusinessFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Businesses</option>
            {businesses.map((business) => (
              <option key={business.id} value={business.id}>{business.name}</option>
            ))}
          </select>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" className="flex items-center gap-2" onClick={handleExportAnalytics}>
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => loadAnalytics({ silent: true })}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold">KSh {metrics.totalRevenue.toLocaleString()}</p>
                <p className={`text-xs ${metrics.growth.revenue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.growth.revenue >= 0 ? '+' : ''}{metrics.growth.revenue}% vs prev period
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bookings</p>
                <p className="text-2xl font-bold">{metrics.totalBookings}</p>
                <p className={`text-xs ${metrics.growth.bookings >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metrics.growth.bookings >= 0 ? '+' : ''}{metrics.growth.bookings}% vs prev period
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold">{metrics.activeBookings}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{metrics.completedBookings}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customers</p>
                <p className="text-2xl font-bold">{metrics.uniqueCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Bookings Trend (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-3 items-end h-44">
              {metrics.dailyTrend.map((day) => {
                const maxBookings = Math.max(...metrics.dailyTrend.map((d) => d.bookings), 1)
                const barHeight = Math.max(8, Math.round((day.bookings / maxBookings) * 120))
                return (
                  <div key={day.date} className="flex flex-col items-center gap-2">
                    <div className="text-xs text-secondary-500">{day.bookings}</div>
                    <div className="w-full bg-blue-500/15 rounded-md flex items-end" style={{ height: 128 }}>
                      <div className="w-full bg-blue-600 rounded-md transition-all" style={{ height: barHeight }} />
                    </div>
                    <div className="text-[11px] text-secondary-500">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Mix</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.statusBreakdown
                .filter((item) => item.count > 0)
                .sort((a, b) => b.count - a.count)
                .map((item) => (
                  <div key={item.status} className="flex justify-between items-center p-2 bg-gray-50 rounded-md text-sm">
                    <span className="capitalize text-secondary-700">{item.status}</span>
                    <span className="font-semibold">{item.count}</span>
                  </div>
                ))}
              {metrics.statusBreakdown.every((item) => item.count === 0) && (
                <p className="text-sm text-secondary-500">No status data available.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Services by Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topServices.map((service) => (
                <div key={service.name} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{service.name}</p>
                    <p className="text-sm text-gray-600">{service.bookings} bookings</p>
                  </div>
                  <p className="font-bold text-green-600">KSh {service.revenue.toLocaleString()}</p>
                </div>
              ))}
              {metrics.topServices.length === 0 && <p className="text-sm text-secondary-500">No service revenue data yet.</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.topCustomers.map((customer) => (
                <div key={customer.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <p className="text-sm text-gray-600">{customer.bookings} bookings</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">KSh {customer.spent.toLocaleString()}</p>
                    <div className="flex items-center justify-end gap-1 text-xs text-yellow-600">
                      <Star className="h-3 w-3 fill-current" />
                      Real Data
                    </div>
                  </div>
                </div>
              ))}
              {metrics.topCustomers.length === 0 && <p className="text-sm text-secondary-500">No customer spending data yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analytics Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-14 flex items-center justify-center gap-2" onClick={handleExportAnalytics}>
              <Download className="h-4 w-4" />
              Export Filtered Report
            </Button>
            <Button variant="outline" className="h-14 flex items-center justify-center gap-2" onClick={() => loadAnalytics({ silent: true })}>
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button variant="outline" className="h-14 flex items-center justify-center gap-2" onClick={() => toast.success('Coming soon: scheduled analytics email')}>
              <Clock className="h-4 w-4" />
              Schedule Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
