import { cn } from '@/lib/utils'

/**
 * LoadingSpinner Component
 * 
 * @param {object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.size - Spinner size (sm, md, lg)
 * @param {string} props.color - Spinner color
 * @returns {JSX.Element} LoadingSpinner component
 */
export function LoadingSpinner({ 
  className, 
  size = 'md',
  color = 'primary',
  ...props 
}) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  }
  
  const colors = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
  }
  
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizes[size],
        colors[color],
        className
      )}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * LoadingCard Component for card-based loading states
 * 
 * @param {object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.message - Loading message
 * @returns {JSX.Element} LoadingCard component
 */
export function LoadingCard({ className, message = 'Loading...', ...props }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 rounded-xl border border-secondary-200 bg-white',
        className
      )}
      {...props}
    >
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-sm text-secondary-600">{message}</p>
    </div>
  )
}

/**
 * LoadingPage Component for full page loading states
 * 
 * @param {object} props - Component props
 * @param {string} props.message - Loading message
 * @returns {JSX.Element} LoadingPage component
 */
export function LoadingPage({ message = 'Loading...', ...props }) {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-secondary-50"
      {...props}
    >
      <div className="text-center">
        <LoadingSpinner size="xl" />
        <p className="mt-4 text-lg text-secondary-600">{message}</p>
      </div>
    </div>
  )
}