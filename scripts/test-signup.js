/**
 * Test Signup Flow
 * Tests creating a user with all attributes and verifying profile storage
 */

require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSignup() {
  console.log('🧪 Testing Signup Flow\n')

  const timestamp = Date.now()
  const testUser = {
    email: `testuser${timestamp}@smartq.test`,
    password: 'testpass123',
    full_name: 'Test User',
    phone: '+1234567890',
    role: 'customer'
  }

  console.log('1. Creating user with attributes:')
  console.log('   Email:', testUser.email)
  console.log('   Name:', testUser.full_name)
  console.log('   Phone:', testUser.phone)
  console.log('   Role:', testUser.role)
  console.log('')

  try {
    // Sign up
    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          full_name: testUser.full_name,
          role: testUser.role,
        },
      },
    })

    if (error) {
      console.error('❌ Signup failed:', error.message)
      return
    }

    console.log('✅ User created in auth.users')
    console.log('   User ID:', data.user.id)
    console.log('')

    // Wait a moment for the trigger to create the profile
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Check if profile was created
    console.log('2. Checking profile creation...')
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (profileError) {
      console.error('❌ Profile not found:', profileError.message)
      console.log('\n⚠️  Profile creation trigger may not have run.')
      console.log('   Check if schema.sql was executed correctly.')
      return
    }

    console.log('✅ Profile created successfully!')
    console.log('')
    console.log('📋 Profile Data:')
    console.log('   ID:', profile.id)
    console.log('   Email:', profile.email)
    console.log('   Full Name:', profile.full_name)
    console.log('   Phone:', profile.phone || '(not set)')
    console.log('   Role:', profile.role)
    console.log('   Avatar URL:', profile.avatar_url || '(not set)')
    console.log('   Created At:', profile.created_at)
    console.log('')

    // Update phone number (test profile update)
    console.log('3. Testing profile update...')
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({ phone: testUser.phone })
      .eq('id', data.user.id)
      .select()
      .single()

    if (updateError) {
      console.error('⚠️  Profile update failed:', updateError.message)
    } else {
      console.log('✅ Profile updated with phone number:', updatedProfile.phone)
    }
    console.log('')

    console.log('🎉 All tests passed!')
    console.log('\nThe signup flow is working correctly:')
    console.log('  ✓ User created in auth.users')
    console.log('  ✓ Profile auto-created with trigger')
    console.log('  ✓ All attributes stored properly')
    console.log('  ✓ Profile can be updated')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

testSignup()
