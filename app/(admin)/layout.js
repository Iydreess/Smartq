'use client'

import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { ROLES } from '@/lib/auth'
import { AdminLayout } from '@/components/layout'

/**
 * Admin Route Group Layout
 * Only accessible by admin users
 */
export default function AdminGroupLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
      <AdminLayout>
        {children}
      </AdminLayout>
    </ProtectedRoute>
  )
}
