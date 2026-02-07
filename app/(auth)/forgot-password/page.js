'use client'

import { AuthLayout } from '@/components/layout'
import { Button, Input } from '@/components/ui'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { resetPassword } from '@/lib/auth'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

/**
 * Forgot Password Page
 */
export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const result = await resetPassword(email)
      
      if (!result.success) {
        toast.error(result.message)
        setLoading(false)
        return
      }

      setEmailSent(true)
      toast.success('Password reset email sent! Check your inbox.')
      
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.')
      console.error('Password reset error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) {
    return (
      <AuthLayout 
        title="Check your email"
        subtitle="We've sent you a password reset link"
      >
        <div className="text-center space-y-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <div className="space-y-2">
            <p className="text-secondary-600">
              We&apos;ve sent a password reset link to
            </p>
            <p className="font-semibold text-secondary-900">
              {email}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Didn&apos;t receive the email?</strong>
              <br />
              Check your spam folder or{' '}
              <button
                onClick={() => {
                  setEmailSent(false)
                  setEmail('')
                }}
                className="text-blue-600 hover:text-blue-700 font-medium underline"
              >
                try another email address
              </button>
            </p>
          </div>

          <Link 
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout 
      title="Reset your password"
      subtitle="Enter your email address and we'll send you a reset link"
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
          <p className="text-sm text-blue-800">
            Enter the email address associated with your account and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        <Input
          label="Email address"
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sending...' : 'Send reset link'}
        </Button>

        <div className="text-center">
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-secondary-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </form>

      {/* Help Section */}
      <div className="mt-8 pt-6 border-t border-secondary-200">
        <h3 className="text-sm font-semibold text-secondary-900 mb-3">
          Having trouble?
        </h3>
        <ul className="space-y-2 text-sm text-secondary-600">
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            <span>Make sure you&apos;re using the email address you registered with</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            <span>Check your spam or junk folder for the reset email</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-600">•</span>
            <span>The reset link will expire after 1 hour</span>
          </li>
        </ul>
      </div>
    </AuthLayout>
  )
}
