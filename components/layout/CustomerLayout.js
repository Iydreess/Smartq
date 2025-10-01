'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui'

/**
 * CustomerLayout Component - Customer dashboard layout
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 * @returns {JSX.Element} CustomerLayout component
 */
export function CustomerLayout({ children }) {
  const pathname = usePathname()
  
  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/customer', 
      current: pathname === '/customer',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      )
    },
    { 
      name: 'My Bookings', 
      href: '/customer/bookings', 
      current: pathname.startsWith('/customer/bookings'),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    { 
      name: 'Queue Status', 
      href: '/customer/queue', 
      current: pathname.startsWith('/customer/queue'),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m0 0h10a2 2 0 002-2V7a2 2 0 00-2-2H9m0 8v2m0-2h10" />
        </svg>
      )
    },
    { 
      name: 'Services', 
      href: '/customer/services', 
      current: pathname.startsWith('/customer/services'),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2M16 6v6a2 2 0 01-2 2H10a2 2 0 01-2-2V6m8 0H8" />
        </svg>
      )
    },
    { 
      name: 'Profile', 
      href: '/customer/profile', 
      current: pathname.startsWith('/customer/profile'),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      name: 'Notifications', 
      href: '/customer/notifications', 
      current: pathname.startsWith('/customer/notifications'),
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3-3V9a6 6 0 10-12 0v5l-3 3h5a6 6 0 1012 0z" />
        </svg>
      )
    }
  ]
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/customer" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">SQ</span>
                </div>
                <span className="text-xl font-bold text-gray-900">SmartQ</span>
              </Link>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center space-x-4">
              {/* Quick Book Button */}
              <Link href="/customer/services">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Book Service
                </Button>
              </Link>
              
              {/* Notifications */}
              <Link href="/customer/notifications">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-3-3V9a6 6 0 10-12 0v5l-3 3h5a6 6 0 1012 0z" />
                  </svg>
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                  <span className="sr-only">Notifications</span>
                </button>
              </Link>
              
              {/* User Menu */}
              <Link href="/customer/profile">
                <div className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 transition-colors cursor-pointer">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">Sarah Johnson</p>
                    <p className="text-xs text-gray-500">Customer</p>
                  </div>
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">SJ</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  item.current
                    ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                )}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          {/* Loyalty Points Card */}
          <div className="p-4">
            <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-4 text-white">
              <h3 className="font-semibold text-sm">Loyalty Points</h3>
              <p className="text-2xl font-bold">1,250</p>
              <p className="text-xs opacity-80">Redeem for rewards</p>
            </div>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}