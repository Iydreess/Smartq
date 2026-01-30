'use client'

import { useEffect } from 'react'
import { seedDemoUsers } from '@/lib/auth/seed'

/**
 * Auth Initializer Component
 * Seeds demo users on first load
 */
export default function AuthInitializer({ children }) {
  useEffect(() => {
    // Seed demo users if not already done
    seedDemoUsers()
  }, [])

  return <>{children}</>
}
