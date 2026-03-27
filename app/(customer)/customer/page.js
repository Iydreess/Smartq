'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { 
  Calendar, Clock, User, Star, TrendingUp, 
  CheckCircle, AlertCircle, Gift, Award,
  MessageSquare, MapPin,
  Bell, Eye, Plus, RefreshCw
} from 'lucide-react'
import { useUser } from '@/lib/supabase/hooks'
import { getCustomerAppointments } from '@/lib/supabase/queries'
import toast from 'react-hot-toast'

/**
 * Customer Dashboard - Main overview page for customers
 */
export default function CustomerDashboard() {
  const router = useRouter()
  const { user, loading } = useUser()
  const [allAppointments, setAllAppointments] = useState([])
  const [loadingAppointments, setLoadingAppointments] = useState(true)

  const asText = (value, fallback = 'N/A') => {
    if (value === null || value === undefined) return fallback
    if (typeof value === 'string' || typeof value === 'number') return value
    if (typeof value === 'object') return value.name || value.full_name || fallback
    return fallback
  }

  const formatAppointmentDate = (appointment) => {
    if (appointment.date) return appointment.date
    if (!appointment.appointment_date) return 'Date TBD'
    return new Date(appointment.appointment_date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatAppointmentTime = (appointment) => {
    if (appointment.time) return appointment.time
    if (!appointment.start_time) return 'Time TBD'
    const [hourStr, minuteStr] = String(appointment.start_time).split(':')
    const hour = Number(hourStr)
    const minute = Number(minuteStr)
    if (Number.isNaN(hour) || Number.isNaN(minute)) return String(appointment.start_time)
    const period = hour >= 12 ? 'PM' : 'AM'
    const normalizedHour = hour % 12 || 12
    return `${normalizedHour}:${String(minute).padStart(2, '0')} ${period}`
  }

  // Fetch customer appointments
  useEffect(() => {
    async function fetchAppointments() {
      if (loading || !user) {
        setLoadingAppointments(false)
        return
      }
      
      try {
        console.log('[CustomerDashboard] Fetching appointments for user:', user.id)
        const appointments = await getCustomerAppointments(user.id)
        console.log('[CustomerDashboard] Appointments fetched:', appointments)
        setAllAppointments(appointments || [])
      } catch (error) {
        console.error('[CustomerDashboard] Error fetching appointments:', error)
      } finally {
        setLoadingAppointments(false)
      }
    }

    fetchAppointments()
  }, [user?.id, loading])

  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const upcomingAppointments = allAppointments.filter((appointment) => {
    if (!appointment.appointment_date) return false
    const appointmentDate = new Date(appointment.appointment_date)
    const status = appointment.status || ''
    return appointmentDate >= todayStart && ['pending', 'confirmed', 'in-progress'].includes(status)
  })

  const completedAppointments = allAppointments.filter((appointment) => appointment.status === 'completed')

  const serviceFrequency = allAppointments.reduce((acc, appointment) => {
    const serviceName = asText(appointment.service, 'Service')
    if (!acc[serviceName]) {
      acc[serviceName] = {
        name: serviceName,
        count: 0,
        price: appointment.service?.price || 0,
        duration: appointment.service?.duration || 0,
      }
    }
    acc[serviceName].count += 1
    return acc
  }, {})

  const topServices = Object.values(serviceFrequency)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  const loyaltyPoints = completedAppointments.reduce((sum, appointment) => {
    const servicePrice = Number(appointment.service?.price || 0)
    return sum + Math.max(25, Math.round(servicePrice / 100))
  }, 0)

  const nextRewardTarget = Math.ceil(Math.max(500, loyaltyPoints + 1) / 500) * 500
  const pointsToNextReward = Math.max(0, nextRewardTarget - loyaltyPoints)
  const rewardProgressPercent = nextRewardTarget > 0
    ? Math.min(100, Math.round((loyaltyPoints / nextRewardTarget) * 100))
    : 0

  const recentActivity = allAppointments
    .slice(0, 4)
    .map((appointment) => {
      const status = appointment.status || 'pending'
      const isPositive = status === 'completed' || status === 'confirmed'
      return {
        id: appointment.id,
        message: `${asText(appointment.service, 'Service')} appointment ${status}`,
        date: appointment.created_at
          ? new Date(appointment.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : 'Recently',
        icon: isPositive ? CheckCircle : AlertCircle,
        color: isPositive ? 'text-success-600' : 'text-primary-600',
      }
    })

  const handleReschedule = (appointment) => {
    const params = new URLSearchParams()
    params.set('reschedule', 'true')
    params.set('fromBookingId', appointment.id)

    if (appointment.service_id) {
      params.set('serviceId', appointment.service_id)
    }

    const serviceName = asText(appointment.service, '')
    if (serviceName) {
      params.set('serviceName', serviceName)
    }

    if (appointment.appointment_date) {
      params.set('appointmentDate', appointment.appointment_date)
    }

    if (appointment.start_time) {
      params.set('appointmentTime', appointment.start_time)
    }

    router.push(`/booking?${params.toString()}`)
  }

  // Customer data from logged-in user
  const customerData = {
    name: user?.full_name || user?.email || 'Guest',
    email: user?.email || '',
    phone: user?.phone || 'Not provided',
    memberSince: user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Recently',
    loyaltyPoints,
    totalBookings: allAppointments.length,
    upcomingBookings: upcomingAppointments.length,
    favoriteService: topServices[0]?.name || 'N/A',
    preferredStaff: 'N/A'
  }

  // Show loading state
  if (loading || loadingAppointments) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-secondary-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const quickStats = [
    {
      label: 'Total Bookings',
      value: customerData.totalBookings,
      icon: Calendar,
      color: 'bg-primary-500'
    },
    {
      label: 'Loyalty Points',
      value: customerData.loyaltyPoints,
      icon: Award,
      color: 'bg-primary-600'
    },
    {
      label: 'Upcoming',
      value: customerData.upcomingBookings,
      icon: Clock,
      color: 'bg-success-500'
    },
    {
      label: 'Member Since',
      value: customerData.memberSince,
      icon: User,
      color: 'bg-primary-400'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {customerData.name}! 👋</h1>
            <p className="text-primary-100">You have {customerData.upcomingBookings} upcoming appointments and {customerData.loyaltyPoints} loyalty points to redeem.</p>
          </div>
          <Link href="/customer/services">
            <Button className="bg-white text-primary-600 hover:bg-primary-50">
              Book New Service
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-secondary-600">{stat.label}</p>
                  <p className="text-xl font-bold text-secondary-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Upcoming Appointments</CardTitle>
              <Link href="/customer/bookings">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="border rounded-lg p-4 hover:bg-secondary-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-secondary-900">{asText(appointment.service, 'Service')}</h3>
                      <p className="text-sm text-secondary-600">with {asText(appointment.staff, 'Staff')}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-secondary-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatAppointmentDate(appointment)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatAppointmentTime(appointment)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{asText(appointment.business?.address || appointment.location, 'Main Location')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {appointment.status}
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs"
                        onClick={() => handleReschedule(appointment)}
                      >
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {upcomingAppointments.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-secondary-300 mx-auto mb-4" />
                  <p className="text-secondary-500">No upcoming appointments</p>
                  <Link href="/customer/services">
                    <Button className="mt-2">Book Your First Service</Button>
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full bg-gray-100 ${activity.color}`}>
                    <activity.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-secondary-900">{activity.message}</p>
                    <p className="text-xs text-secondary-500">{activity.date}</p>
                  </div>
                </div>
              ))}

              {recentActivity.length === 0 && (
                <p className="text-sm text-secondary-500">No recent booking activity yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions & Rewards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/customer/services">
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 w-full">
                  <Plus className="h-5 w-5" />
                  <span className="text-sm">Book Service</span>
                </Button>
              </Link>
              <Link href="/customer/queue">
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 w-full">
                  <Eye className="h-5 w-5" />
                  <span className="text-sm">Queue Status</span>
                </Button>
              </Link>
              <Link href="/customer/notifications">
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 w-full">
                  <MessageSquare className="h-5 w-5" />
                  <span className="text-sm">Contact Support</span>
                </Button>
              </Link>
              <Link href="/customer/bookings">
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2 w-full">
                  <RefreshCw className="h-5 w-5" />
                  <span className="text-sm">Reschedule</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Loyalty & Rewards */}
        <Card>
          <CardHeader>
            <CardTitle>Loyalty Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary-100 to-primary-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-secondary-600">Current Points</p>
                    <p className="text-2xl font-bold text-primary-600">{customerData.loyaltyPoints}</p>
                  </div>
                  <Gift className="h-8 w-8 text-primary-600" />
                </div>
                <div className="mt-3 bg-white rounded p-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to next reward</span>
                    <span>{pointsToNextReward} points to go</span>
                  </div>
                  <div className="mt-1 w-full bg-secondary-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${rewardProgressPercent}%` }}></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-secondary-900">Available Rewards</h4>
                <div className="bg-warning-50 border border-warning-200 rounded p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-warning-800">10% Off Next Service</p>
                      <p className="text-sm text-warning-600">500 points</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-warning-600 hover:bg-warning-700"
                      onClick={() => {
                        toast.success('Reward redemption request submitted')
                        router.push('/customer/profile')
                      }}
                    >
                      Redeem
                    </Button>
                  </div>
                </div>
                <div className="bg-primary-50 border border-primary-200 rounded p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-primary-800">Priority Queue Access</p>
                      <p className="text-sm text-primary-600">1000 points</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-primary-600 hover:bg-primary-700"
                      onClick={() => {
                        toast.success('Priority access reward activated')
                        router.push('/customer/queue')
                      }}
                    >
                      Redeem
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Favorite Services */}
      <Card>
        <CardHeader>
          <CardTitle>Your Favorite Services</CardTitle>
        </CardHeader>
        <CardContent>
          {topServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topServices.map((service) => (
                <div key={service.name} className="border rounded-lg p-4 hover:bg-secondary-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-secondary-900">{service.name}</h3>
                      <p className="text-sm text-secondary-600">
                        KSh {Number(service.price || 0).toLocaleString()} • {service.duration || 'TBD'} min
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-3 w-3 text-warning-500 fill-current" />
                        <span className="text-sm text-secondary-600">Booked {service.count}x</span>
                      </div>
                    </div>
                    <Link href="/customer/services">
                      <Button size="sm">Book Now</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-secondary-500 mb-3">No booking history yet. Your top services will appear here.</p>
              <Link href="/customer/services">
                <Button>Explore Services</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}