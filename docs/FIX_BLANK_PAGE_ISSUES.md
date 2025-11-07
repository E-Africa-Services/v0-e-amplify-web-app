# Fixing Blank Page Issues - Email Verification & Password Reset

## What Was Fixed in Code:

✅ **Updated `/app/auth/callback/route.ts`**:
- Added better error handling
- Added logging to debug issues
- Improved redirect logic for both email verification and password reset

✅ **Updated `/app/auth/reset-password/page.tsx`**:
- Removed strict email verification check for password recovery
- Added console logging for debugging
- Recovery links don't need email_confirmed_at check

## Critical: Check Supabase Email Settings

The blank pages are likely caused by **incorrect redirect URLs in Supabase**. You need to configure these in your Supabase dashboard:

### Step 1: Update Supabase Auth Settings

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `zwgbyazovphrgvaapysv`
3. Go to **Authentication** → **URL Configuration**

### Step 2: Add Redirect URLs

Add these URLs to the **Redirect URLs** list:

**For Production:**
\`\`\`
https://v0-e-amplify-web-app-git-amplifywebapp-eafricang-9522s-projects.vercel.app/auth/callback
https://v0-e-amplify-web-app-git-amplifywebapp-eafricang-9522s-projects.vercel.app/auth/reset-password
https://v0-e-amplify-web-app-git-amplifywebapp-eafricang-9522s-projects.vercel.app/login
\`\`\`

**For Local Development:**
\`\`\`
http://localhost:3000/auth/callback
http://localhost:3000/auth/reset-password
http://localhost:3000/login
\`\`\`

### Step 3: Update Site URL

Set your **Site URL** to:
\`\`\`
https://v0-e-amplify-web-app-git-amplifywebapp-eafricang-9522s-projects.vercel.app
\`\`\`

### Step 4: Check Email Templates

Go to **Authentication** → **Email Templates** and verify:

#### Confirm Signup Template:
\`\`\`html
<h2>Confirm your signup</h2>
<p>Follow this link to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
\`\`\`

The `{{ .ConfirmationURL }}` should automatically include your redirect URL.

#### Reset Password Template:
\`\`\`html
<h2>Reset Password</h2>
<p>Follow this link to reset your password:</p>
<p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
\`\`\`

### Step 5: Test the Flow

After updating Supabase settings:

1. **Test Email Verification:**
   - Sign up with a new email
   - Check your email
   - Click the verification link
   - Should redirect to `/login?verified=true` with success message

2. **Test Password Reset:**
   - Go to `/forgot-password`
   - Enter your email
   - Check your email
   - Click reset link
   - Should show reset password form (not blank page)
   - Enter new password
   - Should redirect to login with success message

## Debugging Steps

If you still see blank pages:

### 1. Check Browser Console
Open Developer Tools (F12) and check:
- Console tab for JavaScript errors
- Network tab to see redirect chain
- Look for failed requests to `/auth/callback`

### 2. Check Server Logs
If deployed on Vercel:
- Go to your Vercel project
- Click on "Deployments"
- Click on latest deployment
- Check "Runtime Logs"
- Look for console.log messages we added

### 3. Check Supabase Logs
- Go to Supabase Dashboard
- Click on "Logs" → "Auth Logs"
- Look for verification/reset attempts
- Check for any errors

### 4. Verify Environment Variables in Vercel
Ensure these are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` (without trailing slash)
- `SUPABASE_SERVICE_ROLE_KEY`

## Common Issues & Solutions

### Issue: "Invalid redirect URL"
**Solution:** Add the URL to Supabase redirect URLs list

### Issue: "Session not found" after clicking link
**Solution:** 
- Check if email link expired (links expire after 1 hour)
- Request new verification/reset email

### Issue: Redirects to localhost instead of production
**Solution:** 
- Set `NEXT_PUBLIC_APP_URL` in Vercel environment variables
- Redeploy the application

### Issue: Reset password page shows "Not authorized"
**Solution:**
- We've removed the strict email verification check
- Make sure you're clicking a valid, non-expired reset link
- Try requesting a new reset link

## After Making Changes

1. **Redeploy your app** if you made code changes
2. **Clear browser cache** and cookies
3. **Try in incognito/private window** to test fresh
4. **Request new verification/reset email** (old links may be cached)

## Need More Help?

Check the console logs we added:
- Look for "Auth callback:" logs in server logs
- Look for "Session established:" logs
- Look for any error messages in browser console

The logs will tell you exactly where the flow is breaking.
