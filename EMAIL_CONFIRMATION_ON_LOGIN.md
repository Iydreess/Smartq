# Email Confirmation on Login

## Overview

The SmartQ application now requires email confirmation for real users when they try to log in. Demo accounts (@smartq.com) automatically bypass this requirement.

## How It Works

### For Real Users (New Signups)

1. **User Signs Up** → Account is created in Supabase Auth
2. **User Tries to Login** → System checks if email is confirmed
3. **Email Not Confirmed** → System sends confirmation email automatically
4. **User Clicks Link** → Email is verified
5. **User Logs In Again** → Successfully authenticated and redirected to dashboard

### For Demo Accounts

Demo accounts (emails ending in @smartq.com or test@example.com) automatically bypass email confirmation for development purposes.

## Enable Email Confirmation in Supabase

### Step 1: Enable Email Confirmation

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Settings**
4. Scroll to **Email Auth** section
5. Find **"Enable email confirmations"**
6. **Toggle it ON**
7. Click **Save**

### Step 2: Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Select **Confirm signup** template
3. Customize if needed (optional):

```html
<h2>Confirm your email address</h2>
<p>Thank you for signing up with SmartQ!</p>
<p>Please click the link below to confirm your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm Email</a></p>
<p>If you didn't create this account, you can safely ignore this email.</p>
```

4. Set the **Site URL** in Authentication Settings:
   - For development: `http://localhost:3002`
   - For production: `https://yourdomain.com`

### Step 3: Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL**: Your app's main URL
3. Add **Redirect URLs**:
   - `http://localhost:3002/login` (development)
   - `https://yourdomain.com/login` (production)

## Testing the Flow

### Test with Real Email

1. Create a new account with your real email address
2. Try to log in immediately (without confirming email)
3. You should see: "Please verify your email address. We've sent a confirmation link to your email."
4. Check your email inbox
5. Click the confirmation link
6. Return to login page and try again
7. Login should now succeed

### Test with Demo Account

```
Email: admin@smartq.com
Password: admin123
```

Demo accounts log in immediately without email confirmation.

## Customizing Email Provider

### For Production: Use Custom Email Service

Supabase free tier has email rate limits. For production, configure a custom SMTP provider:

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Enable **Custom SMTP**
4. Configure your email service:
   - **SendGrid**
   - **Mailgun**
   - **AWS SES**
   - **Postmark**
   - Or any SMTP provider

Example with SendGrid:
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP Username: apikey
SMTP Password: [Your SendGrid API Key]
Sender Email: noreply@yourdomain.com
Sender Name: SmartQ
```

## Code Implementation

### Sign In Flow (lib/auth/index.js)

```javascript
// 1. Authenticate credentials
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
})

// 2. Check email confirmation (skip for demo accounts)
if (!isDemoAccount && !emailConfirmed) {
  // Sign out and send confirmation email
  await supabase.auth.signOut()
  await supabase.auth.resend({
    type: 'signup',
    email: email,
  })
  
  return {
    success: false,
    requiresEmailConfirmation: true,
    message: 'Please verify your email...'
  }
}

// 3. Proceed with login
```

### Login Page (app/(auth)/login/page.js)

```javascript
if (result.requiresEmailConfirmation) {
  toast.error(result.message, {
    duration: 6000,
    icon: '📧',
  })
}
```

## Troubleshooting

### Email Not Received

1. **Check Spam Folder** - Supabase emails may be filtered
2. **Verify Email Address** - Ensure correct email was entered
3. **Check Rate Limits** - Free tier has hourly email limits
4. **Check Email Server** - Ensure your email provider accepts emails from Supabase

### Email Confirmation Not Working

1. **Check Site URL** - Must match your app's URL
2. **Check Redirect URLs** - Must be whitelisted in Supabase
3. **Browser Console** - Check for errors during redirect
4. **Supabase Logs** - Check Auth logs in Supabase Dashboard

### Demo Accounts Not Bypassing

Demo accounts must match these patterns:
- Email ends with `@smartq.com`
- Email is exactly `test@example.com`

Update the bypass logic in `lib/auth/index.js` if needed:

```javascript
const isDemoAccount = email.endsWith('@smartq.com') || 
                      email === 'test@example.com' ||
                      email.endsWith('@yourdomain.com') // Add your domain
```

## Security Considerations

### Why Email Confirmation?

1. **Prevent Fake Accounts** - Ensures valid email addresses
2. **Reduce Spam** - Verifies user legitimacy
3. **Account Recovery** - Ensures users have access to their email
4. **Compliance** - Required for GDPR and other regulations

### Production Recommendations

1. ✅ Enable email confirmation for all users
2. ✅ Use custom SMTP provider (not Supabase default)
3. ✅ Set appropriate rate limits
4. ✅ Monitor email delivery rates
5. ✅ Implement email resend functionality with cooldowns
6. ✅ Add email change verification

## Related Files

- [lib/auth/index.js](lib/auth/index.js) - Authentication logic
- [app/(auth)/login/page.js](app/(auth)/login/page.js) - Login page
- [SUPABASE_EMAIL_SETUP.md](SUPABASE_EMAIL_SETUP.md) - Email configuration guide
- [DISABLE_EMAIL_CONFIRMATION.md](DISABLE_EMAIL_CONFIRMATION.md) - Disable for development

## Support

For issues or questions:
1. Check Supabase Auth logs in dashboard
2. Review browser console for errors
3. Test with demo accounts first
4. Verify Supabase email settings
