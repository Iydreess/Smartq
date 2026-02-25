/**
 * Supabase Database Query Functions
 * Helper functions for common database operations
 */

import { supabase } from './client'

// ============================================================================
// PROFILE OPERATIONS
// ============================================================================

/**
 * Get user profile by ID
 */
export async function getProfile(userId) {
  console.log('[getProfile] Fetching profile for user:', userId)
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  console.log('[getProfile] Query result:', { hasData: !!data, hasError: !!error })

  if (error) {
    // If profile doesn't exist, return null instead of throwing
    if (error.code === 'PGRST116') {
      console.log('[getProfile] Profile not found (PGRST116)')
      return null
    }
    console.error('[getProfile] Error:', error)
    throw error
  }
  
  console.log('[getProfile] Profile found:', data)
  return data
}

/**
 * Create or get user profile
 */
export async function ensureProfile(userId, email) {
  try {
    console.log('[ensureProfile] Starting for user:', userId)
    
    // First try to get existing profile
    let profile = await getProfile(userId)
    console.log('[ensureProfile] Initial profile fetch result:', profile)
    
    // If profile doesn't exist, create it
    if (!profile) {
      console.log('[ensureProfile] Profile not found, creating...')
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: email,
          full_name: email?.split('@')[0] || 'User',
          role: 'customer',
        })
        .select()
        .single()
      
      if (error) {
        console.error('[ensureProfile] Insert error:', error)
        // If insert fails due to duplicate (race condition), try to get again
        if (error.code === '23505') {
          console.log('[ensureProfile] Duplicate key, retrying fetch...')
          profile = await getProfile(userId)
          if (profile) {
            console.log('[ensureProfile] Profile found on retry:', profile)
            return profile
          }
        }
        
        console.warn('[ensureProfile] Returning default profile due to error')
        // Return default profile if creation fails
        return {
          id: userId,
          email: email,
          full_name: email?.split('@')[0] || 'User',
          role: 'customer',
        }
      }
      profile = data
      console.log('[ensureProfile] Profile created:', profile)
    }
    
    return profile
  } catch (error) {
    // Handle any errors gracefully
    console.error('[ensureProfile] Exception:', error)
    return {
      id: userId,
      email: email,
      full_name: email?.split('@')[0] || 'User',
      role: 'customer',
    }
  }
}

/**
 * Update user profile
 */
export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// BUSINESS OPERATIONS
// ============================================================================

/**
 * Get all active businesses
 */
export async function getBusinesses() {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Get business by ID
 */
export async function getBusiness(businessId) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', businessId)
    .single()

  if (error) throw error
  return data
}

/**
 * Get businesses owned by a user
 */
