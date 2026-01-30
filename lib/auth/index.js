/**
 * Authentication Utilities
 * Handles user authentication, session management, and role-based access
 */

/**
 * Get current user from localStorage
 * @returns {Object|null} Current user object or null
 */
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null
  
  const currentUser = localStorage.getItem('currentUser')
  return currentUser ? JSON.parse(currentUser) : null
}

/**
 * Set current user in localStorage
 * @param {Object} user - User object to store
 */
export const setCurrentUser = (user) => {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('currentUser', JSON.stringify(user))
}

/**
 * Remove current user from localStorage (logout)
 */
export const removeCurrentUser = () => {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('currentUser')
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if user is logged in
 */
export const isAuthenticated = () => {
  return getCurrentUser() !== null
}

/**
 * Check if user has a specific role
 * @param {string} role - Role to check ('admin', 'business', 'customer')
 * @returns {boolean} True if user has the role
 */
export const hasRole = (role) => {
  const user = getCurrentUser()
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
 * Authenticate user with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object|null} User object if authenticated, null otherwise
 */
export const authenticateUser = (email, password) => {
  if (typeof window === 'undefined') return null
  
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  const user = users.find(u => u.email === email && u.password === password)
  
  if (user) {
    // Don't store password in session
    const { password: _, ...userWithoutPassword } = user
    return userWithoutPassword
  }
  
  return null
}

/**
 * Register a new user
 * @param {Object} userData - User data to register
 * @returns {Object} Result object with success status and message
 */
export const registerUser = (userData) => {
  if (typeof window === 'undefined') return { success: false, message: 'Server-side rendering not supported' }
  
  const users = JSON.parse(localStorage.getItem('users') || '[]')
  
  // Check if email already exists
  if (users.some(user => user.email === userData.email)) {
    return { success: false, message: 'Email already registered' }
  }
  
  // Add new user
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    createdAt: new Date().toISOString(),
  }
  
  users.push(newUser)
  localStorage.setItem('users', JSON.stringify(users))
  
  return { success: true, message: 'Registration successful', user: newUser }
}

/**
 * Check if user is authorized for a specific role
 * @param {Array<string>} allowedRoles - Array of allowed roles
 * @returns {boolean} True if user is authorized
 */
export const isAuthorized = (allowedRoles = []) => {
  const user = getCurrentUser()
  
  if (!user) return false
  if (allowedRoles.length === 0) return true
  
  return allowedRoles.includes(user.role)
}

/**
 * Role constants
 */
export const ROLES = {
  ADMIN: 'admin',
  BUSINESS: 'business',
  CUSTOMER: 'customer',
}
