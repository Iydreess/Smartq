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

/**
 * Delete a profile by ID (admin usage)
 * Note: This removes only from public.profiles. Auth user deletion requires
 * service-role/admin API and is intentionally not attempted on client.
 */
export async function deleteProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)
    .select('id')

  if (error) throw error
  return {
    deletedCount: Array.isArray(data) ? data.length : 0,
    deletedIds: Array.isArray(data) ? data.map((row) => row.id) : [],
  }
}

/**
 * Delete multiple profiles by IDs (admin usage)
 */
export async function deleteProfiles(userIds = []) {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return { deletedCount: 0, deletedIds: [] }
  }

  const uniqueIds = [...new Set(userIds.filter(Boolean))]

  const { data, error } = await supabase
    .from('profiles')
    .delete()
    .in('id', uniqueIds)
    .select('id')

  if (error) throw error

  return {
    deletedCount: Array.isArray(data) ? data.length : 0,
    deletedIds: Array.isArray(data) ? data.map((row) => row.id) : [],
  }
}

/**
 * Get all profiles (admin usage)
 */
export async function getAllProfiles() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Get global system settings (admin usage)
 */
export async function getSystemSettings() {
  const { data, error } = await supabase
    .from('app_settings')
    .select('settings')
    .eq('key', 'global')
    .maybeSingle()

  if (error) throw error
  return data?.settings || null
}

/**
 * Upsert global system settings (admin usage)
 */
