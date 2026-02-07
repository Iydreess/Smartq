# Signup & User Profile Storage - Complete Guide

## ✅ What's Been Set Up

Your SmartQ application now has complete Supabase integration for user signup with full profile storage.

### Database Schema
The `profiles` table stores all user attributes:
```sql
- id (UUID) - Links to auth.users
- email (TEXT)
- full_name (TEXT)
- phone (TEXT)
- role (TEXT) - 'admin', 'business', or 'customer'
- avatar_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Automatic Profile Creation
A database trigger automatically creates a profile when a user signs up:
- Trigger: `on_auth_user_created`
- Function: `handle_new_user()`
- Pulls data from `auth.users.raw_user_meta_data`

## 📝 Signup Form Fields

The signup page now captures:
1. **Full Name** (required)
2. **Email** (required)
3. **Phone Number** (optional)
4. **Password** (required, min 8 characters)
5. **Confirm Password** (required)
6. **Role** (required - radio buttons):
   - 👤 Customer
   - 🏢 Business Owner
   - ⚡ Admin

## 🔄 Signup Flow

### 1. User Fills Form
User enters all information including role selection.

### 2. Supabase Auth Signup
```javascript
const result = await signUp({
  email: formData.email,
  password: formData.password,
  full_name: formData.name,
  phone: formData.phone,
  role: formData.role,
})
```

### 3. Auto Profile Creation
Database trigger (`on_auth_user_created`) runs automatically:
```sql
INSERT INTO public.profiles (id, email, full_name, role)
VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
);
```

### 4. Optional: Update Phone
If phone was provided, it's passed in metadata and can be updated:
```javascript
await supabase
  .from('profiles')
  .update({ phone: formData.phone })
  .eq('id', user.id)
```

### 5. Email Verification
Supabase sends verification email automatically (if enabled in settings).

### 6. Redirect to Login
User is redirected to login page with success message.

## 🧪 Testing the Signup

### Option 1: Using the UI
1. Start your dev server: `npm run dev`
2. Navigate to: http://localhost:3002/signup
3. Fill out the form with all fields
4. Select a role
5. Submit the form
6. Check your email for verification

### Option 2: Using Supabase Dashboard
1. Go to https://app.supabase.com
2. Select your project
3. Go to Authentication > Users
4. Click "Add User" or check newly created users
5. Go to Table Editor > profiles
6. Verify all attributes are stored

### Option 3: Using SQL
```sql
-- View all profiles with their attributes
SELECT 
  id, 
  email, 
  full_name, 
  phone, 
  role, 
  created_at 
FROM profiles 
ORDER BY created_at DESC 
LIMIT 10;
```

## 📋 What Gets Stored

### In auth.users
- `id` - UUID
- `email` - Email address
- `encrypted_password` - Hashed password
- `email_confirmed_at` - Verification timestamp
- `raw_user_meta_data` - JSON with full_name, role, etc.

### In public.profiles
- `id` - Same UUID as auth.users
- `email` - Email (for easy querying)
- `full_name` - User's full name
- `phone` - Phone number (nullable)
- `role` - User role (admin/business/customer)
- `avatar_url` - Profile picture URL (nullable)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

## 🔒 Security Features

### Row Level Security (RLS)
```sql
-- Users can only view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);
```

### Password Security
- Passwords are hashed by Supabase Auth
- Never stored in plain text
- Minimum 8 characters enforced in UI
- Can add more validation (uppercase, numbers, symbols)

## 🎯 Next Steps

### 1. Customize Email Templates
Go to Supabase Dashboard > Authentication > Email Templates
- Confirmation email
- Password reset email
- Invite email

### 2. Add More Profile Fields
Extend the profiles table:
```sql
ALTER TABLE public.profiles 
ADD COLUMN date_of_birth DATE,
ADD COLUMN address TEXT,
ADD COLUMN city TEXT,
ADD COLUMN country TEXT;
```

### 3. Add Avatar Upload
Use Supabase Storage for profile pictures:
```javascript
// Upload avatar
const { data, error } = await supabase.storage
  .from('avatars')
  .upload(`${userId}/avatar.jpg`, file)

// Update profile with avatar URL
await supabase
  .from('profiles')
  .update({ avatar_url: data.path })
  .eq('id', userId)
```

### 4. Add Business Profile Creation
For business users, create a business record automatically:
```javascript
if (user.role === 'business') {
  await createBusiness({
    owner_id: user.id,
    name: 'My Business', // From signup or prompt user
    // ... other fields
  })
}
```

## 🐛 Troubleshooting

### Profile Not Created
1. Check if schema.sql was run completely
2. Verify trigger exists: `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created'`
3. Check Supabase logs for errors

### Email Not Verified
1. Check Supabase > Authentication > Settings
2. Enable/disable email confirmation
3. Check spam folder for verification emails

### RLS Errors
1. Temporarily disable RLS for testing:
   ```sql
   ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
   ```
2. Check policy definitions
3. Re-enable when fixed

## 📚 Files Updated

- ✅ [app/(auth)/signup/page.js](../app/(auth)/signup/page.js) - Signup form with all fields
- ✅ [app/(auth)/login/page.js](../app/(auth)/login/page.js) - Login with Supabase
- ✅ [lib/auth/index.js](../lib/auth/index.js) - Auth functions (signUp, signIn)
- ✅ [lib/supabase/client.js](../lib/supabase/client.js) - Supabase client
- ✅ [lib/supabase/queries.js](../lib/supabase/queries.js) - Database queries
- ✅ [supabase/schema.sql](../supabase/schema.sql) - Database schema
- ✅ [components/auth/ProtectedRoute.js](../components/auth/ProtectedRoute.js) - Route protection

## 🚀 Ready to Use!

Your signup system is now fully integrated with Supabase and will:
1. ✅ Collect all user information
2. ✅ Create auth account with Supabase Auth
3. ✅ Automatically create profile with all attributes
4. ✅ Enforce role-based access
5. ✅ Secure data with RLS policies

Start your app and try creating a user!
```bash
npm run dev
```

Then visit: http://localhost:3002/signup
