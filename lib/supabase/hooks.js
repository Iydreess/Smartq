/**
 * Supabase React Hooks
 * Custom hooks for working with Supabase in React components
 */

import { useState, useEffect } from 'react'
import { supabase } from './client'
import { getCurrentUser } from '../auth'

/**
 * Hook to get current user
 */
export function useUser() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial user
    getCurrentUser().then(user => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const userData = await getCurrentUser()
          setUser(userData)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user, loading }
}

/**
 * Hook to subscribe to real-time changes
 */
export function useRealtimeSubscription(table, callback, filter = {}) {
  useEffect(() => {
    let channel = supabase.channel(`${table}-changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table,
          ...filter,
        },
        callback
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [table, callback, filter])
}

/**
 * Hook to fetch and subscribe to data
 */
export function useSupabaseQuery(table, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        let query = supabase.from(table).select(options.select || '*')

        // Apply filters
        if (options.filter) {
          Object.entries(options.filter).forEach(([key, value]) => {
            query = query.eq(key, value)
          })
        }

        // Apply ordering
        if (options.orderBy) {
          query = query.order(options.orderBy, {
            ascending: options.ascending !== false,
          })
        }

        const { data, error } = await query

        if (error) throw error

        setData(data)
        setError(null)
      } catch (err) {
        setError(err)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Set up realtime subscription if enabled
    if (options.realtime) {
      const channel = supabase
        .channel(`${table}-query`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table,
          },
          () => {
            fetchData() // Refetch on change
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
      }
    }
  }, [table, JSON.stringify(options)])

  return { data, loading, error, refetch: () => setLoading(true) }
}
