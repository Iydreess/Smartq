'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * PublicLayout Component - Customer-facing pages layout
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {boolean} props.showHeader - Whether to show header
 * @param {boolean} props.showFooter - Whether to show footer
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} PublicLayout component
 */
export function PublicLayout({ 
  children, 
  showHeader = true, 
  showFooter = true,
  className 
}) {
  return (
    <div className={cn("min-h-screen bg-secondary-50", className)}>
      {/* Header */}
      {showHeader && (
        <header className="bg-white shadow-soft border-b border-secondary-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SQ</span>
                  </div>
                  <span className="text-xl font-bold text-secondary-900">Smartq</span>
                </Link>
              </div>
              
              {/* Simple Navigation */}
              <nav className="hidden sm:flex space-x-6">
                <Link 
                  href="/queue/join" 
                  className="text-secondary-700 hover:text-primary-600 transition-colors"
                >
                  Join Queue
                </Link>
                <Link 
                  href="/booking" 
                  className="text-secondary-700 hover:text-primary-600 transition-colors"
                >
                  Book Appointment
                </Link>
                <Link 
                  href="/check-status" 
                  className="text-secondary-700 hover:text-primary-600 transition-colors"
                >
                  Check Status
                </Link>
              </nav>
              
              {/* Help Button */}
              <button className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="sr-only">Help</span>
              </button>
            </div>
          </div>
        </header>
      )}
      
      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
      
      {/* Footer */}
      {showFooter && (
        <footer className="bg-white border-t border-secondary-200 mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-primary-600 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-xs">SQ</span>
                </div>
                <span className="text-sm font-medium text-secondary-900">Smartq</span>
              </div>
              
              <div className="flex space-x-6 text-sm text-secondary-600">
                <Link href="/help" className="hover:text-primary-600 transition-colors">
                  Help
                </Link>
                <Link href="/privacy" className="hover:text-primary-600 transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-primary-600 transition-colors">
                  Terms
                </Link>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-secondary-200 text-center">
              <p className="text-xs text-secondary-500">
                © 2025 Smartq. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}