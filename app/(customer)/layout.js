'use client'

import { CustomerLayout } from '@/components/layout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { ROLES } from '@/lib/auth'

/**
 * Customer Route Group Layout
 * Only accessible by customer users
 */
export default function CustomerGroupLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.CUSTOMER]}>
      <CustomerLayout>{children}</CustomerLayout>
    </ProtectedRoute>
  )
}