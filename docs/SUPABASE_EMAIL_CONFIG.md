# Supabase Email Configuration - REQUIRED SETUP

## Critical: This configuration MUST be done in Supabase Dashboard

These bugs are fixed in the code, but **you must configure Supabase email settings correctly** or the issues will persist.

---

## Bug #1 Fix: Signup Email Configuration

### Problem:

Users are receiving password reset emails instead of email verification emails when they sign up.

### Solution:

Go to **Supabase Dashboard** → **Authentication** → **Email Templates**

#### 1. Confirm Signup Template

Make sure the **"Confirm signup"** template is set and uses this redirect URL pattern:

**Template:** Use the HTML template in `/emails/confirm-signup.html`

**Confirmation URL:** Should redirect to:

\`\`\`
{{ .SiteURL }}/auth/callback?code={{ .Token }}&next=/login?verified=true
\`\`\`

The `{{ .ConfirmationURL }}` variable in the template will automatically handle this.

---

## Bug #2 Fix: Password Reset Redirect

### Problem:

Password reset links redirect to dashboard instead of the reset password form.

### Solution:

Go to **Supabase Dashboard** → **Authentication** → **Email Templates**

#### Reset Password Template

Use the HTML template in `/emails/reset-password.html`

**Confirmation URL:** Should redirect to:

\`\`\`
{{ .SiteURL }}/auth/callback?type=recovery&code={{ .Token }}
\`\`\`

**CRITICAL:** The URL **must include** `type=recovery` parameter so the callback knows it's a password reset, not email verification.

---

## Bug #4 Fix: Password Reset Link Expiration (30 minutes)

### Problem:

Need to set password reset link expiration to 30 minutes.

### Solution:

Go to **Supabase Dashboard** → **Authentication** → **Settings**

1. Scroll to **"Email"** section
2. Find **"Mailer Secure Password Change Expiry"** or **"Password Reset Token Expiry"**
3. Set value to: **1800** (seconds) = 30 minutes
4. Save changes

**Note:** Default is usually 3600 seconds (1 hour). Change to 1800 for 30 minutes.

---

## Complete Supabase Configuration Checklist

### 1. URL Configuration

**Path:** Authentication → URL Configuration

Add these **Redirect URLs**:

**Production:**

\`\`\`
https://v0-e-amplify-web-app-git-amplifywebapp-eafricang-9522s-projects.vercel.app/auth/callback
https://v0-e-amplify-web-app-git-amplifywebapp-eafricang-9522s-projects.vercel.app/auth/reset-password
https://v0-e-amplify-web-app-git-amplifywebapp-eafricang-9522s-projects.vercel.app/login
https://v0-e-amplify-web-app-git-amplifywebapp-eafricang-9522s-projects.vercel.app/feed
\`\`\`

**Local Development:**

\`\`\`
http://localhost:3000/auth/callback
http://localhost:3000/auth/reset-password
http://localhost:3000/login
http://localhost:3000/feed
\`\`\`

**Site URL:**

\`\`\`
https://v0-e-amplify-web-app-git-amplifywebapp-eafricang-9522s-projects.vercel.app
\`\`\`

### 2. Email Templates

**Path:** Authentication → Email Templates

#### Confirm Signup:

- Use template from `/emails/confirm-signup.html`
- Ensure `{{ .ConfirmationURL }}` is used
- Should NOT include `type=recovery` in URL

#### Reset Password:

- Use template from `/emails/reset-password.html`
- Ensure `{{ .ConfirmationURL }}` is used
- URL from code will include `type=recovery` parameter

### 3. Auth Settings

**Path:** Authentication → Settings

- **Password Reset Token Expiry:** 1800 seconds (30 minutes)
- **Email Confirm Token Expiry:** Keep default (24 hours is fine)
- **Enable Email Confirmations:** ON
- **Double Confirm Password Changes:** OFF (not needed for reset)

---

## Testing After Configuration

### Test 1: Signup Flow

1. Sign up with a new email
2. Check email - should receive **"Confirm Your E-Amplify Signup"** email
3. Click the confirmation link
4. Should redirect to `/login?verified=true`
5. Should see "Email verified successfully!" message
6. Log in should redirect to `/feed`

### Test 2: Password Reset Flow

1. Go to `/forgot-password`
2. Enter your email
3. Check email - should receive **"Reset Your E-Amplify Password"** email
4. Click the reset link
5. Should redirect to `/auth/reset-password` page
6. Enter new password and confirm
7. Should redirect to `/login?reset=success`
8. Should see "Password reset successfully!" message
9. Log in with new password should work

### Test 3: Login Redirect

1. Log in with valid credentials
2. Should automatically redirect to `/feed` page
3. Should NOT redirect to dashboard or profile

---

## Code Changes Made

✅ **Fixed `/lib/auth-actions.ts`:**

- Updated comment for password reset to mention 30-minute expiration
- Ensured `type=recovery` is in redirectTo URL

✅ **Fixed `/app/auth/callback/route.ts`:**

- Added better logging to debug flow
- Improved detection of password recovery vs email verification
- Uses `type=recovery` parameter to determine flow

✅ **Already Working `/lib/auth-context.tsx`:**

- Login already redirects to `/feed` on SIGNED_IN event
- No changes needed

---

## Important Notes

1. **Email Template Variables:**

   - `{{ .ConfirmationURL }}` - Full URL with code
   - `{{ .Token }}` - Just the code/token
   - `{{ .SiteURL }}` - Your site URL from settings
   - `{{ .Email }}` - User's email address

2. **URL Parameters:**

   - `next=/login?verified=true` - For email verification
   - `type=recovery` - For password reset
   - Without these, the callback won't know which flow it is

3. **After Making Changes:**

   - Changes take effect immediately
   - Old emails already sent will use old configuration
   - Test with NEW signup/reset requests only
   - Clear browser cache and cookies

4. **Common Mistakes:**
   - Forgetting to add `type=recovery` to reset password URL
   - Using wrong template for wrong action
   - Not adding all redirect URLs to allow list
   - Wrong token expiry format (use seconds, not minutes)

---

## If Issues Persist

1. Check Supabase Dashboard → Logs → Auth Logs
2. Check browser console for errors
3. Check server logs for console.log messages from callback
4. Verify environment variables in Vercel are correct
5. Test in incognito/private browser window
6. Request NEW verification/reset email (don't reuse old ones)

---

## Support

If you've followed all steps and still have issues:

1. Check the callback logs - they show exactly what's happening
2. Verify the email template configuration matches above
3. Ensure all redirect URLs are in the allow list
4. Try with a completely new user/email for testing
