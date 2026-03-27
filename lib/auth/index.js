/**
 * Authentication Utilities
 * Handles user authentication, session management, and role-based access with Supabase
 */

import { supabase } from '../supabase/client'
import { getProfile, ensureProfile } from '../supabase/queries'

/**
 * Get current user from Supabase session
 * Optimized to use metadata for instant access
 * @returns {Promise<Object|null>} Current user object with profile or null
 */
export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      return null
    }
    
    // Use metadata for instant profile access (no database query)
    return {
      id: session.user.id,
      email: session.user.email,
      full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
      role: session.user.user_metadata?.role || 'customer',
      phone: session.user.user_metadata?.phone,
      avatar_url: session.user.user_metadata?.avatar_url,
    }
  } catch (error) {
    return null
  }
}



/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if user is logged in
 */
export const isAuthenticated = async () => {
  const user = await getCurrentUser()
  return user !== null
}

/**
 * Check if user has a specific role
 * @param {string} role - Role to check ('admin', 'business', 'customer')
 * @returns {Promise<boolean>} True if user has the role
 */
export const hasRole = async (role) => {
  const user = await getCurrentUser()
  return user && user.role === role
}

/**
 * Get redirect path based on user role
 * @param {string} role - User role
 * @returns {string} Redirect path
 */
export const getRoleDashboard = (role) => {
  const dashboards = {
    admin: '/admin',
    business: '/dashboard',
    customer: '/customer',
  }
  
  return dashboards[role] || '/customer'
}

/**
 * Retry wrapper for authentication operations
 * @param {Function} fn - Async function to retry
 * @param {number} retries - Number of retries (default: 2)
 * @param {number} delay - Delay between retries in ms (default: 1000)
 * @returns {Promise} Result of the function
 */
