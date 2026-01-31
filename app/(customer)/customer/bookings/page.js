'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { 
  Calendar, Clock, User, MapPin, Phone, Mail,
  Edit, Trash2, CheckCircle, XCircle, AlertCircle,
  Filter, Search, Plus, RefreshCw, Eye, Star
} from 'lucide-react'

/**
 * Customer Bookings Page - Manage all customer bookings and history
 */
export default function CustomerBookings() {
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPeriod, setFilterPeriod] = useState('upcoming')

  const bookings = [
    {
      id: 1,
      service: 'Strategy Consulting',
      staff: 'James Wilson',
      date: '2025-10-02',
      time: '2:00 PM',
      duration: '90 min',
      location: 'Conference Room A',
      price: 'KSh 40,000',
      status: 'confirmed',
      bookingRef: 'SQ-001234',
      notes: 'Business expansion strategy discussion',
      canCancel: true,
      canReschedule: true,
      rating: null
    },
    {
      id: 2,
      service: 'Business Planning',
      staff: 'James Wilson',
      date: '2025-10-05',
      time: '10:00 AM',
      duration: '60 min',
      location: 'Conference Room B',
      price: 'KSh 33,400',
      status: 'confirmed',
      bookingRef: 'SQ-001235',
      notes: 'Quarterly planning session',
      canCancel: true,
      canReschedule: true,
      rating: null
    },
    {
      id: 3,
      service: 'Strategy Consulting',
      staff: 'James Wilson',
      date: '2025-09-28',
      time: '2:00 PM',
      duration: '90 min',
      location: 'Conference Room A',
      price: 'KSh 40,000',
      status: 'completed',
      bookingRef: 'SQ-001233',
      notes: 'Market analysis and competitive positioning',
      canCancel: false,
      canReschedule: false,
      rating: 5
    },
    {
      id: 4,
      service: 'Financial Review',
      staff: 'Sarah Mitchell',
      date: '2025-09-20',
      time: '11:00 AM',
      duration: '45 min',
      location: 'Office 205',
      price: 'KSh 26,700',
      status: 'completed',
      bookingRef: 'SQ-001232',
      notes: 'Q3 financial performance review',
      canCancel: false,
      canReschedule: false,
      rating: 4
    },
    {
      id: 5,
      service: 'Business Planning',
      staff: 'James Wilson',
      date: '2025-09-15',
      time: '3:00 PM',
      duration: '60 min',
      location: 'Conference Room B',
      price: 'KSh 33,400',
      status: 'cancelled',
      bookingRef: 'SQ-001231',
      notes: 'Cancelled due to scheduling conflict',
      canCancel: false,
      canReschedule: false,
      rating: null
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200'
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'no-show': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />
      case 'pending': return <AlertCircle className="h-4 w-4" />
      case 'cancelled': return <XCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'no-show': return <XCircle className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus
    const currentDate = new Date()
    const bookingDate = new Date(booking.date)
    
    let matchesPeriod = true
    if (filterPeriod === 'upcoming') {
      matchesPeriod = bookingDate >= currentDate
    } else if (filterPeriod === 'past') {
      matchesPeriod = bookingDate < currentDate
    }
    
    return matchesStatus && matchesPeriod
  })

  const bookingStats = {
    total: bookings.length,
    upcoming: bookings.filter(b => new Date(b.date) >= new Date() && b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    totalSpent: bookings
      .filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + parseInt(b.price.replace('$', '')), 0)
  }

  const renderStarRating = (rating) => {
    if (!rating) return null
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`h-3 w-3 ${star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating}.0)</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600">Manage your appointments and booking history</p>
        </div>
        <Link href="/customer/services">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Booking
          </Button>
        </Link>
      </div>

      {/* Booking Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold">{bookingStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold">{bookingStats.upcoming}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">{bookingStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-bold text-lg">$</span>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold">${bookingStats.totalSpent}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex gap-3 items-center">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search bookings..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <select 
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Time</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  {/* Booking Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{booking.service}</h3>
                      <p className="text-gray-600">with {booking.staff}</p>
                      <p className="text-sm text-gray-500">Ref: {booking.bookingRef}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>

                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{booking.time} ({booking.duration})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{booking.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-green-600">{booking.price}</span>
                    </div>
                  </div>

                  {/* Notes and Rating */}
                  {booking.notes && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Notes:</strong> {booking.notes}
                      </p>
                    </div>
                  )}

                  {booking.rating && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Your Rating:</span>
                      {renderStarRating(booking.rating)}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {booking.canReschedule && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => alert(`Reschedule booking ${booking.bookingRef}`)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Reschedule
                      </Button>
                    )}
                    {booking.canCancel && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => confirm(`Cancel booking ${booking.bookingRef}?`) && alert('Booking cancelled')}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                    )}
                    {booking.status === 'completed' && !booking.rating && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => alert(`Rate ${booking.service}`)}
                      >
                        <Star className="h-3 w-3 mr-1" />
                        Rate Service
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => alert(`View details for ${booking.bookingRef}`)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                    {booking.status === 'completed' && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => alert(`Rebook ${booking.service}`)}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Book Again
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredBookings.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-4">
                {filterPeriod === 'upcoming' ? "You don't have any upcoming appointments" : "No bookings match your current filters"}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Book Your First Service
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}