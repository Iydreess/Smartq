/**
 * Seed demo users and data for Supabase
 * This should be used for development/testing only
 */

import { supabase } from '../supabase/client'
import { signUp } from './index'

/**
 * Seed demo users for testing
 * Note: In production, use Supabase dashboard or proper migration scripts
 */
export const seedDemoUsers = async () => {
  try {
    console.log('Starting to seed demo users...')
    
    const demoUsers = [
      {
        email: 'admin@smartq.com',
        password: 'admin123',
        full_name: 'Admin User',
        role: 'admin',
      },
      {
        email: 'business@smartq.com',
        password: 'business123',
        full_name: 'Business Owner',
        role: 'business',
      },
      {
        email: 'customer@smartq.com',
        password: 'customer123',
        full_name: 'John Customer',
        role: 'customer',
      },
    ]
    
    const results = []
    
    for (const user of demoUsers) {
      const result = await signUp(user)
      results.push(result)
      
      if (result.success) {
        console.log(`✓ Created user: ${user.email}`)
      } else {
        console.log(`✗ Failed to create ${user.email}: ${result.message}`)
      }
    }
    
    return {
      success: true,
      message: 'Demo users seeding completed',
      results,
    }
  } catch (error) {
    console.error('Error seeding demo users:', error)
    return {
      success: false,
      message: error.message || 'Failed to seed demo users',
    }
  }
}

/**
 * Seed demo business and services
 * Should be called after users are created
 */
export const seedDemoData = async () => {
  try {
    console.log('Starting to seed demo business data...')
    
    // Get the business user
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) throw usersError
    
    const businessUser = users.find(u => u.email === 'business@smartq.com')
    
    if (!businessUser) {
      return {
        success: false,
        message: 'Business user not found. Please seed users first.',
      }
    }
    
    // Create demo business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .insert({
        owner_id: businessUser.id,
        name: 'SmartQ Dental Clinic',
        description: 'Professional dental services with advanced technology',
        category: 'healthcare',
        address: '123 Health Street, Medical District',
        phone: '+1-555-0123',
        email: 'info@smartqdental.com',
        operating_hours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: { open: '10:00', close: '14:00' },
          sunday: { open: null, close: null },
        },
      })
      .select()
      .single()
    
    if (businessError) throw businessError
    
    console.log('✓ Created demo business')
    
    // Create demo services
    const services = [
      {
        business_id: business.id,
        name: 'General Checkup',
        description: 'Regular dental checkup and cleaning',
        duration: 30,
        price: 75.00,
        category: 'general',
      },
      {
        business_id: business.id,
        name: 'Teeth Whitening',
        description: 'Professional teeth whitening treatment',
        duration: 60,
        price: 250.00,
        category: 'cosmetic',
      },
      {
        business_id: business.id,
        name: 'Root Canal',
        description: 'Root canal treatment',
        duration: 90,
        price: 800.00,
        category: 'treatment',
      },
    ]
    
    const { error: servicesError } = await supabase
      .from('services')
      .insert(services)
    
    if (servicesError) throw servicesError
    
    console.log('✓ Created demo services')
    
    return {
      success: true,
      message: 'Demo data seeded successfully',
    }
  } catch (error) {
    console.error('Error seeding demo data:', error)
    return {
      success: false,
      message: error.message || 'Failed to seed demo data',
    }
  }
}

/**
 * Clear all demo data (for testing)
 * WARNING: This will delete all data from the database
 */
export const clearAllData = async () => {
  try {
    console.warn('WARNING: Clearing all data...')
    
    // Note: In production, this should be done through proper migration rollback
    // This is for development/testing only
    
    const tables = [
      'analytics_events',
      'notifications',
      'appointments',
      'queue_entries',
      'queues',
      'staff',
      'services',
      'businesses',
      // profiles are handled by auth.users cascade
    ]
    
    for (const table of tables) {
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
      
      if (error) {
        console.error(`Error clearing ${table}:`, error)
      } else {
        console.log(`✓ Cleared ${table}`)
      }
    }
    
    return {
      success: true,
      message: 'All data cleared successfully',
    }
  } catch (error) {
    console.error('Error clearing data:', error)
    return {
      success: false,
      message: error.message || 'Failed to clear data',
    }
  }
}
