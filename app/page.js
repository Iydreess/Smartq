import Link from 'next/link'
import { Button, Card, CardContent } from '@/components/ui'
import { MainLayout } from '@/components/layout'

/**
 * Home Page Component
 * Landing page for Smartq showcasing features and call-to-actions
 */
export default function Home() {
  const features = [
    {
      title: 'Smart Queue Management',
      description: 'Eliminate physical waiting with virtual queues and real-time position updates.',
      icon: (
        <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h10a2 2 0 002-2V7a2 2 0 00-2-2H9m0 8v2m0-2h10" />
        </svg>
      ),
    },
    {
      title: 'Easy Appointment Booking',
      description: 'Book appointments online with calendar integration and automated reminders.',
      icon: (
        <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      title: 'Real-time Updates',
      description: 'Get instant notifications about queue status, wait times, and appointment changes.',
      icon: (
        <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3-3V9a6 6 0 10-12 0v5l-3 3h5a6 6 0 1012 0z" />
        </svg>
      ),
    },
    {
      title: 'Business Analytics',
      description: 'Track performance metrics, customer satisfaction, and operational efficiency.',
      icon: (
        <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ]

  const stats = [
    { label: 'Average Wait Time Reduced', value: '75%' },
    { label: 'Customer Satisfaction', value: '98%' },
    { label: 'Businesses Using Smartq', value: '500+' },
    { label: 'Queue Entries Processed', value: '100K+' },
  ]

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white via-primary-50 to-accent-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-secondary-900 mb-6 animate-scale-in">
              The Smart Way to 
              <span className="bg-gradient-to-r from-primary-600 via-accent-600 to-luxury-600 bg-clip-text text-transparent block animate-glow">
                Manage Queues
              </span>
            </h1>
            <p className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto animate-slide-in-up">
              Eliminate waiting frustration with virtual queues, online appointment booking, 
              and real-time updates that keep everyone informed and happy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white animate-float" 
                asChild
              >
                <Link href="/booking">Book Appointment</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </div>
        
        {/* Enhanced Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 -mt-4 opacity-10 animate-float">
            <svg className="h-96 w-96 text-primary-600" fill="currentColor" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="50" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 -mb-4 opacity-5 animate-float" style={{ animationDelay: '2s' }}>
            <svg className="h-64 w-64 text-accent-600" fill="currentColor" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="50" />
            </svg>
          </div>
          
          {/* Floating queue icons */}
          <div className="absolute top-20 left-20 opacity-20 animate-bounce-gentle">
            <svg className="h-12 w-12 text-luxury-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          
          <div className="absolute top-40 right-32 opacity-15 animate-float" style={{ animationDelay: '1s' }}>
            <svg className="h-16 w-16 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <div className="absolute bottom-32 right-16 opacity-10 animate-bounce-gentle" style={{ animationDelay: '3s' }}>
            <svg className="h-10 w-10 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3-3V9a6 6 0 10-12 0v5l-3 3h5a6 6 0 1012 0z" />
            </svg>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center group animate-slide-in-up hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="text-3xl lg:text-4xl font-bold text-primary-600 mb-2 group-hover:animate-bounce-gentle">
                  {stat.value}
                </div>
                <div className="text-sm text-secondary-600 group-hover:text-primary-600 transition-colors duration-300">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Everything You Need to Manage Queues
            </h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              From virtual queues to appointment booking, Smartq provides all the tools 
              needed to create exceptional customer experiences.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-lg hover:shadow-primary-200/50 transition-all duration-500 hover:scale-105 hover:-translate-y-2 group animate-scale-in border border-secondary-200 hover:border-primary-300"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 group-hover:animate-bounce-gentle group-hover:text-accent-600 transition-colors duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-secondary-600 group-hover:text-secondary-700 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/90 to-accent-600/90"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-white/5 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-32 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4 animate-slide-in-down">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto animate-slide-in-up">
            Join hundreds of businesses already using Smartq to improve customer 
            experience and operational efficiency.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in">
            <Button 
              size="lg" 
              variant="secondary"
              className="bg-white text-primary-600 hover:bg-primary-50 hover:scale-110 hover:shadow-xl transition-all duration-300 animate-pulse-glow"
              asChild
            >
              <Link href="/dashboard">Start Free Trial</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-primary-600 hover:scale-110 transition-all duration-300"
              asChild
            >
              <Link href="/demo">Watch Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  )
}