import { cn, getQueueStatusColor, getAppointmentStatusColor } from '@/lib/utils'

/**
 * Badge Component for displaying status indicators
 * 
 * @param {object} props - Component props
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.variant - Badge variant (default, success, warning, error, info)
 * @param {string} props.size - Badge size (sm, md, lg)
 * @param {React.ReactNode} props.children - Badge content
 * @returns {JSX.Element} Badge component
 */
export function Badge({ 
  className, 
  variant = 'default', 
  size = 'md',
  children, 
  ...props 
}) {
  const variants = {
    default: 'bg-secondary-100 text-secondary-800 border-secondary-200',
    success: 'bg-success-100 text-success-800 border-success-200',
    warning: 'bg-warning-100 text-warning-800 border-warning-200',
    error: 'bg-error-100 text-error-800 border-error-200',
    info: 'bg-primary-100 text-primary-800 border-primary-200',
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base',
  }
  
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

/**
 * QueueStatusBadge Component for queue status display
 * 
 * @param {object} props - Component props
 * @param {string} props.status - Queue status
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} QueueStatusBadge component
 */
export function QueueStatusBadge({ status, className, ...props }) {
  const statusLabels = {
    waiting: 'Waiting',
    called: 'Called',
    serving: 'Being Served',
    completed: 'Completed',
    cancelled: 'Cancelled',
  }
  
  return (
    <Badge
      className={cn(
        getQueueStatusColor(status),
        className
      )}
      {...props}
    >
      {statusLabels[status] || status}
    </Badge>
  )
}

/**
 * AppointmentStatusBadge Component for appointment status display
 * 
 * @param {object} props - Component props
 * @param {string} props.status - Appointment status
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} AppointmentStatusBadge component
 */
export function AppointmentStatusBadge({ status, className, ...props }) {
  const statusLabels = {
    scheduled: 'Scheduled',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    noshow: 'No Show',
  }
  
  return (
    <Badge
      className={cn(
        getAppointmentStatusColor(status),
        className
      )}
      {...props}
    >
      {statusLabels[status] || status}
    </Badge>
  )
}