'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button, Card, CardContent } from '@/components/ui'
import { MainLayout } from '@/components/layout'
import { Calendar, Clock, Star, ChevronRight, Dumbbell, Heart, Target } from 'lucide-react'

/**
 * Sports & Fitness Services Page
 * Displays fitness services and trainers for sports and fitness appointments
 */
export default function SportsFitnessPage() {
  const [selectedService, setSelectedService] = useState(null)

  const services = [
    {
      id: 'personal-training',
      name: 'Personal Trainers',
      description: 'One-on-one sessions, small group training, and fitness assessments',
      icon: '🏋️',
      personnel: [
        {
          id: 1,
          name: 'Marcus Thompson',
          specialty: 'Certified Personal Trainer',
          experience: '8 years',
          rating: 4.9,
          photo: '/api/placeholder/150/150',
          services: ['Weight Training', 'HIIT', 'Strength Building', 'Fitness Assessment'],
          availability: {
            monday: ['6:00 AM', '7:00 AM', '5:00 PM', '6:00 PM'],
            tuesday: ['6:00 AM', '8:00 AM', '12:00 PM', '5:30 PM'],
            wednesday: ['6:30 AM', '7:30 AM', '4:00 PM', '6:00 PM'],
            thursday: ['6:00 AM', '12:00 PM', '5:00 PM', '7:00 PM'],
            friday: ['6:00 AM', '7:00 AM', '4:30 PM'],
            saturday: ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM'],
            sunday: ['9:00 AM', '10:00 AM', '4:00 PM']
          }
        },
        {
          id: 2,
          name: 'Jennifer Kim',
          specialty: 'Fitness Coach & Nutritionist',
          experience: '6 years',
          rating: 4.8,
          photo: '/api/placeholder/150/150',
          services: ['Functional Training', 'Core Strength', 'Cardio Training', 'Nutrition Coaching'],
          availability: {
            monday: ['7:00 AM', '9:00 AM', '1:00 PM', '4:00 PM'],
            tuesday: ['6:30 AM', '8:30 AM', '2:00 PM', '5:00 PM'],
            wednesday: ['7:00 AM', '10:00 AM', '3:00 PM'],
            thursday: ['6:30 AM', '9:00 AM', '1:30 PM', '4:30 PM'],
            friday: ['7:00 AM', '11:00 AM', '3:00 PM'],
            saturday: ['8:00 AM', '10:00 AM', '2:00 PM'],
            sunday: ['Closed']
          }
        }
      ]
    },
    {
      id: 'yoga-pilates',
      name: 'Yoga & Pilates',
      description: 'Group classes, private sessions, and specialized workshops',
      icon: '🧘',
      personnel: [
        {
          id: 3,
          name: 'Sophia Martinez',
          specialty: 'Certified Yoga Instructor',
          experience: '10 years',
          rating: 5.0,
          photo: '/api/placeholder/150/150',
          services: ['Hatha Yoga', 'Vinyasa Flow', 'Prenatal Yoga', 'Meditation'],
          availability: {
            monday: ['8:00 AM', '10:00 AM', '6:00 PM'],
            tuesday: ['7:00 AM', '9:00 AM', '5:30 PM'],
            wednesday: ['8:00 AM', '11:00 AM', '6:30 PM'],
            thursday: ['7:30 AM', '10:30 AM', '6:00 PM'],
            friday: ['8:00 AM', '10:00 AM', '5:00 PM'],
            saturday: ['9:00 AM', '11:00 AM', '2:00 PM'],
            sunday: ['10:00 AM', '4:00 PM', '6:00 PM']
          }
        }
      ]
    },
    {
      id: 'physical-therapy',
      name: 'Physical Therapy',
      description: 'Rehabilitation, injury recovery, and mobility improvement',
      icon: '🏥',
      personnel: [
        {
          id: 4,
          name: 'Dr. Robert Chen',
          specialty: 'Licensed Physical Therapist',
          experience: '12 years',
          rating: 4.9,
          photo: '/api/placeholder/150/150',
          services: ['Injury Rehabilitation', 'Sports Recovery', 'Mobility Training', 'Pain Management'],
          availability: {
            monday: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
            tuesday: ['8:30 AM', '10:30 AM', '1:30 PM', '3:30 PM'],
            wednesday: ['9:00 AM', '11:30 AM', '2:30 PM'],
            thursday: ['8:00 AM', '10:00 AM', '1:00 PM', '4:00 PM'],
            friday: ['9:00 AM', '12:00 PM', '3:00 PM'],
            saturday: ['10:00 AM', '12:00 PM'],
            sunday: ['Closed']
          }
        }
      ]
    },
    {
      id: 'sports-coaching',
      name: 'Sports Coaching',
      description: 'Tennis, swimming, martial arts, and specialized sports training',
      icon: '🎾',
      personnel: [
        {
          id: 5,
          name: 'Coach David Wilson',
          specialty: 'Professional Tennis Coach',
          experience: '15 years',
          rating: 4.8,
          photo: '/api/placeholder/150/150',
          services: ['Tennis Lessons', 'Match Strategy', 'Tournament Prep', 'Junior Coaching'],
          availability: {
            monday: ['4:00 PM', '5:00 PM', '6:00 PM'],
            tuesday: ['3:30 PM', '4:30 PM', '5:30 PM'],
            wednesday: ['4:00 PM', '5:00 PM', '6:00 PM'],
            thursday: ['3:30 PM', '5:00 PM', '6:30 PM'],
            friday: ['4:00 PM', '5:00 PM'],
            saturday: ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM'],
            sunday: ['10:00 AM', '11:00 AM', '3:00 PM']
          }
        }
      ]
    },
    {
      id: 'nutrition',
      name: 'Nutrition & Wellness',
      description: 'Meal planning, dietary consultations, and wellness coaching',
      icon: '🥗',
      personnel: [
        {
          id: 6,
          name: 'Dr. Lisa Rodriguez',
          specialty: 'Sports Nutritionist',
          experience: '9 years',
          rating: 4.9,
          photo: '/api/placeholder/150/150',
          services: ['Meal Planning', 'Sports Nutrition', 'Weight Management', 'Supplement Advice'],
          availability: {
            monday: ['10:00 AM', '1:00 PM', '3:00 PM'],
            tuesday: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
            wednesday: ['10:00 AM', '12:00 PM', '3:00 PM'],
            thursday: ['9:00 AM', '1:00 PM', '4:00 PM'],
            friday: ['10:00 AM', '2:00 PM'],
            saturday: ['11:00 AM', '1:00 PM'],
            sunday: ['Closed']
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
      <section className="bg-gradient-to-r from-blue-50 via-green-50 to-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-4 animate-slide-in-down flex items-center justify-center gap-3">
              <Dumbbell className="h-12 w-12 text-blue-600" />
              Sports & Fitness Services
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto animate-slide-in-up">
              Achieve your fitness goals with certified trainers, coaches, and wellness experts. 
              From personal training to nutrition coaching, we've got you covered.
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
              <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                <Target className="h-6 w-6 mr-2 text-blue-600" />
                Select a Service
              </h2>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 animate-scale-in ${
                      selectedService?.id === service.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-secondary-200 hover:border-blue-300'
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
                            <span className="text-sm font-medium text-blue-600">
                              {service.personnel.length} Expert{service.personnel.length > 1 ? 's' : ''} Available
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
                  <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                    <Heart className="h-6 w-6 mr-2 text-red-500" />
                    Available Trainers - {selectedService.name}
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
                              className="w-32 h-32 rounded-xl object-cover border-4 border-blue-100"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-secondary-900">{person.name}</h3>
                                <p className="text-blue-600 font-medium">{person.specialty}</p>
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
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
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
                            <Calendar className="h-5 w-5 mr-2 text-blue-600" />
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
                                        className="w-full text-xs hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all duration-200"
                                        asChild
                                      >
                                        <Link href={`/booking/confirm?service=${selectedService.id}&personnel=${person.id}&time=${time}&day=${day}&category=sports-fitness`}>
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
                              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                              asChild
                            >
                              <Link href={`/booking/schedule?service=${selectedService.id}&personnel=${person.id}&category=sports-fitness`}>
                                Book Session with {person.name}
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
                  <div className="text-6xl mb-4">💪</div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">Select a Fitness Service</h3>
                  <p className="text-secondary-600">
                    Choose from our sports and fitness services to view available trainers and coaches.
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