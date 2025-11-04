# Vercel Deployment Setup Guide

## ⚠️ Important: Environment Variables Issue

Your testers are getting `localhost` because **environment variables in `.env.local` are NOT deployed to Vercel**. The `.env.local` file only works on your local machine.

## 🔧 Fix the Issue - Add Environment Variables to Vercel

### Step 1: Go to Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Select your project: `v0-e-amplify-web-app`
3. Click on **Settings** tab
4. Click on **Environment Variables** in the sidebar

### Step 2: Add These Environment Variables

Add each of these variables one by one:

#### Variable 1: NEXT_PUBLIC_SUPABASE_URL

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://zwgbyazovphrgvaapysv.supabase.co
Environment: Production, Preview, Development (check all 3)
```

#### Variable 2: NEXT_PUBLIC_SUPABASE_ANON_KEY

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3Z2J5YXpvdnBocmd2YWFweXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMjMzOTIsImV4cCI6MjA3Njc5OTM5Mn0.P8Jmlg8ir7_GZSkHLHjiGTHyLyMv9IgD3ME-phJwOXI
Environment: Production, Preview, Development (check all 3)
```

#### Variable 3: SUPABASE_SERVICE_ROLE_KEY

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3Z2J5YXpvdnBocmd2YWFweXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTIyMzM5MiwiZXhwIjoyMDc2Nzk5MzkyfQ.dMoUi1TbgBFk8J8blQ2I84Dk-wEc9kXLK0vfsvTFcGA
Environment: Production ONLY (for security)
```

#### Variable 4: NEXT_PUBLIC_APP_URL

```
Name: NEXT_PUBLIC_APP_URL
Value: https://v0-e-amplify-web-app-git-amplifywebapp-eafricang-9522s-projects.vercel.app
Environment: Production, Preview, Development (check all 3)
```

**⚠️ IMPORTANT:** Do NOT include a trailing `/` at the end of the URL.

### Step 3: Redeploy Your Application

After adding all environment variables, you MUST redeploy:

**Option A: Push a new commit** (Recommended)

```bash
git add .
git commit -m "Update environment variables"
git push
```

**Option B: Manual redeploy in Vercel**

1. Go to **Deployments** tab
2. Click the three dots `...` on your latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete

### Step 4: Verify the Fix

After redeployment:

1. Visit your production URL
2. Try the password reset flow
3. Check that email links redirect to your production URL, not `localhost`
4. Test signup and email verification flows

## 🔍 How to Check if Environment Variables are Set

### In Vercel Dashboard:

1. Go to **Settings** → **Environment Variables**
2. You should see all 4 variables listed

### During Build:

1. Go to **Deployments** → Click on latest deployment
2. Click on **Build Logs**
3. Look for environment variables being loaded (NEXT*PUBLIC*\* ones will be visible)

## 📝 Understanding Environment Files

| File              | Usage                               | Deployed?                   |
| ----------------- | ----------------------------------- | --------------------------- |
| `.env.local`      | Local development only              | ❌ NO                       |
| `.env.production` | Could work but not recommended      | ⚠️ Only if committed to git |
| Vercel Dashboard  | Production/Preview/Dev environments | ✅ YES                      |

**Best Practice:** Always set environment variables in Vercel Dashboard for production deployments.

## 🔐 Security Notes

1. **SUPABASE_SERVICE_ROLE_KEY**:

   - Only set for Production environment
   - This key has admin privileges
   - Never expose in client-side code

2. **NEXT*PUBLIC*\* variables**:
   - These are exposed to the browser
   - Safe to use in client-side code
   - Set for all environments (Production, Preview, Development)

## 🧪 Testing After Deployment

1. **Signup Flow**: Create new account → Check email → Verify
2. **Login Flow**: Sign in with credentials
3. **Password Reset**:
   - Click "Forgot password?"
   - Check email link redirects to production URL (not localhost)
   - Reset password → Should redirect to production login page
4. **Profile Access**: After login, click profile → Should load correctly

## ❓ Troubleshooting

### Issue: Still getting localhost in emails

**Solution:**

- Verify `NEXT_PUBLIC_APP_URL` is set in Vercel (no trailing `/`)
- Redeploy the application
- Clear browser cache

### Issue: Supabase errors in production

**Solution:**

- Verify all Supabase environment variables are set
- Check Supabase dashboard → Settings → API to confirm URLs and keys
- Redeploy

### Issue: Changes not reflecting

**Solution:**

- Environment variable changes require a redeploy
- Clear browser cache or try incognito mode
- Check deployment logs for any build errors

## 🎯 Quick Checklist

- [ ] Added all 4 environment variables to Vercel
- [ ] Set correct environments for each variable
- [ ] Removed trailing `/` from NEXT_PUBLIC_APP_URL
- [ ] Redeployed the application
- [ ] Tested signup flow
- [ ] Tested password reset flow
- [ ] Verified email links use production URL

---

**Current Production URL:**
`https://v0-e-amplify-web-app-git-amplifywebapp-eafricang-9522s-projects.vercel.app`

**Note:** You can also set a custom domain in Vercel Settings → Domains for a cleaner URL.
