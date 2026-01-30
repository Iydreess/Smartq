'use client'

import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui'
import { useState } from 'react'
import Image from 'next/image'
import { 
  Calendar, Clock, User, MapPin, Phone, Star,
  ChevronLeft, ChevronRight, CheckCircle
} from 'lucide-react'

export default function DentalBookingPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedTime, setSelectedTime] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Mock dentist data
  const dentist = {
    name: 'Dr. Sarah Johnson',
    speciality: 'General Dentistry & Cosmetics',
    rating: 4.9,
    reviews: 234,
    image: '/api/placeholder/200/200',
    location: 'Nairobi Dental Clinic',
    phone: '+254 712 345 678'
  }

  const services = [
    { id: 1, name: 'Dental Checkup & Cleaning', duration: '60 min', price: 'KSh 16,000' },
    { id: 2, name: 'Teeth Whitening', duration: '90 min', price: 'KSh 46,800' },
    { id: 3, name: 'Dental Filling', duration: '45 min', price: 'KSh 24,000' },
    { id: 4, name: 'Root Canal Treatment', duration: '120 min', price: 'KSh 107,000' },
    { id: 5, name: 'Crown Placement', duration: '90 min', price: 'KSh 160,000' },
    { id: 6, name: 'Orthodontic Consultation', duration: '45 min', price: 'KSh 20,000' }
  ]

  // Generate time slots for the week
  const generateTimeSlots = (date) => {
    const slots = []
    const startHour = 9 // 9 AM
    const endHour = 17 // 5 PM
    const slotDuration = 30 // 30 minutes
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        // Mock availability - some slots are booked
        const isBooked = Math.random() > 0.7
        slots.push({
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          available: !isBooked
        })
      }
    }
    return slots
  }

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  // Get the current week dates
  const getWeekDates = () => {
    const week = []
    const startOfWeek = new Date(currentMonth)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
    startOfWeek.setDate(diff)
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      week.push(date)
    }
    return week
  }

  const weekDates = getWeekDates()

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSameDay = (date1, date2) => {
    return date1.toDateString() === date2.toDateString()
  }

  const nextWeek = () => {
    const next = new Date(currentMonth)
    next.setDate(next.getDate() + 7)
    setCurrentMonth(next)
  }

  const prevWeek = () => {
    const prev = new Date(currentMonth)
    prev.setDate(prev.getDate() - 7)
    setCurrentMonth(prev)
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-cyan-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <nav className="text-sm text-secondary-600 mb-4">
              <span>Healthcare</span> → <span>Dental Services</span> → <span className="text-secondary-900 font-medium">Book Appointment</span>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900">
              Book Dental Appointment
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Dentist Info & Services */}
            <div className="space-y-6">
              {/* Dentist Card */}
              <div className="bg-white rounded-2xl shadow-soft border border-secondary-200 p-6">
                <div className="flex items-start space-x-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 flex items-center justify-center">
                    <User className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-secondary-900 mb-1">
                      {dentist.name}
                    </h2>
                    <p className="text-secondary-600 mb-2">
                      {dentist.speciality}
                    </p>
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-warning-500 mr-1" />
                      <span className="font-semibold text-secondary-900">{dentist.rating}</span>
                      <span className="text-secondary-600 ml-1">({dentist.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center text-sm text-secondary-600 mb-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {dentist.location}
                    </div>
                    <div className="flex items-center text-sm text-secondary-600">
                      <Phone className="w-4 h-4 mr-1" />
                      {dentist.phone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Services Selection */}
              <div className="bg-white rounded-2xl shadow-soft border border-secondary-200 p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Select Service
                </h3>
                <div className="space-y-3">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedService?.id === service.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-secondary-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-secondary-900">
                            {service.name}
                          </h4>
                          <div className="flex items-center text-sm text-secondary-600 mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {service.duration}
                          </div>
                        </div>
                        <span className="font-bold text-blue-600">
                          {service.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Column - Calendar */}
            <div className="bg-white rounded-2xl shadow-soft border border-secondary-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-secondary-900">
                  Select Date
                </h3>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={prevWeek}
                    className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-secondary-600" />
                  </button>
                  <span className="text-sm font-medium text-secondary-700 px-3">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button 
                    onClick={nextWeek}
                    className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-secondary-600" />
                  </button>
                </div>
              </div>

              {/* Week View */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day, index) => (
                  <div key={day} className="text-center">
                    <div className="text-xs font-medium text-secondary-600 mb-2">
                      {day}
                    </div>
                    <button
                      onClick={() => setSelectedDate(weekDates[index])}
                      disabled={weekDates[index] < new Date().setHours(0,0,0,0)}
                      className={`w-full h-12 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isSameDay(selectedDate, weekDates[index])
                          ? 'bg-blue-600 text-white shadow-lg'
                          : isToday(weekDates[index])
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          : weekDates[index] < new Date().setHours(0,0,0,0)
                          ? 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                          : 'bg-secondary-50 text-secondary-700 hover:bg-blue-50 hover:text-blue-700'
                      }`}
                    >
                      {weekDates[index].getDate()}
                    </button>
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              <div>
                <h4 className="text-sm font-semibold text-secondary-900 mb-3">
                  Available Times - {formatDate(selectedDate)}
                </h4>
                <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto">
                  {generateTimeSlots(selectedDate).map((slot, index) => (
                    <button
                      key={index}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`p-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        selectedTime === slot.time
                          ? 'bg-blue-600 text-white shadow-lg'
                          : slot.available
                          ? 'bg-secondary-50 text-secondary-700 hover:bg-blue-50 hover:text-blue-700'
                          : 'bg-secondary-100 text-secondary-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="space-y-6">
              {/* Booking Summary */}
              <div className="bg-white rounded-2xl shadow-soft border border-secondary-200 p-6">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                  Booking Summary
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-secondary-900">{dentist.name}</p>
                      <p className="text-sm text-secondary-600">{dentist.speciality}</p>
                    </div>
                  </div>
                  
                  {selectedService && (
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-secondary-900">{selectedService.name}</p>
                        <p className="text-sm text-secondary-600">{selectedService.duration} • {selectedService.price}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-secondary-900">{formatDate(selectedDate)}</p>
                      {selectedTime && (
                        <p className="text-sm text-secondary-600">{selectedTime}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-secondary-900">{dentist.location}</p>
                      <p className="text-sm text-secondary-600">Downtown Medical Center</p>
                    </div>
                  </div>
                </div>
                
                {selectedService && selectedTime && (
                  <div className="mt-6 pt-6 border-t border-secondary-200">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-secondary-900">Total</span>
                      <span className="text-2xl font-bold text-blue-600">{selectedService.price}</span>
                    </div>
                    
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                    >
                      Book Appointment
                    </Button>
                    
                    <p className="text-xs text-secondary-500 mt-3 text-center">
                      You will receive a confirmation email and SMS reminder
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Info */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="font-semibold text-secondary-900 mb-3">
                  Before Your Visit
                </h4>
                <ul className="space-y-2 text-sm text-secondary-700">
                  <li>• Arrive 15 minutes early for check-in</li>
                  <li>• Bring your insurance card and ID</li>
                  <li>• List current medications</li>
                  <li>• Avoid eating 2 hours before cleaning</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}