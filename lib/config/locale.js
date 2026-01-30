/**
 * Kenyan Localization Configuration
 * This file contains all region-specific settings for Kenya
 */

export const LOCALE_CONFIG = {
  // Country Information
  country: 'Kenya',
  countryCode: 'KE',
  
  // Currency Settings
  currency: {
    code: 'KES',
    symbol: 'KSh',
    name: 'Kenyan Shilling',
    decimalPlaces: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.'
  },
  
  // Timezone Settings
  timezone: {
    name: 'Africa/Nairobi',
    abbreviation: 'EAT',
    offset: '+03:00',
    utcOffset: 180 // minutes
  },
  
  // Date & Time Formats
  dateFormat: {
    short: 'DD/MM/YYYY',
    long: 'dddd, MMMM D, YYYY',
    time12h: 'h:mm A',
    time24h: 'HH:mm',
    dateTime: 'DD/MM/YYYY h:mm A'
  },
  
  // Phone Number Settings
  phone: {
    countryCode: '+254',
    format: {
      // Kenyan mobile: +254 7XX XXX XXX or +254 1XX XXX XXX
      mobile: /^(\+254|254|0)?([71]\d{8})$/,
      // Display format: +254 712 345 678
      displayFormat: (number) => {
        const cleaned = number.replace(/\D/g, '')
        let digits = cleaned
        
        // Remove leading 0
        if (digits.startsWith('0')) {
          digits = digits.substring(1)
        }
        
        // Remove country code if present
        if (digits.startsWith('254')) {
          digits = digits.substring(3)
        }
        
        // Format as +254 7XX XXX XXX
        if (digits.length === 9 && (digits.startsWith('7') || digits.startsWith('1'))) {
          return `+254 ${digits.substring(0, 3)} ${digits.substring(3, 6)} ${digits.substring(6)}`
        }
        
        return number
      }
    },
    validation: {
      // Kenyan numbers: Must start with 7 or 1, followed by 8 more digits
      // Accepts: 0712345678, 254712345678, +254712345678, 712345678
      regex: /^(\+254|254|0)?[71]\d{8}$/,
      errorMessage: 'Please enter a valid Kenyan phone number (e.g., 0712345678)'
    }
  },
  
  // Language Settings
  language: {
    primary: 'en-KE',
    secondary: ['sw-KE'], // Swahili
    displayNames: {
      'en-KE': 'English (Kenya)',
      'sw-KE': 'Kiswahili'
    }
  },
  
  // Business Hours (Default - Kenyan Business Hours)
  businessHours: {
    weekdays: {
      start: '08:00',
      end: '17:00'
    },
    saturday: {
      start: '09:00',
      end: '13:00'
    },
    sunday: {
      closed: true
    }
  },
  
  // Payment Methods (Popular in Kenya)
  paymentMethods: {
    mobile: ['M-PESA', 'Airtel Money', 'T-Kash'],
    cards: ['Visa', 'Mastercard'],
    bank: ['Bank Transfer', 'KCB', 'Equity Bank', 'Co-operative Bank']
  },
  
  // Common Kenyan Holidays (for appointment scheduling)
  publicHolidays: [
    { date: '01-01', name: 'New Year\'s Day' },
    { date: '04-18', name: 'Good Friday' },
    { date: '04-21', name: 'Easter Monday' },
    { date: '05-01', name: 'Labour Day' },
    { date: '06-01', name: 'Madaraka Day' },
    { date: '10-10', name: 'Huduma Day' },
    { date: '10-20', name: 'Mashujaa Day' },
    { date: '12-12', name: 'Jamhuri Day' },
    { date: '12-25', name: 'Christmas Day' },
    { date: '12-26', name: 'Boxing Day' }
  ],
  
  // Address Format
  addressFormat: {
    fields: ['street', 'building', 'city', 'county', 'postalCode'],
    displayFormat: '{building}, {street}\n{city}, {county}\n{postalCode}'
  }
}

/**
 * Format currency for Kenyan market
 * @param {number} amount - Amount to format
 * @param {boolean} showSymbol - Whether to show currency symbol
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(amount, showSymbol = true) {
  if (amount === null || amount === undefined) return ''
  
  const formatted = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: LOCALE_CONFIG.currency.code,
    minimumFractionDigits: LOCALE_CONFIG.currency.decimalPlaces,
    maximumFractionDigits: LOCALE_CONFIG.currency.decimalPlaces
  }).format(amount)
  
  // Replace KES with KSh for better local recognition
  return formatted.replace('KES', LOCALE_CONFIG.currency.symbol)
}

/**
 * Format phone number for Kenyan format
 * @param {string} phone - Raw phone number
 * @returns {string} - Formatted phone number
 */
export function formatKenyanPhone(phone) {
  if (!phone) return ''
  
  return LOCALE_CONFIG.phone.format.displayFormat(phone)
}

/**
 * Validate Kenyan phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - Whether phone number is valid
 */
export function isValidKenyanPhone(phone) {
  if (!phone) return false
  return LOCALE_CONFIG.phone.validation.regex.test(phone)
}

/**
 * Get current Kenyan time
 * @returns {Date} - Current time in EAT timezone
 */
export function getKenyanTime() {
  return new Date(new Date().toLocaleString('en-US', { 
    timeZone: LOCALE_CONFIG.timezone.name 
  }))
}

/**
 * Format date for Kenyan locale
 * @param {Date | string} date - Date to format
 * @param {string} format - Format type ('short', 'long', 'time', 'dateTime')
 * @returns {string} - Formatted date
 */
export function formatKenyanDate(date, format = 'short') {
  if (!date) return ''
  
  const dateObj = new Date(date)
  
  const options = {
    timeZone: LOCALE_CONFIG.timezone.name
  }
  
  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString('en-KE', { 
        ...options,
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    
    case 'long':
      return dateObj.toLocaleDateString('en-KE', {
        ...options,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    
    case 'time':
      return dateObj.toLocaleTimeString('en-KE', {
        ...options,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    
    case 'dateTime':
      return `${formatKenyanDate(date, 'short')} ${formatKenyanDate(date, 'time')}`
    
    default:
      return dateObj.toLocaleDateString('en-KE', options)
  }
}
