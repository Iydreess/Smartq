'use client'

import { AuthLayout } from '@/components/layout'
import { Button, Input } from '@/components/ui'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { signIn, getRoleDashboard } from '@/lib/auth'

/**
 * Sign In Page with Role-Based Authentication
 */
export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl')
  const message = searchParams.get('message')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [loading, setLoading] = useState(false)

  // Show message if coming from signup
  useEffect(() => {
    if (message === 'check-email') {
      toast.success('Please check your email and click the confirmation link to verify your account', {
        duration: 6000,
        icon: '📧',
      })
      // Clean up URL
      const newUrl = window.location.pathname
      window.history.replaceState({}, '', newUrl)
    }
  }, [message])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('[Login] Attempting to sign in with:', formData.email)
      
      const result = await signIn(formData.email, formData.password)
      
      console.log('[Login] Sign in result:', result)
      
      if (!result.success) {
        console.error('[Login] Sign in failed:', result.message)
        
        // Handle email confirmation requirement
        if (result.requiresEmailConfirmation) {
          toast.error(result.message, {
            duration: 6000,
            icon: '📧',
          })
        } else {
          toast.error(result.message)
        }
        
        setLoading(false)
        return
      }

      const user = result.user
      console.log('[Login] Sign in successful, user:', user)
      console.log('[Login] User role:', user.role)
      
      toast.success(`Welcome back, ${user.full_name || user.email}!`)
      
      // Redirect based on returnUrl or user role
      if (returnUrl) {
        console.log('[Login] Redirecting to return URL:', returnUrl)
        setTimeout(() => {
          window.location.href = returnUrl
        }, 100)
      } else {
        const dashboard = getRoleDashboard(user.role)
        console.log('[Login] Redirecting to dashboard:', dashboard)
        setTimeout(() => {
          console.log('[Login] Executing redirect now...')
          window.location.href = dashboard
        }, 100)
      }
      
    } catch (error) {
      console.error('[Login] Catch block - Error:', error)
      setLoading(false)
      toast.error('Login failed. Please try again.')
    }
  }

  return (
    <AuthLayout 
      title="Sign in to your account"
      subtitle={
        <>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-primary-600 hover:text-primary-500">
            Sign up
          </Link>
        </>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Email address"
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
        
        <Input
          label="Password"
          type="password"
          name="password"
          required
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="rememberMe"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary-900">
              Remember me
            </label>
          </div>

          <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-500">
            Forgot your password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </form>

      {/* Demo Credentials */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Quick Demo Login</span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          {/* Admin Demo */}
          <button
            type="button"
            onClick={() => {
              setFormData({ ...formData, email: 'admin@smartq.com', password: 'admin123' })
              toast.success('Admin credentials filled!')
            }}
            className="flex items-center p-3 border-2 border-orange-200 bg-orange-50 rounded-lg hover:border-orange-400 hover:bg-orange-100 transition-all group"
          >
            <div className="flex items-center flex-1">
              <span className="text-2xl mr-3">⚡</span>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">Login as Admin</div>
                <div className="text-xs text-gray-600">admin@smartq.com</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-orange-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Business Demo */}
          <button
            type="button"
            onClick={() => {
              setFormData({ ...formData, email: 'business@smartq.com', password: 'business123' })
              toast.success('Business credentials filled!')
            }}
            className="flex items-center p-3 border-2 border-purple-200 bg-purple-50 rounded-lg hover:border-purple-400 hover:bg-purple-100 transition-all group"
          >
            <div className="flex items-center flex-1">
              <span className="text-2xl mr-3">🏢</span>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">Login as Business</div>
                <div className="text-xs text-gray-600">business@smartq.com</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-purple-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Customer Demo */}
          <button
            type="button"
            onClick={() => {
              setFormData({ ...formData, email: 'customer@smartq.com', password: 'customer123' })
              toast.success('Customer credentials filled!')
            }}
            className="flex items-center p-3 border-2 border-blue-200 bg-blue-50 rounded-lg hover:border-blue-400 hover:bg-blue-100 transition-all group"
          >
            <div className="flex items-center flex-1">
              <span className="text-2xl mr-3">👤</span>
              <div className="text-left">
                <div className="text-sm font-semibold text-gray-900">Login as Customer</div>
                <div className="text-xs text-gray-600">customer@smartq.com</div>
              </div>
            </div>
            <svg className="w-5 h-5 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </AuthLayout>
  )
}