'use client'

import { useState, useMemo } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button, Calendar, TimeSlotPicker, Card } from '@/components/ui'
import Link from 'next/link'
import { 
  Briefcase, Scale, Calculator, Code, Users, Star, Clock, 
  Calendar as CalendarIcon, MapPin, Phone, Mail, ChevronRight, Award
} from 'lucide-react'

export default function ProfessionalServicesPage() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedPersonnel, setSelectedPersonnel] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  const categories = [
    {
      id: 'accounting-tax',
      name: 'Accounting & Tax',
      icon: Calculator,
      description: 'Professional accounting and tax advisory services',
      color: 'from-blue-500 to-indigo-600',
      services: [
        { id: 'tax-preparation', name: 'Tax Preparation', duration: '90 min', price: 'KSh 20,000' },
        { id: 'business-consulting', name: 'Business Consulting', duration: '60 min', price: 'KSh 26,500' },
        { id: 'financial-planning', name: 'Financial Planning', duration: '120 min', price: 'KSh 39,800' },
        { id: 'audit-services', name: 'Audit Services', duration: '240 min', price: 'KSh 66,300' }
      ]
    },
    {
      id: 'legal-services',
      name: 'Legal Services',
      icon: Scale,
      description: 'Legal consultations and document services',
      color: 'from-gray-700 to-gray-900',
      services: [
        { id: 'legal-consultation', name: 'Legal Consultation', duration: '60 min', price: 'KSh 33,100' },
        { id: 'contract-review', name: 'Contract Review', duration: '90 min', price: 'KSh 46,400' },
        { id: 'notary-services', name: 'Notary Services', duration: '30 min', price: 'KSh 6,600' },
        { id: 'document-drafting', name: 'Document Drafting', duration: '120 min', price: 'KSh 53,000' }
      ]
    },
    {
      id: 'consulting',
      name: 'Business Consulting',
      icon: Briefcase,
      description: 'Strategic business and management consulting',
      color: 'from-green-600 to-emerald-700',
      services: [
        { id: 'strategy-consulting', name: 'Strategy Consulting', duration: '90 min', price: 'KSh 40,000' },
        { id: 'process-improvement', name: 'Process Improvement', duration: '120 min', price: 'KSh 46,800' },
        { id: 'market-research', name: 'Market Research', duration: '180 min', price: 'KSh 60,100' },
        { id: 'project-management', name: 'Project Management', duration: '60 min', price: 'KSh 26,700' }
      ]
    },
    {
      id: 'tech-services',
      name: 'Technical Services',
      icon: Code,
      description: 'IT consulting and technical support',
      color: 'from-purple-600 to-violet-700',
      services: [
        { id: 'it-consulting', name: 'IT Consulting', duration: '60 min', price: 'KSh 24,000' },
        { id: 'software-development', name: 'Software Development', duration: '120 min', price: 'KSh 53,400' },
        { id: 'system-integration', name: 'System Integration', duration: '180 min', price: 'KSh 66,800' },
        { id: 'cybersecurity-audit', name: 'Cybersecurity Audit', duration: '240 min', price: 'KSh 80,200' }
      ]
    }
  ]

  const personnel = {
    'accounting-tax': [
      {
        id: 'robert-chang',
        name: 'Robert Chang',
        title: 'Certified Public Accountant',
        rating: 4.9,
        reviews: 342,
        specialties: ['Tax Planning', 'Business Accounting', 'Financial Analysis'],
        image: '/api/placeholder/200/200',
        experience: '15 years',
        languages: ['English', 'Mandarin']
      },
      {
        id: 'maria-gonzalez',
        name: 'Maria Gonzalez',
        title: 'Tax Advisor & CPA',
        rating: 4.8,
        reviews: 298,
        specialties: ['Personal Tax', 'Small Business Tax', 'IRS Representation'],
        image: '/api/placeholder/200/200',
        experience: '12 years',
        languages: ['English', 'Spanish']
      }
    ],
    'legal-services': [
      {
        id: 'sarah-mitchell',
        name: 'Sarah Mitchell',
        title: 'Attorney at Law',
        rating: 4.9,
        reviews: 456,
        specialties: ['Business Law', 'Contract Law', 'Real Estate Law'],
        image: '/api/placeholder/200/200',
        experience: '18 years',
        languages: ['English']
      },
      {
        id: 'david-kumar',
        name: 'David Kumar',
        title: 'Legal Counsel & Notary',
        rating: 4.7,
        reviews: 234,
        specialties: ['Corporate Law', 'Intellectual Property', 'Employment Law'],
        image: '/api/placeholder/200/200',
        experience: '10 years',
        languages: ['English', 'Hindi']
      }
    ],
    'consulting': [
      {
        id: 'james-wilson',
        name: 'James Wilson',
        title: 'Senior Business Consultant',
        rating: 4.8,
        reviews: 387,
        specialties: ['Strategic Planning', 'Operations Management', 'Digital Transformation'],
        image: '/api/placeholder/200/200',
        experience: '20 years',
        languages: ['English']
      },
      {
        id: 'lisa-chen',
        name: 'Lisa Chen',
        title: 'Management Consultant',
        rating: 4.9,
        reviews: 267,
        specialties: ['Process Optimization', 'Change Management', 'Performance Analytics'],
        image: '/api/placeholder/200/200',
        experience: '14 years',
        languages: ['English', 'Mandarin']
      }
    ],
    'tech-services': [
      {
        id: 'michael-thompson',
        name: 'Michael Thompson',
        title: 'Senior IT Consultant',
        rating: 4.9,
        reviews: 398,
        specialties: ['Cloud Architecture', 'System Design', 'DevOps'],
        image: '/api/placeholder/200/200',
        experience: '16 years',
        languages: ['English']
      },
      {
        id: 'priya-patel',
        name: 'Priya Patel',
        title: 'Cybersecurity Specialist',
        rating: 4.8,
        reviews: 289,
        specialties: ['Security Audits', 'Compliance', 'Risk Assessment'],
        image: '/api/placeholder/200/200',
        experience: '11 years',
        languages: ['English', 'Hindi']
      }
    ]
  }

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

  const handleBooking = () => {
    const selectedCategoryData = categories.find(cat => cat.id === selectedCategory)
    const selectedServiceData = selectedCategoryData?.services.find(service => service.id === selectedService)
    const selectedPersonnelData = personnel[selectedCategory]?.find(person => person.id === selectedPersonnel)
    
    // Validate that we have the minimum required data
    if (!selectedServiceData?.name || !selectedPersonnelData?.name) {
      alert('Please select a service and professional before booking.');
      return;
    }
    
    const bookingData = {
      category: selectedCategoryData?.name || 'Professional Services',
      service: selectedServiceData.name,
      personnel: selectedPersonnelData.name,
      date: selectedDate ? selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) : '',
      time: selectedTime || '',
      duration: selectedServiceData.duration || '60 min',
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
      <section className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-blue-600/10"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Briefcase className="w-20 h-20 mx-auto mb-6 text-slate-600 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              Professional Services
              <span className="block bg-gradient-to-r from-slate-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                & Consulting
              </span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              Connect with expert business consultants, legal professionals, accountants, 
              and IT specialists for comprehensive professional services.
            </p>
          </div>
        </div>
      </section>

      {/* Category Selection */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Choose Your Professional Service
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
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-blue-50 shadow-strong' 
                      : 'border-secondary-200 bg-white hover:border-green-300'
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
        <section className="py-16 bg-gradient-to-br from-secondary-50 to-green-50">
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
                      ? 'border-green-500 bg-white shadow-lg'
                      : 'border-secondary-200 bg-white hover:border-green-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-secondary-900">{service.name}</h4>
                    <span className="text-green-600 font-bold">{service.price}</span>
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
              Choose Your Professional
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {personnel[selectedCategory]?.map((person) => (
                <div
                  key={person.id}
                  onClick={() => setSelectedPersonnel(person.id)}
                  className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-strong hover:-translate-y-1 ${
                    selectedPersonnel === person.id
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-blue-50 shadow-strong'
                      : 'border-secondary-200 bg-white hover:border-green-300'
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
                      <p className="text-green-600 font-medium mb-2">{person.title}</p>
                      
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
                            className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-200"
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
        <section className="py-16 bg-gradient-to-br from-secondary-50 to-green-50">
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
                        <p className="font-medium text-secondary-900">
                          {categories.find(cat => cat.id === selectedCategory)?.name}
                        </p>
                      </div>
                    )}
                    
                    {selectedService && (
                      <div>
                        <p className="text-sm text-secondary-600 mb-1">Service</p>
                        <p className="font-medium text-secondary-900">
                          {categories.find(cat => cat.id === selectedCategory)?.services.find(s => s.id === selectedService)?.name}
                        </p>
                        <p className="text-sm text-secondary-500 mt-1">
                          {categories.find(cat => cat.id === selectedCategory)?.services.find(s => s.id === selectedService)?.duration} • {categories.find(cat => cat.id === selectedCategory)?.services.find(s => s.id === selectedService)?.price}
                        </p>
                      </div>
                    )}
                    
                    {selectedPersonnel && (
                      <div>
                        <p className="text-sm text-secondary-600 mb-1">Professional</p>
                        <p className="font-medium text-secondary-900">
                          {personnel[selectedCategory]?.find(p => p.id === selectedPersonnel)?.name}
                        </p>
                        <p className="text-sm text-secondary-500">
                          {personnel[selectedCategory]?.find(p => p.id === selectedPersonnel)?.title}
                        </p>
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
                        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
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