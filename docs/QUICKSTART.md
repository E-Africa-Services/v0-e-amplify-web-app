# Quick Start - Run This SQL First!

## 🚀 Setup Instructions

### Step 1: Go to Supabase SQL Editor

1. Open your Supabase project: https://supabase.com/dashboard/project/zwgbyazovphrgvaapysv
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"

### Step 2: Copy and Run the Schema

Copy the entire contents of `/supabase/schema.sql` and paste into the SQL Editor, then click "Run".

OR run this command if you have Supabase CLI:

```bash
supabase db push
```

### Step 3: Verify Tables Were Created

1. Go to "Table Editor" in Supabase dashboard
2. You should see these tables:
   - profiles
   - skills
   - sessions
   - reviews
   - credits
   - credit_transactions
   - posts

### Step 4: Test the Trigger

The database will automatically:

- Create a profile when a user signs up
- Give new users 100 free credits
- Keep timestamps updated

## 🧪 Quick Test

After running the schema, test your app:

```bash
# Install dependencies (if not done)
pnpm install

# Start development server
pnpm dev
```

Then:

1. Visit http://localhost:3000
2. Click "Get Started"
3. Complete onboarding
4. Check Supabase Table Editor to see your data!

## 📋 What the Schema Creates

### Tables:

- **profiles** - User information (name, email, bio, goal, location)
- **skills** - User skills with proficiency levels
- **sessions** - Mentorship sessions (scheduled, completed, cancelled)
- **reviews** - Session ratings and comments
- **credits** - User credit balances
- **credit_transactions** - Purchase/earn/spend history
- **posts** - Social feed posts

### Security:

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Public data (profiles, reviews) visible to all
- Secure policies for data modification

### Automation:

- Auto-create profile on signup
- Auto-give 100 credits to new users
- Auto-update timestamps on changes

## ⚡ Common Issues

### "relation does not exist"

→ Run the SQL schema in Supabase SQL Editor

### "permission denied"

→ RLS policies are working correctly! Make sure you're authenticated

### "trigger does not exist"

→ Re-run the entire schema script

## 🎯 Next Steps

After schema is set up:

1. ✅ Schema created
2. ✅ Environment variables configured
3. ✅ Dependencies installed
4. ✅ Run `pnpm dev`
5. ✅ Test signup/login flow
6. ✅ Verify data in Supabase Table Editor

Enjoy building with E-Amplify! 🚀
