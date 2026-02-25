# Email Confirmation Setup Guide

## Overview

SmartQ now supports complete email confirmation workflows for both signup and password reset. This guide explains how to enable and configure email confirmation for your application.

## Features Implemented

### ✅ Signup Email Confirmation
- New users receive a confirmation email after signup
- Users must click the link in the email to verify their account
- Verified users can then log in successfully

### ✅ Login Email Verification Check
- When unverified users try to log in, a confirmation email is automatically resent
- Users are notified to check their email

### ✅ Password Reset
- Users can request a password reset email
- Email contains a secure link to reset their password
- Link redirects to `/reset-password` page

### ✅ Demo Account Bypass
- Demo accounts (@smartq.com) bypass email confirmation
- Useful for development and testing

## Enable Email Confirmation in Supabase

### Step 1: Configure Email Settings

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Settings**

### Step 2: Enable Email Confirmations

1. Scroll to **Email Auth** section
2. Find **"Enable email confirmations"**
3. **Toggle it ON**
4. Click **Save**

### Step 3: Configure Site URL and Redirect URLs

1. Still in **Authentication** → **Settings**
2. Find **Site URL** section
3. Set your Site URL:
   - Development: `http://localhost:3002`
   - Production: `https://yourdomain.com`
4. Scroll to **Redirect URLs**
5. Add these URLs (one per line):
   ```
   http://localhost:3002/login
   http://localhost:3002/reset-password
   https://yourdomain.com/login
   https://yourdomain.com/reset-password
   ```
6. Click **Save**

### Step 4: Customize Email Templates (Optional)

#### Confirm Signup Email

1. Go to **Authentication** → **Email Templates**
2. Select **Confirm signup** template
3. Customize the template (or keep default):

```html
<h2>Welcome to SmartQ!</h2>
<p>Thank you for signing up. Please confirm your email address to start using SmartQ.</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Confirm Email Address</a></p>
<p>Or copy and paste this link into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p style="color: #666; font-size: 12px; margin-top: 20px;">If you didn't create this account, you can safely ignore this email.</p>
```

#### Reset Password Email

1. Select **Reset Password** template
2. Customize:

```html
<h2>Reset Your Password</h2>
<p>We received a request to reset your password for your SmartQ account.</p>
<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Reset Password</a></p>
<p>Or copy and paste this link into your browser:</p>
<p>{{ .ConfirmationURL }}</p>
<p style="color: #666; font-size: 12px; margin-top: 20px;">If you didn't request this, please ignore this email. Your password will remain unchanged.</p>
<p style="color: #666; font-size: 12px;">This link will expire in 1 hour.</p>
```

## User Flows

### New User Signup Flow

```
1. User fills signup form
   ↓
2. System creates account
   ↓
3. Confirmation email sent
   ↓
4. User redirected to login with message
   ↓
5. User checks email & clicks link
   ↓
6. Email verified → Redirected to login
   ↓
7. User logs in successfully
```

### Unverified User Login Flow

```
1. Unverified user tries to log in
   ↓
2. System detects unverified email
   ↓
3. New confirmation email sent
   ↓
4. User sees message: "Check your email"
   ↓
5. User clicks confirmation link
   ↓
6. Email verified
   ↓
7. User logs in successfully
```

### Password Reset Flow

```
1. User clicks "Forgot Password"
   ↓
2. User enters email address
   ↓
3. Reset email sent
   ↓
4. User clicks link in email
   ↓
5. User redirected to /reset-password
   ↓
6. User enters new password
   ↓
7. Password updated
   ↓
8. User redirected to login
```

## Testing

### Test Signup with Email Confirmation

1. Start your dev server: `npm run dev`
2. Navigate to: `http://localhost:3002/signup`
3. Create an account with a real email address
4. Check your inbox for confirmation email
5. Click the confirmation link
6. You should be redirected to login
7. Log in with your credentials

### Test Password Reset

1. Navigate to: `http://localhost:3002/forgot-password`
2. Enter your email address
3. Check your inbox for reset email
4. Click the reset link
5. Enter your new password
6. Submit form
7. You should be redirected to login
8. Log in with new password

### Test with Demo Accounts

Demo accounts bypass email confirmation:

```
Admin Account:
Email: admin@smartq.com
Password: admin123

Business Account:
Email: business@smartq.com
Password: business123

Customer Account:
Email: customer@smartq.com
Password: customer123
```

## Custom Email Provider (Production)

For production, configure a custom SMTP provider for better deliverability:

### Recommended Providers

- **SendGrid** - 100 emails/day free
- **Mailgun** - 5,000 emails/month free
- **AWS SES** - 62,000 emails/month free
- **Postmark** - Free development account
- **Resend** - 3,000 emails/month free

### Configure SMTP in Supabase

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Enable **Custom SMTP**
4. Fill in your provider details:

