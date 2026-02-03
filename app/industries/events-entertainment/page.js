'use client'

import { useState, useMemo } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button, Calendar, TimeSlotPicker, Card } from '@/components/ui'
import Link from 'next/link'
import { 
  Calendar as CalendarIcon, Camera, Users, MapPin, Music, Palette, Star, Clock, 
  Phone, Mail, ChevronRight, Award, Globe, Heart, Sparkles
} from 'lucide-react'

export default function EventsEntertainmentPage() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedPersonnel, setSelectedPersonnel] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  const categories = [
    {
      id: 'event-venues',
      name: 'Event Venues',
      icon: Calendar,
      description: 'Wedding venues, conference halls, and party spaces',
      color: 'from-purple-500 to-pink-600',
      services: [
        { id: 'venue-tour', name: 'Venue Tour & Consultation', duration: '60 min', price: 'KSh 6,700' },
        { id: 'event-planning', name: 'Event Planning Session', duration: '90 min', price: 'KSh 13,400' },
        { id: 'catering-consultation', name: 'Catering Consultation', duration: '45 min', price: 'KSh 10,000' },
        { id: 'decoration-planning', name: 'Decoration Planning', duration: '75 min', price: 'KSh 11,400' }
      ]
    },
    {
      id: 'photography',
      name: 'Photography Services',
      icon: Camera,
      description: 'Professional photographers for all occasions',
      color: 'from-blue-500 to-cyan-600',
      services: [
        { id: 'portrait-session', name: 'Portrait Photography', duration: '120 min', price: 'KSh 26,700' },
        { id: 'event-photography', name: 'Event Photography', duration: '240 min', price: 'KSh 66,800' },
        { id: 'product-photography', name: 'Product Photography', duration: '90 min', price: 'KSh 20,000' },
        { id: 'headshot-session', name: 'Professional Headshots', duration: '60 min', price: 'KSh 16,000' }
      ]
    },
    {
      id: 'tour-guides',
      name: 'Tour Guides',
      icon: MapPin,
      description: 'Local tours and travel experiences',
      color: 'from-green-500 to-teal-600',
      services: [
        { id: 'city-tour', name: 'City Walking Tour', duration: '180 min', price: 'KSh 6,000' },
        { id: 'museum-tour', name: 'Museum Guided Tour', duration: '120 min', price: 'KSh 4,700' },
        { id: 'food-tour', name: 'Culinary Food Tour', duration: '210 min', price: 'KSh 8,700' },
        { id: 'historical-tour', name: 'Historical Site Tour', duration: '150 min', price: 'KSh 5,400' }
      ]
    },
    {
      id: 'entertainment',
      name: 'Entertainment Services',
      icon: Music,
      description: 'Musicians, DJs, and performers',
      color: 'from-orange-500 to-red-600',
      services: [
        { id: 'dj-consultation', name: 'DJ Consultation', duration: '45 min', price: 'KSh 8,000' },
        { id: 'band-audition', name: 'Live Band Audition', duration: '60 min', price: 'KSh 10,700' },
        { id: 'entertainment-planning', name: 'Entertainment Planning', duration: '90 min', price: 'KSh 13,400' },
        { id: 'performer-booking', name: 'Performer Booking', duration: '30 min', price: 'KSh 6,700' }
      ]
    }
  ]

  const personnel = {
    'event-venues': [
      {
        id: 'sophia-martinez',
        name: 'Sophia Martinez',
        title: 'Senior Event Coordinator',
        rating: 4.9,
        reviews: 312,
        specialties: ['Weddings', 'Corporate Events', 'Social Gatherings'],
        image: '/api/placeholder/200/200',
        experience: '12 years',
        languages: ['English', 'Spanish']
      },
      {
        id: 'james-wilson',
        name: 'James Wilson',
        title: 'Venue Manager',
        rating: 4.8,
        reviews: 278,
        specialties: ['Conference Planning', 'Team Building', 'Product Launches'],
        image: '/api/placeholder/200/200',
        experience: '10 years',
        languages: ['English']
      }
    ],
    'photography': [
      {
        id: 'alexandra-brooks',
        name: 'Alexandra Brooks',
        title: 'Professional Photographer',
        rating: 4.9,
        reviews: 425,
        specialties: ['Portrait', 'Wedding', 'Fashion Photography'],
        image: '/api/placeholder/200/200',
        experience: '15 years',
        languages: ['English', 'French']
      },
      {
        id: 'marcus-chen',
        name: 'Marcus Chen',
        title: 'Commercial Photographer',
        rating: 4.8,
        reviews: 356,
        specialties: ['Product Photography', 'Corporate Headshots', 'Events'],
        image: '/api/placeholder/200/200',
        experience: '11 years',
        languages: ['English', 'Mandarin']
      }
    ],
    'tour-guides': [
      {
        id: 'elena-rodriguez',
        name: 'Elena Rodriguez',
        title: 'Licensed Tour Guide',
        rating: 4.9,
        reviews: 523,
        specialties: ['Historical Tours', 'Cultural Experiences', 'Food Tours'],
        image: '/api/placeholder/200/200',
        experience: '8 years',
        languages: ['English', 'Spanish', 'Portuguese']
      },
      {
        id: 'david-thompson',
        name: 'David Thompson',
        title: 'Adventure Guide',
        rating: 4.7,
        reviews: 298,
        specialties: ['Nature Tours', 'City Walks', 'Museum Guidance'],
        image: '/api/placeholder/200/200',
        experience: '14 years',
        languages: ['English', 'German']
      }
    ],
    'entertainment': [
      {
        id: 'dj-mike-stevens',
        name: 'DJ Mike Stevens',
        title: 'Professional DJ & MC',
        rating: 4.8,
        reviews: 387,
        specialties: ['Wedding DJ', 'Corporate Events', 'Party Entertainment'],
        image: '/api/placeholder/200/200',
        experience: '16 years',
        languages: ['English']
      },
      {
        id: 'sarah-melody',
        name: 'Sarah Melody',
        title: 'Entertainment Coordinator',
        rating: 4.9,
        reviews: 234,
        specialties: ['Live Bands', 'Performers', 'Event Entertainment'],
        image: '/api/placeholder/200/200',
        experience: '9 years',
        languages: ['English', 'Italian']
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
    
    const bookingData = {
      category: selectedCategoryData?.name,
      service: selectedServiceData?.name,
      personnel: selectedPersonnelData?.name,
      date: selectedDate ? selectedDate.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) : '',
      time: selectedTime,
      duration: selectedServiceData?.duration,
      price: selectedServiceData?.price
    }
    
    const params = new URLSearchParams(bookingData)
    window.location.href = `/booking/confirm?${params.toString()}`
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Sparkles className="w-20 h-20 mx-auto mb-6 text-purple-600 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              Events & Entertainment
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
                Booking Hub
              </span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              Book venues, photographers, tour guides, and entertainment services 
              for your special occasions and memorable experiences.
            </p>
          </div>
        </div>
      </section>

      {/* Category Selection */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Choose Your Service Category
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
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-strong' 
                      : 'border-secondary-200 bg-white hover:border-purple-300'
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
        <section className="py-16 bg-gradient-to-br from-secondary-50 to-purple-50">
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
                      ? 'border-purple-500 bg-white shadow-lg'
                      : 'border-secondary-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-secondary-900">{service.name}</h4>
                    <span className="text-purple-600 font-bold">{service.price}</span>
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
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-strong'
                      : 'border-secondary-200 bg-white hover:border-purple-300'
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
                      <p className="text-purple-600 font-medium mb-2">{person.title}</p>
                      
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
                        <Globe className="w-4 h-4 ml-3 mr-1" />
                        <span>{person.languages.join(', ')}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {person.specialties.map((specialty, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full border border-purple-200"
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
        <section className="py-16 bg-gradient-to-br from-secondary-50 to-purple-50">
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
                  <h4 className="text-lg font-semibold text-secondary-900 mb-4">Booking Summary</h4>
                  
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
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
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