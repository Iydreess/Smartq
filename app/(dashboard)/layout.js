import { DashboardLayout } from '@/components/layout'

/**
 * Dashboard Route Group Layout
 * Applies DashboardLayout to all pages in the (dashboard) route group
 */
export default function DashboardGroupLayout({ children }) {
  return (
    <DashboardLayout>
      {children}
    </DashboardLayout>
  )
}