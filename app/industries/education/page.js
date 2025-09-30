'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { 
  GraduationCap, BookOpen, Car, Globe, Users, Star, Clock, 
  Calendar, MapPin, Phone, Mail, ChevronRight, Award
} from 'lucide-react'

export default function EducationPage() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedPersonnel, setSelectedPersonnel] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  const categories = [
    {
      id: 'universities',
      name: 'Universities & Colleges',
      icon: GraduationCap,
      description: 'Academic advisors, professors, and student services',
      color: 'from-blue-500 to-indigo-600',
      services: [
        { id: 'academic-advising', name: 'Academic Advising', duration: '45 min', price: '$75' },
        { id: 'professor-consultation', name: 'Professor Consultation', duration: '30 min', price: '$60' },
        { id: 'career-counseling', name: 'Career Counseling', duration: '60 min', price: '$90' },
        { id: 'research-supervision', name: 'Research Supervision', duration: '90 min', price: '$120' }
      ]
    },
    {
      id: 'tutoring',
      name: 'Tutoring Centers',
      icon: BookOpen,
      description: 'Subject tutoring and exam preparation',
      color: 'from-green-500 to-emerald-600',
      services: [
        { id: 'math-tutoring', name: 'Math Tutoring', duration: '60 min', price: '$50' },
        { id: 'science-tutoring', name: 'Science Tutoring', duration: '60 min', price: '$55' },
        { id: 'language-tutoring', name: 'Language Arts', duration: '45 min', price: '$45' },
        { id: 'test-prep', name: 'Test Preparation', duration: '90 min', price: '$80' }
      ]
    },
    {
      id: 'language-schools',
      name: 'Language Schools',
      icon: Globe,
      description: 'Language learning and conversation practice',
      color: 'from-purple-500 to-violet-600',
      services: [
        { id: 'english-lessons', name: 'English Lessons', duration: '60 min', price: '$40' },
        { id: 'spanish-lessons', name: 'Spanish Lessons', duration: '60 min', price: '$40' },
        { id: 'french-lessons', name: 'French Lessons', duration: '60 min', price: '$45' },
        { id: 'conversation-practice', name: 'Conversation Practice', duration: '30 min', price: '$25' }
      ]
    },
    {
      id: 'driving-schools',
      name: 'Driving Schools',
      icon: Car,
      description: 'Driving lessons and road test preparation',
      color: 'from-orange-500 to-red-600',
      services: [
        { id: 'driving-lesson', name: 'Driving Lesson', duration: '60 min', price: '$65' },
        { id: 'road-test-prep', name: 'Road Test Prep', duration: '90 min', price: '$85' },
        { id: 'parallel-parking', name: 'Parallel Parking', duration: '45 min', price: '$50' },
        { id: 'highway-driving', name: 'Highway Driving', duration: '75 min', price: '$75' }
      ]
    }
  ]

  const personnel = {
    'universities': [
      {
        id: 'dr-sarah-wilson',
        name: 'Dr. Sarah Wilson',
        title: 'Academic Advisor',
        rating: 4.9,
        reviews: 234,
        specialties: ['Graduate Programs', 'Course Planning', 'Academic Support'],
        image: '/api/placeholder/200/200',
        experience: '15 years',
        languages: ['English', 'Spanish']
      },
      {
        id: 'prof-michael-chen',
        name: 'Prof. Michael Chen',
        title: 'Computer Science Professor',
        rating: 4.8,
        reviews: 189,
        specialties: ['Programming', 'Data Structures', 'Algorithms'],
        image: '/api/placeholder/200/200',
        experience: '12 years',
        languages: ['English', 'Mandarin']
      }
    ],
    'tutoring': [
      {
        id: 'emma-thompson',
        name: 'Emma Thompson',
        title: 'Math Tutor',
        rating: 4.9,
        reviews: 156,
        specialties: ['Calculus', 'Algebra', 'Statistics'],
        image: '/api/placeholder/200/200',
        experience: '8 years',
        languages: ['English']
      },
      {
        id: 'david-martinez',
        name: 'David Martinez',
        title: 'Science Tutor',
        rating: 4.7,
        reviews: 203,
        specialties: ['Physics', 'Chemistry', 'Biology'],
        image: '/api/placeholder/200/200',
        experience: '10 years',
        languages: ['English', 'Spanish']
      }
    ],
    'language-schools': [
      {
        id: 'maria-garcia',
        name: 'Maria Garcia',
        title: 'Spanish Instructor',
        rating: 4.8,
        reviews: 178,
        specialties: ['Conversational Spanish', 'Grammar', 'Business Spanish'],
        image: '/api/placeholder/200/200',
        experience: '12 years',
        languages: ['Spanish', 'English']
      },
      {
        id: 'jean-dupont',
        name: 'Jean Dupont',
        title: 'French Instructor',
        rating: 4.9,
        reviews: 145,
        specialties: ['French Literature', 'Pronunciation', 'Culture'],
        image: '/api/placeholder/200/200',
        experience: '15 years',
        languages: ['French', 'English']
      }
    ],
    'driving-schools': [
      {
        id: 'robert-johnson',
        name: 'Robert Johnson',
        title: 'Certified Driving Instructor',
        rating: 4.8,
        reviews: 267,
        specialties: ['Road Test Prep', 'Defensive Driving', 'New Drivers'],
        image: '/api/placeholder/200/200',
        experience: '20 years',
        languages: ['English']
      },
      {
        id: 'lisa-brown',
        name: 'Lisa Brown',
        title: 'Senior Driving Instructor',
        rating: 4.9,
        reviews: 198,
        specialties: ['Highway Driving', 'City Navigation', 'Parking'],
        image: '/api/placeholder/200/200',
        experience: '18 years',
        languages: ['English', 'French']
      }
    ]
  }

  const timeSlots = {
    Monday: ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM', '4:00 PM'],
    Tuesday: ['9:00 AM', '11:00 AM', '1:30 PM', '3:00 PM', '4:30 PM'],
    Wednesday: ['10:00 AM', '11:30 AM', '2:00 PM', '3:30 PM', '5:00 PM'],
    Thursday: ['9:30 AM', '11:00 AM', '1:00 PM', '2:30 PM', '4:00 PM'],
    Friday: ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '3:30 PM'],
    Saturday: ['10:00 AM', '11:30 AM', '1:00 PM', '2:30 PM'],
    Sunday: ['11:00 AM', '1:00 PM', '2:30 PM', '4:00 PM']
  }

  const handleBooking = () => {
    const selectedCategoryData = categories.find(cat => cat.id === selectedCategory)
    const selectedServiceData = selectedCategoryData?.services.find(service => service.id === selectedService)
    const selectedPersonnelData = personnel[selectedCategory]?.find(person => person.id === selectedPersonnel)
    
    const bookingData = {
      category: selectedCategoryData?.name,
      service: selectedServiceData?.name,
      personnel: selectedPersonnelData?.name,
      day: selectedDay,
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
      <section className="relative bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <GraduationCap className="w-20 h-20 mx-auto mb-6 text-orange-600 animate-bounce" />
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              Educational Services
              <span className="block bg-gradient-to-r from-orange-600 via-red-600 to-yellow-600 bg-clip-text text-transparent">
                Booking Platform
              </span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              Book tutoring sessions, language classes, academic consultations, and driving lessons 
              with qualified instructors and educators.
            </p>
          </div>
        </div>
      </section>

      {/* Category Selection */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary-900 mb-12">
            Choose Your Educational Service
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
                      ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-strong' 
                      : 'border-secondary-200 bg-white hover:border-orange-300'
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
        <section className="py-16 bg-gradient-to-br from-secondary-50 to-orange-50">
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
                      ? 'border-orange-500 bg-white shadow-lg'
                      : 'border-secondary-200 bg-white hover:border-orange-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-lg font-semibold text-secondary-900">{service.name}</h4>
                    <span className="text-orange-600 font-bold">{service.price}</span>
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
              Choose Your Instructor
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {personnel[selectedCategory]?.map((person) => (
                <div
                  key={person.id}
                  onClick={() => setSelectedPersonnel(person.id)}
                  className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-strong hover:-translate-y-1 ${
                    selectedPersonnel === person.id
                      ? 'border-orange-500 bg-gradient-to-br from-orange-50 to-red-50 shadow-strong'
                      : 'border-secondary-200 bg-white hover:border-orange-300'
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
                      <p className="text-orange-600 font-medium mb-2">{person.title}</p>
                      
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
                            className="px-3 py-1 bg-orange-100 text-orange-700 text-xs rounded-full border border-orange-200"
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
        <section className="py-16 bg-gradient-to-br from-secondary-50 to-orange-50">
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
                              ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md'
                              : 'bg-secondary-50 text-secondary-700 hover:bg-orange-100 hover:text-orange-700'
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
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-200">
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                Ready to Book Your Session?
              </h3>
              <p className="text-secondary-600 mb-6">
                You've selected a session on {selectedDay} at {selectedTime}
              </p>
              <Button 
                onClick={handleBooking}
                size="lg" 
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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