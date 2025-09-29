import { cn } from '@/lib/utils'
import { cva } from 'class-variance-authority'
import { forwardRef } from 'react'

/**
 * Button component variants using CVA (Class Variance Authority)
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary-600 text-white hover:bg-primary-700 shadow-sm",
        destructive: "bg-error-600 text-white hover:bg-error-700 shadow-sm",
        outline: "border border-secondary-200 bg-white text-secondary-900 hover:bg-secondary-50 hover:text-secondary-900",
        secondary: "bg-secondary-100 text-secondary-900 hover:bg-secondary-200",
        ghost: "text-secondary-900 hover:bg-secondary-100",
        link: "text-primary-600 underline-offset-4 hover:underline",
        success: "bg-success-600 text-white hover:bg-success-700 shadow-sm",
        warning: "bg-warning-600 text-white hover:bg-warning-700 shadow-sm",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

/**
 * Button Component
 * 
 * @param {object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Button variant (default, destructive, outline, etc.)
 * @param {string} props.size - Button size (default, sm, lg, xl, icon)
 * @param {boolean} props.asChild - Render as child component
 * @param {boolean} props.loading - Loading state
 * @param {React.ReactNode} props.children - Button content
 * @param {object} props...props - Other HTML button attributes
 * @returns {JSX.Element} Button component
 */
export const Button = forwardRef(({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  children,
  disabled,
  ...props
}, ref) => {
  const Comp = asChild ? 'div' : 'button'
  
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={!asChild && (disabled || loading)}
      ref={ref}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {children}
    </Comp>
  )
})

Button.displayName = "Button"