export async function upsertSystemSettings(settings, updatedBy = null) {
  const { data, error } = await supabase
    .from('app_settings')
    .upsert(
      {
        key: 'global',
        settings,
        updated_by: updatedBy,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'key' }
    )
    .select('settings')
    .single()

  if (error) throw error
  return data?.settings || null
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
 * Get all businesses including inactive (admin usage)
 */
export async function getAllBusinesses() {
  const { data, error } = await supabase
    .from('businesses')
    .select('*')
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
export async function getServices(businessId, options = {}) {
  let query = supabase
    .from('services')
    .select('*')
    .eq('business_id', businessId)

  if (!options.includeInactive) {
    query = query.eq('is_active', true)
  }

  query = query.order('name')

  const { data, error } = await query

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

/**
 * Get active queues scoped to a specific service
 */
export async function getActiveQueuesByService(serviceId, businessId = null) {
  if (!serviceId) return []

  let query = supabase
    .from('queues')
    .select(`
      *,
      service:services(*),
      business:businesses(id, name, category, address, phone)
    `)
    .eq('status', 'active')
    .eq('service_id', serviceId)
    .order('created_at', { ascending: false })

  if (businessId) {
    query = query.eq('business_id', businessId)
  }

  const { data, error } = await query

  if (error) throw error

  const queuesWithCounts = await Promise.all(
    (data || []).map(async (queue) => {
      const { count } = await supabase
        .from('queue_entries')
        .select('*', { count: 'exact', head: true })
        .eq('queue_id', queue.id)
        .in('status', ['waiting', 'called', 'serving'])

      return {
        ...queue,
        peopleInQueue: count || 0,
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
  const { data: existingEntry, error: existingError } = await supabase
    .from('queue_entries')
    .select('id, status, position')
    .eq('queue_id', queueId)
    .eq('customer_id', customerId)
    .in('status', ['waiting', 'called', 'serving', 'snoozed'])
    .maybeSingle()

  if (existingError) throw existingError

  if (existingEntry) {
    throw new Error('You are already in this queue.')
  }

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
    .in('status', ['waiting', 'called', 'serving', 'snoozed'])
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
    .select('*, queue:queues(*, business:businesses(*), service:services(*))')
    .eq('customer_id', customerId)
    .in('status', ['waiting', 'called', 'serving', 'snoozed'])
    .order('joined_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Leave queue as a customer
 */
export async function leaveQueueEntry(entryId, reason = 'Left queue by customer') {
  const { data: entry, error: entryError } = await supabase
    .from('queue_entries')
    .select('id, status, notes')
    .eq('id', entryId)
    .maybeSingle()

  if (entryError) throw entryError
  if (!entry) {
    throw new Error('Queue entry not found or you do not have permission to update it.')
  }

  if (['completed', 'cancelled', 'no-show'].includes(entry.status)) {
    throw new Error('This queue entry can no longer be changed.')
  }

  const mergedNotes = entry.notes
    ? `${entry.notes}\n${reason}`
    : reason

  const { data, error } = await supabase
    .from('queue_entries')
    .update({
      status: 'cancelled',
      notes: mergedNotes,
    })
    .eq('id', entryId)
    .select('id, status')
    .maybeSingle()

  if (error) {
    const message = String(error?.message || '').toLowerCase()
    if (message.includes('cannot coerce the result to a single json object')) {
      throw new Error('Unable to leave queue right now. Please refresh and try again.')
    }

    throw error
  }

  if (!data) {
    throw new Error('Leave queue was blocked by permissions. Run supabase/fix-customer-queue-entry-update-policy.sql and try again.')
  }

  return data
}

/**
 * Step away from queue for a temporary snooze period
 */
export async function snoozeQueueEntry(entryId, snoozeMinutes = 10) {
  const now = new Date()
  const snoozeUntil = new Date(now.getTime() + snoozeMinutes * 60 * 1000)

  const { data: currentEntry, error: fetchError } = await supabase
    .from('queue_entries')
    .select('id, position, status, snooze_count, original_position')
    .eq('id', entryId)
    .maybeSingle()

  if (fetchError) throw fetchError
  if (!currentEntry) {
    throw new Error('Queue entry not found or you do not have permission to update it.')
  }

  if (currentEntry.status === 'snoozed') {
    throw new Error('Step Away mode is already active for this queue entry.')
  }

  if (!['waiting', 'called'].includes(currentEntry.status)) {
    throw new Error('Only waiting or called entries can use Step Away mode.')
  }

  const { data, error } = await supabase
    .from('queue_entries')
    .update({
      status: 'snoozed',
      snoozed_at: now.toISOString(),
      snooze_until: snoozeUntil.toISOString(),
      snooze_count: (currentEntry.snooze_count || 0) + 1,
      original_position: currentEntry.original_position || currentEntry.position,
    })
    .eq('id', entryId)
    .select('*, queue:queues(*, business:businesses(*), service:services(*))')
    .maybeSingle()

  if (error) {
    const message = String(error?.message || '').toLowerCase()
    if (
      message.includes('queue_entries_status_check') ||
      message.includes('status') && message.includes('violat')
    ) {
      throw new Error('Step Away mode is not enabled in your database yet. Run supabase/add-queue-snooze-mode.sql and try again.')
    }

    if (
      message.includes('column') && (
        message.includes('snooze_until') ||
        message.includes('snoozed_at') ||
        message.includes('snooze_count') ||
        message.includes('original_position')
      )
    ) {
      throw new Error('Step Away mode requires queue snooze columns. Run supabase/add-queue-snooze-mode.sql and try again.')
    }

    if (message.includes('cannot coerce the result to a single json object')) {
      throw new Error('Unable to update Step Away state for this entry. Please refresh and try again.')
    }

    throw error
  }
  if (!data) {
    throw new Error('Step Away update was blocked by queue permissions. Run supabase/fix-customer-queue-entry-update-policy.sql, then try again.')
  }
  return data
}

/**
 * Return from Step Away mode and re-enter queue with fair position adjustment
 */
export async function returnFromSnooze(entryId) {
  const now = new Date()

  const { data: entry, error: entryError } = await supabase
    .from('queue_entries')
    .select('id, queue_id, position, status, snoozed_at, original_position')
    .eq('id', entryId)
    .maybeSingle()

  if (entryError) throw entryError
  if (!entry) {
    throw new Error('Queue entry not found or you do not have permission to update it.')
  }

  if (entry.status !== 'snoozed') {
    throw new Error('This queue entry is not currently in Step Away mode.')
  }

  const snoozedAt = entry.snoozed_at ? new Date(entry.snoozed_at) : now
  const elapsedMinutes = Math.max(1, Math.ceil((now.getTime() - snoozedAt.getTime()) / 60000))
  const positionSlip = Math.floor(elapsedMinutes / 10)
  const basePosition = entry.original_position || entry.position || 1
  const targetPosition = basePosition + positionSlip

  const { data: activeEntries, error: activeError } = await supabase
    .from('queue_entries')
    .select('id, position')
    .eq('queue_id', entry.queue_id)
    .neq('id', entryId)
    .in('status', ['waiting', 'called', 'serving'])
    .order('position', { ascending: true })

  if (activeError) throw activeError

  const usedPositions = new Set((activeEntries || []).map(item => item.position).filter(Boolean))
  let newPosition = targetPosition
  while (usedPositions.has(newPosition)) {
    newPosition += 1
  }

  const { data, error } = await supabase
    .from('queue_entries')
    .update({
      status: 'waiting',
      position: newPosition,
      snoozed_at: null,
      snooze_until: null,
      original_position: null,
    })
    .eq('id', entryId)
    .select('*, queue:queues(*, business:businesses(*), service:services(*))')
    .maybeSingle()

  if (error) {
    const message = String(error?.message || '').toLowerCase()
    if (
      message.includes('column') && (
        message.includes('snooze_until') ||
        message.includes('snoozed_at') ||
        message.includes('original_position')
      )
    ) {
      throw new Error('Step Away mode is not enabled in your database yet. Run supabase/add-queue-snooze-mode.sql and try again.')
    }

    if (message.includes('cannot coerce the result to a single json object')) {
      throw new Error('Unable to return from Step Away for this entry. Please refresh and try again.')
    }

    throw error
  }
  if (!data) {
    throw new Error('Return from Step Away was blocked by queue permissions. Run supabase/fix-customer-queue-entry-update-policy.sql, then try again.')
  }
  return data
}

/**
 * Expire snoozed entries whose return time passed
 */
export async function expireSnoozedQueueEntries(customerId) {
  let query = supabase
    .from('queue_entries')
    .select('id')
    .eq('status', 'snoozed')
    .lte('snooze_until', new Date().toISOString())

  if (customerId) {
    query = query.eq('customer_id', customerId)
  }

  const { data: expiredEntries, error: fetchError } = await query

  if (fetchError) throw fetchError
  if (!expiredEntries?.length) return []

  const expiredIds = expiredEntries.map(entry => entry.id)

  const { data, error } = await supabase
    .from('queue_entries')
    .update({
      status: 'no-show',
      snoozed_at: null,
      snooze_until: null,
      original_position: null,
    })
    .in('id', expiredIds)
    .select('id')

  if (error) throw error
  return data || []
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
  return (data || []).map((item) => {
    const type = item?.type || 'general'
    let category = 'general'

    if (type.includes('appointment') || type.includes('booking')) {
      category = 'booking'
    } else if (type.includes('queue')) {
      category = 'reminder'
    } else if (type.includes('reminder')) {
      category = 'reminder'
    } else if (type.includes('payment')) {
      category = 'payment'
    }

    return {
      ...item,
      isRead: Boolean(item?.read),
      timestamp: item?.created_at,
      metadata: item?.data || null,
      category,
      priority: 'medium',
    }
  })
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
export async function getStaff(businessId, options = {}) {
  let query = supabase
    .from('staff')
    .select('*')
    .eq('business_id', businessId)

  if (!options.includeInactive) {
    query = query.eq('is_active', true)
  }

  query = query.order('name')

  const { data, error } = await query

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
