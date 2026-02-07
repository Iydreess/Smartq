'use client'

import { useEffect } from 'react'
import { useUser } from '@/lib/supabase/hooks'

/**
 * Auth Initializer Component
 * Initializes authentication state and listens for changes
 */
export default function AuthInitializer({ children }) {
  const { user, loading } = useUser()

  useEffect(() => {
    if (!loading) {
      console.log('Auth initialized:', user ? `Logged in as ${user.email}` : 'Not logged in')
    }
  }, [user, loading])

  return <>{children}</>
}
