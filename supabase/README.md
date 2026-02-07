# Supabase Setup Guide

## Prerequisites
- A Supabase account (sign up at https://supabase.com)
- Node.js and npm installed

## Setup Steps

### 1. Create a Supabase Project
1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in your project details
4. Wait for the project to be provisioned

### 2. Configure Environment Variables
1. Copy `.env.local.example` to `.env.local`
2. Get your project credentials from Supabase:
   - Go to Settings > API
   - Copy the Project URL and paste it as `NEXT_PUBLIC_SUPABASE_URL`
   - Copy the `anon public` key and paste it as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - (Optional) Copy the `service_role` key for server-side operations

### 3. Run Database Schema
1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Copy the contents of `schema.sql`
4. Paste and run it in the SQL Editor

### 4. (Optional) Seed Demo Data
1. Create some test users through Supabase Auth or your app's signup
2. Update `seed.sql` with the actual UUIDs
3. Run the seed script in the SQL Editor

### 5. Test the Connection
Run your Next.js app:
```bash
npm run dev
```

## Database Tables

### Core Tables
- **profiles** - User profiles (linked to auth.users)
- **businesses** - Business information
- **services** - Services offered by businesses
- **staff** - Staff members
- **queues** - Queue management
- **queue_entries** - Individual queue positions
- **appointments** - Appointment bookings
- **notifications** - User notifications
- **analytics_events** - Analytics and reporting data

## Row Level Security (RLS)
All tables have RLS enabled with appropriate policies:
- Users can only see their own data
- Business owners can manage their business data
- Admins have full access
- Public data (active businesses/services) is viewable by all

## Authentication
Supabase Auth is integrated with:
- Email/password authentication
- Role-based access (admin, business, customer)
- Automatic profile creation on signup
- Session management

## Next Steps
- Configure email templates in Supabase dashboard
- Set up storage buckets for file uploads (avatars, logos)
- Configure webhooks if needed
- Set up Supabase Realtime for live updates
