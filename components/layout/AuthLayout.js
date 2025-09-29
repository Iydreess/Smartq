'use client'

import Link from 'next/link'

/**
 * AuthLayout Component - Authentication pages layout
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle
 * @returns {JSX.Element} AuthLayout component
 */
export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Logo */}
        <div className="flex justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">SQ</span>
            </div>
            <span className="text-2xl font-bold text-secondary-900">Smartq</span>
          </Link>
        </div>
        
        {/* Title and Subtitle */}
        {title && (
          <h2 className="mt-6 text-center text-3xl font-bold text-secondary-900">
            {title}
          </h2>
        )}
        {subtitle && (
          <p className="mt-2 text-center text-sm text-secondary-600">
            {subtitle}
          </p>
        )}
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-soft sm:rounded-xl sm:px-10">
          {children}
        </div>
      </div>
      
      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs text-secondary-500">
          © 2025 Smartq. All rights reserved.
        </p>
      </div>
    </div>
  )
}