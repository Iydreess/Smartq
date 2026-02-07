/**
 * Test Supabase Connection
 * Run this script to verify your Supabase setup
 */

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('🔍 Testing Supabase Connection...\n')

// Check environment variables
console.log('1. Checking environment variables...')
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables!')
  console.log('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing')
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing')
  process.exit(1)
}
console.log('   ✅ Environment variables found')
console.log('   URL:', supabaseUrl)
console.log('   Key:', supabaseAnonKey.substring(0, 20) + '...\n')

// Initialize Supabase client
console.log('2. Initializing Supabase client...')
const supabase = createClient(supabaseUrl, supabaseAnonKey)
console.log('   ✅ Client initialized\n')

// Test connection
async function testConnection() {
  try {
    console.log('3. Testing database connection...')
    
    // Try to query the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (error) {
      console.log('   ⚠️  Database query failed:', error.message)
      console.log('\n📋 Next steps:')
      console.log('   1. Make sure you ran the schema.sql in Supabase SQL Editor')
      console.log('   2. Check if the profiles table exists')
      console.log('   3. Verify your RLS policies are set up correctly')
      return false
    }
    
    console.log('   ✅ Database connection successful!')
    console.log('   Tables are accessible\n')
    return true
  } catch (error) {
    console.error('   ❌ Connection test failed:', error.message)
    return false
  }
}

// Test auth
async function testAuth() {
  try {
    console.log('4. Testing authentication...')
    
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.log('   ⚠️  Auth check failed:', error.message)
      return false
    }
    
    console.log('   ✅ Auth is working!')
    console.log('   Current session:', data.session ? 'Logged in' : 'Not logged in\n')
    return true
  } catch (error) {
    console.error('   ❌ Auth test failed:', error.message)
    return false
  }
}

// Run all tests
async function runTests() {
  const dbTest = await testConnection()
  const authTest = await testAuth()
  
  console.log('\n' + '='.repeat(50))
  console.log('📊 Test Summary')
  console.log('='.repeat(50))
  console.log('Environment Variables:', '✅ Pass')
  console.log('Client Initialization:', '✅ Pass')
  console.log('Database Connection:  ', dbTest ? '✅ Pass' : '❌ Fail')
  console.log('Authentication:       ', authTest ? '✅ Pass' : '⚠️  Warning')
  console.log('='.repeat(50))
  
  if (dbTest && authTest) {
    console.log('\n🎉 All tests passed! Your Supabase setup is working correctly.')
    console.log('\nYou can now:')
    console.log('  • Run your Next.js app: npm run dev')
    console.log('  • Create users through signup')
    console.log('  • Use all database features')
  } else if (dbTest) {
    console.log('\n✅ Connection is working! Auth is ready but no user logged in.')
    console.log('\nNext steps:')
    console.log('  • Run: npm run dev')
    console.log('  • Create your first user through the signup page')
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.')
    console.log('\nMake sure you:')
    console.log('  1. Created your Supabase project')
    console.log('  2. Ran the schema.sql in Supabase SQL Editor')
    console.log('  3. Updated .env.local with correct credentials')
  }
  
  console.log('')
}

runTests()
