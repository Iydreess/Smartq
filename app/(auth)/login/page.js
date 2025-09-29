import { AuthLayout } from '@/components/layout'
import { Button, Input } from '@/components/ui'
import Link from 'next/link'

/**
 * Sign In Page
 */
export default function SignInPage() {
  return (
    <AuthLayout 
      title="Sign in to your account"
      subtitle={
        <>
          Or{' '}
          <Link href="/register" className="font-medium text-primary-600 hover:text-primary-500">
            start your 14-day free trial
          </Link>
        </>
      }
    >
      <form className="space-y-6">
        <Input
          label="Email address"
          type="email"
          required
          placeholder="Enter your email"
        />
        
        <Input
          label="Password"
          type="password"
          required
          placeholder="Enter your password"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
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

        <Button type="submit" className="w-full">
          Sign in
        </Button>
      </form>
    </AuthLayout>
  )
}