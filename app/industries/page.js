import { MainLayout } from '@/components/layout/MainLayout'
import Link from 'next/link'
import { 
  Scissors, Dumbbell, Heart, Briefcase, 
  Building2, GraduationCap, Calendar, ArrowRight 
} from 'lucide-react'

export default function IndustriesPage() {
  const industries = [
    {
      name: 'Beauty & Wellness',
      href: '/industries/beauty-wellness',
      icon: Scissors,
      description: 'Transform your salon, spa, or wellness center with smart appointment booking and queue management.',
      services: ['Hair Salons', 'Nail Studios', 'Spas & Massage', 'Skincare Clinics'],
      color: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-100',
      stats: { businesses: '2,500+', satisfaction: '96%' }
    },
    {
      name: 'Sports & Fitness',
      href: '/industries/sports-fitness',
      icon: Dumbbell,
      description: 'Optimize gym sessions, personal training, and fitness class bookings with intelligent scheduling.',
      services: ['Gyms & Trainers', 'Yoga Studios', 'Physical Therapy', 'Sports Coaching'],
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-100',
      stats: { businesses: '1,800+', satisfaction: '94%' }
    },
    {
      name: 'Healthcare',
      href: '/industries/healthcare',
      icon: Heart,
      description: 'Streamline patient appointments and reduce waiting room congestion in medical practices.',
      services: ['Dental Clinics', 'General Practice', 'Therapy Centers', 'Diagnostic Labs'],
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-100',
      stats: { businesses: '3,200+', satisfaction: '98%' }
    },
    {
      name: 'Professional Services',
      href: '/industries/professional-services',
      icon: Briefcase,
      description: 'Enhance client consultations and service delivery for professional service providers.',
      services: ['Legal Firms', 'Accounting', 'IT Consulting', 'Business Coaching'],
      color: 'from-primary-500 to-accent-600',
      bgColor: 'from-primary-50 to-accent-100',
      stats: { businesses: '1,500+', satisfaction: '95%' }
    },
    {
      name: 'Public Services',
      href: '/industries/public-services',
      icon: Building2,
      description: 'Modernize government services and reduce citizen wait times with digital queue solutions.',
      services: ['DMV Offices', 'Passport Services', 'Municipal Services', 'Public Health'],
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-indigo-100',
      stats: { businesses: '800+', satisfaction: '92%' }
    },
    {
      name: 'Education',
      href: '/industries/education',
      icon: GraduationCap,
      description: 'Organize student services, tutoring sessions, and academic consultations efficiently.',
      services: ['Universities', 'Tutoring Centers', 'Language Schools', 'Driving Schools'],
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-100',
      stats: { businesses: '1,200+', satisfaction: '93%' }
    },
    {
      name: 'Events & Entertainment',
      href: '/industries/events-entertainment',
      icon: Calendar,
      description: 'Manage event bookings, tours, and entertainment services with seamless scheduling.',
      services: ['Event Venues', 'Tour Guides', 'Photography', 'Museums'],
      color: 'from-luxury-500 to-warning-600',
      bgColor: 'from-luxury-50 to-warning-100',
      stats: { businesses: '900+', satisfaction: '97%' }
    }
  ]

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-primary-50 to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              Solutions for Every
              <span className="block bg-gradient-to-r from-primary-600 via-accent-600 to-luxury-600 bg-clip-text text-transparent">
                Industry
              </span>
            </h1>
            <p className="text-xl text-secondary-600 mb-12 max-w-3xl mx-auto">
              Discover how Smartq transforms queue management and appointment booking 
              across diverse industries, from healthcare to entertainment.
            </p>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((industry, index) => {
              const IconComponent = industry.icon
              return (
                <Link
                  key={index}
                  href={industry.href}
                  className="group block"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-soft hover:shadow-strong transition-all duration-300 hover:-translate-y-1 border border-secondary-100 h-full">
                    {/* Icon and Header */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${industry.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-secondary-900 mb-4 group-hover:text-primary-600 transition-colors">
                      {industry.name}
                    </h3>
                    
                    <p className="text-secondary-600 mb-6 line-clamp-3">
                      {industry.description}
                    </p>
                    
                    {/* Services List */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-secondary-800 mb-3">Key Services:</h4>
                      <div className="flex flex-wrap gap-2">
                        {industry.services.map((service, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 rounded-full text-sm bg-gradient-to-r ${industry.bgColor} text-secondary-700 border border-secondary-200`}
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="flex justify-between items-center mb-4 p-4 bg-secondary-50 rounded-lg">
                      <div className="text-center">
                        <div className="font-bold text-primary-600">{industry.stats.businesses}</div>
                        <div className="text-xs text-secondary-600">Businesses</div>
                      </div>
                      <div className="text-center">
                        <div className="font-bold text-success-600">{industry.stats.satisfaction}</div>
                        <div className="text-xs text-secondary-600">Satisfaction</div>
                      </div>
                    </div>
                    
                    {/* CTA */}
                    <div className="flex items-center text-primary-600 group-hover:text-primary-700 font-medium">
                      <span>Explore Solutions</span>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Why Industries Choose Smartq
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              Common benefits across all industries using our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary-500 to-accent-600 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">75%</span>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">
                Reduced Wait Times
              </h3>
              <p className="text-secondary-600">
                Average reduction in customer wait times across all industries
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-accent-500 to-luxury-600 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">98%</span>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">
                Customer Satisfaction
              </h3>
              <p className="text-secondary-600">
                Average customer satisfaction rating from all our clients
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-luxury-500 to-warning-600 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">40%</span>
              </div>
              <h3 className="text-xl font-bold text-secondary-900 mb-3">
                Increased Revenue
              </h3>
              <p className="text-secondary-600">
                Average revenue increase from improved efficiency and capacity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-accent-600 to-luxury-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Industry?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using Smartq to deliver exceptional experiences in their industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-white text-primary-700 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Get Industry Demo
            </button>
            <button className="px-8 py-4 border border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}