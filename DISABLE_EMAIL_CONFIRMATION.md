# Disable Email Confirmation for Development

## Issue
You're seeing: **"email rate limit exceeded"**

This happens because:
- Supabase sends confirmation emails on signup
- Free tier has email rate limits
- Development testing triggers this quickly

## Quick Fix for Development

### Option 1: Disable Email Confirmation (Recommended for Dev)

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `qokszxfbcqqojnlbkalx`
3. Go to **Authentication** > **Settings**
4. Scroll to **Email Auth**
5. Find **"Enable email confirmations"**
6. **Toggle it OFF**
7. Click **Save**

✅ Now users can sign up immediately without email verification!

### Option 2: Use Auto-confirm in Development

If you want to keep emails enabled but skip confirmation:

1. Go to **Authentication** > **Settings**
2. Scroll to **Email Auth**
3. Find **"Confirm email"**
4. Set to **Disabled** (for development only)

### Option 3: Increase Rate Limits (Paid Plans)

Upgrade your Supabase plan for higher email limits.

## After Disabling Email Confirmation

### Test Signup Flow
```bash
# Your app is running at:
http://localhost:3002/signup
```

1. Fill out the signup form
2. Click "Create account"
3. You'll be redirected to login
4. Sign in immediately (no email confirmation needed)

### For Production

**Important**: Re-enable email confirmation before going to production!

1. Go back to Authentication > Settings
2. Enable "Enable email confirmations"
3. Customize email templates if needed

## Alternative: Skip Email for Testing

You can also create users directly in Supabase:

1. Go to **Authentication** > **Users**
2. Click **"Add User"**
3. Enter email and password
4. Set **Auto Confirm** to ON
5. Click **Create User**

Then you can immediately login with those credentials!

## Current Settings to Apply

For development environment:
- ✅ Disable email confirmations
- ✅ Auto-confirm users
- ✅ Set a simple redirect URL

For production:
- ✅ Enable email confirmations
- ✅ Customize email templates
- ✅ Set proper redirect URLs
- ✅ Consider using a custom SMTP provider

---

**After applying these changes, try signing up again!**
