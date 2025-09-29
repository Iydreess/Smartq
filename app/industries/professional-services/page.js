'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button, Card, CardContent } from '@/components/ui'
import { MainLayout } from '@/components/layout'
import { Calendar, Clock, Star, ChevronRight, Briefcase, Scale, Calculator, Code, Building } from 'lucide-react'

/**
 * Professional Services Page
 * Business, legal, financial, and technical consulting services
 */
export default function ProfessionalServicesPage() {
  const [selectedService, setSelectedService] = useState(null)

  const services = [
    {
      id: 'accounting-tax',
      name: 'Accountants & Tax Advisors',
      description: 'Tax filing, financial auditing, and business consulting',
      icon: '📊',
      personnel: [
        {
          id: 1,
          name: 'Robert Chang CPA',
          specialty: 'Certified Public Accountant',
          experience: '15 years',
          rating: 4.9,
          photo: '/api/placeholder/150/150',
          services: ['Tax Preparation', 'Business Consulting', 'Financial Planning', 'Audit Services'],
          availability: {
            monday: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
            tuesday: ['10:00 AM', '1:00 PM', '3:00 PM'],
            wednesday: ['9:00 AM', '11:30 AM', '2:30 PM', '4:30 PM'],
            thursday: ['9:30 AM', '12:00 PM', '3:00 PM'],
            friday: ['10:00 AM', '2:00 PM', '4:00 PM'],
            saturday: ['Closed'],
            sunday: ['Closed']
          }
        }
      ]
    },
    {
      id: 'legal-services',
      name: 'Lawyers & Notaries',
      description: 'Legal consultations, contract review, and document notarization',
      icon: '⚖️',
      personnel: [
        {
          id: 2,
          name: 'Attorney Sarah Mitchell',
          specialty: 'Business & Contract Law',
          experience: '12 years',
          rating: 4.8,
          photo: '/api/placeholder/150/150',
          services: ['Contract Review', 'Business Law', 'Legal Consultation', 'Document Notarization'],
          availability: {
            monday: ['10:00 AM', '2:00 PM', '4:00 PM'],
            tuesday: ['9:00 AM', '11:00 AM', '3:00 PM'],
            wednesday: ['10:00 AM', '1:00 PM', '4:00 PM'],
            thursday: ['9:00 AM', '2:00 PM', '3:30 PM'],
            friday: ['10:00 AM', '1:30 PM'],
            saturday: ['Closed'],
            sunday: ['Closed']
          }
        }
      ]
    },
    {
      id: 'it-support',
      name: 'IT Support & Consultants',
      description: 'System setup, network troubleshooting, and cybersecurity audits',
      icon: '💻',
      personnel: [
        {
          id: 3,
          name: 'Alex Johnson',
          specialty: 'IT Systems Specialist',
          experience: '10 years',
          rating: 4.9,
          photo: '/api/placeholder/150/150',
          services: ['System Setup', 'Network Support', 'Cybersecurity', 'Cloud Migration'],
          availability: {
            monday: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'],
            tuesday: ['10:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'],
            wednesday: ['9:00 AM', '11:30 AM', '2:30 PM'],
            thursday: ['9:30 AM', '12:00 PM', '3:00 PM', '4:30 PM'],
            friday: ['10:00 AM', '1:30 PM', '3:30 PM'],
            saturday: ['10:00 AM', '12:00 PM'],
            sunday: ['Closed']
          }
        }
      ]
    },
    {
      id: 'business-coaching',
      name: 'Business Coaches',
      description: 'Resume reviews, interview prep, and business strategy sessions',
      icon: '🎯',
      personnel: [
        {
          id: 4,
          name: 'Dr. Michelle Torres',
          specialty: 'Business Strategy Coach',
          experience: '8 years',
          rating: 4.8,
          photo: '/api/placeholder/150/150',
          services: ['Business Strategy', 'Career Coaching', 'Interview Prep', 'Leadership Training'],
          availability: {
            monday: ['10:00 AM', '2:00 PM', '4:00 PM'],
            tuesday: ['9:00 AM', '11:00 AM', '3:00 PM'],
            wednesday: ['10:00 AM', '1:00 PM', '4:00 PM'],
            thursday: ['9:00 AM', '2:00 PM', '3:30 PM'],
            friday: ['10:00 AM', '1:30 PM', '3:00 PM'],
            saturday: ['11:00 AM', '2:00 PM'],
            sunday: ['Closed']
          }
        }
      ]
    },
    {
      id: 'design-architecture',
      name: 'Architects & Designers',
      description: 'Project consultations, blueprint reviews, and design presentations',
      icon: '🏗️',
      personnel: [
        {
          id: 5,
          name: 'James Rodriguez AIA',
          specialty: 'Licensed Architect',
          experience: '18 years',
          rating: 5.0,
          photo: '/api/placeholder/150/150',
          services: ['Architectural Design', 'Project Planning', 'Blueprint Review', 'Construction Consultation'],
          availability: {
            monday: ['9:00 AM', '11:00 AM', '2:00 PM'],
            tuesday: ['10:00 AM', '1:00 PM', '3:00 PM'],
            wednesday: ['9:00 AM', '11:30 AM', '2:30 PM'],
            thursday: ['10:00 AM', '12:00 PM', '3:00 PM'],
            friday: ['9:00 AM', '1:00 PM'],
            saturday: ['Closed'],
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
      <section className="bg-gradient-to-r from-slate-50 via-blue-50 to-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-4 animate-slide-in-down flex items-center justify-center gap-3">
              <Briefcase className="h-12 w-12 text-slate-600" />
              Professional Services
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto animate-slide-in-up">
              Expert business, legal, financial, and technical consulting services. 
              Connect with certified professionals to grow your business and achieve your goals.
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
                <Building className="h-6 w-6 mr-2 text-slate-600" />
                Select a Service
              </h2>
              <div className="space-y-4">
                {services.map((service, index) => (
                  <Card
                    key={service.id}
                    className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-2 animate-scale-in ${
                      selectedService?.id === service.id
                        ? 'border-slate-500 bg-slate-50'
                        : 'border-secondary-200 hover:border-slate-300'
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
                            <span className="text-sm font-medium text-slate-600">
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
                  <h2 className="text-2xl font-bold text-secondary-900 mb-6 flex items-center">
                    <Scale className="h-6 w-6 mr-2 text-blue-600" />
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
                              className="w-32 h-32 rounded-xl object-cover border-4 border-slate-100"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-secondary-900">{person.name}</h3>
                                <p className="text-slate-600 font-medium">{person.specialty}</p>
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
                                    className="bg-slate-100 text-slate-800 px-3 py-1 rounded-full text-sm font-medium"
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
                            <Calendar className="h-5 w-5 mr-2 text-slate-600" />
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
                                        className="w-full text-xs hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 transition-all duration-200"
                                        asChild
                                      >
                                        <Link href={`/booking/confirm?service=${selectedService.id}&personnel=${person.id}&time=${time}&day=${day}&category=professional-services`}>
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
                              className="bg-gradient-to-r from-slate-600 to-blue-600 hover:from-slate-700 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                              asChild
                            >
                              <Link href={`/booking/schedule?service=${selectedService.id}&personnel=${person.id}&category=professional-services`}>
                                Book Consultation with {person.name}
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
                  <div className="text-6xl mb-4">🏢</div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">Select a Professional Service</h3>
                  <p className="text-secondary-600">
                    Choose from our business and professional services to connect with certified experts.
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