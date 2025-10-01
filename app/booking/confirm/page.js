'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button, Card, CardContent } from '@/components/ui'
import { MainLayout } from '@/components/layout'
import { Calendar, Clock, User, MapPin, Phone, Mail, CheckCircle, ArrowLeft } from 'lucide-react'

/**
 * Booking Confirmation Page
 * Handles appointment booking and confirmation process
 */
export default function BookingConfirmPage() {
  const searchParams = useSearchParams()
  const [bookingData, setBookingData] = useState(null)
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  })
  const [isBooked, setIsBooked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Get booking data from URL parameters - support both old and new formats
    const service = searchParams.get('service')
    const personnel = searchParams.get('personnel')
    const time = searchParams.get('time')
    const day = searchParams.get('day')
    const category = searchParams.get('category')
    const duration = searchParams.get('duration')
    const price = searchParams.get('price')

    // More flexible validation - only require service and personnel at minimum
    if (service && personnel) {
      // In a real app, you would fetch this data from your backend
      setBookingData({
        service: service,
        personnel: personnel,
        time: time || 'TBD',
        day: day || 'TBD',
        // Use actual data from URL parameters or fallback to mock data
        serviceInfo: {
          name: service,
          category: category || 'Service',
          duration: duration || '60 minutes',
          price: price || 'Contact for pricing'
        },
        personnelInfo: {
          name: personnel,
          specialty: category ? `${category} Specialist` : 'Professional Service Provider',
          photo: '/api/placeholder/150/150',
          rating: 4.9,
          location: category ? `${category} Center` : 'Service Location',
          address: '123 Main St, City Center',
          phone: '+1 (555) 123-4567',
          email: `${personnel.toLowerCase().replace(/[\s&]/g, '.').replace(/[^a-z.]/g, '')}@smartq.com`
        }
      })
    }
  }, [searchParams])

  const handleBooking = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      setIsBooked(true)
      setIsLoading(false)
    }, 2000)
  }

  const formatDay = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1)
  }

  if (!bookingData) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-secondary-50">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <Calendar className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-secondary-900 mb-2">Booking Information Missing</h2>
                <p className="text-secondary-600">
                  Please select a service from one of our industry pages to proceed with booking.
                </p>
              </div>
              <div className="space-y-3">
                <Button asChild className="w-full">
                  <Link href="/industries">Browse Services</Link>
                </Button>
                <Button variant="outline" asChild className="w-full">
                  <Link href="/">Go Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  if (isBooked) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-primary-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full animate-scale-in">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4 animate-bounce-gentle" />
                <h1 className="text-3xl font-bold text-secondary-900 mb-2">Booking Confirmed!</h1>
                <p className="text-lg text-secondary-600">Your appointment has been successfully scheduled.</p>
              </div>

              <div className="bg-white rounded-xl p-6 mb-6 border border-secondary-200">
                <h3 className="font-semibold text-secondary-900 mb-4">Appointment Details</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-primary-600 mr-3" />
                    <span className="font-medium">{bookingData.personnelInfo.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary-600 mr-3" />
                    <span>
                      {bookingData.day !== 'TBD' && bookingData.time !== 'TBD' 
                        ? `${formatDay(bookingData.day)} at ${bookingData.time}`
                        : 'Date and time to be scheduled'
                      }
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-primary-600 mr-3" />
                    <span>{bookingData.serviceInfo.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 text-primary-600 mr-3" />
                    <span>{bookingData.personnelInfo.location}</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-primary-800">
                  📧 A confirmation email has been sent to <strong>{customerInfo.email}</strong>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  asChild
                >
                  <Link href="/industries">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Book Another Service
                  </Link>
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700"
                  asChild
                >
                  <Link href="/dashboard">View My Appointments</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-secondary-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href={`/industries/${bookingData?.serviceInfo?.category?.toLowerCase().replace(/\s+/g, '-').replace('&', '').replace(/\s+/g, '-') || 'beauty-wellness'}`}
              className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to {bookingData?.serviceInfo?.category || 'Beauty & Wellness'}
            </Link>
            <h1 className="text-3xl font-bold text-secondary-900">Confirm Your Appointment</h1>
            <p className="text-secondary-600">Please review and confirm your booking details</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Booking Summary */}
            <Card className="animate-slide-in-left">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-secondary-900 mb-4">Appointment Summary</h2>
                
                {/* Personnel Info */}
                <div className="flex items-center space-x-4 mb-6">
                  <img
                    src={bookingData.personnelInfo.photo}
                    alt={bookingData.personnelInfo.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary-200"
                  />
                  <div>
                    <h3 className="font-semibold text-secondary-900">{bookingData.personnelInfo.name}</h3>
                    <p className="text-primary-600">{bookingData.personnelInfo.specialty}</p>
                    <div className="flex items-center text-sm text-secondary-600">
                      <span className="text-yellow-500 mr-1">★</span>
                      {bookingData.personnelInfo.rating} rating
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between py-2 border-b border-secondary-200">
                    <span className="text-secondary-600">Service</span>
                    <span className="font-medium">{bookingData.serviceInfo.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-secondary-200">
                    <span className="text-secondary-600">Date & Time</span>
                    <span className="font-medium">
                      {bookingData.day !== 'TBD' && bookingData.time !== 'TBD' 
                        ? `${formatDay(bookingData.day)} at ${bookingData.time}`
                        : 'To be scheduled'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-secondary-200">
                    <span className="text-secondary-600">Duration</span>
                    <span className="font-medium">{bookingData.serviceInfo.duration}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-secondary-200">
                    <span className="text-secondary-600">Price</span>
                    <span className="font-semibold text-primary-600">{bookingData.serviceInfo.price}</span>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-secondary-50 rounded-lg p-4">
                  <h4 className="font-semibold text-secondary-900 mb-2 flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-primary-600" />
                    Location
                  </h4>
                  <p className="text-secondary-700 mb-1">{bookingData.personnelInfo.location}</p>
                  <p className="text-sm text-secondary-600">{bookingData.personnelInfo.address}</p>
                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    <a 
                      href={`tel:${bookingData.personnelInfo.phone}`}
                      className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      {bookingData.personnelInfo.phone}
                    </a>
                    <a 
                      href={`mailto:${bookingData.personnelInfo.email}`}
                      className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      {bookingData.personnelInfo.email}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information Form */}
            <Card className="animate-slide-in-right">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-secondary-900 mb-4">Your Information</h2>
                
                <form onSubmit={handleBooking} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={customerInfo.email}
                      onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Special Notes (Optional)
                    </label>
                    <textarea
                      value={customerInfo.notes}
                      onChange={(e) => setCustomerInfo({...customerInfo, notes: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Any special requests or notes..."
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                    <h4 className="font-semibold text-yellow-800 mb-2">Booking Policy</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• Appointments can be cancelled up to 24 hours in advance</li>
                      <li>• A confirmation SMS will be sent 1 hour before your appointment</li>
                      <li>• Please arrive 10 minutes early for your appointment</li>
                    </ul>
                  </div>

                  <Button 
                    type="submit"
                    disabled={isLoading || !customerInfo.name || !customerInfo.email || !customerInfo.phone}
                    className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 mt-6"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Confirming Booking...
                      </div>
                    ) : (
                      'Confirm Appointment'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}