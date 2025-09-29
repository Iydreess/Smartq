import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

/**
 * Input Component
 * 
 * @param {object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.type - Input type
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {string} props.helperText - Helper text
 * @param {boolean} props.required - Whether input is required
 * @param {React.Ref} ref - Forwarded ref
 * @param {object} props...props - Other HTML input attributes
 * @returns {JSX.Element} Input component
 */
export const Input = forwardRef(({
  className,
  type = "text",
  label,
  error,
  helperText,
  required = false,
  ...props
}, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  return (
    <div className="space-y-2">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-secondary-700"
        >
          {label}
          {required && (
            <span className="text-error-500 ml-1">*</span>
          )}
        </label>
      )}
      
      <input
        {...props}
        ref={ref}
        type={type}
        id={inputId}
        className={cn(
          "flex h-10 w-full rounded-lg border border-secondary-200 bg-white px-3 py-2 text-sm",
          "placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-secondary-50",
          error && "border-error-300 focus:ring-error-500",
          className
        )}
      />
      
      {error && (
        <p className="text-sm text-error-600 flex items-center gap-1">
          <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {!error && helperText && (
        <p className="text-sm text-secondary-500">{helperText}</p>
      )}
    </div>
  )
})

Input.displayName = "Input"