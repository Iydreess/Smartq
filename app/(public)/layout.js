import { PublicLayout } from '@/components/layout'

/**
 * Public Route Group Layout
 * Applies PublicLayout to all pages in the (public) route group
 */
export default function PublicGroupLayout({ children }) {
  return (
    <PublicLayout>
      {children}
    </PublicLayout>
  )
}