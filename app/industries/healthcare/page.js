import { MainLayout } from '@/components/layout/MainLayout'
import Link from 'next/link'
import { Button } from '@/components/ui'
import { 
  Heart, Clock, Users, BarChart3, Shield, CheckCircle,
  Stethoscope, Pill, Eye, Brain, ArrowRight, Calendar
} from 'lucide-react'

export default function HealthcarePage() {
  const services = [
    {
      name: 'Dentists & Orthodontists',
      icon: Stethoscope,
      href: '/industries/healthcare/dental',
      description: 'Streamline dental appointments, check-ups, cleanings, and orthodontic treatments.',
      features: ['Online booking', 'Appointment reminders', 'Patient records integration', 'Treatment scheduling'],
      waitTime: '15 min avg',
      satisfaction: '98%'
    },
    {
      name: 'General Practitioners',
      icon: Heart,
      href: '/industries/healthcare/gp',
      description: 'Manage family doctor visits, consultations, and routine health screenings.',
      features: ['Symptom-based booking', 'Urgent care slots', 'Prescription management', 'Follow-up scheduling'],
      waitTime: '12 min avg',
      satisfaction: '96%'
    },
    {
      name: 'Mental Health Therapists',
      icon: Brain,
      href: '/industries/healthcare/therapy',
      description: 'Schedule therapy sessions, counseling, and mental health consultations.',
      features: ['Confidential booking', 'Session type selection', 'Crisis appointment slots', 'Progress tracking'],
      waitTime: '8 min avg',
      satisfaction: '99%'
    },
    {
      name: 'Diagnostic Centers',
      icon: Pill,
      href: '/industries/healthcare/diagnostics',
      description: 'Organize lab tests, blood work, imaging, and diagnostic procedures.',
      features: ['Test preparation info', 'Fasting requirements', 'Results scheduling', 'Multiple test booking'],
      waitTime: '20 min avg',
      satisfaction: '94%'
    },
    {
      name: 'Physiotherapists',
      icon: Users,
      href: '/industries/healthcare/physio',
      description: 'Coordinate rehabilitation sessions, injury recovery, and mobility treatments.',
      features: ['Treatment plans', 'Progress monitoring', 'Exercise scheduling', 'Equipment booking'],
      waitTime: '10 min avg',
      satisfaction: '97%'
    },
    {
      name: 'Optometrists',
      icon: Eye,
      href: '/industries/healthcare/optometry',
      description: 'Schedule eye exams, vision tests, and optical consultations.',
      features: ['Eye test booking', 'Frame selection time', 'Contact lens fittings', 'Vision screening'],
      waitTime: '18 min avg',
      satisfaction: '95%'
    }
  ]

  const benefits = [
    {
      icon: Clock,
      title: 'Reduced Wait Times',
      description: 'Average 70% reduction in patient waiting times',
      metric: '70%'
    },
    {
      icon: Users,
      title: 'Better Patient Flow',
      description: 'Optimized scheduling improves clinic efficiency',
      metric: '45%'
    },
    {
      icon: BarChart3,
      title: 'Increased Capacity',
      description: 'See more patients with better time management',
      metric: '35%'
    },
    {
      icon: Shield,
      title: 'HIPAA Compliant',
      description: 'Secure, compliant patient data handling',
      metric: '100%'
    }
  ]

  const features = [
    'Patient portal integration',
    'Insurance verification',
    'Medical record access',
    'Prescription reminders',
    'Telehealth scheduling',
    'Emergency slot management',
    'Multi-provider coordination',
    'Automated follow-ups'
  ]

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-blue-50 to-cyan-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-secondary-900 mb-6">
                Healthcare Queue Management
                <span className="block bg-gradient-to-r from-blue-600 via-cyan-600 to-primary-600 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>
              <p className="text-xl text-secondary-600 mb-8">
                Reduce patient wait times, improve clinic efficiency, and enhance the healthcare 
                experience with smart appointment scheduling and queue management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                  Book Healthcare Demo
                </Button>
                <Button variant="outline" size="lg">
                  View Case Studies
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8 border border-secondary-200">
                <div className="flex items-center mb-6">
                  <Heart className="w-8 h-8 text-blue-600 mr-3" />
                  <h3 className="text-xl font-semibold text-secondary-900">
                    Smart Healthcare Scheduling
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="font-medium text-secondary-800">Dr. Smith - Cardiology</span>
                    <span className="text-blue-600 font-semibold">Next: 2:30 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
                    <span className="font-medium text-secondary-800">Lab Tests - Building B</span>
                    <span className="text-cyan-600 font-semibold">Queue: 3 patients</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-primary-50 rounded-lg">
                    <span className="font-medium text-secondary-800">Pharmacy Pickup</span>
                    <span className="text-primary-600 font-semibold">Ready now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-cyan-100 flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {benefit.metric}
                  </div>
                  <h3 className="font-semibold text-secondary-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-secondary-600">
                    {benefit.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Healthcare Services We Support
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Specialized solutions for different healthcare providers and medical specialties
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = service.icon
              return (
                <Link key={index} href={service.href} className="group block">
                  <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border border-secondary-100 h-full">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-secondary-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {service.name}
                    </h3>
                    
                    <p className="text-secondary-600 mb-6">
                      {service.description}
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="font-semibold text-secondary-800 mb-3">Key Features:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-sm text-secondary-700">
                            <CheckCircle className="w-4 h-4 text-blue-600 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex justify-between items-center mb-4 p-4 bg-blue-50 rounded-lg">
                      <div className="text-center">
                        <div className="font-bold text-blue-600">{service.waitTime}</div>
                        <div className="text-xs text-secondary-600">Wait Time</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-cyan-600">{service.satisfaction}</div>
                        <div className="text-xs text-secondary-600">Satisfaction</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-medium">
                      <Calendar className="mr-2 w-4 h-4" />
                      <span>Book Appointment</span>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-6">
                Built for Healthcare Professionals
              </h2>
              <p className="text-xl text-secondary-600 mb-8">
                Our platform understands the unique needs of healthcare providers, 
                offering specialized features for medical practices.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                    <span className="text-secondary-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                  Get Healthcare Demo
                </Button>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-secondary-900 mb-6 text-center">
                Healthcare Compliance
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <Shield className="w-8 h-8 text-blue-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-secondary-900">HIPAA Compliant</h4>
                    <p className="text-sm text-secondary-600">Full patient data protection</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <CheckCircle className="w-8 h-8 text-cyan-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-secondary-900">SOC 2 Certified</h4>
                    <p className="text-sm text-secondary-600">Enterprise security standards</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                  <Shield className="w-8 h-8 text-primary-600 mr-4" />
                  <div>
                    <h4 className="font-semibold text-secondary-900">End-to-End Encryption</h4>
                    <p className="text-sm text-secondary-600">Secure data transmission</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-cyan-600 to-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Transform Your Healthcare Practice
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare providers using Smartq to improve patient experience and operational efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50">
              Schedule Healthcare Demo
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-700">
              Contact Healthcare Team
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}