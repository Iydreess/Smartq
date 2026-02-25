/**
 * Check Supabase Email Configuration
 * This script helps diagnose email-related issues
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

async function checkEmailConfig() {
  console.log('📧 Checking Supabase Email Configuration...\n')
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing Supabase environment variables!')
    process.exit(1)
  }
  
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  console.log('✅ Supabase URL:', supabaseUrl)
  console.log()
  
  // Test signup to check email confirmation setting
  console.log('🔍 Testing signup flow to detect email confirmation settings...')
  console.log('   (Creating a test user with a random email)')
  console.log()
  
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = 'TestPassword123!'
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Test User',
        }
      }
    })
    
    if (error) {
      console.error('❌ Signup test failed:', error.message)
      console.log()
      
      if (error.message.includes('rate limit')) {
        console.log('⚠️  EMAIL RATE LIMIT DETECTED')
        console.log('   Your Supabase project has hit the email rate limit.')
        console.log()
        console.log('   RECOMMENDED SOLUTIONS:')
        console.log('   1. Disable email confirmation in Supabase Dashboard')
        console.log('   2. Wait a few hours and try again')
        console.log('   3. Upgrade to a paid plan for higher limits')
      }
    } else {
      const isConfirmed = data.user?.confirmed_at || data.session
      
      console.log('✅ Test user created successfully!')
      console.log()
      console.log('📊 Email Configuration Status:')
      console.log('─────────────────────────────────────────────────────')
      
      if (isConfirmed) {
        console.log('✅ Email Confirmation: DISABLED (Auto-confirm enabled)')
        console.log('   ℹ️  Users can sign in immediately after signup')
        console.log('   ℹ️  No confirmation email is sent')
        console.log()
        console.log('   This is PERFECT for development! ✨')
      } else {
        console.log('⚠️  Email Confirmation: ENABLED')
        console.log('   ℹ️  Users must confirm their email before signing in')
        console.log('   ℹ️  Confirmation emails will be sent')
        console.log()
        console.log('   ISSUE: You mentioned not receiving emails!')
        console.log()
        console.log('   POSSIBLE CAUSES:')
        console.log('   • Email rate limit exceeded (common on free tier)')
        console.log('   • Custom SMTP not configured')
        console.log('   • Emails going to spam folder')
        console.log()
        console.log('   RECOMMENDED SOLUTION for Development:')
        console.log('   ──────────────────────────────────────')
        console.log('   1. Go to: https://app.supabase.com')
        console.log('   2. Select your project')
        console.log('   3. Navigate to: Authentication → Settings')
        console.log('   4. Scroll to "Email Auth" section')
        console.log('   5. Toggle OFF "Enable email confirmations"')
        console.log('   6. Click Save')
        console.log()
        console.log('   After this, users can sign in immediately! 🎉')
      }
      
      console.log('─────────────────────────────────────────────────────')
      console.log()
      
      // Clean up test user
      console.log('🧹 Cleaning up test user...')
      // Note: We can't delete the user with anon key, needs service role key
      console.log('   ℹ️  You can manually delete test user from Supabase Dashboard')
      console.log('   ℹ️  Email:', testEmail)
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
  
  console.log()
  console.log('─────────────────────────────────────────────────────')
  console.log()
  console.log('📝 QUICK REFERENCE:')
  console.log()
  console.log('For Development (Disable Email Confirmation):')
  console.log('  Dashboard → Authentication → Settings → Email Auth')
  console.log('  Toggle OFF: "Enable email confirmations"')
  console.log()
  console.log('For Production (Enable Email, Configure SMTP):')
  console.log('  Dashboard → Project Settings → Auth → SMTP Settings')
  console.log('  Configure your own SMTP provider (SendGrid, AWS SES, etc.)')
  console.log()
  console.log('─────────────────────────────────────────────────────')
}

checkEmailConfig()
  .then(() => {
    console.log('\\n✨ Configuration check completed')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\\n❌ Check failed:', error)
    process.exit(1)
  })
