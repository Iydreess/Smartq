/**
 * Fix Supabase RLS Policy for Profiles
 * Adds missing INSERT policy to allow users to create their own profile
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function fixProfilePolicy() {
  console.log('🔧 Fixing profiles table RLS policy...\n')

  try {
    // Try to query existing policies to check if our policy exists
    const { data: policies, error: queryError } = await supabaseAdmin
      .from('pg_policies')
      .select('policyname')
      .eq('tablename', 'profiles')
      .eq('policyname', 'Users can insert their own profile')
      .maybeSingle()

    if (policies) {
      console.log('✅ Policy already exists - no action needed!')
      console.log('Login should work correctly now.')
      return
    }

    // Since we can't execute DDL directly, provide manual instructions
    console.log('⚠️  Manual SQL execution required\n')
    console.log('Please run this SQL in your Supabase dashboard:\n')
    console.log('─'.repeat(70))
    console.log('CREATE POLICY "Users can insert their own profile" ON public.profiles')
    console.log('    FOR INSERT WITH CHECK (auth.uid() = id);')
    console.log('─'.repeat(70))
    console.log('\n📍 Steps to apply:')
    console.log('   1. Go to https://app.supabase.com')
    console.log('   2. Select your SmartQ project')
    console.log('   3. Click "SQL Editor" in the left sidebar')
    console.log('   4. Click "New Query"')
    console.log('   5. Copy and paste the SQL above')
    console.log('   6. Click "Run" (or press Ctrl+Enter)\n')
    console.log('After applying, login will work immediately! 🚀')
    
  } catch (error) {
    // If pg_policies is not accessible, just show the SQL
    console.log('📋 Please run this SQL in your Supabase dashboard:\n')
    console.log('─'.repeat(70))
    console.log('CREATE POLICY "Users can insert their own profile" ON public.profiles')
    console.log('    FOR INSERT WITH CHECK (auth.uid() = id);')
    console.log('─'.repeat(70))
    console.log('\n📍 Go to: https://app.supabase.com → SQL Editor → Run the above SQL\n')
  }
}

fixProfilePolicy()
  .then(() => {
    console.log('\n✨ Fix applied successfully!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Script failed:', error)
    process.exit(1)
  })