export async function getBusinessesByOwner(ownerId) {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Create a new business
 */
export async function createBusiness(businessData) {
  const { data, error } = await supabase
    .from('businesses')
    .insert(businessData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update business
 */
export async function updateBusiness(businessId, updates) {
  const { data, error } = await supabase
    .from('businesses')
    .update(updates)
    .eq('id', businessId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// SERVICE OPERATIONS
// ============================================================================

/**
 * Get services for a business
 */
export async function getServices(businessId) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .order('name')

  if (error) throw error
  return data
}

/**
 * Get all active services (for public booking)
 */
export async function getAllServices() {
  const { data, error } = await supabase
    .from('services')
    .select(`
      *,
      business:businesses(id, name, category, address, phone)
    `)
    .eq('is_active', true)
    .order('name')

  if (error) throw error
  return data
}

/**
 * Get service by ID
 */
export async function getService(serviceId) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', serviceId)
    .single()

  if (error) throw error
  return data
}

/**
 * Create a new service
 */
export async function createService(serviceData) {
  const { data, error } = await supabase
    .from('services')
    .insert(serviceData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update service
 */
export async function updateService(serviceId, updates) {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', serviceId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Delete service (soft delete)
 */
export async function deleteService(serviceId) {
  const { data, error } = await supabase
    .from('services')
    .update({ is_active: false })
    .eq('id', serviceId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// QUEUE OPERATIONS
// ============================================================================

/**
 * Get queues for a business
 */
export async function getQueues(businessId) {
  const { data, error } = await supabase
    .from('queues')
    .select('*, service:services(*)')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Get queue by ID with entries
 */
export async function getQueue(queueId) {
  const { data, error } = await supabase
    .from('queues')
    .select(`
      *,
      service:services(*),
      entries:queue_entries(*, customer:profiles(*))
    `)
    .eq('id', queueId)
    .single()

  if (error) throw error
  return data
}

/**
 * Create a new queue
 */
export async function createQueue(queueData) {
  const { data, error } = await supabase
    .from('queues')
    .insert(queueData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update queue
 */
export async function updateQueue(queueId, updates) {
  const { data, error } = await supabase
    .from('queues')
    .update(updates)
    .eq('id', queueId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get all active queues (for public joining)
 */
export async function getAllActiveQueues() {
  const { data, error } = await supabase
    .from('queues')
    .select(`
      *,
      service:services(*),
      business:businesses(id, name, category, address, phone)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) throw error
  
  // For each queue, get the count of active entries
  const queuesWithCounts = await Promise.all(
    (data || []).map(async (queue) => {
      const { count } = await supabase
        .from('queue_entries')
        .select('*', { count: 'exact', head: true })
        .eq('queue_id', queue.id)
        .in('status', ['waiting', 'called', 'serving'])
      
      return {
        ...queue,
        peopleInQueue: count || 0
      }
    })
  )
  
  return queuesWithCounts
}

// ============================================================================
// QUEUE ENTRY OPERATIONS
// ============================================================================

/**
 * Join a queue
 */
export async function joinQueue(queueId, customerId, notes = null) {
  // Get current max position
  const { data: maxPos } = await supabase
    .from('queue_entries')
    .select('position')
    .eq('queue_id', queueId)
    .order('position', { ascending: false })
    .limit(1)
    .single()

  const position = (maxPos?.position || 0) + 1

  const { data, error } = await supabase
    .from('queue_entries')
    .insert({
      queue_id: queueId,
      customer_id: customerId,
      position,
      notes,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get queue entries for a queue
 */
export async function getQueueEntries(queueId) {
  const { data, error } = await supabase
    .from('queue_entries')
    .select('*, customer:profiles(*)')
    .eq('queue_id', queueId)
    .in('status', ['waiting', 'called', 'serving'])
    .order('position')

  if (error) throw error
  return data
}

/**
 * Get customer's queue entries
 */
export async function getCustomerQueueEntries(customerId) {
  const { data, error } = await supabase
    .from('queue_entries')
    .select('*, queue:queues(*, business:businesses(*))')
    .eq('customer_id', customerId)
    .in('status', ['waiting', 'called', 'serving'])
    .order('joined_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Get queue entry by ID (for status checking)
 */
export async function getQueueEntryById(entryId) {
  const { data, error } = await supabase
    .from('queue_entries')
    .select(`
      *,
      queue:queues(*, business:businesses(*), service:services(*)),
      customer:profiles(full_name, phone)
    `)
    .eq('id', entryId)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Entry not found
    }
    throw error
  }
  return data
}

/**
 * Get queue entries by phone number (for guest lookup)
 */
export async function getQueueEntriesByPhone(phoneNumber) {
  const { data, error } = await supabase
    .from('queue_entries')
    .select(`
      *,
      queue:queues(*, business:businesses(*), service:services(*)),
      customer:profiles(full_name, phone, email)
    `)
    .eq('customer.phone', phoneNumber)
    .in('status', ['waiting', 'called', 'serving'])
    .order('joined_at', { ascending: false })

  if (error) throw error
  return data || []
}

/**
 * Update queue entry status
 */
export async function updateQueueEntry(entryId, updates) {
  const { data, error } = await supabase
    .from('queue_entries')
    .update(updates)
    .eq('id', entryId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// APPOINTMENT OPERATIONS
// ============================================================================

/**
 * Get appointments for a business
 */
export async function getBusinessAppointments(businessId, filters = {}) {
  let query = supabase
    .from('appointments')
    .select(`
      *,
      customer:profiles(*),
      service:services(*),
      staff:staff(*)
    `)
    .eq('business_id', businessId)

  if (filters.date) {
    query = query.eq('appointment_date', filters.date)
  }
  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  query = query.order('appointment_date', { ascending: true })
    .order('start_time', { ascending: true })

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Get customer appointments
 */
export async function getCustomerAppointments(customerId, filters = {}) {
  let query = supabase
    .from('appointments')
    .select(`
      *,
      business:businesses(*),
      service:services(*),
      staff:staff(*)
    `)
    .eq('customer_id', customerId)

  if (filters.upcoming) {
    query = query.gte('appointment_date', new Date().toISOString().split('T')[0])
  }
  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  query = query.order('appointment_date', { ascending: true })
    .order('start_time', { ascending: true })

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Create appointment
 */
export async function createAppointment(appointmentData) {
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointmentData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update appointment
 */
export async function updateAppointment(appointmentId, updates) {
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', appointmentId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Cancel appointment
 */
export async function cancelAppointment(appointmentId, reason) {
  const { data, error } = await supabase
    .from('appointments')
    .update({
      status: 'cancelled',
      cancellation_reason: reason,
    })
    .eq('id', appointmentId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// NOTIFICATION OPERATIONS
// ============================================================================

/**
 * Get user notifications
 */
export async function getNotifications(userId, unreadOnly = false) {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)

  if (unreadOnly) {
    query = query.eq('read', false)
  }

  query = query.order('created_at', { ascending: false }).limit(50)

  const { data, error } = await query

  if (error) throw error
  return data
}

/**
 * Create notification
 */
export async function createNotification(notificationData) {
  const { data, error } = await supabase
    .from('notifications')
    .insert(notificationData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Mark notification as read
 */
export async function markNotificationRead(notificationId) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsRead(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) throw error
  return data
}

// ============================================================================
// STAFF OPERATIONS
// ============================================================================

/**
 * Get staff members for a business
 */
export async function getStaff(businessId) {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('business_id', businessId)
    .eq('is_active', true)
    .order('name')

  if (error) throw error
  return data
}

/**
 * Create staff member
 */
export async function createStaff(staffData) {
  const { data, error } = await supabase
    .from('staff')
    .insert(staffData)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Update staff member
 */
export async function updateStaff(staffId, updates) {
  const { data, error } = await supabase
    .from('staff')
    .update(updates)
    .eq('id', staffId)
    .select()
    .single()

  if (error) throw error
  return data
}

// ============================================================================
// ANALYTICS OPERATIONS
// ============================================================================

/**
 * Track analytics event
 */
export async function trackEvent(businessId, eventType, eventData = {}) {
  const { data, error } = await supabase
    .from('analytics_events')
    .insert({
      business_id: businessId,
      event_type: eventType,
      event_data: eventData,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get analytics events for a business
 */
export async function getAnalyticsEvents(businessId, filters = {}) {
  let query = supabase
    .from('analytics_events')
    .select('*')
    .eq('business_id', businessId)

  if (filters.eventType) {
    query = query.eq('event_type', filters.eventType)
  }
  if (filters.startDate) {
    query = query.gte('created_at', filters.startDate)
  }
  if (filters.endDate) {
    query = query.lte('created_at', filters.endDate)
  }

  query = query.order('created_at', { ascending: false })

  const { data, error } = await query

  if (error) throw error
  return data
}
