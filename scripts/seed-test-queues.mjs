/**
 * Seed Test Queues
 * Creates sample active queues for testing the join queue page
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

async function seedQueues() {
  console.log('🌱 Seeding test queues...\n')

  try {
    // Get first business
    const { data: businesses } = await supabase
      .from('businesses')
      .select('*')
      .limit(3)

    if (!businesses || businesses.length === 0) {
      console.error('❌ No businesses found. Please run seed-business-data.mjs first.')
      process.exit(1)
    }

    console.log(`✅ Found ${businesses.length} businesses\n`)

    // Get services for each business
    for (const business of businesses) {
      const { data: services } = await supabase
        .from('services')
        .select('*')
        .eq('business_id', business.id)
        .limit(2)

      if (services && services.length > 0) {
        console.log(`📍 Creating queues for ${business.name}...`)
        
        for (const service of services) {
          // Check if queue already exists
          const { data: existingQueue } = await supabase
            .from('queues')
            .select('id')
            .eq('business_id', business.id)
            .eq('service_id', service.id)
            .maybeSingle()

          if (existingQueue) {
            console.log(`   ⏭️  Queue already exists for ${service.name}`)
            continue
          }

          // Create queue
          const { data: queue, error } = await supabase
            .from('queues')
            .insert({
              business_id: business.id,
              service_id: service.id,
              name: service.name,
              description: service.description || `Queue for ${service.name}`,
              status: 'active',
              max_capacity: 50,
              estimated_wait_time: Math.floor(Math.random() * 30) + 10 // Random between 10-40 min
            })
            .select()
            .single()

          if (error) {
            console.error(`   ❌ Error creating queue: ${error.message}`)
          } else {
            console.log(`   ✅ Created queue: ${queue.name}`)
          }
        }
        console.log()
      }
    }

    // Count total active queues
    const { count } = await supabase
      .from('queues')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    console.log(`\n✅ Seeding complete! Total active queues: ${count}`)
    console.log('\n🚀 You can now test the join queue page at: /queue/join\n')

  } catch (error) {
    console.error('❌ Error seeding queues:', error)
    process.exit(1)
  }
}

seedQueues()
