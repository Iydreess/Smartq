import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui'
import Link from 'next/link'
import { Play, CheckCircle, ArrowRight } from 'lucide-react'

export default function DemoPage() {
  const features = [
    {
      title: 'Smart Queue Management',
      description: 'See how our virtual queue system eliminates physical waiting and keeps customers informed in real-time.'
    },
    {
      title: 'Online Appointment Booking',
      description: 'Experience our intuitive booking system with calendar integration and automated reminders.'
    },
    {
      title: 'Real-time Notifications',
      description: 'Discover how we keep customers updated via SMS, email, and push notifications.'
    },
    {
      title: 'Business Analytics',
      description: 'Explore comprehensive dashboards with actionable insights on wait times, customer satisfaction, and more.'
    }
  ]

  const benefits = [
    '75% reduction in average wait times',
    '98% customer satisfaction rate',
    'Real-time queue position updates',
    'Multi-channel notifications',
    'Comprehensive analytics dashboard',
    'Easy integration with existing systems'
  ]

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-primary-50 to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-secondary-900 mb-6">
              See Smartq in
              <span className="block bg-gradient-to-r from-primary-600 via-accent-600 to-luxury-600 bg-clip-text text-transparent">
                Action
              </span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto">
              Watch how Smartq transforms the queue and appointment management experience 
              for businesses and customers alike.
            </p>
          </div>

          {/* Video Demo Section */}
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-br from-secondary-900 to-primary-900 rounded-2xl shadow-2xl overflow-hidden">
              {/* Video Placeholder */}
              <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-secondary-800 to-primary-800">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all cursor-pointer group">
                    <Play className="w-12 h-12 text-white group-hover:scale-110 transition-transform" fill="white" />
                  </div>
                  <p className="text-white text-lg font-medium mb-2">
                    Product Demo Video
                  </p>
                  <p className="text-primary-200 text-sm">
                    Click to play (5:30)
                  </p>
                </div>
              </div>
              
              {/* Demo Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Full Product Walkthrough</h3>
                    <p className="text-sm text-gray-300">Learn how to set up and use all features</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Watch Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Covered Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              What You&apos;ll See in the Demo
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              A comprehensive walkthrough of all major features and capabilities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              Key Benefits
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
              See the measurable impact Smartq can have on your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="bg-white rounded-lg p-6 shadow-soft hover:shadow-strong transition-all duration-300"
              >
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                  <p className="text-secondary-900 font-medium">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-600 via-accent-600 to-luxury-600 rounded-2xl p-8 md:p-12 text-center shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Want to Try It Yourself?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Get hands-on experience with our interactive demo environment or schedule 
              a personalized walkthrough with our team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-primary-700 hover:bg-primary-50"
                asChild
              >
                <Link href="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-primary-700"
                asChild
              >
                <Link href="/booking">Schedule a Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Resources */}
      <section className="py-20 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              More Resources
            </h2>
            <p className="text-xl text-secondary-600">
              Explore additional ways to learn about Smartq
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-strong transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary-500 to-accent-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Documentation
              </h3>
              <p className="text-secondary-600 mb-4">
                Comprehensive guides and API documentation
              </p>
              <Link href="/services" className="text-primary-600 font-medium hover:text-primary-700">
                Learn more →
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-strong transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-accent-500 to-luxury-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Case Studies
              </h3>
              <p className="text-secondary-600 mb-4">
                Real success stories from our customers
              </p>
              <Link href="/industries" className="text-primary-600 font-medium hover:text-primary-700">
                View case studies →
              </Link>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-soft hover:shadow-strong transition-all">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-luxury-500 to-warning-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                Support Center
              </h3>
              <p className="text-secondary-600 mb-4">
                Get help from our expert support team
              </p>
              <Link href="/pricing" className="text-primary-600 font-medium hover:text-primary-700">
                Contact support →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}
