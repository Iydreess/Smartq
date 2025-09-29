'use client'

import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'

/**
 * Modal Component
 * 
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {function} props.onClose - Function to close modal
 * @param {string} props.title - Modal title
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size (sm, md, lg, xl, full)
 * @param {boolean} props.closeOnOverlayClick - Whether to close on overlay click
 * @param {boolean} props.showCloseButton - Whether to show close button
 * @returns {JSX.Element} Modal component
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
  ...props
}) {
  const modalRef = useRef(null)
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])
  
  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus()
    }
  }, [isOpen])
  
  if (!isOpen) return null
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full mx-4',
  }
  
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal */}
      <div className="relative z-50 flex items-center justify-center w-full p-4">
        <div
          ref={modalRef}
          tabIndex={-1}
          className={cn(
            "relative w-full bg-white rounded-2xl shadow-strong animate-fade-in",
            sizeClasses[size],
            className
          )}
          {...props}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 pb-4 border-b border-secondary-200">
              {title && (
                <h2 className="text-xl font-semibold text-secondary-900">
                  {title}
                </h2>
              )}
              
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="rounded-lg p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 transition-colors"
                  aria-label="Close modal"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className={cn(
            "p-6",
            (title || showCloseButton) && "pt-4"
          )}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * ModalFooter Component
 * 
 * @param {object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {React.ReactNode} props.children - Footer content
 * @returns {JSX.Element} ModalFooter component
 */
export function ModalFooter({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 p-6 pt-4 border-t border-secondary-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}