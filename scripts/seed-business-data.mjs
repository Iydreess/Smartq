/**
 * Seed Business Data
 * Populates database with sample businesses, services, and staff
 */

import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '..', '.env.local') })

const { createClient } = await import('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
})

async function seedData() {
  console.log('🌱 Seeding business data...\n')

  try {
    // Get business owner
    let { data: ownerUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'business@smartq.com')
      .maybeSingle()

    if (!ownerUser) {
      const { data: anyUser } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single()
      ownerUser = anyUser
    }

    if (!ownerUser) {
      console.error('❌ No users found. Please create users first.')
      process.exit(1)
    }

    console.log(`✅ Using owner: ${ownerUser.email}\n`)

    // Healthcare Business
    const { data: hcBiz } = await supabase
      .from('businesses')
      .insert({
        owner_id: ownerUser.id,
        name: 'SmartQ Healthcare Center',
        description: 'Modern healthcare facility',
        category: 'Healthcare',
        address: '123 Medical Plaza, Downtown',
        phone: '+254 712 345 678',
        email: 'contact@smartqhealth.com',
        is_active: true
      })
      .select()
      .single()

    if (hcBiz) {
      console.log('✅ Healthcare Center created')
      
      await supabase.from('services').insert([
        { business_id: hcBiz.id, name: 'General Consultation', duration: 30, price: 2500, category: 'Healthcare', is_active: true, description: 'General medical consultation' },
        { business_id: hcBiz.id, name: 'Specialist Consultation', duration: 60, price: 5000, category: 'Healthcare', is_active: true, description: 'Detailed specialist consultation' },
        { business_id: hcBiz.id, name: 'Follow-up Appointment', duration: 20, price: 1500, category: 'Healthcare', is_active: true, description: 'Follow-up visit' }
      ])
      console.log('   ✅ Services added')
      
      await supabase.from('staff').insert([
        { business_id: hcBiz.id, name: 'Dr. Sarah Johnson', email: 'sarah@smartqhealth.com', role: 'doctor', specialization: 'General Practitioner', is_active: true },
        { business_id: hcBiz.id, name: 'Dr. Michael Chen', email: 'michael@smartqhealth.com', role: 'doctor', specialization: 'Internal Medicine', is_active: true }
      ])
      console.log('   ✅ Staff added\n')
    }

    // Beauty Business
    const { data: beautyBiz } = await supabase
      .from('businesses')
      .insert({
        owner_id: ownerUser.id,
        name: 'Luxe Beauty Salon',
        description: 'Premium beauty services',
        category: 'Beauty & Wellness',
        address: '456 Style Avenue, City Center',
        phone: '+254 722 345 678',
        email: 'info@luxebeauty.com',
        is_active: true
      })
      .select()
      .single()

    if (beautyBiz) {
      console.log('✅ Beauty Salon created')
      
      await supabase.from('services').insert([
        { business_id: beautyBiz.id, name: 'Hair Cut & Styling', duration: 60, price: 1500, category: 'Hair', is_active: true, description: 'Professional haircut and styling' },
        { business_id: beautyBiz.id, name: 'Hair Color & Highlights', duration: 120, price: 4500, category: 'Hair', is_active: true, description: 'Full color treatment' },
        { business_id: beautyBiz.id, name: 'Manicure & Pedicure', duration: 90, price: 2000, category: 'Nails', is_active: true, description: 'Complete nail care' },
        { business_id: beautyBiz.id, name: 'Facial Treatment', duration: 60, price: 3500, category: 'Skin Care', is_active: true, description: 'Refreshing facial' }
      ])
      console.log('   ✅ Services added')
      
      await supabase.from('staff').insert([
        { business_id: beautyBiz.id, name: 'Jessica Martinez', email: 'jessica@luxebeauty.com', role: 'stylist', specialization: 'Hair Specialist', is_active: true },
        { business_id: beautyBiz.id, name: 'Rachel Kim', email: 'rachel@luxebeauty.com', role: 'esthetician', specialization: 'Skin Care Specialist', is_active: true }
      ])
      console.log('   ✅ Staff added\n')
    }

    console.log('✨ Database seeded successfully!')
    console.log('📊 2 businesses, 7 services, 4 staff members added\n')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

seedData().then(() => process.exit(0))
