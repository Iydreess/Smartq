'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Calendar, TimeSlotPicker } from '@/components/ui'
import { CheckCircle2, Clock, DollarSign, User, Phone, Mail, MessageSquare } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Enhanced Appointment Booking Page with Real-time Calendar
 */
export default function BookingPage() {
  const router = useRouter()
  
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

  // Services data
  const availableServices = [
    {
      id: 1,
      name: 'General Consultation',
      duration: 30,
      price: 2500,
      currency: 'KSh',
      description: 'General consultation and basic health check',
      category: 'Healthcare',
      icon: User
    },
    {
      id: 2,
      name: 'Specialist Consultation',
      duration: 60,
      price: 5000,
      currency: 'KSh',
      description: 'Detailed consultation with our specialist',
      category: 'Healthcare',
      icon: User
    },
    {
      id: 3,
      name: 'Follow-up Appointment',
      duration: 20,
      price: 1500,
      currency: 'KSh',
      description: 'Follow-up appointment for existing patients',
      category: 'Healthcare',
      icon: User
    },
  ]

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

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setSelectedTime(null)
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
      await new Promise(resolve => setTimeout(resolve, 1500))

      const bookingData = {
        service: selectedService.name,
        category: selectedService.category,
        date: selectedDate.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        time: selectedTime,
        duration: selectedService.duration,
        price: selectedService.price,
        currency: selectedService.currency,
        ...formData
      }

      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      const newBooking = {
        id: Date.now(),
        ...bookingData,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      }
      bookings.push(newBooking)
      localStorage.setItem('bookings', JSON.stringify(bookings))

      toast.success('Appointment booked successfully!')

      const params = new URLSearchParams({
        service: bookingData.service,
        date: bookingData.date,
        time: bookingData.time,
        duration: bookingData.duration,
        price: bookingData.price,
        name: bookingData.fullName
      })
      
      router.push(`/booking/confirm?${params.toString()}`)

    } catch (error) {
      toast.error('Failed to book appointment. Please try again.')
      console.error('Booking error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalPrice = selectedService ? selectedService.price : 0

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
                    <TimeSlotPicker
                      timeSlots={availableTimeSlots}
                      selectedTime={selectedTime}
                      onTimeSelect={handleTimeSelect}
                    />
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
