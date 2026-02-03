import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { 
  Users, Clock, Calendar, BarChart3, Bell, MapPin,
  Smartphone, Shield, Star, Zap, CheckCircle, ArrowRight
} from 'lucide-react'

export default function ServicesPage() {
  const coreServices = [
    {
      icon: Users,
      title: 'Smart Queue Management',
      description: 'Eliminate physical waiting with virtual queues, real-time position tracking, and intelligent queue optimization.',
      features: ['Virtual queue system', 'Real-time position updates', 'SMS/Email notifications', 'Queue analytics'],
      color: 'from-primary-500 to-accent-600'
    },
    {
      icon: Calendar,
      title: 'Online Appointment Booking',
      description: 'Streamline scheduling with calendar integration, automated reminders, and flexible booking options.',
      features: ['Calendar integration', 'Automated reminders', 'Reschedule options', 'Staff availability'],
      color: 'from-accent-600 to-luxury-500'
    },
    {
      icon: Bell,
      title: 'Real-time Notifications',
      description: 'Keep customers informed with instant updates via SMS, email, and push notifications.',
      features: ['Multi-channel alerts', 'Custom messaging', 'Automated updates', 'Delivery tracking'],
      color: 'from-luxury-500 to-warning-500'
    },
    {
      icon: BarChart3,
      title: 'Business Analytics',
      description: 'Make data-driven decisions with comprehensive reporting and performance insights.',
      features: ['Wait time analytics', 'Customer satisfaction', 'Staff performance', 'Revenue tracking'],
      color: 'from-warning-500 to-success-500'
    },
    {
      icon: MapPin,
      title: 'Multi-Location Support',
      description: 'Manage multiple branches and locations from a centralized dashboard.',
      features: ['Centralized management', 'Location-specific settings', 'Cross-location reporting', 'Staff allocation'],
      color: 'from-success-500 to-primary-500'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Experience',
      description: 'Provide seamless customer experience across all devices with responsive design.',
      features: ['Mobile apps', 'QR code check-in', 'Offline capabilities', 'PWA support'],
      color: 'from-primary-500 to-accent-600'
    }
  ]

  const additionalFeatures = [
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Enterprise-grade security with GDPR compliance and data protection.',
      items: ['End-to-end encryption', 'GDPR compliance', 'Regular security audits', 'Data anonymization']
    },
    {
      icon: Star,
      title: 'Customer Experience',
      description: 'Enhance satisfaction with personalized service and seamless interactions.',
      items: ['Personalized service', 'Feedback collection', 'Loyalty programs', 'VIP queue management']
    },
    {
      icon: Zap,
      title: 'Integration & API',
      description: 'Connect with existing systems through robust APIs and integrations.',
      items: ['REST API access', 'Webhook support', 'CRM integration', 'Payment gateways']
    }
  ]

  const stats = [
    { value: '75%', label: 'Reduction in Wait Times', color: 'text-primary-600' },
    { value: '98%', label: 'Customer Satisfaction', color: 'text-accent-600' },
    { value: '500+', label: 'Businesses Served', color: 'text-luxury-600' },
    { value: '1M+', label: 'Queue Entries Processed', color: 'text-warning-600' }
  ]

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-primary-50 to-accent-50 py-20">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              Complete Queue & Appointment
              <span className="block bg-gradient-to-r from-primary-600 via-accent-600 to-luxury-600 bg-clip-text text-transparent">
                Management Solution
              </span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              Everything you need to eliminate waiting frustration, boost customer satisfaction, 
              and optimize your business operations with intelligent queue management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white" asChild>
                <Link href="/signup">Start Free Trial</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/demo">Watch Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl md:text-5xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-secondary-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Core Services & Features
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Comprehensive tools to transform your customer service experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreServices.map((service, index) => {
              const IconComponent = service.icon
              return (
                <div 
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border border-secondary-100"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-7 h-7 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-secondary-900 mb-3">
                    {service.title}
                  </h3>
                  
                  <p className="text-secondary-600 mb-6">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-secondary-700">
                        <CheckCircle className="w-4 h-4 text-primary-600 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Advanced Capabilities
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Enterprise-grade features for businesses of all sizes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {additionalFeatures.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-100 to-accent-100 flex items-center justify-center">
                    <IconComponent className="w-10 h-10 text-primary-600" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-secondary-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-secondary-600 mb-6">
                    {feature.description}
                  </p>
                  
                  <ul className="space-y-3 text-left max-w-sm mx-auto">
                    {feature.items.map((item, idx) => (
                      <li key={idx} className="flex items-center text-secondary-700">
                        <div className="w-2 h-2 rounded-full bg-primary-600 mr-3 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-accent-600 to-luxury-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using Smartq to deliver exceptional customer experiences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary-700 hover:bg-primary-50" asChild>
              <Link href="/signup">
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-700" asChild>
              <Link href="/booking">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}