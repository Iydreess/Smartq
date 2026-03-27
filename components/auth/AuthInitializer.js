'use client'

import { useEffect } from 'react'
import { useUser } from '@/lib/supabase/hooks'
import { checkConnection, getConnectionStatus } from '@/lib/supabase/client'

/**
 * Auth Initializer Component
 * Initializes authentication state and listens for changes
 */
export default function AuthInitializer({ children }) {
  const { user, loading } = useUser()

  // Check Supabase connection on mount
  useEffect(() => {
    const status = getConnectionStatus()
    console.log('[AuthInitializer] Supabase configuration:', status)
    
    checkConnection().then(isConnected => {
      if (isConnected) {
        console.log('[AuthInitializer] ✅ Supabase connection healthy')
      } else {
        console.warn('[AuthInitializer] ⚠️ Supabase connection issue detected')
      }
    }).catch((error) => {
      console.warn('[AuthInitializer] ⚠️ Initial connection check failed:', error?.message || error)
    })
  }, [])

  useEffect(() => {
    if (!loading) {
      console.log('Auth initialized:', user ? `Logged in as ${user.email}` : 'Not logged in')
    }
  }, [user, loading])

  // Suppress abort errors globally
  useEffect(() => {
    // Store original console.error
    const originalError = console.error

    // Override console.error to filter abort errors
    console.error = (...args) => {
      const errorMessage = args[0]?.toString?.() || ''
      const isAbortError = 
        errorMessage.includes('AbortError') ||
        errorMessage.includes('aborted without reason') ||
        errorMessage.includes('signal is aborted') ||
        args[0]?.name === 'AbortError'
      const isExpectedAuthValidationError =
        errorMessage.includes('New password should be different from the old password') ||
        args.some((arg) => arg?.message?.includes?.('New password should be different from the old password'))
      
      if (!isAbortError && !isExpectedAuthValidationError) {
        originalError.apply(console, args)
      }
    }

    const containsAbortSignal = (value) => {
      const text = typeof value === 'string' ? value : value?.message || value?.toString?.() || ''
      return text.includes('AbortError') || text.includes('aborted') || text.includes('signal is aborted')
    }

    const handleError = (event) => {
      if (containsAbortSignal(event?.error) || containsAbortSignal(event?.message)) {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }

    const handleUnhandledRejection = (event) => {
      if (containsAbortSignal(event?.reason)) {
        event.preventDefault()
        event.stopPropagation()
        return false
      }
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      console.error = originalError
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  return <>{children}</>
}
