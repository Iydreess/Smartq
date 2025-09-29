'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button, Card, CardContent } from '@/components/ui'
import { MainLayout } from '@/components/layout'
import { Calendar, Clock, Star, MapPin, Phone, Mail, ChevronRight } from 'lucide-react'

/**
 * Beauty & Wellness Services Page
 * Displays services and personnel for beauty and wellness appointments
 */
export default function BeautyWellnessPage() {
  const [selectedService, setSelectedService] = useState(null)

  const services = [
    {
      id: 'hair-salon',
      name: 'Hair Salons & Barbershops',
      description: 'Professional haircuts, coloring, styling, and treatments',
      icon: '✂️',
      personnel: [
        {
          id: 1,
          name: 'Sarah Johnson',
          specialty: 'Hair Colorist & Stylist',
          experience: '8 years',
          rating: 4.9,
          photo: '/api/placeholder/150/150',
          services: ['Hair Coloring', 'Highlights', 'Balayage', 'Haircuts'],
          availability: {
            monday: ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM'],
            tuesday: ['9:00 AM', '11:00 AM', '1:00 PM', '4:00 PM'],
            wednesday: ['10:00 AM', '11:30 AM', '2:30 PM'],
            thursday: ['9:00 AM', '10:00 AM', '2:00 PM', '4:30 PM'],
            friday: ['9:30 AM', '1:00 PM', '3:00 PM'],
            saturday: ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM'],
            sunday: ['Closed']
          }
        },
        {
          id: 2,
          name: 'Michael Rodriguez',
          specialty: 'Master Barber',
          experience: '12 years',
          rating: 4.8,
          photo: '/api/placeholder/150/150',
          services: ['Classic Cuts', 'Beard Trimming', 'Hot Towel Shaves', 'Hair Washing'],
          availability: {
            monday: ['8:00 AM', '9:30 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
            tuesday: ['8:00 AM', '10:00 AM', '1:30 PM', '3:30 PM'],
            wednesday: ['9:00 AM', '10:30 AM', '2:00 PM', '4:30 PM'],
            thursday: ['8:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'],
            friday: ['8:30 AM', '10:00 AM', '2:30 PM'],
            saturday: ['9:00 AM', '10:30 AM', '1:00 PM', '2:30 PM'],
            sunday: ['Closed']
          }
        }
      ]
    },
    {
      id: 'nail-salon',
      name: 'Nail Salons',
      description: 'Manicures, pedicures, nail art, and acrylic/gel applications',
      icon: '💅',
      personnel: [
        {
          id: 3,
          name: 'Emma Chen',
          specialty: 'Nail Artist & Technician',
          experience: '6 years',
          rating: 4.9,
          photo: '/api/placeholder/150/150',
          services: ['Manicure', 'Pedicure', 'Gel Nails', 'Nail Art'],
          availability: {
            monday: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
            tuesday: ['10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'],
            wednesday: ['9:30 AM', '11:30 AM', '2:30 PM'],
            thursday: ['9:00 AM', '12:00 PM', '3:00 PM', '4:30 PM'],
            friday: ['10:00 AM', '1:30 PM', '3:30 PM'],
            saturday: ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM'],
            sunday: ['11:00 AM', '2:00 PM', '4:00 PM']
          }
        }
      ]
    },
    {
      id: 'spa-massage',
      name: 'Spas & Massage Therapy',
      description: 'Swedish, deep tissue, hot stone, and aromatherapy massages',
      icon: '💆',
      personnel: [
        {
          id: 4,
          name: 'Dr. Lisa Williams',
          specialty: 'Licensed Massage Therapist',
          experience: '10 years',
          rating: 5.0,
          photo: '/api/placeholder/150/150',
          services: ['Swedish Massage', 'Deep Tissue', 'Hot Stone', 'Aromatherapy'],
          availability: {
            monday: ['10:00 AM', '1:00 PM', '3:00 PM'],
            tuesday: ['9:00 AM', '11:30 AM', '2:30 PM', '4:30 PM'],
            wednesday: ['10:00 AM', '1:30 PM', '3:30 PM'],
            thursday: ['9:00 AM', '12:00 PM', '3:00 PM'],
            friday: ['10:30 AM', '2:00 PM', '4:00 PM'],
            saturday: ['10:00 AM', '1:00 PM', '3:00 PM'],
            sunday: ['Closed']
          }
        }
      ]
    },
    {
      id: 'skincare',
      name: 'Estheticians & Skincare',
      description: 'Facials, chemical peels, microdermabrasion, and waxing services',
      icon: '🧴',
      personnel: [
        {
          id: 5,
          name: 'Rachel Thompson',
          specialty: 'Licensed Esthetician',
          experience: '7 years',
          rating: 4.8,
          photo: '/api/placeholder/150/150',
          services: ['Facials', 'Chemical Peels', 'Microdermabrasion', 'Waxing'],
          availability: {
            monday: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
            tuesday: ['10:00 AM', '1:00 PM', '3:30 PM'],
            wednesday: ['9:30 AM', '12:00 PM', '2:30 PM', '4:30 PM'],
            thursday: ['9:00 AM', '11:30 AM', '3:00 PM'],
            friday: ['10:00 AM', '1:00 PM', '3:00 PM'],
            saturday: ['9:00 AM', '11:00 AM', '2:00 PM'],
            sunday: ['Closed']
          }
        }
      ]
    },
    {
      id: 'makeup',
      name: 'Makeup Artists',
      description: 'Bridal makeup, event makeup, and professional lessons',
      icon: '💄',
      personnel: [
        {
          id: 6,
          name: 'Victoria Adams',
          specialty: 'Professional Makeup Artist',
          experience: '9 years',
          rating: 4.9,
          photo: '/api/placeholder/150/150',
          services: ['Bridal Makeup', 'Event Makeup', 'Makeup Lessons', 'Special Effects'],
          availability: {
            monday: ['10:00 AM', '2:00 PM', '4:00 PM'],
            tuesday: ['9:00 AM', '12:00 PM', '3:00 PM'],
            wednesday: ['10:30 AM', '1:30 PM', '4:30 PM'],
            thursday: ['9:00 AM', '11:00 AM', '2:30 PM'],
            friday: ['10:00 AM', '1:00 PM', '3:30 PM'],
            saturday: ['9:00 AM', '11:30 AM', '2:00 PM', '4:00 PM'],
            sunday: ['11:00 AM', '2:00 PM']
          }
        }
      ]
    }
  ]

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <MainLayout>
      {/* Header Section */}
      <section className="bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-4 animate-slide-in-down">
              Beauty & Wellness Services
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto animate-slide-in-up">
              Professional personal care, grooming, and relaxation services. 
              Book appointments with certified experts in beauty and wellness.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Services List */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">Select a Service</h2>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 animate-scale-in ${
                      selectedService?.id === service.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-secondary-200 hover:border-primary-300'
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedService(service)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="text-3xl">{service.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-secondary-900 mb-1">
                            {service.name}
                          </h3>
                          <p className="text-sm text-secondary-600 mb-2">
                            {service.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-primary-600">
                              {service.personnel.length} Professional{service.personnel.length > 1 ? 's' : ''} Available
                            </span>
                            <ChevronRight className="h-4 w-4 text-secondary-400" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Personnel & Booking */}
            <div className="lg:col-span-2">
              {selectedService ? (
                <div className="animate-slide-in-right">
                  <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                    Available Professionals - {selectedService.name}
                  </h2>
                  
                  {selectedService.personnel.map((person) => (
                    <Card key={person.id} className="mb-8 border border-secondary-200 hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        {/* Personnel Info */}
                        <div className="flex flex-col md:flex-row gap-6 mb-6">
                          <div className="flex-shrink-0">
                            <img
                              src={person.photo}
                              alt={person.name}
                              className="w-32 h-32 rounded-xl object-cover border-4 border-primary-100"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-secondary-900">{person.name}</h3>
                                <p className="text-primary-600 font-medium">{person.specialty}</p>
                                <p className="text-secondary-600">{person.experience} experience</p>
                              </div>
                              <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                                <Star className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                                <span className="font-semibold text-yellow-700">{person.rating}</span>
                              </div>
                            </div>
                            
                            {/* Services */}
                            <div className="mb-4">
                              <h4 className="font-semibold text-secondary-900 mb-2">Specializes in:</h4>
                              <div className="flex flex-wrap gap-2">
                                {person.services.map((service, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
                                  >
                                    {service}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Weekly Availability */}
                        <div>
                          <h4 className="font-semibold text-secondary-900 mb-4 flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-primary-600" />
                            Weekly Availability
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                            {days.map((day, dayIndex) => (
                              <div key={day} className="border border-secondary-200 rounded-lg p-3">
                                <h5 className="font-medium text-secondary-900 mb-2 text-center">
                                  {dayNames[dayIndex]}
                                </h5>
                                <div className="space-y-2">
                                  {person.availability[day][0] === 'Closed' ? (
                                    <div className="text-center py-2">
                                      <span className="text-secondary-400 text-sm">Closed</span>
                                    </div>
                                  ) : (
                                    person.availability[day].map((time, timeIndex) => (
                                      <Button
                                        key={timeIndex}
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-xs hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all duration-200"
                                        asChild
                                      >
                                        <Link href={`/booking/confirm?service=${selectedService.id}&personnel=${person.id}&time=${time}&day=${day}`}>
                                          <Clock className="h-3 w-3 mr-1" />
                                          {time}
                                        </Link>
                                      </Button>
                                    ))
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 text-center">
                            <Button 
                              className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                              asChild
                            >
                              <Link href={`/booking/schedule?service=${selectedService.id}&personnel=${person.id}`}>
                                Book Appointment with {person.name}
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">💫</div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">Select a Service Category</h3>
                  <p className="text-secondary-600">
                    Choose from our beauty and wellness services to view available professionals and book your appointment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}