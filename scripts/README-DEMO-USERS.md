# Create Demo Users - Quick Start

This script creates test users in your Supabase database for development and testing.

## Prerequisites

You need your **Supabase Service Role Key** in your `.env.local` file.

### How to Get Your Service Role Key:

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **Settings** → **API**
3. Find the **Service Role Key** section
4. Copy the `service_role` key (⚠️ Keep this secret!)

### Setup:

1. Create `.env.local` file in the project root if you don't have one:
   ```bash
   copy .env.local.example .env.local
   ```

2. Add your keys to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

## Run the Script:

```bash
npm run create-demo-users
```

## Demo Users Created:

| Role     | Email                  | Password     |
|----------|------------------------|--------------|
| admin    | admin@smartq.com       | admin123     |
| business | business@smartq.com    | business123  |
| customer | customer@smartq.com    | customer123  |
| customer | test@example.com       | test123456   |

## What This Script Does:

1. ✅ Creates users in Supabase Auth
2. ✅ Auto-confirms their email (no verification needed)
3. ✅ Sets up their profile with name, phone, and role
4. ✅ Makes them ready to log in immediately

## After Running:

You can now log in at `/login` with any of the demo accounts!

## Troubleshooting:

**"Missing environment variables"**
- Make sure `.env.local` exists and has all required keys

**"User already exists"**
- That's OK! The script will skip existing users

**"Invalid JWT"**
- Check that your `SUPABASE_SERVICE_ROLE_KEY` is correct
- Make sure you copied the entire key

## Security Note:

⚠️ **NEVER** commit `.env.local` to git or expose the service role key publicly!
The `.gitignore` file should already exclude it.
