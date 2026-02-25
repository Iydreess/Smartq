'use client'

import { AuthLayout } from '@/components/layout'
import { Button, Input } from '@/components/ui'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase/client'
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react'

/**
 * Reset Password Page - User lands here from email link
 */
export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [error, setError] = useState('')
  const [verifyingSession, setVerifyingSession] = useState(true)

  // Verify auth session on mount
  useEffect(() => {
    const verifySession = async () => {
      try {
        // Check if there's a valid session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError || !session) {
          console.error('No valid session found:', sessionError)
          setError('Invalid or expired reset link')
        }
        
        setVerifyingSession(false)
      } catch (err) {
        console.error('Error verifying session:', err)
        setError('Invalid or expired reset link')
        setVerifyingSession(false)
      }
    }
    
    verifySession()
  }, [])

  // Handle redirect after successful reset
  useEffect(() => {
    if (resetSuccess) {
      const timer = setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [resetSuccess])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log('[Reset Password] Starting password reset...')
      
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

      // Password strength check
      const hasUpperCase = /[A-Z]/.test(formData.password)
      const hasLowerCase = /[a-z]/.test(formData.password)
      const hasNumber = /[0-9]/.test(formData.password)
      
      if (!hasUpperCase || !hasLowerCase || !hasNumber) {
        toast.error('Password must contain uppercase, lowercase, and numbers')
        setLoading(false)
        return
      }

      console.log('[Reset Password] Updating user password...')
      
      // Update password in Supabase
      const { data, error } = await supabase.auth.updateUser({
        password: formData.password
      })

      console.log('[Reset Password] Update response:', { data, error })

      if (error) {
        console.error('[Reset Password] Error:', error)
        // Check if it's an expired/invalid token error
        if (error.message.includes('expired') || error.message.includes('invalid') || error.message.includes('session')) {
          setError('Invalid or expired reset link')
          toast.error('Your reset link has expired. Please request a new one.')
        } else {
          toast.error(error.message)
        }
        setLoading(false)
        return
      }

      console.log('[Reset Password] Password updated successfully')
      
      // Success - update state
      setLoading(false)
      toast.success('Password updated successfully!')
      setResetSuccess(true)
      
    } catch (error) {
      console.error('[Reset Password] Exception:', error)
      // Only show error if it's not an abort error
      if (error.name !== 'AbortError') {
        toast.error('Failed to reset password. Please try again.')
        console.error('Password reset error:', error)
      }
      setLoading(false)
    }
  }

  // Show loading state while verifying session
  if (verifyingSession) {
    return (
      <AuthLayout 
        title="Verifying Reset Link"
        subtitle="Please wait while we verify your password reset link"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
          <p className="text-secondary-600">
            Verifying your password reset link...
          </p>
        </div>
      </AuthLayout>
    )
  }

  if (error) {
    return (
      <AuthLayout 
        title="Invalid Reset Link"
        subtitle="This password reset link is invalid or has expired"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
          
          <div className="space-y-2">
            <p className="text-secondary-600">
              The password reset link you clicked is either invalid or has expired.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>What to do next:</strong>
              <br />
              Password reset links expire after 1 hour. Please request a new reset link.
            </p>
          </div>

          <Link href="/forgot-password">
            <Button className="w-full">
              Request New Reset Link
            </Button>
          </Link>

          <Link 
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-secondary-900"
          >
            Back to login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  if (resetSuccess) {
    return (
      <AuthLayout 
        title="Password Reset Successful"
        subtitle="Your password has been updated"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <p className="text-secondary-600">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              Redirecting you to the login page...
            </p>
          </div>

          <Link href="/login">
            <Button className="w-full">
              Go to Login
            </Button>
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="Set New Password"
      subtitle="Enter your new password below"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Lock className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Password Requirements:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>At least 8 characters long</li>
              <li>Contains uppercase and lowercase letters</li>
              <li>Contains at least one number</li>
            </ul>
          </div>
        </div>

        <div className="relative">
          <Input
            label="New Password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            required
            placeholder="Enter new password"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-secondary-400 hover:text-secondary-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm New Password"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            required
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-secondary-400 hover:text-secondary-600"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>

        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-secondary-700">Password Strength:</div>
            <div className="space-y-1">
              <div className={`flex items-center gap-2 text-xs ${formData.password.length >= 8 ? 'text-green-600' : 'text-secondary-400'}`}>
                <CheckCircle className="h-4 w-4" />
                <span>At least 8 characters</span>
              </div>
              <div className={`flex items-center gap-2 text-xs ${/[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) ? 'text-green-600' : 'text-secondary-400'}`}>
                <CheckCircle className="h-4 w-4" />
                <span>Uppercase and lowercase letters</span>
              </div>
              <div className={`flex items-center gap-2 text-xs ${/[0-9]/.test(formData.password) ? 'text-green-600' : 'text-secondary-400'}`}>
                <CheckCircle className="h-4 w-4" />
                <span>Contains numbers</span>
              </div>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={loading || verifyingSession}>
          {loading ? 'Resetting Password...' : 'Reset Password'}
        </Button>

        <div className="text-center">
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-secondary-900"
          >
            Back to login
          </Link>
        </div>
      </form>
    </AuthLayout>
  )
}
