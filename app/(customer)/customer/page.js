'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { 
  Calendar, Clock, User, Star, TrendingUp, 
  CheckCircle, AlertCircle, Gift, Award,
  Phone, MessageSquare, CreditCard, MapPin,
  Bell, Eye, Plus, RefreshCw
} from 'lucide-react'

/**
 * Customer Dashboard - Main overview page for customers
 */
export default function CustomerDashboard() {
  const [notifications, setNotifications] = useState(3)

  // Sample customer data
  const customerData = {
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    phone: '+1 (555) 123-4567',
    memberSince: 'March 2024',
    loyaltyPoints: 1250,
    totalBookings: 15,
    upcomingBookings: 2,
    favoriteService: 'Strategy Consulting',
    preferredStaff: 'James Wilson'
  }

  const upcomingAppointments = [
    {
      id: 1,
      service: 'Strategy Consulting',
      staff: 'James Wilson',
      date: '2025-10-02',
      time: '2:00 PM',
      location: 'Conference Room A',
      status: 'confirmed',
      canCancel: true
    },
    {
      id: 2,
      service: 'Business Planning',
      staff: 'James Wilson', 
      date: '2025-10-05',
      time: '10:00 AM',
      location: 'Conference Room B',
      status: 'confirmed',
      canCancel: true
    }
  ]

  const recentActivity = [
    {
      id: 1,
      type: 'booking',
      message: 'Strategy Consulting appointment confirmed',
      date: '2025-09-28',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'points',
      message: 'Earned 50 loyalty points',
      date: '2025-09-25',
      icon: Award,
      color: 'text-purple-600'
    },
    {
      id: 3,
      type: 'reminder',
      message: 'Appointment reminder sent',
      date: '2025-09-24',
      icon: Bell,
      color: 'text-blue-600'
    }
  ]

  const quickStats = [
    {
      label: 'Total Bookings',
      value: customerData.totalBookings,
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      label: 'Loyalty Points',
      value: customerData.loyaltyPoints,
      icon: Award,
      color: 'bg-purple-500'
    },
    {
      label: 'Upcoming',
      value: customerData.upcomingBookings,
      icon: Clock,
      color: 'bg-green-500'
    },
    {
      label: 'Member Since',
      value: customerData.memberSince,
      icon: User,
      color: 'bg-orange-500'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {customerData.name}! 👋</h1>
            <p className="text-blue-100">You have {customerData.upcomingBookings} upcoming appointments and {customerData.loyaltyPoints} loyalty points to redeem.</p>
          </div>
          <Link href="/customer/services">
            <Button className="bg-white text-blue-600 hover:bg-blue-50">
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
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
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
                <div key={appointment.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{appointment.service}</h3>
                      <p className="text-sm text-gray-600">with {appointment.staff}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{appointment.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{appointment.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        {appointment.status}
                      </span>
                      <Button size="sm" variant="outline" className="text-xs">
                        Reschedule
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {upcomingAppointments.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No upcoming appointments</p>
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
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
              ))}
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
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600">Current Points</p>
                    <p className="text-2xl font-bold text-purple-600">{customerData.loyaltyPoints}</p>
                  </div>
                  <Gift className="h-8 w-8 text-purple-600" />
                </div>
                <div className="mt-3 bg-white rounded p-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress to next reward</span>
                    <span>250 points to go</span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Available Rewards</h4>
                <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-yellow-800">10% Off Next Service</p>
                      <p className="text-sm text-yellow-600">500 points</p>
                    </div>
                    <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                      Redeem
                    </Button>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-blue-800">Priority Queue Access</p>
                      <p className="text-sm text-blue-600">1000 points</p>
                    </div>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Strategy Consulting</h3>
                  <p className="text-sm text-gray-600">KSh 40,000 • 90 min</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">4.9 rating</span>
                  </div>
                </div>
                <Link href="/customer/services">
                  <Button size="sm">Book Now</Button>
                </Link>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Business Planning</h3>
                  <p className="text-sm text-gray-600">KSh 33,400 • 60 min</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">4.8 rating</span>
                  </div>
                </div>
                <Link href="/customer/services">
                  <Button size="sm">Book Now</Button>
                </Link>
              </div>
            </div>
            
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Financial Review</h3>
                  <p className="text-sm text-gray-600">KSh 26,700 • 45 min</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-sm text-gray-600">4.7 rating</span>
                  </div>
                </div>
                <Link href="/customer/services">
                  <Button size="sm">Book Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}