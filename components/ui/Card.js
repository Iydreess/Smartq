import { cn } from '@/lib/utils'

/**
 * Card Component
 * 
 * @param {object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Card content
 * @returns {JSX.Element} Card component
 */
export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-secondary-200 bg-white shadow-soft",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * CardHeader Component
 * 
 * @param {object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - CardHeader content
 * @returns {JSX.Element} CardHeader component
 */
export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6 pb-4", className)}
      {...props}
    >
      {children}
    </div>
  )
}

/**
 * CardTitle Component
 * 
 * @param {object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - CardTitle content
 * @returns {JSX.Element} CardTitle component
 */
export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("text-lg font-semibold leading-none tracking-tight text-secondary-900", className)}
      {...props}
    >
      {children}
    </h3>
  )
}

/**
 * CardDescription Component
 * 
 * @param {object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - CardDescription content
 * @returns {JSX.Element} CardDescription component
 */
export function CardDescription({ className, children, ...props }) {
  return (
    <p
      className={cn("text-sm text-secondary-600", className)}
      {...props}
    >
      {children}
    </p>
  )
}

/**
 * CardContent Component
 * 
 * @param {object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - CardContent content
 * @returns {JSX.Element} CardContent component
 */
export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-6 pt-4", className)} {...props}>
      {children}
    </div>
  )
}

/**
 * CardFooter Component
 * 
 * @param {object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - CardFooter content
 * @returns {JSX.Element} CardFooter component
 */
export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("flex items-center p-6 pt-4", className)} {...props}>
      {children}
    </div>
  )
}