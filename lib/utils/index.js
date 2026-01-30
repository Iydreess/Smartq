import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines CSS classes using clsx and tailwind-merge for optimal Tailwind CSS class merging
 * @param {...(string | object | Array)} inputs - CSS classes or conditional objects
 * @returns {string} - Merged CSS classes
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a phone number for display (Kenyan format)
 * @param {string} phone - Raw phone number
 * @returns {string} - Formatted phone number
 */
export function formatPhoneNumber(phone) {
  if (!phone) return ''
  
  // Remove all non-digits
  const digitsOnly = phone.replace(/\D/g, '')
  
  let digits = digitsOnly
  
  // Remove leading 0
  if (digits.startsWith('0')) {
    digits = digits.substring(1)
  }
  
  // Remove country code if present
  if (digits.startsWith('254')) {
    digits = digits.substring(3)
  }
  
  // Format as +254 7XX XXX XXX for Kenyan numbers
  if (digits.length === 9 && (digits.startsWith('7') || digits.startsWith('1'))) {
    return `+254 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`
  }
  
  // Return as-is for other formats
  return phone
}

/**
 * Formats a duration in minutes to a human-readable string
 * @param {number} minutes - Duration in minutes
 * @returns {string} - Formatted duration
 */
export function formatDuration(minutes) {
  if (!minutes) return '0 min'
  
  if (minutes < 60) {
    return `${minutes} min`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${remainingMinutes}m`
}

/**
 * Formats a date for display (Kenyan locale)
 * @param {Date | string} date - Date to format
 * @param {object} options - Formatting options
 * @returns {string} - Formatted date
 */
export function formatDate(date, options = {}) {
  if (!date) return ''
  
  const dateObj = new Date(date)
  
  const defaultOptions = {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options
  }
  
  return dateObj.toLocaleDateString('en-KE', defaultOptions)
}

/**
 * Formats a time for display (EAT timezone)
 * @param {Date | string} date - Date/time to format
 * @param {object} options - Formatting options
 * @returns {string} - Formatted time
 */
export function formatTime(date, options = {}) {
  if (!date) return ''
  
  const dateObj = new Date(date)
  
  const defaultOptions = {
    timeZone: 'Africa/Nairobi',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    ...options
  }
  
  return dateObj.toLocaleTimeString('en-KE', defaultOptions)
}

/**
 * Formats a date and time for display
 * @param {Date | string} date - Date/time to format
 * @returns {string} - Formatted date and time
 */
export function formatDateTime(date) {
  if (!date) return ''
  
  return `${formatDate(date)} at ${formatTime(date)}`
}

/**
 * Calculates the time difference from now
 * @param {Date | string} date - Target date
 * @returns {string} - Relative time string
 */
export function getRelativeTime(date) {
  if (!date) return ''
  
  const now = new Date()
  const targetDate = new Date(date)
  const diffInMinutes = Math.floor((targetDate - now) / (1000 * 60))
  
  if (diffInMinutes < 0) {
    const pastMinutes = Math.abs(diffInMinutes)
    if (pastMinutes < 60) {
      return `${pastMinutes} min ago`
    }
    const pastHours = Math.floor(pastMinutes / 60)
    if (pastHours < 24) {
      return `${pastHours}h ago`
    }
    const pastDays = Math.floor(pastHours / 24)
    return `${pastDays}d ago`
  }
  
  if (diffInMinutes < 60) {
    return `in ${diffInMinutes} min`
  }
  
  const hours = Math.floor(diffInMinutes / 60)
  if (hours < 24) {
    return `in ${hours}h`
  }
  
  const days = Math.floor(hours / 24)
  return `in ${days}d`
}

/**
 * Generates a random queue number
 * @returns {number} - Random queue number
 */
export function generateQueueNumber() {
  return Math.floor(Math.random() * 9000) + 1000
}

/**
 * Gets the appropriate color class for queue status
 * @param {string} status - Queue status
 * @returns {string} - Tailwind color class
 */
export function getQueueStatusColor(status) {
  const colors = {
    waiting: 'bg-warning-100 text-warning-800 border-warning-200',
    called: 'bg-primary-100 text-primary-800 border-primary-200',
    serving: 'bg-success-100 text-success-800 border-success-200',
    completed: 'bg-secondary-100 text-secondary-800 border-secondary-200',
    cancelled: 'bg-error-100 text-error-800 border-error-200',
  }
  
  return colors[status] || colors.waiting
}

/**
 * Gets the appropriate color class for appointment status
 * @param {string} status - Appointment status
 * @returns {string} - Tailwind color class
 */
export function getAppointmentStatusColor(status) {
  const colors = {
    scheduled: 'bg-primary-100 text-primary-800 border-primary-200',
    confirmed: 'bg-success-100 text-success-800 border-success-200',
    completed: 'bg-secondary-100 text-secondary-800 border-secondary-200',
    cancelled: 'bg-error-100 text-error-800 border-error-200',
    noshow: 'bg-warning-100 text-warning-800 border-warning-200',
  }
  
  return colors[status] || colors.scheduled
}

/**
 * Debounces a function call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates phone number format (Kenyan format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether phone number is valid
 */
export function isValidPhone(phone) {
  // Kenyan phone number: Must start with 7 or 1, followed by 8 more digits
  // Accepts: 0712345678, 254712345678, +254712345678, 712345678
  const phoneRegex = /^(\+254|254|0)?[71]\d{8}$/
  return phoneRegex.test(phone.replace(/[\s\-]/g, ''))
}

/**
 * Formats currency for Kenyan market
 * @param {number} amount - Amount to format
 * @param {boolean} showDecimals - Whether to show decimal places
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, showDecimals = true) {
  if (amount === null || amount === undefined) return ''
  
  const options = {
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  }
  
  const formatted = new Intl.NumberFormat('en-KE', options).format(amount)
  
  return `KSh ${formatted}`
}