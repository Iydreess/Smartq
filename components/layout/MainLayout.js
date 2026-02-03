'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'
import { ChevronDown, Menu, X } from 'lucide-react'

/**
 * MainLayout Component - Overall app layout with navigation
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @returns {JSX.Element} MainLayout component
 */
export function MainLayout({ children }) {
  const pathname = usePathname()
  const [isIndustriesOpen, setIsIndustriesOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navigation = [
    { name: 'Home', href: '/', current: pathname === '/' },
    { name: 'Services', href: '/services', current: pathname === '/services' },
    { 
      name: 'Industries', 
      href: '/industries', 
      current: pathname.startsWith('/industries'),
      hasDropdown: true,
      dropdownItems: [
        { name: 'Beauty & Wellness', href: '/industries/beauty-wellness' },
        { name: 'Sports & Fitness', href: '/industries/sports-fitness' },
        { name: 'Healthcare', href: '/industries/healthcare' },
        { name: 'Professional Services', href: '/industries/professional-services' },
        { name: 'Public Services', href: '/industries/public-services' },
        { name: 'Education', href: '/industries/education' },
        { name: 'Events & Entertainment', href: '/industries/events-entertainment' },
      ]
    },
    { name: 'Pricing', href: '/pricing', current: pathname === '/pricing' },
  ]
  
  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-white via-yellow-50 to-white backdrop-blur-xl shadow-lg border-b border-yellow-200 sticky top-0 z-50 transition-all duration-500 hover:shadow-xl nav-enhanced">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center animate-slide-in-right">
              <Link href="/" className="flex items-center space-x-4 group">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 via-accent-600 to-luxury-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg hover:shadow-xl animate-glow">
                  <span className="text-white font-bold text-xl animate-bounce-gentle">SQ</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-secondary-900 via-primary-700 to-accent-700 bg-clip-text text-transparent group-hover:from-primary-600 group-hover:to-luxury-600 transition-all duration-300">Smartq</span>
                  <span className="text-xs text-secondary-500 font-medium">Smart Queue System</span>
                </div>
              </Link>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              {navigation.map((item, index) => (
                <div 
                  key={item.name} 
                  className="relative animate-slide-in-down"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.hasDropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => setIsIndustriesOpen(true)}
                      onMouseLeave={() => setIsIndustriesOpen(false)}
                    >
                      <button
                        className={cn(
                          'flex items-center px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 group hover:scale-105 border border-transparent',
                          item.current
                            ? 'text-primary-700 bg-gradient-to-r from-primary-100 via-accent-50 to-primary-100 shadow-md border-primary-200 animate-glow'
                            : 'text-secondary-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:via-accent-50 hover:to-primary-50 hover:shadow-lg hover:border-primary-200'
                        )}
                      >
                        {item.name}
                        <ChevronDown className={cn(
                          'ml-2 h-4 w-4 transition-all duration-300 group-hover:text-primary-600',
                          isIndustriesOpen ? 'rotate-180 text-primary-600' : ''
                        )} />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {isIndustriesOpen && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-secondary-200 py-3 z-50 animate-scale-in">
                          {item.dropdownItems.map((dropdownItem, idx) => (
                            <Link
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="block px-5 py-3 text-sm font-medium text-secondary-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50 transition-all duration-300 mx-2 rounded-xl animate-slide-left"
                              style={{ animationDelay: `${idx * 50}ms` }}
                            >
                              {dropdownItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        'px-5 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 hover:scale-105 border border-transparent',
                        item.current
                          ? 'text-primary-700 bg-gradient-to-r from-primary-100 via-accent-50 to-primary-100 shadow-md border-primary-200 animate-glow'
                          : 'text-secondary-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:via-accent-50 hover:to-primary-50 hover:shadow-lg hover:border-primary-200'
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4 animate-slide-in-right">
              <Button 
                variant="outline" 
                className="px-6 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-300 hover:scale-110 hover:shadow-lg border-2 border-primary-300 text-primary-700 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-800"
                asChild
              >
                <Link href="/login">Sign In</Link>
              </Button>
              <Button 
                className="btn-primary-enhanced animate-pulse-glow"
                asChild
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-secondary-700 hover:text-primary-600 hover:bg-secondary-100 transition-all duration-300 hover:scale-110"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6 animate-scale-in" />
                ) : (
                  <Menu className="block h-6 w-6 animate-scale-in" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden animate-slide-in-down">
            <div className="px-2 pt-4 pb-6 space-y-2 sm:px-4 bg-white/95 backdrop-blur-md border-t border-secondary-200 shadow-lg">
              {navigation.map((item, index) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div className="space-y-1">
                      <div 
                        className="block px-4 py-3 rounded-xl text-base font-semibold text-secondary-700 bg-gradient-to-r from-primary-50 to-accent-50 animate-slide-left"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        {item.name}
                      </div>
                      <div className="pl-4 space-y-1">
                        {item.dropdownItems.map((dropdownItem, idx) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block px-4 py-2 rounded-lg text-sm font-medium text-secondary-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-300 animate-slide-left"
                            style={{ animationDelay: `${(index * 100) + (idx * 50)}ms` }}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-300 animate-slide-left hover:scale-105',
                        item.current
                          ? 'text-primary-600 bg-gradient-to-r from-primary-50 to-accent-50 shadow-sm'
                          : 'text-secondary-700 hover:text-primary-600 hover:bg-gradient-to-r hover:from-primary-50 hover:to-accent-50'
                      )}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Mobile CTA Buttons */}
              <div className="pt-4 space-y-3 border-t border-secondary-200 animate-scale-in">
                <Button 
                  variant="outline" 
                  className="w-full transition-all duration-300 hover:scale-105 hover:shadow-md border-secondary-300 hover:border-primary-400"
                  asChild
                >
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  asChild
                >
                  <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-secondary-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SQ</span>
                </div>
                <span className="text-xl font-bold text-secondary-900">Smartq</span>
              </div>
              <p className="text-secondary-600 mb-4">
                The smart way to manage queues and appointments. 
                Reduce wait times and improve customer experience.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-secondary-400 hover:text-primary-600">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-secondary-400 hover:text-primary-600">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-secondary-900 tracking-wider uppercase mb-4">
                Features
              </h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-secondary-600 hover:text-primary-600">Queue Management</a></li>
                <li><a href="#" className="text-secondary-600 hover:text-primary-600">Appointment Booking</a></li>
                <li><a href="#" className="text-secondary-600 hover:text-primary-600">Real-time Updates</a></li>
                <li><a href="#" className="text-secondary-600 hover:text-primary-600">Analytics</a></li>
              </ul>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="text-sm font-semibold text-secondary-900 tracking-wider uppercase mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-secondary-600 hover:text-primary-600">Help Center</a></li>
                <li><a href="#" className="text-secondary-600 hover:text-primary-600">Contact Us</a></li>
                <li><a href="#" className="text-secondary-600 hover:text-primary-600">Privacy Policy</a></li>
                <li><a href="#" className="text-secondary-600 hover:text-primary-600">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-secondary-200">
            <p className="text-center text-secondary-600">
              © 2025 Smartq. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}