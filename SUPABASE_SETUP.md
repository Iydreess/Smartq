# SmartQ - Supabase Setup Complete! 🎉

## What's Been Set Up

### 1. **Database Schema** (`supabase/schema.sql`)
   - Complete database structure with 9 tables
   - Row Level Security (RLS) policies
   - Indexes for performance
   - Automatic triggers for timestamps
   - Auto-create profile on user signup

### 2. **Supabase Client** (`lib/supabase/client.js`)
   - Configured Supabase JavaScript client
   - Session persistence
   - Auto token refresh

### 3. **Database Queries** (`lib/supabase/queries.js`)
   - Helper functions for all database operations:
     - Profile management
     - Business CRUD operations
     - Service management
     - Queue operations
     - Appointment booking
     - Notifications
     - Staff management
     - Analytics tracking

### 4. **React Hooks** (`lib/supabase/hooks.js`)
   - `useUser()` - Get current user with real-time updates
   - `useRealtimeSubscription()` - Subscribe to database changes
   - `useSupabaseQuery()` - Fetch data with real-time sync

### 5. **Updated Auth System** (`lib/auth/index.js`)
   - ✅ `signIn()` - Sign in with email/password
   - ✅ `signUp()` - Register new users
   - ✅ `signOut()` - Sign out
   - ✅ `getCurrentUser()` - Get current user
   - ✅ `resetPassword()` - Password reset
   - ✅ `updatePassword()` - Update password
   - ✅ `onAuthStateChange()` - Listen to auth changes

### 6. **Environment Variables**
   - `.env.local.example` - Template file
   - `.env.local` - Your config file (update with real credentials)

## Next Steps

### 1. Create Supabase Project
```bash
# Go to https://app.supabase.com
# 1. Click "New Project"
# 2. Fill in project details
# 3. Wait for provisioning
```

### 2. Get Your Credentials
```bash
# In Supabase Dashboard:
# Settings > API
# Copy:
# - Project URL → NEXT_PUBLIC_SUPABASE_URL
# - anon public key → NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 3. Update `.env.local`
Replace the placeholder values in `.env.local` with your actual Supabase credentials.

### 4. Run Database Schema
```bash
# In Supabase Dashboard:
# 1. Go to SQL Editor
# 2. Click "New query"
# 3. Copy/paste contents of supabase/schema.sql
# 4. Click "Run"
```

### 5. Test Your Setup
```bash
npm run dev
```

## Database Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (extends auth.users) |
| `businesses` | Business information |
| `services` | Services offered by businesses |
| `staff` | Staff members |
| `queues` | Queue management |
| `queue_entries` | Individual queue positions |
| `appointments` | Appointment bookings |
| `notifications` | User notifications |
| `analytics_events` | Analytics tracking |

## Usage Examples

### Sign Up
```javascript
import { signUp } from '@/lib/auth'

const result = await signUp({
  email: 'user@example.com',
  password: 'password123',
  full_name: 'John Doe',
  role: 'customer'
})
```

### Sign In
```javascript
import { signIn } from '@/lib/auth'

const result = await signIn('user@example.com', 'password123')
```

### Use Current User Hook
```javascript
import { useUser } from '@/lib/supabase/hooks'

function MyComponent() {
  const { user, loading } = useUser()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Not logged in</div>
  
  return <div>Hello {user.full_name}</div>
}
```

### Fetch Data
```javascript
import { getBusinesses, createAppointment } from '@/lib/supabase/queries'

// Get all businesses
const businesses = await getBusinesses()

// Create appointment
const appointment = await createAppointment({
  business_id: 'xxx',
  customer_id: 'yyy',
  service_id: 'zzz',
  appointment_date: '2026-02-10',
  start_time: '10:00',
  end_time: '11:00',
})
```

## Security Features

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ Business owners can manage their business data
- ✅ Admins have full access
- ✅ Email verification on signup
- ✅ Secure password hashing
- ✅ JWT-based authentication

## Optional: Seed Demo Data

After setting up, you can seed demo data:

```javascript
import { seedDemoUsers, seedDemoData } from '@/lib/auth/seed'

// Create demo users (admin, business, customer)
await seedDemoUsers()

// Create demo business and services
await seedDemoData()
```

Demo accounts:
- Admin: `admin@smartq.com` / `admin123`
- Business: `business@smartq.com` / `business123`
- Customer: `customer@smartq.com` / `customer123`

---

Need help? Check the [Supabase documentation](https://supabase.com/docs) or [setup guide](supabase/README.md).