const withRetry = async (fn, retries = 2, delay = 1000) => {
  let lastError
  
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      console.log(`[withRetry] Attempt ${i + 1} failed:`, error.message)
      
      if (i < retries) {
        console.log(`[withRetry] Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}

/**
 * Sign in user with email and password
 * Optimized for fast authentication using metadata
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Result object with success status, message, and user
 */
export const signIn = async (email, password) => {
  try {
    const normalizedEmail = (email || '').trim().toLowerCase()

    // Authenticate with Supabase (fast, single request)
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    })

    if (error) {
      const message = (error.message || '').toLowerCase()

      if (message.includes('email not confirmed') || message.includes('not confirmed')) {
        return {
          success: false,
          requiresEmailConfirmation: true,
          message: 'Please verify your email first. Check your inbox for the confirmation link.',
          user: null,
        }
      }

      if (message.includes('invalid login credentials') || message.includes('invalid email or password')) {
        return {
          success: false,
          message: 'Invalid email or password',
          user: null,
        }
      }

      return { 
        success: false, 
        message: error.message || 'Sign in failed',
        user: null 
      }
    }

    if (!data.user) {
      return {
        success: false,
        message: 'Authentication failed',
        user: null
      }
    }

    // Use metadata for instant profile access (no database query needed)
    const profile = {
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
      role: data.user.user_metadata?.role || 'customer',
      phone: data.user.user_metadata?.phone,
      avatar_url: data.user.user_metadata?.avatar_url,
    }

    return {
      success: true,
      message: 'Login successful',
      user: profile,
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'An error occurred during sign in',
      user: null,
    }
  }
}

/**
 * Register a new user
 * @param {Object} userData - User data to register
 * @param {string} userData.email - User email
 * @param {string} userData.password - User password
 * @param {string} userData.full_name - User full name
 * @param {string} userData.role - User role ('admin', 'business', 'customer')
 * @returns {Promise<Object>} Result object with success status and message
 */
export const signUp = async (userData) => {
  try {
    const { email, password, full_name, role = 'customer', phone } = userData
    const normalizedEmail = (email || '').trim().toLowerCase()
    const normalizedName = (full_name || '').trim()

    // Get the origin for email redirects
    const origin = typeof window !== 'undefined' ? window.location.origin : ''

    // Sign up with Supabase Auth (fast, single request)
    // Metadata is stored instantly, no separate profile query needed
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: `${origin}/login`,
        data: {
          full_name: normalizedName,
          role,
          phone,
        },
      },
    })

    if (error) {
      const errorMessage = (error.message || '').toLowerCase()

      // Handle specific errors
      if (errorMessage.includes('rate limit')) {
        return {
          success: false,
          message: 'Email rate limit exceeded. Please wait a few minutes and try again.',
          user: null,
        }
      }
      
      if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
        const { error: resendError } = await supabase.auth.resend({
          type: 'signup',
          email: normalizedEmail,
          options: {
            emailRedirectTo: `${origin}/login`,
          },
        })

        if (resendError) {
          return {
            success: false,
            message: 'An account with this email already exists. Please sign in instead.',
            user: null,
          }
        }

        return {
          success: false,
          message: 'An account with this email already exists. We sent a new verification email if the account is not yet confirmed.',
          user: null,
        }
      }
      
      return {
        success: false,
        message: error.message,
        user: null,
      }
    }

    // Supabase may return a user with no identities for existing accounts when
    // email confirmation is enabled and duplicate signups are obfuscated.
    if (data?.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: normalizedEmail,
        options: {
          emailRedirectTo: `${origin}/login`,
        },
      })

      return {
        success: false,
        message: resendError
          ? 'An account with this email already exists. Please sign in instead.'
          : 'This email is already registered. We sent a verification email if confirmation is still pending.',
        user: null,
      }
    }

    // Profile is automatically created by database trigger
    // Check if email confirmation is needed
    const isConfirmed = data.user?.confirmed_at || data.session

    return {
      success: true,
      message: isConfirmed 
        ? 'Account created successfully! You can now sign in.'
        : 'Account created! Please check your email inbox to verify your account.',
      user: data.user,
      needsConfirmation: !isConfirmed,
    }
  } catch (error) {
    return {
      success: false,
      message: error.message || 'An error occurred during registration',
      user: null,
    }
  }
}

/**
 * Sign out current user
 * @returns {Promise<Object>} Result object with success status
 */
export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: true,
      message: 'Signed out successfully',
    }
  } catch (error) {
    console.error('Sign out error:', error)
    return {
      success: false,
      message: error.message || 'An error occurred during sign out',
    }
  }
}

/**
 * Check if user is authorized for a specific role
 * @param {Array<string>} allowedRoles - Array of allowed roles
 * @returns {Promise<boolean>} True if user is authorized
 */
export const isAuthorized = async (allowedRoles = []) => {
  const user = await getCurrentUser()
  
  if (!user) return false
  if (allowedRoles.length === 0) return true
  
  return allowedRoles.includes(user.role)
}

/**
 * Listen to auth state changes
 * @param {Function} callback - Callback function to handle auth state changes
 * @returns {Object} Subscription object with unsubscribe method
 */
export const onAuthStateChange = (callback) => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session?.user) {
        const profile = await ensureProfile(session.user.id, session.user.email)
        callback(event, {
          id: session.user.id,
          email: session.user.email,
          ...profile,
        })
      } else {
        callback(event, null)
      }
    }
  )
  
  return subscription
}

/**
 * Reset password request
 * @param {string} email - User email
 * @returns {Promise<Object>} Result object with success status
 */
export const resetPassword = async (email) => {
  try {
    console.log('[resetPassword] Requesting password reset for:', email)
    
    // Get the origin safely (could be undefined on server)
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const redirectUrl = `${origin}/reset-password`
    
    console.log('[resetPassword] Redirect URL:', redirectUrl)
    
    // Request password reset email with redirect to reset password page
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })

    if (error) {
      console.error('[resetPassword] Error:', error)
      
      // Handle rate limit error specifically
      if (error.message?.includes('security purposes') || error.message?.includes('seconds') || error.message?.includes('rate limit')) {
        return {
          success: false,
          message: 'Please wait a moment before requesting another reset email. For security, there is a short delay between requests.',
        }
      }
      
      return {
        success: false,
        message: error.message,
      }
    }

    console.log('[resetPassword] Reset email sent successfully')

    return {
      success: true,
      message: 'Password reset email sent! Please check your inbox and spam folder.',
    }
  } catch (error) {
    console.error('[resetPassword] Exception:', error)
    return {
      success: false,
      message: error.message || 'Failed to send reset email. Please try again.',
    }
  }
}

/**
 * Update password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Result object with success status
 */
export const updatePassword = async (newPassword) => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: true,
      message: 'Password updated successfully',
    }
  } catch (error) {
    console.error('Update password error:', error)
    return {
      success: false,
      message: error.message || 'An error occurred',
    }
  }
}

/**
 * Role constants
 */
export const ROLES = {
  ADMIN: 'admin',
  BUSINESS: 'business',
  CUSTOMER: 'customer',
}

// Legacy compatibility (deprecated - use new functions)
// These are kept for backward compatibility but will be removed in future versions
export const authenticateUser = signIn
export const registerUser = signUp
export const setCurrentUser = () => console.warn('setCurrentUser is deprecated with Supabase')
export const removeCurrentUser = signOut
