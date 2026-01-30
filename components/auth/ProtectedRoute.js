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
    const checkAuth = () => {
      const user = getCurrentUser()
      
      // Not logged in
      if (!user) {
        router.push(redirectTo)
        return
      }
      
      // Check role authorization
      if (allowedRoles.length > 0 && !isAuthorized(allowedRoles)) {
        // User doesn't have required role, redirect to their dashboard
        const dashboards = {
          admin: '/admin',
          business: '/dashboard',
          customer: '/customer',
        }
        router.push(dashboards[user.role] || '/login')
        return
      }
      
      // User is authenticated and authorized
      setIsAuthorizedUser(true)
      setIsChecking(false)
    }
    
    checkAuth()
  }, [router, allowedRoles, redirectTo])

  if (isChecking) {
    return <LoadingPage />
  }

  return isAuthorizedUser ? children : null
}
