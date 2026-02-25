/**
 * Test Supabase Connection
 * Verifies that Supabase is properly configured and reachable
 */

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') })

// Import after loading env vars
const { createClient } = await import('@supabase/supabase-js')

async function testConnection() {
  console.log('🔍 Testing Supabase Connection...\n')
  
  // Check environment variables
  console.log('Environment Variables:')
  console.log('  NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing')
  console.log()
  
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.log('  URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  }
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('\n❌ Missing required environment variables!')
    console.error('Please check your .env.local file.')
    process.exit(1)
  }
  
  console.log()
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
  
  // Test basic connection
  try {
    console.log('Testing connection with a simple query...')
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Connection timeout')), 5000)
    )
    
    const queryPromise = supabase.from('profiles').select('count', { count: 'exact', head: true })
    
    const { error, count } = await Promise.race([queryPromise, timeoutPromise])
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      console.error('   Error details:', error)
    } else {
      console.log('✅ Connection successful!')
      console.log('   Profiles in database:', count ?? 'unknown')
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error.message)
  }
  
  // Test auth
  try {
    console.log('\nTesting auth service...')
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Auth service error:', error.message)
    } else {
      console.log('✅ Auth service is working')
      console.log('   Current session:', data.session ? 'Active' : 'None')
    }
  } catch (error) {
    console.error('❌ Auth test failed:', error.message)
  }
}

testConnection()
  .then(() => {
    console.log('\n✨ Test completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  })
