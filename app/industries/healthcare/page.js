'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { 
  Heart, Stethoscope, Brain, Eye, Users, Star, Clock, 
  Calendar, MapPin, Phone, Mail, ChevronRight, Award
} from 'lucide-react'

export default function HealthcarePage() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedPersonnel, setSelectedPersonnel] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  const categories = [
    {
      id: 'general-medicine',
      name: 'General Medicine',
      icon: Stethoscope,
      description: 'Primary care physicians and family doctors',
      color: 'from-blue-500 to-indigo-600',
      services: [
        { id: 'general-checkup', name: 'General Health Checkup', duration: '45 min', price: '$120' },
        { id: 'chronic-care', name: 'Chronic Disease Management', duration: '60 min', price: '$150' },
        { id: 'preventive-care', name: 'Preventive Care Consultation', duration: '30 min', price: '$90' },
        { id: 'health-screening', name: 'Health Screening', duration: '90 min', price: '$200' }
      ]
    },
    {
      id: 'specialist-care',
      name: 'Specialist Care',
      icon: Heart,
      description: 'Specialized medical consultations and treatments',
      color: 'from-red-500 to-pink-600',
      services: [
        { id: 'cardiology', name: 'Cardiology Consultation', duration: '60 min', price: '$220' },
        { id: 'dermatology', name: 'Dermatology Consultation', duration: '45 min', price: '$180' },
        { id: 'orthopedics', name: 'Orthopedic Consultation', duration: '60 min', price: '$200' },
        { id: 'endocrinology', name: 'Endocrinology Consultation', duration: '50 min', price: '$190' }
      ]
    },
    {
      id: 'mental-health',
      name: 'Mental Health',
      icon: Brain,
      description: 'Psychology, psychiatry, and counseling services',
      color: 'from-green-500 to-emerald-600',
      services: [
        { id: 'therapy-session', name: 'Individual Therapy Session', duration: '60 min', price: '$140' },
        { id: 'psychiatric-eval', name: 'Psychiatric Evaluation', duration: '90 min', price: '$280' },
        { id: 'couples-therapy', name: 'Couples Therapy', duration: '75 min', price: '$180' },
        { id: 'group-therapy', name: 'Group Therapy Session', duration: '90 min', price: '$80' }
      ]
    },
    {
      id: 'diagnostic-services',
      name: 'Diagnostic Services',
      icon: Eye,
      description: 'Medical imaging, lab tests, and diagnostic procedures',
      color: 'from-purple-500 to-violet-600',
      services: [
        { id: 'blood-work', name: 'Comprehensive Blood Work', duration: '30 min', price: '$85' },
        { id: 'mri-scan', name: 'MRI Scan', duration: '45 min', price: '$450' },
        { id: 'ultrasound', name: 'Ultrasound Examination', duration: '30 min', price: '$150' },
        { id: 'x-ray', name: 'X-Ray Imaging', duration: '15 min', price: '$75' }
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

  const timeSlots = {
    Monday: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    Tuesday: ['8:00 AM', '9:30 AM', '11:00 AM', '1:00 PM', '2:30 PM', '4:00 PM'],
    Wednesday: ['8:30 AM', '10:00 AM', '11:30 AM', '1:30 PM', '3:00 PM', '4:30 PM'],
    Thursday: ['8:00 AM', '9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '3:30 PM'],
    Friday: ['8:00 AM', '9:30 AM', '11:00 AM', '1:00 PM', '2:30 PM'],
    Saturday: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM'],
    Sunday: ['Closed']
  }

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
      day: selectedDay || '',
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
                      {slots[0] === 'Closed' ? (
                        <div className="text-secondary-400 text-sm py-2">Closed</div>
                      ) : (
                        slots.map((time) => (
                          <button
                            key={`${day}-${time}`}
                            onClick={() => {
                              setSelectedDay(day)
                              setSelectedTime(time)
                            }}
                            className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                              selectedDay === day && selectedTime === time
                                ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md'
                                : 'bg-secondary-50 text-secondary-700 hover:bg-blue-100 hover:text-blue-700'
                            }`}
                          >
                            {time}
                          </button>
                        ))
                      )}
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
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                Ready to Book Your Appointment?
              </h3>
              <p className="text-secondary-600 mb-6">
                You&apos;ve selected an appointment on {selectedDay} at {selectedTime}
              </p>
              <Button 
                onClick={handleBooking}
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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