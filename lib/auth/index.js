/**
 * Authentication Utilities
 * Handles user authentication, session management, and role-based access with Supabase
 */

import { supabase } from '../supabase/client'
import { getProfile } from '../supabase/queries'

/**
 * Get current user from Supabase session
 * @returns {Promise<Object|null>} Current user object with profile or null
 */
export const getCurrentUser = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error || !session) {
      console.log('[getCurrentUser] No session found')
      return null
    }
    
    console.log('[getCurrentUser] Session found for user:', session.user.id)
    
    // Get user profile
    try {
      const profile = await getProfile(session.user.id)
      console.log('[getCurrentUser] Profile loaded:', profile)
      
      return {
        id: session.user.id,
        email: session.user.email,
        ...profile,
      }
    } catch (profileError) {
      console.warn('[getCurrentUser] Profile not found, using basic user data:', profileError.message)
      // Return basic user data if profile doesn't exist yet
      return {
        id: session.user.id,
        email: session.user.email,
        role: 'customer', // Default role
        full_name: session.user.email?.split('@')[0] || 'User',
      }
    }
  } catch (error) {
    console.error('[getCurrentUser] Error getting current user:', error)
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
 * Sign in user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object>} Result object with success status, message, and user
 */
export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { 
        success: false, 
        message: error.message,
        user: null 
      }
    }

    // Get user profile
    const profile = await getProfile(data.user.id)

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        ...profile,
      },
    }
  } catch (error) {
    console.error('Sign in error:', error)
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
    const { email, password, full_name, role = 'customer', ...profileData } = userData

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          full_name,
          role,
        },
      },
    })

    if (error) {
      // Handle rate limit error specifically
      if (error.message.includes('rate limit')) {
        return {
          success: false,
          message: 'Email rate limit exceeded. Please disable email confirmation in Supabase settings for development, or try again later.',
          user: null,
        }
      }
      
      return {
        success: false,
        message: error.message,
        user: null,
      }
    }

    // Profile is automatically created by the database trigger
    // If there's additional profile data, update it
    if (Object.keys(profileData).length > 0 && data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', data.user.id)

      if (profileError) {
        console.error('Error updating profile:', profileError)
      }
    }

    return {
      success: true,
      message: 'Registration successful. Please check your email to confirm your account.',
      user: data.user,
    }
  } catch (error) {
    console.error('Sign up error:', error)
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
        const profile = await getProfile(session.user.id)
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
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: true,
      message: 'Password reset email sent. Please check your inbox.',
    }
  } catch (error) {
    console.error('Reset password error:', error)
    return {
      success: false,
      message: error.message || 'An error occurred',
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
