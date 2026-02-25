/**
 * Create demo user accounts in Supabase
 * Run this to set up test accounts for development
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

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

async function createDemoAccounts() {
  console.log('🚀 Creating demo accounts...\n')

  for (const user of demoUsers) {
    try {
      console.log(`Creating ${user.role}: ${user.email}`)
      
      // Create user with admin API
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: user.full_name
        }
      })

      if (authError) {
        if (authError.message.toLowerCase().includes('already')) {
          console.log(`  ⏳ User already exists, resetting password...`)
          
          // Find and update the existing user
          const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
          
          if (listError) {
            console.log(`  ❌ Failed to list users:`, listError.message)
            continue
          }
          
          const existingUser = users.find(u => u.email === user.email)
          
          if (!existingUser) {
            console.log(`  ❌ Could not find user ${user.email} in database`)
            continue
          }
          
          // Update password
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingUser.id,
            { password: user.password }
          )
          
          if (updateError) {
            console.log(`  ❌ Failed to reset password:`, updateError.message)
            continue
          }
          
          // Update profile
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: existingUser.id,
              full_name: user.full_name,
              role: user.role,
              email: user.email,
              updated_at: new Date().toISOString(),
            })
          
          if (profileError) {
            console.log(`  ⚠️  Profile update warning:`, profileError.message)
          }
          
          console.log(`  ✅ Password reset successfully!`)
          continue
        }
        
        // If it's a different error, throw it
        throw authError
      }

      // Create or update profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: authData.user.id,
          full_name: user.full_name,
          role: user.role,
          email: user.email,
          updated_at: new Date().toISOString(),
        })

      if (profileError) throw profileError

      console.log(`  ✅ Created: ${user.email} (password: ${user.password})`)
    } catch (error) {
      console.error(`  ❌ Error creating ${user.email}:`, error.message)
    }
  }

  console.log('\n✨ Demo accounts setup complete!')
  console.log('\nYou can now log in with:')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  demoUsers.forEach(user => {
    console.log(`${user.role.toUpperCase().padEnd(10)} → ${user.email.padEnd(25)} / ${user.password}`)
  })
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

createDemoAccounts().catch(console.error)
