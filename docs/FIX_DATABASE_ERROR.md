# 🚨 DATABASE SETUP - Fixed for Existing Schema

## ❌ Previous Error

```
ERROR: 42P07: relation "idx_sessions_mentor_id" already exists
```

**Cause**: You had partially run SQL scripts from the `/scripts` folder before.

## ✅ NEW SOLUTION - Clean Slate Script

The script has been **completely rewritten** to:

- ✅ Clean up ALL old tables, indexes, triggers, and policies
- ✅ Handle existing objects gracefully (won't error if they exist)
- ✅ Create fresh schema compatible with the new codebase
- ✅ Safe to run multiple times

## 🚀 Run This Now (2 minutes)

### Step 1: Open Supabase SQL Editor

Click: [Open Supabase SQL Editor](https://supabase.com/dashboard/project/zwgbyazovphrgvaapysv/sql)

### Step 2: Run the Updated Script

1. Click **"New Query"**
2. Open: `/supabase/URGENT_RUN_THIS_FIRST.sql`
3. **Copy ALL contents** (entire file)
4. **Paste** into SQL Editor
5. Click **"Run"**

### Step 3: What the Script Does

**Cleanup Phase:**

- Drops old `users` table (from `/scripts/01-schema-setup.sql`)
- Drops old `mentorship_sessions` table
- Drops old indexes like `idx_sessions_mentor_id`
- Drops old triggers and functions
- Drops old enum types
- Drops old RLS policies

**Creation Phase:**

- Creates new `profiles` table (compatible with your app)
- Creates `skills`, `sessions`, `reviews`, `credits`, `credit_transactions`, `posts`
- Creates indexes with `IF NOT EXISTS` (won't error)
- Sets up triggers for auto-profile creation
- Enables Row Level Security
- Grants proper permissions

### Step 4: Verify Success

You should see these success messages in Supabase:

```
✅ E-Amplify database schema created successfully!
📊 Tables created: profiles, skills, sessions, reviews, credits, credit_transactions, posts
🔒 Row Level Security enabled on all tables
🎁 New users will automatically receive 100 free credits
🚀 Ready to start your development server!
```

### Step 5: Check Table Editor

Go to [Table Editor](https://supabase.com/dashboard/project/zwgbyazovphrgvaapysv/editor)

Verify these 7 tables exist:

- ✅ profiles
- ✅ skills
- ✅ sessions
- ✅ reviews
- ✅ credits
- ✅ credit_transactions
- ✅ posts

**OLD tables should be GONE:**

- ❌ users
- ❌ mentorship_sessions
- ❌ connections
- ❌ activity_logs

### Step 6: Restart Dev Server

```bash
# In your terminal (Ctrl+C to stop if running)
pnpm dev
```

Visit http://localhost:3000 - all errors should be gone!

## 🎯 What Changed in the Script

### Old Script Issues:

- ❌ Didn't clean up old schema
- ❌ Used `CREATE INDEX` (errored if existed)
- ❌ Didn't handle previous runs
- ❌ Named triggers identically (conflicts)

### New Script Improvements:

- ✅ Comprehensive cleanup of old schema
- ✅ Uses `CREATE INDEX IF NOT EXISTS`
- ✅ Drops old types, functions, triggers
- ✅ Unique trigger names (no conflicts)
- ✅ Safe to run multiple times
- ✅ Better success messaging

## 📋 Key Differences from Old `/scripts` Schema

| Old Schema             | New Schema                         |
| ---------------------- | ---------------------------------- |
| `users` table          | `profiles` table                   |
| `mentorship_sessions`  | `sessions`                         |
| Complex ENUMs          | Simple TEXT with CHECK constraints |
| Many indexes           | Essential indexes only             |
| `user_role[]` array    | Simple `role` TEXT field           |
| `skills` as TEXT array | Separate `skills` table            |

## 🐛 Troubleshooting

### Error: "permission denied for schema public"

**Solution**: You're not the project owner. Ask the owner to run the script.

### Error: "must be owner of table"

**Solution**: Some old tables exist. The script will drop them, just run it anyway.

### Error: "cannot drop table because other objects depend on it"

**Solution**: The script uses `CASCADE`, this shouldn't happen. If it does, contact support.

### Still seeing "table not found" errors?

**Solution**:

1. Make sure script ran successfully (no red errors)
2. Check Table Editor - tables should exist
3. Clear browser cache
4. Restart dev server
5. Check Supabase connection in `.env`

## ✨ After Running Successfully

Your app will have:

- ✅ Fresh, clean database schema
- ✅ No old conflicting tables
- ✅ Compatible with new codebase
- ✅ RLS policies working
- ✅ Auto-profile creation trigger
- ✅ 100 free credits for new users

**Test it:**

1. Sign up a new user
2. Check `profiles` table - profile auto-created
3. Check `credits` table - 100 credits added
4. Dashboard shows user data
5. No errors in console

## 🎉 Success Checklist

- [ ] Ran new SQL script without errors
- [ ] 7 tables exist in Table Editor
- [ ] Old tables are gone
- [ ] Dev server starts without errors
- [ ] Can sign up new users
- [ ] Dashboard loads without errors
- [ ] Profile auto-created on signup
- [ ] 100 credits granted to new users

---

**The script is now production-ready and safe to run!** 🚀
