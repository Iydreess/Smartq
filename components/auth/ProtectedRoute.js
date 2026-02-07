'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, isAuthorized } from '@/lib/auth'
import { LoadingPage } from '@/components/ui'

/**
 * Protected Route Component
 * Ensures user is authenticated and has required role before rendering children
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {Array<string>} props.allowedRoles - Array of allowed roles (optional)
 * @param {string} props.redirectTo - Path to redirect if unauthorized (default: '/login')
 */
export default function ProtectedRoute({ 
  children, 
  allowedRoles = [], 
  redirectTo = '/login' 
}) {
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)
  const [isAuthorizedUser, setIsAuthorizedUser] = useState(false)

  useEffect(() => {
    let isMounted = true
    
    const checkAuth = async () => {
      try {
        console.log('[ProtectedRoute] Starting auth check...')
        const user = await getCurrentUser()
        console.log('[ProtectedRoute] User:', user)
        
        if (!isMounted) return
        
        // Not logged in
        if (!user) {
          console.log('[ProtectedRoute] No user found, redirecting to login')
          router.push(redirectTo)
          return
        }
        
        // Check role authorization
        if (allowedRoles.length > 0) {
          const authorized = await isAuthorized(allowedRoles)
          console.log('[ProtectedRoute] Authorization check:', authorized, 'for roles:', allowedRoles)
          
          if (!isMounted) return
          
          if (!authorized) {
            // User doesn't have required role, redirect to their dashboard
            const dashboards = {
              admin: '/admin',
              business: '/dashboard',
              customer: '/customer',
            }
            const redirectPath = dashboards[user.role] || '/login'
            console.log('[ProtectedRoute] User not authorized, redirecting to:', redirectPath)
            router.push(redirectPath)
            return
          }
        }
        
        // User is authenticated and authorized
        if (!isMounted) return
        console.log('[ProtectedRoute] User authorized, rendering children')
        setIsAuthorizedUser(true)
        setIsChecking(false)
      } catch (error) {
        console.error('[ProtectedRoute] Error during auth check:', error)
        if (isMounted) {
          router.push(redirectTo)
        }
      }
    }
    
    checkAuth()
    
    return () => {
      isMounted = false
    }
  }, [router, allowedRoles, redirectTo])

  if (isChecking) {
    return <LoadingPage message="Loading your dashboard..." />
  }

  return isAuthorizedUser ? children : null
}
