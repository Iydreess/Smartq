'use client'

import { useState, useMemo } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button, Calendar, TimeSlotPicker, Card } from '@/components/ui'
import Link from 'next/link'
import { 
  Heart, Stethoscope, Brain, Eye, Users, Star, Clock, 
  Calendar as CalendarIcon, MapPin, Phone, Mail, ChevronRight, Award
} from 'lucide-react'

export default function HealthcarePage() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedPersonnel, setSelectedPersonnel] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  // Disable Sundays and past dates
  const disabledDates = useMemo(() => {
    const dates = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Add Sundays for next 60 days
    for (let i = 0; i < 60; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() + i)
      if (date.getDay() === 0) {
        dates.push(date.toDateString())
      }
    }
    return dates
  }, [])

  // Generate available time slots based on selected date
  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return []
    
    const slots = []
    const date = new Date(selectedDate)
    const dayOfWeek = date.getDay()
    
    // Weekend has different hours (9 AM - 5 PM)
    // Weekday hours: 8 AM - 8 PM
    const startHour = dayOfWeek === 6 ? 9 : 8
    const endHour = dayOfWeek === 6 ? 17 : 20
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute of [0, 30]) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        
        // Simulate availability - some random slots are booked
        const isBooked = Math.random() > 0.7
        const spotsLeft = isBooked ? 0 : Math.floor(Math.random() * 10) + 1
        
        // Determine period based on hour
        let period = 'morning'
        if (hour >= 12 && hour < 17) period = 'afternoon'
        else if (hour >= 17) period = 'evening'
        
        slots.push({
          time,
          available: !isBooked,
          spotsLeft,
          period
        })
      }
    }
    
    return slots
  }, [selectedDate])

  const categories = [
    {
      id: 'general-medicine',
      name: 'General Medicine',
      icon: Stethoscope,
      description: 'Primary care physicians and family doctors',
      color: 'from-blue-500 to-indigo-600',
      services: [
        { id: 'general-checkup', name: 'General Health Checkup', duration: '45 min', price: 'KSh 16,000' },
        { id: 'chronic-care', name: 'Chronic Disease Management', duration: '60 min', price: 'KSh 20,000' },
        { id: 'preventive-care', name: 'Preventive Care Consultation', duration: '30 min', price: 'KSh 12,000' },
        { id: 'health-screening', name: 'Health Screening', duration: '90 min', price: 'KSh 26,700' }
      ]
    },
    {
      id: 'specialist-care',
      name: 'Specialist Care',
      icon: Heart,
      description: 'Specialized medical consultations and treatments',
      color: 'from-red-500 to-pink-600',
      services: [
        { id: 'cardiology', name: 'Cardiology Consultation', duration: '60 min', price: 'KSh 29,400' },
        { id: 'dermatology', name: 'Dermatology Consultation', duration: '45 min', price: 'KSh 24,000' },
        { id: 'orthopedics', name: 'Orthopedic Consultation', duration: '60 min', price: 'KSh 26,700' },
        { id: 'endocrinology', name: 'Endocrinology Consultation', duration: '50 min', price: 'KSh 25,400' }
      ]
    },
    {
      id: 'mental-health',
      name: 'Mental Health',
      icon: Brain,
      description: 'Psychology, psychiatry, and counseling services',
      color: 'from-green-500 to-emerald-600',
      services: [
        { id: 'therapy-session', name: 'Individual Therapy Session', duration: '60 min', price: 'KSh 18,700' },
        { id: 'psychiatric-eval', name: 'Psychiatric Evaluation', duration: '90 min', price: 'KSh 37,400' },
        { id: 'couples-therapy', name: 'Couples Therapy', duration: '75 min', price: 'KSh 24,000' },
        { id: 'group-therapy', name: 'Group Therapy Session', duration: '90 min', price: 'KSh 10,700' }
      ]
    },
    {
      id: 'diagnostic-services',
      name: 'Diagnostic Services',
      icon: Eye,
      description: 'Medical imaging, lab tests, and diagnostic procedures',
      color: 'from-purple-500 to-violet-600',
      services: [
        { id: 'blood-work', name: 'Comprehensive Blood Work', duration: '30 min', price: 'KSh 11,400' },
        { id: 'mri-scan', name: 'MRI Scan', duration: '45 min', price: 'KSh 60,000' },
        { id: 'ultrasound', name: 'Ultrasound Examination', duration: '30 min', price: 'KSh 20,000' },
        { id: 'x-ray', name: 'X-Ray Imaging', duration: '15 min', price: 'KSh 10,000' }
      ]
    }
  ]

  const personnel = {
    'general-medicine': [
      {
        id: 'dr-sarah-johnson',
        name: 'Dr. Sarah Johnson',
        title: 'Family Medicine Physician',
        rating: 4.9,
        reviews: 523,
        specialties: ['Primary Care', 'Preventive Medicine', 'Chronic Disease Management'],
        image: '/api/placeholder/200/200',
        experience: '18 years',
        languages: ['English', 'Spanish']
      },
      {
        id: 'dr-michael-chen',
        name: 'Dr. Michael Chen',
        title: 'Internal Medicine Physician',
        rating: 4.8,
        reviews: 387,
        specialties: ['Internal Medicine', 'Diabetes Care', 'Hypertension Management'],
        image: '/api/placeholder/200/200',
        experience: '14 years',
        languages: ['English', 'Mandarin']
      }
    ],
    'specialist-care': [
      {
        id: 'dr-emily-rodriguez',
        name: 'Dr. Emily Rodriguez',
        title: 'Cardiologist',
        rating: 4.9,
        reviews: 445,
        specialties: ['Cardiology', 'Heart Disease Prevention', 'Echocardiography'],
        image: '/api/placeholder/200/200',
        experience: '20 years',
        languages: ['English', 'Spanish']
      },
      {
        id: 'dr-james-wilson',
        name: 'Dr. James Wilson',
        title: 'Orthopedic Surgeon',
        rating: 4.8,
        reviews: 298,
        specialties: ['Orthopedic Surgery', 'Sports Medicine', 'Joint Replacement'],
        image: '/api/placeholder/200/200',
        experience: '16 years',
        languages: ['English']
      }
    ],
    'mental-health': [
      {
        id: 'dr-lisa-martinez',
        name: 'Dr. Lisa Martinez',
        title: 'Clinical Psychologist',
        rating: 4.9,
        reviews: 367,
        specialties: ['Cognitive Behavioral Therapy', 'Anxiety Disorders', 'Depression Treatment'],
        image: '/api/placeholder/200/200',
        experience: '12 years',
        languages: ['English', 'Spanish']
      },
      {
        id: 'dr-david-kim',
        name: 'Dr. David Kim',
        title: 'Psychiatrist',
        rating: 4.7,
        reviews: 234,
        specialties: ['Psychiatric Evaluation', 'Medication Management', 'Mood Disorders'],
        image: '/api/placeholder/200/200',
        experience: '15 years',
        languages: ['English', 'Korean']
      }
    ],
    'diagnostic-services': [
      {
        id: 'dr-angela-brown',
        name: 'Dr. Angela Brown',
        title: 'Radiologist',
        rating: 4.8,
        reviews: 189,
        specialties: ['Medical Imaging', 'MRI Interpretation', 'CT Scan Analysis'],
        image: '/api/placeholder/200/200',
        experience: '11 years',
        languages: ['English']
      },
      {
        id: 'tech-robert-garcia',
        name: 'Robert Garcia',
        title: 'Medical Laboratory Technician',
        rating: 4.6,
        reviews: 156,
        specialties: ['Blood Analysis', 'Laboratory Testing', 'Diagnostic Procedures'],
        image: '/api/placeholder/200/200',
        experience: '8 years',
        languages: ['English', 'Spanish']
      }
    ]
  }

  // Generate time slots based on selected date
  const handleBooking = () => {
    const selectedCategoryData = categories.find(cat => cat.id === selectedCategory)
    const selectedServiceData = selectedCategoryData?.services.find(service => service.id === selectedService)
    const selectedPersonnelData = personnel[selectedCategory]?.find(person => person.id === selectedPersonnel)
    
    // Validate that we have the minimum required data
    if (!selectedServiceData?.name || !selectedPersonnelData?.name) {
      alert('Please select a service and healthcare provider before booking.');
      return;
    }
    
    const bookingData = {
      category: selectedCategoryData?.name || 'Healthcare',
      service: selectedServiceData.name,
      personnel: selectedPersonnelData.name,
      date: selectedDate ? selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) : '',
      time: selectedTime || '',
      duration: selectedServiceData.duration || '45 min',
      price: selectedServiceData.price || 'Contact for pricing'
    }
    
    // Filter out empty values
    const filteredData = Object.fromEntries(
      Object.entries(bookingData).filter(([key, value]) => value !== '')
    )
    
    const params = new URLSearchParams(filteredData)
    window.location.href = `/booking/confirm?${params.toString()}`
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Heart className="w-20 h-20 mx-auto mb-6 text-blue-600 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              Healthcare
              <span className="block bg-gradient-to-r from-blue-600 via-green-600 to-indigo-600 bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              Book appointments with qualified healthcare professionals, specialists, 
              and mental health providers for comprehensive medical care.
            </p>
          </div>
        </div>
      </section>

      {/* Category Selection */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Choose Your Healthcare Service
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon
              const isSelected = selectedCategory === category.id
              
              return (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-strong hover:-translate-y-1 ${
                    isSelected 
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-green-50 shadow-strong' 
                      : 'border-secondary-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-center text-secondary-900 mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-secondary-600 text-center">
                    {category.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Service Selection */}
      {selectedCategory && (
        <section className="py-16 bg-gradient-to-br from-secondary-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-center text-secondary-900 mb-8">
              Select Your Service
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.find(cat => cat.id === selectedCategory)?.services.map((service) => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`cursor-pointer p-6 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                    selectedService === service.id
                      ? 'border-blue-500 bg-white shadow-lg'
                      : 'border-secondary-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-secondary-900">{service.name}</h4>
                    <span className="text-blue-600 font-bold">{service.price}</span>
                  </div>
                  <div className="flex items-center text-secondary-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm">{service.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Personnel Selection */}
      {selectedService && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-center text-secondary-900 mb-8">
              Choose Your Healthcare Provider
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {personnel[selectedCategory]?.map((person) => (
                <div
                  key={person.id}
                  onClick={() => setSelectedPersonnel(person.id)}
                  className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-strong hover:-translate-y-1 ${
                    selectedPersonnel === person.id
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-green-50 shadow-strong'
                      : 'border-secondary-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-secondary-900">{person.name}</h4>
                      <p className="text-blue-600 font-medium mb-2">{person.title}</p>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex items-center mr-4">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="ml-1 font-semibold text-secondary-900">{person.rating}</span>
                          <span className="ml-1 text-secondary-500">({person.reviews} reviews)</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-secondary-600 mb-3">
                        <Award className="w-4 h-4 mr-1" />
                        <span>{person.experience} experience</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {person.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full border border-blue-200"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Time Selection */}
      {selectedPersonnel && (
        <section className="py-16 bg-gradient-to-br from-secondary-50 to-blue-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl font-bold text-center text-secondary-900 mb-8">
              Select Date & Time
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Calendar Section */}
              <div className="lg:col-span-8">
                <Card className="p-6">
                  <h4 className="text-lg font-semibold text-secondary-900 mb-4">Choose Your Date</h4>
                  <Calendar
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                    disabledDates={disabledDates}
                    bookedDates={[]}
                    minDate={new Date()}
                    maxDate={new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)}
                  />
                </Card>

                {/* Time Slots */}
                {selectedDate && (
                  <Card className="p-6 mt-6">
                    <h4 className="text-lg font-semibold text-secondary-900 mb-4">Choose Your Time</h4>
                    <TimeSlotPicker
                      timeSlots={availableTimeSlots}
                      selectedTime={selectedTime}
                      onTimeSelect={setSelectedTime}
                    />
                  </Card>
                )}
              </div>

              {/* Summary Sidebar */}
              <div className="lg:col-span-4">
                <Card className="p-6 sticky top-6">
                  <h4 className="text-lg font-semibold text-secondary-900 mb-4">Appointment Summary</h4>
                  
                  <div className="space-y-4">
                    {selectedCategory && (
                      <div>
                        <p className="text-sm text-secondary-600 mb-1">Category</p>
                        <p className="font-medium text-secondary-900">{selectedCategory.name}</p>
                      </div>
                    )}
                    
                    {selectedService && (
                      <div>
                        <p className="text-sm text-secondary-600 mb-1">Service</p>
                        <p className="font-medium text-secondary-900">{selectedService.name}</p>
                        <p className="text-sm text-secondary-500 mt-1">
                          {selectedService.duration} • ${selectedService.price}
                        </p>
                      </div>
                    )}
                    
                    {selectedPersonnel && (
                      <div>
                        <p className="text-sm text-secondary-600 mb-1">Healthcare Provider</p>
                        <p className="font-medium text-secondary-900">{selectedPersonnel.name}</p>
                        <p className="text-sm text-secondary-500">{selectedPersonnel.role}</p>
                      </div>
                    )}
                    
                    {selectedDate && (
                      <div>
                        <p className="text-sm text-secondary-600 mb-1">Date</p>
                        <p className="font-medium text-secondary-900">
                          {selectedDate.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                    
                    {selectedTime && (
                      <div>
                        <p className="text-sm text-secondary-600 mb-1">Time</p>
                        <p className="font-medium text-secondary-900">{selectedTime}</p>
                      </div>
                    )}
                  </div>

                  {selectedTime && (
                    <div className="mt-6 pt-6 border-t border-secondary-200">
                      <Button
                        onClick={handleBooking}
                        className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                      >
                        <CalendarIcon className="w-5 h-5 mr-2" />
                        Confirm Booking
                      </Button>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  )
}