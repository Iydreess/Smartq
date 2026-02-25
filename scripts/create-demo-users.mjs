/**
 * Create Demo Users Script
 * Creates test users with different roles for development and testing
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get the directory name for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  console.error('\nMake sure these are set in your .env.local file')
  process.exit(1)
}

// Initialize Supabase Admin Client (bypasses RLS and email confirmation)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Demo users to create
const demoUsers = [
  {
    email: 'admin@smartq.com',
    password: 'admin123',
    full_name: 'Admin User',
    phone: '+1-555-0100',
    role: 'admin'
  },
  {
    email: 'business@smartq.com',
    password: 'business123',
    full_name: 'Business Owner',
    phone: '+1-555-0200',
    role: 'business'
  },
  {
    email: 'customer@smartq.com',
    password: 'customer123',
    full_name: 'Customer User',
    phone: '+1-555-0300',
    role: 'customer'
  },
  {
    email: 'test@example.com',
    password: 'test123456',
    full_name: 'Test User',
    phone: '+1-555-0400',
    role: 'customer'
  }
]

async function createDemoUsers() {
  console.log('🚀 Creating demo users...\n')

  for (const user of demoUsers) {
    try {
      console.log(`Creating ${user.role}: ${user.email}...`)
      
      // Create user with admin client (bypasses email confirmation)
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: user.full_name,
          phone: user.phone,
          role: user.role
        }
      })

      if (error) {
        // Check if user already exists
        if (error.message.includes('already registered')) {
          console.log(`⚠️  User already exists: ${user.email}`)
        } else {
          console.error(`❌ Error creating ${user.email}:`, error.message)
        }
        continue
      }

      console.log(`✅ Created: ${user.email}`)
      console.log(`   Password: ${user.password}`)
      console.log(`   Role: ${user.role}`)
      console.log(`   ID: ${data.user.id}\n`)

      // Wait a bit to ensure trigger completes
      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (err) {
      console.error(`❌ Error creating ${user.email}:`, err.message)
    }
  }

  console.log('\n📋 Demo Users Summary:')
  console.log('─'.repeat(60))
  console.log('Role     | Email                  | Password')
  console.log('─'.repeat(60))
  demoUsers.forEach(user => {
    console.log(`${user.role.padEnd(8)} | ${user.email.padEnd(22)} | ${user.password}`)
  })
  console.log('─'.repeat(60))
  console.log('\n✨ Demo users created successfully!')
  console.log('You can now log in with any of the accounts above.\n')
}

// Run the script
createDemoUsers()
  .then(() => {
    console.log('✅ Script completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
