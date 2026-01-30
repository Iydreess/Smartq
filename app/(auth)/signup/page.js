'use client'

import { AuthLayout } from '@/components/layout'
import { Button, Input } from '@/components/ui'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

/**
 * Sign Up Page with Role Selection
 */
export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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

      // Store user data in localStorage (replace with actual API call)
      const userData = {
        id: Date.now().toString(),
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString(),
      }

      // Get existing users or initialize empty array
      const users = JSON.parse(localStorage.getItem('users') || '[]')
      
      // Check if email already exists
      if (users.some(user => user.email === formData.email)) {
        toast.error('Email already registered')
        setLoading(false)
        return
      }

      // Add new user with hashed password (in production, hash on backend)
      users.push({
        ...userData,
        password: formData.password, // In production, NEVER store plain passwords
      })
      
      localStorage.setItem('users', JSON.stringify(users))
      
      toast.success('Account created successfully!')
      
      // Redirect to login
      setTimeout(() => {
        router.push('/login')
      }, 1000)
      
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
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            I am a:
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-4 border-2 border-secondary-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
              <input
                type="radio"
                name="role"
                value="customer"
                checked={formData.role === 'customer'}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-secondary-900">Customer</span>
                <span className="block text-xs text-secondary-500">Book appointments and join queues</span>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 border-secondary-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
              <input
                type="radio"
                name="role"
                value="business"
                checked={formData.role === 'business'}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-secondary-900">Business</span>
                <span className="block text-xs text-secondary-500">Manage services, staff, and appointments</span>
              </div>
            </label>

            <label className="flex items-center p-4 border-2 border-secondary-200 rounded-lg cursor-pointer hover:border-primary-500 transition-colors">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={formData.role === 'admin'}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
              />
              <div className="ml-3">
                <span className="block text-sm font-medium text-secondary-900">Admin</span>
                <span className="block text-xs text-secondary-500">Full system access and control</span>
              </div>
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
