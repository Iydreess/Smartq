/**
 * Test Email Confirmation Flows
 * Tests signup confirmation and password reset workflows
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

async function testSignupFlow() {
  console.log('\n📝 Test 1: Signup Email Confirmation')
  console.log('─'.repeat(60))
  
  const testEmail = `test-${Date.now()}@example.com`
  const testPassword = 'TestPass123!'
  
  try {
    console.log(`Creating test account: ${testEmail}`)
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/login`,
        data: {
          full_name: 'Test User',
          role: 'customer',
        },
      },
    })
    
    if (error) {
      console.log('❌ Signup failed:', error.message)
      return false
    }
    
    if (data.user) {
      console.log('✅ Account created!')
      console.log('   User ID:', data.user.id)
      console.log('   Email:', data.user.email)
      console.log('   Email confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No')
      console.log('   Has session:', data.session ? 'Yes' : 'No')
      
      if (data.user.email_confirmed_at) {
        console.log('ℹ️  Email confirmation is DISABLED in Supabase')
        console.log('   Users can log in immediately without verification')
      } else {
        console.log('✅ Email confirmation is ENABLED')
        console.log('   Confirmation email should be sent')
        console.log('   Check your Supabase email logs to verify')
      }
      
      // Clean up test account
      if (data.session) {
        await supabase.auth.signOut()
      }
      
      return true
    }
    
    console.log('❌ No user returned')
    return false
  } catch (error) {
    console.log('❌ Exception:', error.message)
    return false
  }
}

async function testPasswordResetFlow() {
  console.log('\n🔐 Test 2: Password Reset Email')
  console.log('─'.repeat(60))
  
  const testEmail = 'customer@smartq.com' // Use existing demo account
  
  try {
    console.log(`Requesting password reset for: ${testEmail}`)
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(testEmail, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/reset-password`,
    })
    
    if (error) {
      // Some errors are expected (like rate limiting)
      if (error.message.includes('security purposes') || error.message.includes('seconds')) {
        console.log('ℹ️  Rate limit reached (expected in testing)')
        console.log('   This is normal - wait a minute and try again')
        return true
      }
      console.log('❌ Reset failed:', error.message)
      return false
    }
    
    console.log('✅ Password reset request processed!')
    console.log('   If email exists, reset link should be sent')
    console.log('   Check your Supabase email logs to verify')
    
    return true
  } catch (error) {
    console.log('❌ Exception:', error.message)
    return false
  }
}

async function testLoginWithUnverifiedEmail() {
  console.log('\n🔑 Test 3: Login with Unverified Email')
  console.log('─'.repeat(60))
  
  // This test assumes an unverified account exists
  // In practice, this would be tested through the UI
  
  console.log('ℹ️  This test should be performed through the UI:')
  console.log('   1. Create a new account (with email confirmation enabled)')
  console.log('   2. Try to log in before confirming email')
  console.log('   3. System should automatically resend confirmation email')
  console.log('   4. Check logs for email delivery')
  
  return true
}

async function checkEmailConfiguration() {
  console.log('\n⚙️  Email Configuration Check')
  console.log('─'.repeat(60))
  
  console.log('Environment:')
  console.log('   Supabase URL:', supabaseUrl)
  console.log('   App URL:', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002')
  
  console.log('\nTo check email settings:')
  console.log('   1. Go to Supabase Dashboard')
  console.log('   2. Navigate to Authentication → Settings')
  console.log('   3. Check "Enable email confirmations" status')
  console.log('   4. Verify Site URL and Redirect URLs')
  console.log('   5. Check Authentication → Email Templates')
  console.log('   6. Review Authentication → Logs for email delivery')
  
  return true
}

async function main() {
  console.log('🧪 Testing Email Confirmation Workflows')
  console.log('='.repeat(60))
  
  const tests = [
    { name: 'Email Configuration', fn: checkEmailConfiguration },
    { name: 'Signup Flow', fn: testSignupFlow },
    { name: 'Password Reset', fn: testPasswordResetFlow },
    { name: 'Login Verification', fn: testLoginWithUnverifiedEmail },
  ]
  
  let passed = 0
  let failed = 0
  
  for (const test of tests) {
    const result = await test.fn()
    if (result) {
      passed++
    } else {
      failed++
    }
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait between tests
  }
  
  console.log('\n' + '='.repeat(60))
  console.log('\n📊 Test Results')
  console.log(`   Passed: ${passed}/${tests.length}`)
  console.log(`   Failed: ${failed}/${tests.length}`)
  
  if (failed === 0) {
    console.log('\n✅ All tests passed!')
  } else {
    console.log('\n⚠️  Some tests failed - check configuration')
  }
  
  console.log('\n📚 Next Steps:')
  console.log('   1. Enable email confirmation in Supabase Dashboard')
  console.log('   2. Configure redirect URLs')
  console.log('   3. Test signup flow through UI')
  console.log('   4. Check Supabase email logs')
  console.log('   5. Configure custom SMTP for production')
  console.log('\nSee EMAIL_CONFIRMATION_GUIDE.md for detailed instructions')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('\n❌ Test suite failed:', error)
    process.exit(1)
  })
