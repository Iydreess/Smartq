'use client'

import { DashboardLayout } from '@/components/layout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { ROLES } from '@/lib/auth'

/**
 * Dashboard Route Group Layout
 * Accessible by admin and business users
 */
export default function DashboardGroupLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.BUSINESS]}>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  )
}