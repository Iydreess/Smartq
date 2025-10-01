import { CustomerLayout } from '@/components/layout'

/**
 * Customer Dashboard Route Group Layout
 * Applies CustomerLayout to all pages in the (customer) route group
 */
export default function CustomerGroupLayout({ children }) {
  return (
    <CustomerLayout>
      {children}
    </CustomerLayout>
  )
}