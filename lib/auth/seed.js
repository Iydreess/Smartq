/**
 * Seed demo users for testing
 * This should be called once to populate the demo users
 */

export const seedDemoUsers = () => {
  if (typeof window === 'undefined') return
  
  const demoUsers = [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@smartq.com',
      password: 'admin123',
      role: 'admin',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'business-1',
      name: 'Business Owner',
      email: 'business@smartq.com',
      password: 'business123',
      role: 'business',
      businessName: 'SmartQ Clinic',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'customer-1',
      name: 'John Customer',
      email: 'customer@smartq.com',
      password: 'customer123',
      role: 'customer',
      createdAt: new Date().toISOString(),
    },
  ]
  
  // Only seed if no users exist
  const existingUsers = localStorage.getItem('users')
  if (!existingUsers) {
    localStorage.setItem('users', JSON.stringify(demoUsers))
    console.log('Demo users seeded successfully')
  }
}

/**
 * Clear all users (for testing)
 */
export const clearAllUsers = () => {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('users')
  localStorage.removeItem('currentUser')
  console.log('All users cleared')
}