**SendGrid Example:**
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP Username: apikey
SMTP Password: [Your SendGrid API Key]
Sender Email: noreply@yourdomain.com
Sender Name: SmartQ
```

**Resend Example:**
```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP Username: resend
SMTP Password: [Your Resend API Key]
Sender Email: noreply@yourdomain.com
Sender Name: SmartQ
```

5. Save settings
6. Send a test email to verify

## Troubleshooting

### Problem: Email Not Received

**Solutions:**
1. ✅ Check spam/junk folder
2. ✅ Verify email address is correct
3. ✅ Check Supabase email logs: **Auth** → **Logs**
4. ✅ Verify SMTP settings (if using custom provider)
5. ✅ Check rate limits (free tier: ~30 emails/hour)

### Problem: Confirmation Link Doesn't Work

**Solutions:**
1. ✅ Verify redirect URLs are whitelisted in Supabase
2. ✅ Check Site URL matches your app URL
3. ✅ Check browser console for errors
4. ✅ Link expires after 1 hour - request new one

### Problem: Link Shows "Invalid or Expired"

**Solutions:**
1. ✅ Request a new confirmation email
2. ✅ Ensure you're using the latest link
3. ✅ Check Supabase auth logs for errors
4. ✅ Verify email confirmation is enabled

### Problem: Demo Accounts Require Email Confirmation

**Check bypass logic in `/lib/auth/index.js`:**

```javascript
const isDemoAccount = email.endsWith('@smartq.com') || 
                      email === 'test@example.com'
```

Add your demo domains as needed.

### Problem: Rate Limit Errors

**Solutions:**
1. For development, you can disable email confirmation temporarily
2. For production, upgrade Supabase plan or use custom SMTP
3. Wait a few minutes between signup attempts

## Code Reference

### Key Files

- [lib/auth/index.js](lib/auth/index.js) - Authentication functions
  - `signUp()` - Handles user registration
  - `signIn()` - Handles login with email verification
  - `resetPassword()` - Sends password reset email
  
- [app/(auth)/signup/page.js](app/(auth)/signup/page.js) - Signup page
- [app/(auth)/login/page.js](app/(auth)/login/page.js) - Login page
- [app/(auth)/forgot-password/page.js](app/(auth)/forgot-password/page.js) - Password reset request
- [app/(auth)/reset-password/page.js](app/(auth)/reset-password/page.js) - Password reset form

### Sign Up Function

```javascript
const result = await signUp({
  email: formData.email,
  password: formData.password,
  full_name: formData.name,
  phone: formData.phone,
  role: formData.role,
})

if (result.needsConfirmation) {
  // Show message to check email
}
```

### Sign In Function

```javascript
const result = await signIn(email, password)

if (result.requiresEmailConfirmation) {
  // Confirmation email was sent
}
```

### Reset Password Function

```javascript
const result = await resetPassword(email)

if (result.success) {
  // Email sent successfully
}
```

## Security Best Practices

### ✅ Email Verification
- Prevents fake accounts with invalid emails
- Ensures users have access to their email
- Required for password recovery

### ✅ Rate Limiting
- Prevents spam and abuse
- Built into Supabase Auth
- Custom SMTP for higher limits

### ✅ Link Expiration
- Confirmation links expire after 1 hour
- Reset links expire after 1 hour
- Protects against link hijacking

### ✅ Secure Tokens
- Use Supabase's built-in token system
- Tokens are cryptographically secure
- Auto-generated by Supabase Auth

## Development vs Production

### Development Mode (Email Confirmation Disabled)

If you want to develop without email confirmation:

1. Go to Supabase Dashboard
2. **Authentication** → **Settings**
3. **Disable** "Enable email confirmations"
4. Users can sign up and log in immediately

### Production Mode (Email Confirmation Enabled)

For production:

1. ✅ Enable email confirmations
2. ✅ Configure custom SMTP provider
3. ✅ Use custom domain for emails
4. ✅ Monitor email delivery rates
5. ✅ Set up custom email templates
6. ✅ Configure proper redirect URLs

## Related Documentation

- [SUPABASE_EMAIL_SETUP.md](SUPABASE_EMAIL_SETUP.md) - Detailed email setup
- [EMAIL_CONFIRMATION_ON_LOGIN.md](EMAIL_CONFIRMATION_ON_LOGIN.md) - Login email checks
- [DISABLE_EMAIL_CONFIRMATION.md](DISABLE_EMAIL_CONFIRMATION.md) - Disable for dev
- [SIGNUP_GUIDE.md](SIGNUP_GUIDE.md) - User signup guide

## Support

For issues:
1. Check Supabase Auth logs
2. Review browser console errors
3. Test with demo accounts first
4. Verify all configuration steps
5. Check email provider status

## Summary

✅ **Signup** - New users get confirmation emails
✅ **Login** - Unverified users are prompted to check email
✅ **Password Reset** - Users can reset passwords via email
✅ **Demo Bypass** - Demo accounts skip verification
✅ **Production Ready** - Configure custom SMTP for production

Your SmartQ application now has complete email confirmation workflows! 🎉
