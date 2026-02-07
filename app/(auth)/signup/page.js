'use client'

import { AuthLayout } from '@/components/layout'
import { Button, Input } from '@/components/ui'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { signUp } from '@/lib/auth'

/**
 * Sign Up Page with Role Selection
 */
export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer', // default role
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validation
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match')
        setLoading(false)
        return
      }

      if (formData.password.length < 8) {
        toast.error('Password must be at least 8 characters')
        setLoading(false)
        return
      }

      // Sign up with Supabase
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        full_name: formData.name,
        phone: formData.phone,
        role: formData.role,
      })

      if (!result.success) {
        toast.error(result.message)
        setLoading(false)
        return
      }
      
      toast.success('Account created! Please check your email to verify your account.')
      
      // Redirect to login
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      
    } catch (error) {
      toast.error('Registration failed. Please try again.')
      console.error('Signup error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Create your account"
      subtitle={
        <>
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </>
      }
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          type="text"
          name="name"
          required
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
        />

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
          label="Phone Number (Optional)"
          type="tel"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
        />
        
        <Input
          label="Password"
          type="password"
          name="password"
          required
          placeholder="Create a password (min. 8 characters)"
          value={formData.password}
          onChange={handleChange}
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          required
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Select Your Account Type *
          </label>
          <div className="grid grid-cols-1 gap-3">
            {/* Customer Role */}
            <label className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.role === 'customer' 
                ? 'border-blue-600 bg-blue-50 shadow-md' 
                : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
            }`}>
              <input
                type="radio"
                name="role"
                value="customer"
                checked={formData.role === 'customer'}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">👤</span>
                  <span className="block text-base font-semibold text-gray-900">Customer</span>
                </div>
                <span className="block text-sm text-gray-600 mt-1">
                  Book appointments, join queues, and manage your bookings
                </span>
              </div>
              {formData.role === 'customer' && (
                <div className="absolute top-3 right-3">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </label>

            {/* Business Role */}
            <label className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.role === 'business' 
                ? 'border-purple-600 bg-purple-50 shadow-md' 
                : 'border-gray-300 bg-white hover:border-purple-400 hover:bg-purple-50'
            }`}>
              <input
                type="radio"
                name="role"
                value="business"
                checked={formData.role === 'business'}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🏢</span>
                  <span className="block text-base font-semibold text-gray-900">Business</span>
                </div>
                <span className="block text-sm text-gray-600 mt-1">
                  Manage your business, services, staff, queues, and appointments
                </span>
              </div>
              {formData.role === 'business' && (
                <div className="absolute top-3 right-3">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </label>

            {/* Admin Role */}
            <label className={`relative flex items-start p-4 border-2 rounded-lg cursor-pointer transition-all ${
              formData.role === 'admin' 
                ? 'border-orange-600 bg-orange-50 shadow-md' 
                : 'border-gray-300 bg-white hover:border-orange-400 hover:bg-orange-50'
            }`}>
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === 'admin'}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">⚡</span>
                  <span className="block text-base font-semibold text-gray-900">Admin</span>
                </div>
                <span className="block text-sm text-gray-600 mt-1">
                  Full system access, manage all users, businesses, and settings
                </span>
              </div>
              {formData.role === 'admin' && (
                <div className="absolute top-3 right-3">
                  <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            required
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-secondary-900">
            I agree to the{' '}
            <Link href="/terms" className="text-primary-600 hover:text-primary-500">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </AuthLayout>
  )
}
