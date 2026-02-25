/**
 * Supabase Client Configuration
 * Initializes and exports the Supabase client instance
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'smartq-auth',
    flowType: 'implicit',
  },
  global: {
    headers: {
      'x-application-name': 'smartq',
    },
    fetch: (...args) => {
      console.log('[Supabase] Fetch request:', args[0])
      return fetch(...args).catch(err => {
        console.error('[Supabase] Fetch error:', err)
        throw err
      })
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

/**
 * Check if Supabase client is ready and connected
 * @returns {Promise<boolean>} True if connection is healthy
 */
export const checkConnection = async () => {
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true })
    return !error
  } catch (error) {
    console.error('[Supabase] Connection check failed:', error)
    return false
  }
}

/**
 * Get connection status
 * @returns {Object} Connection status info
 */
export const getConnectionStatus = () => {
  return {
    url: supabaseUrl,
    configured: !!(supabaseUrl && supabaseAnonKey),
  }
}
