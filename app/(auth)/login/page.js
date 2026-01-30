'use client'

import { AuthLayout } from '@/components/layout'
import { Button, Input } from '@/components/ui'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { authenticateUser, setCurrentUser, getRoleDashboard } from '@/lib/auth'

/**
 * Sign In Page with Role-Based Authentication
 */
export default function SignInPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })
  const [loading, setLoading] = useState(false)

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
      // Authenticate user
      const user = authenticateUser(formData.email, formData.password)
      
      if (!user) {
        toast.error('Invalid email or password')
        setLoading(false)
        return
      }

      // Store user session
      setCurrentUser(user)
      
      toast.success(`Welcome back, ${user.name}!`)
      
      // Redirect based on user role
      const dashboard = getRoleDashboard(user.role)
      
      setTimeout(() => {
        router.push(dashboard)
      }, 500)
      
    } catch (error) {
      toast.error('Login failed. Please try again.')
      console.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout 
      title="Sign in to your account"
      subtitle={
        <>
          Don't have an account?{' '}
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
      <div className="mt-6 p-4 bg-secondary-50 border border-secondary-200 rounded-lg">
        <p className="text-xs font-semibold text-secondary-700 mb-2">Demo Credentials:</p>
        <div className="space-y-1 text-xs text-secondary-600">
          <p><strong>Admin:</strong> admin@smartq.com / admin123</p>
          <p><strong>Business:</strong> business@smartq.com / business123</p>
          <p><strong>Customer:</strong> customer@smartq.com / customer123</p>
        </div>
      </div>
    </AuthLayout>
  )
}