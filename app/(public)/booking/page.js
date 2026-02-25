'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Calendar, TimeSlotPicker } from '@/components/ui'
import { CheckCircle2, Clock, DollarSign, User, Phone, Mail, MessageSquare, Sparkles, TrendingUp } from 'lucide-react'
import toast from 'react-hot-toast'
import { getAllServices } from '@/lib/supabase/queries'
import { createAppointment } from '@/lib/supabase/queries'
import { getCurrentUser } from '@/lib/auth'
import { suggestAppointmentTimes } from '@/lib/ai/smartScheduling'

/**
 * Enhanced Appointment Booking Page with Real-time Calendar
 */
export default function BookingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Form state  
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    notes: '',
    termsAccepted: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [availableServices, setAvailableServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [aiRecommendations, setAiRecommendations] = useState(null)
  const [loadingRecommendations, setLoadingRecommendations] = useState(false)

  // Load services and user on mount
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        // Get current user
        const user = await getCurrentUser()
        setCurrentUser(user)
        
        // Pre-fill form if user is logged in
        if (user) {
          setFormData(prev => ({
            ...prev,
            fullName: user.full_name || '',
            email: user.email || '',
            phone: user.phone || ''
          }))
        }
        
        // Load services from database
        const services = await getAllServices()
        
        // Transform services to match component format
        const transformedServices = services.map(service => ({
          id: service.id,
          businessId: service.business.id,
          businessName: service.business.name,
          name: service.name,
          duration: service.duration,
          price: service.price,
          currency: 'KSh',
          description: service.description,
          category: service.category,
          icon: User
        }))
        
        setAvailableServices(transformedServices)
        
        // Check if a service was pre-selected from URL parameters
        const serviceId = searchParams.get('serviceId')
        const serviceName = searchParams.get('serviceName')
        
        if (serviceId || serviceName) {
          // Try to find and pre-select the service
          const preSelectedService = transformedServices.find(
            s => s.id === serviceId || s.name === serviceName
          )
          
          if (preSelectedService) {
            setSelectedService(preSelectedService)
            toast.success(`${preSelectedService.name} selected!`)
          }
        }
      } catch (error) {
        console.error('[Booking] Load error:', error)
        toast.error('Failed to load services')
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Generate time slots based on selected date
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return []

    const dayOfWeek = selectedDate.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    
    // Different hours for weekdays vs weekends
    const workingHours = isWeekend 
      ? { start: 9, end: 14 } // Weekend: 9 AM - 2 PM
      : { start: 8, end: 18 } // Weekday: 8 AM - 6 PM

    const slots = []
    
    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      // Skip lunch break (1 PM - 2 PM on weekdays)
      if (!isWeekend && hour === 13) continue

      for (let minute of [0, 30]) {
        const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`
        
        // Determine period
        let period = 'morning'
        if (hour >= 12 && hour < 17) period = 'afternoon'
        if (hour >= 17) period = 'evening'

        // Simulate some slots being booked (for demo)
        const randomBookings = Math.floor(Math.random() * 4)
        const totalSlots = 4
        const isAvailable = randomBookings < totalSlots

        slots.push({
          time: time12,
          time24,
          available: isAvailable,
          bookedSlots: randomBookings,
          totalSlots,
          period
        })
      }
    }

    return slots
  }, [selectedDate])

  // Dates with limited availability (for demo)
  const bookedDates = [
    new Date(2026, 1, 5).toISOString().split('T')[0],
    new Date(2026, 1, 12).toISOString().split('T')[0],
    new Date(2026, 1, 19).toISOString().split('T')[0],
  ]

  // Disabled dates (Sundays for demo)
  const disabledDates = []
  const today = new Date()
  for (let i = 0; i < 60; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    if (date.getDay() === 0) { // Sunday
      disabledDates.push(date.toISOString().split('T')[0])
    }
  }

  const handleServiceSelect = (service) => {
    setSelectedService(service)
    setSelectedTime(null)
  }

  const handleDateSelect = async (date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    
    // Get AI-powered time recommendations
    if (selectedService && date) {
      setLoadingRecommendations(true)
      try {
        const availableSlots = generateTimeSlotsForDate(date)
        const recommendations = await suggestAppointmentTimes({
          serviceId: selectedService.id,
          customerId: currentUser?.id,
          selectedDate: date,
          availableSlots: availableSlots.filter(s => s.available).map(s => s.time)
        })
        setAiRecommendations(recommendations)
      } catch (error) {
        console.error('[Booking] AI recommendation error:', error)
      } finally {
        setLoadingRecommendations(false)
      }
    }
  }
  
  // Helper function to generate time slots for a specific date
  const generateTimeSlotsForDate = (date) => {
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    const workingHours = isWeekend 
      ? { start: 9, end: 14 }
      : { start: 8, end: 18 }
    const slots = []
    
    for (let hour = workingHours.start; hour < workingHours.end; hour++) {
      if (!isWeekend && hour === 13) continue
      for (let minute of [0, 30]) {
        const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`
        const randomBookings = Math.floor(Math.random() * 4)
        const totalSlots = 4
        const isAvailable = randomBookings < totalSlots
        slots.push({
          time: time12,
          available: isAvailable,
          bookedSlots: randomBookings,
          totalSlots
        })
      }
    }
    return slots
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if user is logged in
    if (!currentUser) {
      toast.error('Please sign in to book an appointment')
      // Redirect to signup page
      setTimeout(() => {
        router.push('/signup?returnUrl=/booking')
      }, 1500)
      return
    }
    
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error('Please select service, date, and time')
      return
    }

    if (!formData.termsAccepted) {
      toast.error('Please accept the terms and conditions')
      return
    }

    setIsSubmitting(true)

    try {
      // Parse time to get start and end time
      const [time, period] = selectedTime.split(' ')
      const [hours, minutes] = time.split(':')
      let hour24 = parseInt(hours)
      
      if (period === 'PM' && hour24 !== 12) hour24 += 12
      if (period === 'AM' && hour24 === 12) hour24 = 0
      
      const startTime = `${hour24.toString().padStart(2, '0')}:${minutes}:00`
      
      // Calculate end time based on service duration
      const endHour = hour24 + Math.floor(selectedService.duration / 60)
      const endMinute = parseInt(minutes) + (selectedService.duration % 60)
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}:00`
      
      const formattedDate = selectedDate.toISOString().split('T')[0]
      
      // Create appointment in database
      const appointmentData = {
        business_id: selectedService.businessId,
        customer_id: currentUser.id,
        service_id: selectedService.id,
        appointment_date: formattedDate,
        start_time: startTime,
        end_time: endTime,
        status: 'pending',
        customer_notes: formData.notes,
        notes: `Name: ${currentUser.full_name}, Email: ${currentUser.email}, Phone: ${currentUser.phone || formData.phone}`
      }
      
      console.log('[Booking] Creating appointment:', appointmentData)
      
      const appointment = await createAppointment(appointmentData)
      
      console.log('[Booking] Appointment created:', appointment)
      
      toast.success('Appointment booked successfully!')

      // Redirect to confirmation page
      const params = new URLSearchParams({
        service: selectedService.name,
        date: selectedDate.toLocaleDateString(),
        time: selectedTime,
        duration: `${selectedService.duration} minutes`,
        price: `KSh ${selectedService.price}`,
        name: formData.fullName,
        business: selectedService.businessName || 'SmartQ'
      })
      
      router.push(`/booking/confirm?${params.toString()}`)

    } catch (error) {
      console.error('[Booking] Error:', error)
      toast.error(error.message || 'Failed to book appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPrice = selectedService ? selectedService.price : 0

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-secondary-600">Loading services...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
          Book Your Appointment
        </h1>
        <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
          Choose your service, select a convenient time, and skip the wait. 
          We&apos;ll send you a confirmation and reminders.
        </p>
      </div>

      {/* Authentication Notice */}
      {!currentUser && (
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Account Required
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    You need to sign in to book an appointment. Already have an account?{' '}
                    <a href="/login" className="font-semibold underline hover:text-blue-900">
                      Sign in here
                    </a>
                    {' '}or{' '}
                    <a href="/signup" className="font-semibold underline hover:text-blue-900">
                      create a new account
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logged In User Badge */}
      {currentUser && (
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="bg-green-50 border-l-4 border-green-600 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Signed in as {currentUser.full_name || currentUser.email}
                </h3>
                <p className="mt-1 text-sm text-green-700">
                  You can now book appointments and manage your bookings.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {/* Step 1: Select Service */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <CardTitle>Select a Service</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableServices.map((service) => {
                      const Icon = service.icon
                      return (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => handleServiceSelect(service)}
                          className={`text-left border-2 rounded-xl p-4 transition-all duration-200 ${
                            selectedService?.id === service.id
                              ? 'border-primary-600 bg-primary-50 shadow-md'
                              : 'border-secondary-200 hover:border-primary-300 hover:bg-primary-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              selectedService?.id === service.id
                                ? 'bg-primary-600 text-white'
                                : 'bg-secondary-100 text-secondary-600'
                            }`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-secondary-900 mb-1">
                                {service.name}
                              </h3>
                              <p className="text-secondary-600 text-sm mb-3">
                                {service.description}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-secondary-500">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {service.duration} min
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-3 h-3" />
                                  {service.currency} {service.price.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            {selectedService?.id === service.id && (
                              <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0" />
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Step 2: Select Date */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      selectedService 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-secondary-200 text-secondary-500'
                    }`}>
                      2
                    </div>
                    <CardTitle>Select Date</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedService ? (
                    <Calendar
                      selectedDate={selectedDate}
                      onDateSelect={handleDateSelect}
                      minDate={new Date()}
                      disabledDates={disabledDates}
                      bookedDates={bookedDates}
                    />
                  ) : (
                    <div className="text-center py-8 text-secondary-500">
                      Please select a service first
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Step 3: Select Time */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      selectedDate 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-secondary-200 text-secondary-500'
                    }`}>
                      3
                    </div>
                    <CardTitle>Select Time</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {selectedDate ? (
                    <>
                      {/* AI Recommendations Banner */}
                      {aiRecommendations && aiRecommendations.success && (
                        <div className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Sparkles className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-purple-900 mb-1 flex items-center gap-2">
                                AI-Powered Recommendations
                              </h4>
                              <p className="text-sm text-purple-800 mb-3">
                                {aiRecommendations.insight}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {aiRecommendations.recommendations.slice(0, 3).map((rec, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleTimeSelect(rec.time)}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-purple-300 rounded-full text-sm font-medium text-purple-700 hover:bg-purple-100 hover:border-purple-400 transition-all"
                                  >
                                    <TrendingUp className="h-3.5 w-3.5" />
                                    {rec.time}
                                    <span className="text-xs text-purple-600">({rec.score}% match)</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {loadingRecommendations && (
                        <div className="mb-4 text-center py-3 text-sm text-secondary-600">
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                          Getting AI recommendations...
                        </div>
                      )}
                      
                      <TimeSlotPicker
                        timeSlots={availableTimeSlots}
                        selectedTime={selectedTime}
                        onTimeSelect={handleTimeSelect}
                      />
                    </>
                  ) : (
                    <div className="text-center py-8 text-secondary-500">
                      Please select a date first
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Step 4: Your Information */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      selectedTime 
                        ? 'bg-primary-600 text-white' 
                        : 'bg-secondary-200 text-secondary-500'
                    }`}>
                      4
                    </div>
                    <CardTitle>Your Information</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Full Name"
                        name="fullName"
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={handleInputChange}
                      />
                      
                      <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        required
                        placeholder="+254 712 345 678"
                        value={formData.phone}
                        onChange={handleInputChange}
                        helperText="For SMS reminders"
                      />
                    </div>
                    
                    <Input
                      label="Email Address"
                      name="email"
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      helperText="For email confirmation"
                    />
                    
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-secondary-700 mb-2">
                        <MessageSquare className="w-4 h-4" />
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        name="notes"
                        rows={3}
                        className="w-full rounded-lg border border-secondary-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        placeholder="Any specific concerns or requests..."
                        value={formData.notes}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="flex items-start">
                      <input
                        id="termsAccepted"
                        name="termsAccepted"
                        type="checkbox"
                        checked={formData.termsAccepted}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded mt-1"
                      />
                      <label htmlFor="termsAccepted" className="ml-3 block text-sm text-secondary-600">
                        I agree to the{' '}
                        <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                          terms and conditions
                        </a>{' '}
                        and{' '}
                        <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                          privacy policy
                        </a>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary Sidebar */}
            <div className="lg:col-span-4">
              <div className="sticky top-6 space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Booking Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedService ? (
                        <>
                          <div className="pb-4 border-b border-secondary-200">
                            <p className="text-xs text-secondary-500 mb-1">Service</p>
                            <p className="font-semibold text-secondary-900">{selectedService.name}</p>
                          </div>
                          
                          {selectedDate && (
                            <div className="pb-4 border-b border-secondary-200">
                              <p className="text-xs text-secondary-500 mb-1">Date</p>
                              <p className="font-semibold text-secondary-900">
                                {selectedDate.toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  month: 'long', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          )}
                          
                          {selectedTime && (
                            <div className="pb-4 border-b border-secondary-200">
                              <p className="text-xs text-secondary-500 mb-1">Time</p>
                              <p className="font-semibold text-secondary-900">{selectedTime}</p>
                            </div>
                          )}
                          
                          <div className="pb-4 border-b border-secondary-200">
                            <p className="text-xs text-secondary-500 mb-1">Duration</p>
                            <p className="font-semibold text-secondary-900">{selectedService.duration} minutes</p>
                          </div>
                          
                          <div className="pt-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-secondary-700">Total</span>
                              <span className="text-2xl font-bold text-primary-600">
                                {selectedService.currency} {totalPrice.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-secondary-500 text-center py-8">
                          Select a service to see booking details
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  className="w-full"
                  size="lg"
                  disabled={!selectedService || !selectedDate || !selectedTime || !formData.termsAccepted || isSubmitting}
                >
                  {isSubmitting ? 'Booking...' : 'Confirm Booking'}
                </Button>

                <Card className="bg-primary-50 border-primary-200">
                  <CardContent className="pt-6">
                    <h4 className="font-semibold text-secondary-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary-600" />
                      What happens next?
                    </h4>
                    <ul className="space-y-2 text-sm text-secondary-700">
                      <li className="flex gap-2">
                        <span className="text-primary-600">•</span>
                        <span>Instant confirmation via SMS & email</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary-600">•</span>
                        <span>Reminder 24 hours before appointment</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary-600">•</span>
                        <span>Easy rescheduling or cancellation</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </form>
      </div>
  )
}
