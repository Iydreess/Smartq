/**
 * Check current authentication status
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

async function checkAuth() {
  console.log('🔍 Checking Authentication Status...\n')
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Check if there's a session
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error) {
    console.error('❌ Error getting session:', error.message)
    return
  }
  
  if (!session) {
    console.log('❌ No active session found')
    console.log('ℹ️  You need to sign up or login first')
    return
  }
  
  console.log('✅ Active session found!')
  console.log('User ID:', session.user.id)
  console.log('Email:', session.user.email)
  
  // Check if profile exists
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()
  
  if (profileError) {
    console.log('❌ Profile not found:', profileError.message)
    return
  }
  
  console.log('\n👤 Profile:')
  console.log('Name:', profile.full_name)
  console.log('Role:', profile.role)
  console.log('Phone:', profile.phone || 'Not set')
  console.log('\n✅ Everything looks good! You should be able to access the dashboard.')
}

checkAuth().catch(console.error)
