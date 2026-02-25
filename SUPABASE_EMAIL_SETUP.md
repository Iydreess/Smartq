# Supabase Email Configuration Guide

This guide explains how to enable email confirmation and password reset emails for your SmartQ application.

## Overview

- **Demo Accounts**: Auto-confirmed via admin API (no emails sent)
- **Real Users**: Require email confirmation via Supabase email service

## Step 1: Enable Email Confirmation

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Authentication** → **Providers**
4. Find **Email** in the providers list
5. Click on **Email** to expand settings
6. **Enable** "Confirm email"
7. Click **Save**

## Step 2: Configure Email Templates

### A. Confirm Signup Email

1. Go to **Authentication** → **Email Templates**
2. Select **Confirm signup** template
3. Update the email content (optional - use the default or customize):

```html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your account:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

4. **IMPORTANT**: Set the redirect URL to your app's login page
   - In the template settings or project URL configuration
   - Should redirect to: `https://yourdomain.com/login`

### B. Reset Password Email

1. Go to **Authentication** → **Email Templates**
2. Select **Reset Password** template
3. Update the email content (optional):

```html
<h2>Reset Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset your password</a></p>
```

4. **IMPORTANT**: Ensure redirect URL is set to reset password page
   - Should redirect to: `https://yourdomain.com/reset-password`

## Step 3: Configure Site URL

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your application URL:
   - Development: `http://localhost:3000`
   - Production: `https://yourdomain.com`
3. Add **Redirect URLs**:
   - `http://localhost:3000/login` (for development)
   - `http://localhost:3000/reset-password` (for development)
   - `https://yourdomain.com/login` (for production)
   - `https://yourdomain.com/reset-password` (for production)
4. Click **Save**

## Step 4: Configure Email Provider (Production)

For production, you need to configure a custom SMTP provider:

### Option 1: Use Supabase Default (Development Only)
- Supabase provides a default email service for development
- **Limited to 4 emails per hour per user**
- Not recommended for production

### Option 2: Custom SMTP (Recommended for Production)

1. Go to **Project Settings** → **Authentication**
2. Scroll to **SMTP Settings**
3. Enable **Custom SMTP**
4. Configure your email provider:

#### Using SendGrid:
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP Username: apikey
SMTP Password: <your-sendgrid-api-key>
Sender Email: noreply@yourdomain.com
Sender Name: SmartQ
```

#### Using AWS SES:
```
SMTP Host: email-smtp.us-east-1.amazonaws.com
SMTP Port: 587
SMTP Username: <your-aws-access-key>
SMTP Password: <your-aws-secret-key>
Sender Email: noreply@yourdomain.com
Sender Name: SmartQ
```

#### Using Gmail (Development Only):
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Username: your-email@gmail.com
SMTP Password: <app-specific-password>
Sender Email: your-email@gmail.com
Sender Name: SmartQ
```

5. Click **Save**
6. Send a test email to verify configuration

## Step 5: Test Email Flow

### Test User Signup:
1. Go to your app's signup page: `http://localhost:3000/signup`
2. Create a new account with a real email address
3. Check your email inbox for confirmation email
4. Click the confirmation link
5. You should be redirected to the login page
6. Log in with your credentials

### Test Password Reset:
1. Go to forgot password page: `http://localhost:3000/forgot-password`
2. Enter your email address
3. Check your email inbox for reset email
4. Click the reset link
5. You should be redirected to the reset password page
6. Enter your new password
7. You should be able to log in with the new password

## Demo Accounts vs Real Users

### Demo Accounts (Auto-Confirmed)
Created via `npm run create-demo-accounts`:
- **admin@smartq.com** / admin123
- **business@smartq.com** / business123
- **customer@smartq.com** / customer123

These accounts:
- ✅ Created via Supabase Admin API
- ✅ Auto-confirmed (no email required)
- ✅ Can log in immediately
- ❌ Do not receive confirmation emails
- ❌ Do not receive password reset emails (use admin API to reset)

### Real User Accounts
Created via signup form:
- ✅ Require email confirmation (if enabled)
- ✅ Receive confirmation emails
- ✅ Receive password reset emails
- ❌ Cannot log in until email is confirmed

## Troubleshooting

### Emails Not Being Received

1. **Check Spam Folder**: Email might be filtered as spam
2. **Verify SMTP Settings**: Ensure credentials are correct
3. **Check Rate Limits**: Supabase default service has strict limits
4. **Review Logs**: Go to **Authentication** → **Logs** in Supabase dashboard
5. **Test Email Service**: Send a test email from SMTP settings

### "Invalid login credentials" Error

This means:
- User hasn't confirmed their email yet (if confirmation is enabled)
- Wrong email/password combination
- User account doesn't exist

Solution:
- Check email for confirmation link
- Verify credentials are correct
- Use demo accounts for testing

### Email Confirmation Link Doesn't Work

1. **Check Redirect URLs**: Ensure URLs are added to allowed list
2. **Verify Site URL**: Must match your application domain
3. **Check Email Template**: Ensure `{{ .ConfirmationURL }}` is present
4. **Clear Browser Cache**: Old tokens might be cached

## Environment Variables

Ensure these are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Current Application Flow

### New User Registration:
1. User fills signup form → `/signup`
2. Account created in Supabase
3. If email confirmation **enabled**:
   - Email sent to user
   - User sees: "Please check your email to verify your account"
   - User clicks confirmation link in email
   - Redirected to `/login`
   - User can now log in
4. If email confirmation **disabled**:
   - User sees: "Account created successfully!"
   - User can immediately log in

### Password Reset:
1. User goes to `/forgot-password`
2. Enters email address
3. Reset email sent (if email exists in system)
4. User clicks link in email
5. Redirected to `/reset-password`
6. User enters new password
7. Password updated
8. Redirected to `/login`
9. User logs in with new password

## Production Checklist

Before deploying to production:

- [ ] Email confirmation enabled in Supabase
- [ ] Custom SMTP provider configured (not using default)
- [ ] Site URL set to production domain
- [ ] Redirect URLs include production URLs
- [ ] Email templates customized with branding
- [ ] Test emails working in production environment
- [ ] Demo accounts created for testing
- [ ] Email rate limits understood and monitored

## Additional Resources

- [Supabase Email Documentation](https://supabase.com/docs/guides/auth/auth-email)
- [Email Templates Guide](https://supabase.com/docs/guides/auth/auth-email-templates)
- [SMTP Configuration](https://supabase.com/docs/guides/auth/auth-smtp)
