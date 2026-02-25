/**
 * Test Demo Login
 * Tests if demo accounts can successfully authenticate
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

const demoAccounts = [
  { email: 'admin@smartq.com', password: 'admin123', role: 'admin' },
  { email: 'business@smartq.com', password: 'business123', role: 'business' },
  { email: 'customer@smartq.com', password: 'customer123', role: 'customer' },
]

async function testLogin(email, password, role) {
  console.log(`\nTesting ${role}: ${email}`)
  console.log('─'.repeat(50))
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      console.log('❌ Login failed:', error.message)
      return false
    }
    
    if (data.user) {
      console.log('✅ Login successful!')
      console.log('   User ID:', data.user.id)
      console.log('   Email:', data.user.email)
      console.log('   Email confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No')
      console.log('   Metadata:', JSON.stringify(data.user.user_metadata, null, 2))
      
      // Test profile fetch
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      
      if (profileError) {
        console.log('⚠️  Profile not found in database:', profileError.message)
      } else {
        console.log('✅ Profile found in database')
        console.log('   Role:', profile.role)
        console.log('   Full Name:', profile.full_name)
      }
      
      // Sign out
      await supabase.auth.signOut()
      return true
    }
    
    console.log('❌ No user returned')
    return false
  } catch (error) {
    console.log('❌ Error:', error.message)
    return false
  }
}

async function main() {
  console.log('🧪 Testing Demo Account Logins')
  console.log('='.repeat(50))
  
  let successCount = 0
  
  for (const account of demoAccounts) {
    const success = await testLogin(account.email, account.password, account.role)
    if (success) successCount++
  }
  
  console.log('\n' + '='.repeat(50))
  console.log(`\n📊 Results: ${successCount}/${demoAccounts.length} accounts working`)
  
  if (successCount === demoAccounts.length) {
    console.log('✅ All demo accounts are working!')
  } else {
    console.log('⚠️  Some demo accounts need to be fixed')
    console.log('\nTo recreate demo users, run:')
    console.log('  node scripts/create-demo-users.mjs')
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Test failed:', error)
    process.exit(1)
  })
