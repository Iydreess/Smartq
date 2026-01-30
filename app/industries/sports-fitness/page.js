'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { 
  Dumbbell, Heart, Target, Users, Star, Clock, 
  Calendar, MapPin, Phone, Mail, ChevronRight, Award
} from 'lucide-react'

export default function SportsFitnessPage() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedPersonnel, setSelectedPersonnel] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  const categories = [
    {
      id: 'personal-training',
      name: 'Personal Training',
      icon: Dumbbell,
      description: 'One-on-one fitness coaching and strength training',
      color: 'from-green-500 to-emerald-600',
      services: [
        { id: 'strength-training', name: 'Strength Training', duration: '60 min', price: 'KSh 10,700' },
        { id: 'hiit-training', name: 'HIIT Training', duration: '45 min', price: 'KSh 9,400' },
        { id: 'fitness-assessment', name: 'Fitness Assessment', duration: '90 min', price: 'KSh 13,400' },
        { id: 'functional-training', name: 'Functional Training', duration: '60 min', price: 'KSh 10,000' }
      ]
    },
    {
      id: 'yoga-pilates',
      name: 'Yoga & Pilates',
      icon: Heart,
      description: 'Mind-body wellness and flexibility training',
      color: 'from-purple-500 to-pink-600',
      services: [
        { id: 'hatha-yoga', name: 'Hatha Yoga', duration: '75 min', price: 'KSh 6,700' },
        { id: 'vinyasa-flow', name: 'Vinyasa Flow', duration: '60 min', price: 'KSh 6,000' },
        { id: 'pilates-mat', name: 'Pilates Mat Class', duration: '60 min', price: 'KSh 5,400' },
        { id: 'restorative-yoga', name: 'Restorative Yoga', duration: '90 min', price: 'KSh 7,400' }
      ]
    },
    {
      id: 'physical-therapy',
      name: 'Physical Therapy',
      icon: Target,
      description: 'Rehabilitation and injury prevention services',
      color: 'from-blue-500 to-cyan-600',
      services: [
        { id: 'injury-rehab', name: 'Injury Rehabilitation', duration: '60 min', price: 'KSh 12,700' },
        { id: 'sports-massage', name: 'Sports Massage', duration: '90 min', price: 'KSh 16,000' },
        { id: 'movement-assessment', name: 'Movement Assessment', duration: '75 min', price: 'KSh 14,700' },
        { id: 'recovery-therapy', name: 'Recovery Therapy', duration: '60 min', price: 'KSh 11,400' }
      ]
    },
    {
      id: 'sports-coaching',
      name: 'Sports Coaching',
      icon: Users,
      description: 'Specialized coaching for various sports and activities',
      color: 'from-orange-500 to-red-600',
      services: [
        { id: 'tennis-coaching', name: 'Tennis Coaching', duration: '60 min', price: 'KSh 8,700' },
        { id: 'swimming-lessons', name: 'Swimming Lessons', duration: '45 min', price: 'KSh 7,400' },
        { id: 'basketball-training', name: 'Basketball Training', duration: '90 min', price: 'KSh 10,000' },
        { id: 'martial-arts', name: 'Martial Arts Training', duration: '60 min', price: 'KSh 8,000' }
      ]
    }
  ]

  const personnel = {
    'personal-training': [
      {
        id: 'alex-johnson',
        name: 'Alex Johnson',
        title: 'Certified Personal Trainer',
        rating: 4.9,
        reviews: 387,
        specialties: ['Strength Training', 'HIIT', 'Weight Loss'],
        image: '/api/placeholder/200/200',
        experience: '8 years',
        languages: ['English']
      },
      {
        id: 'maria-garcia',
        name: 'Maria Garcia',
        title: 'Fitness Specialist',
        rating: 4.8,
        reviews: 294,
        specialties: ['Functional Training', 'Nutrition', 'Body Transformation'],
        image: '/api/placeholder/200/200',
        experience: '6 years',
        languages: ['English', 'Spanish']
      }
    ],
    'yoga-pilates': [
      {
        id: 'sarah-williams',
        name: 'Sarah Williams',
        title: 'Certified Yoga Instructor',
        rating: 4.9,
        reviews: 456,
        specialties: ['Vinyasa', 'Meditation', 'Prenatal Yoga'],
        image: '/api/placeholder/200/200',
        experience: '12 years',
        languages: ['English']
      },
      {
        id: 'james-chen',
        name: 'James Chen',
        title: 'Pilates & Movement Specialist',
        rating: 4.7,
        reviews: 234,
        specialties: ['Pilates', 'Core Strength', 'Injury Prevention'],
        image: '/api/placeholder/200/200',
        experience: '9 years',
        languages: ['English', 'Mandarin']
      }
    ],
    'physical-therapy': [
      {
        id: 'dr-emily-brown',
        name: 'Dr. Emily Brown',
        title: 'Licensed Physical Therapist',
        rating: 5.0,
        reviews: 178,
        specialties: ['Sports Injuries', 'Post-Surgery Rehab', 'Pain Management'],
        image: '/api/placeholder/200/200',
        experience: '15 years',
        languages: ['English']
      },
      {
        id: 'mike-rodriguez',
        name: 'Mike Rodriguez',
        title: 'Sports Therapist',
        rating: 4.8,
        reviews: 312,
        specialties: ['Athletic Recovery', 'Mobility', 'Strength & Conditioning'],
        image: '/api/placeholder/200/200',
        experience: '10 years',
        languages: ['English', 'Portuguese']
      }
    ],
    'sports-coaching': [
      {
        id: 'coach-david-kim',
        name: 'Coach David Kim',
        title: 'Professional Sports Coach',
        rating: 4.9,
        reviews: 445,
        specialties: ['Tennis', 'Fitness Coaching', 'Youth Development'],
        image: '/api/placeholder/200/200',
        experience: '18 years',
        languages: ['English', 'Korean']
      },
      {
        id: 'lisa-taylor',
        name: 'Lisa Taylor',
        title: 'Swimming & Water Sports Instructor',
        rating: 4.8,
        reviews: 267,
        specialties: ['Swimming Technique', 'Water Safety', 'Competitive Training'],
        image: '/api/placeholder/200/200',
        experience: '11 years',
        languages: ['English']
      }
    ]
  }

  const timeSlots = {
    Monday: ['6:00 AM', '7:00 AM', '8:00 AM', '5:00 PM', '6:00 PM', '7:00 PM'],
    Tuesday: ['6:00 AM', '7:30 AM', '12:00 PM', '5:30 PM', '6:30 PM', '7:30 PM'],
    Wednesday: ['6:30 AM', '8:00 AM', '12:30 PM', '5:00 PM', '6:00 PM', '7:00 PM'],
    Thursday: ['6:00 AM', '7:00 AM', '1:00 PM', '5:30 PM', '6:30 PM', '7:30 PM'],
    Friday: ['6:00 AM', '7:30 AM', '12:00 PM', '5:00 PM', '6:00 PM'],
    Saturday: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'],
    Sunday: ['8:00 AM', '9:30 AM', '11:00 AM', '2:30 PM', '4:00 PM']
  }

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
      category: selectedCategoryData?.name || 'Sports & Fitness',
      service: selectedServiceData.name,
      personnel: selectedPersonnelData.name,
      day: selectedDay || '',
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
      <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Dumbbell className="w-20 h-20 mx-auto mb-6 text-green-600 animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              Sports & Fitness
              <span className="block bg-gradient-to-r from-green-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                Training
              </span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              Connect with certified personal trainers, yoga instructors, physical therapists, 
              and sports coaches to achieve your fitness and wellness goals.
            </p>
          </div>
        </div>
      </section>

      {/* Category Selection */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Choose Your Training Category
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
              Choose Your Trainer
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
              Select Day & Time
            </h3>
            
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                {Object.entries(timeSlots).map(([day, slots]) => (
                  <div key={day} className="text-center">
                    <h4 className="font-semibold text-secondary-900 mb-4 pb-2 border-b border-secondary-200">
                      {day}
                    </h4>
                    <div className="space-y-2">
                      {slots.map((time) => (
                        <button
                          key={`${day}-${time}`}
                          onClick={() => {
                            setSelectedDay(day)
                            setSelectedTime(time)
                          }}
                          className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            selectedDay === day && selectedTime === time
                              ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                              : 'bg-secondary-50 text-secondary-700 hover:bg-green-100 hover:text-green-700'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Book Now Button */}
      {selectedTime && (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                Ready to Book Your Training Session?
              </h3>
              <p className="text-secondary-600 mb-6">
                You&apos;ve selected a session on {selectedDay} at {selectedTime}
              </p>
              <Button 
                onClick={handleBooking}
                size="lg" 
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Book Now
                <ChevronRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  )
}