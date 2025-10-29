# E-Amplify Database & Storage Setup Guide

## Overview

This guide provides complete instructions for setting up the E-Amplify database and storage infrastructure on Supabase.

## Prerequisites

- Supabase project created
- Supabase CLI installed (`npm install -g supabase`)
- Access to Supabase dashboard

## Database Setup

### Step 1: Run Schema Migration

Execute the SQL schema script to create all tables, enums, indexes, and RLS policies:

\`\`\`bash
# Using Supabase CLI
supabase db push

# Or manually in Supabase SQL Editor:
# Copy and paste the contents of scripts/01-schema-setup.sql
\`\`\`

### Step 2: Seed Development Data (Optional)

To populate the database with sample data for testing:

\`\`\`bash
# Using Supabase CLI
supabase db push

# Or manually in Supabase SQL Editor:
# Copy and paste the contents of scripts/02-seed-data.sql
\`\`\`

## Storage Setup

### Step 1: Create Storage Buckets

Create the following buckets in Supabase Storage:

\`\`\`bash
# Using Supabase CLI
supabase storage create-bucket avatars --public
supabase storage create-bucket cover-images --public
supabase storage create-bucket post-images --public
supabase storage create-bucket documents --public
supabase storage create-bucket session-recordings --public
\`\`\`

Or manually in Supabase Dashboard:
1. Go to Storage section
2. Click "New Bucket" for each bucket name above
3. Set appropriate public/private settings

### Step 2: Configure Storage Policies

Execute the storage policies script:

\`\`\`bash
# In Supabase SQL Editor:
# Copy and paste the contents of scripts/03-storage-setup.sql
\`\`\`

## Database Schema Overview

### Core Tables

#### Users
- Stores user profiles, roles, skills, and pricing information
- Supports multiple roles: learner, mentor, collaborator
- Tracks stats: sessions, earnings, ratings

#### Mentorship Sessions
- Records all mentoring interactions
- Tracks status: scheduled, completed, cancelled, no_show
- Links mentor and learner with pricing and credits

#### Credits System
- `credits`: User credit balances
- `credit_transactions`: Transaction history
- `credit_packages`: Available credit packages for purchase

#### Social Features
- `posts`: User-generated content
- `post_reactions`: Likes and amplifies
- `post_comments`: Discussion threads
- `reviews`: Mentor ratings and feedback
- `connections`: Follower relationships

#### Support Tables
- `skills`: Detailed skill tracking
- `notifications`: User notifications
- `messages`: Direct messaging
- `activity_log`: User activity history

### Relationships

\`\`\`
Users (1) ──→ (Many) Mentorship Sessions
Users (1) ──→ (Many) Posts
Users (1) ──→ (Many) Reviews (as mentor)
Users (1) ──→ (Many) Reviews (as reviewer)
Users (1) ──→ (Many) Connections
Users (1) ──→ (1) Credits
Posts (1) ──→ (Many) Post Reactions
Posts (1) ──→ (Many) Post Comments
\`\`\`

## Storage Buckets

### avatars
- **Purpose**: User profile pictures
- **Access**: Public read, authenticated write
- **Path Structure**: `{user_id}/{filename}`
- **Max Size**: 5MB recommended

### cover-images
- **Purpose**: User profile cover images
- **Access**: Public read, authenticated write
- **Path Structure**: `{user_id}/{filename}`
- **Max Size**: 10MB recommended

### post-images
- **Purpose**: Images attached to posts
- **Access**: Public read, authenticated write
- **Path Structure**: `{user_id}/{post_id}/{filename}`
- **Max Size**: 5MB recommended

### documents
- **Purpose**: Shared resources, PDFs, materials
- **Access**: Private (authenticated users only)
- **Path Structure**: `{user_id}/{filename}`
- **Max Size**: 50MB recommended

### session-recordings
- **Purpose**: Video recordings of mentorship sessions
- **Access**: Private (session participants only)
- **Path Structure**: `{session_id}/{filename}`
- **Max Size**: 500MB recommended

## Row Level Security (RLS)

All tables have RLS enabled with policies ensuring:

- **Users**: Public profiles, users can edit their own
- **Credits**: Users see only their own
- **Posts**: Public read, users manage their own
- **Sessions**: Participants can view/manage
- **Messages**: Users see their own conversations
- **Notifications**: Users see their own notifications

## Indexes

Indexes are created on frequently queried columns:

- User lookups: `email`, `created_at`
- Session queries: `mentor_id`, `learner_id`, `status`, `scheduled_at`
- Post queries: `author_id`, `created_at`
- Transaction queries: `user_id`, `type`, `created_at`

## Triggers

Automatic triggers maintain data integrity:

- `updated_at` timestamps on all mutable tables
- Cascading deletes for related records

## Environment Variables

Add these to your `.env.local`:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
\`\`\`

## Backup & Recovery

### Backup Database
\`\`\`bash
supabase db pull
\`\`\`

### Restore Database
\`\`\`bash
supabase db push
\`\`\`

## Monitoring

Monitor your database in Supabase Dashboard:
- Query performance in "Logs"
- Storage usage in "Storage"
- Real-time activity in "Realtime"

## Common Queries

### Get user profile with stats
\`\`\`sql
SELECT * FROM users WHERE id = 'user_id';
\`\`\`

### Get user's mentorship sessions
\`\`\`sql
SELECT * FROM mentorship_sessions 
WHERE mentor_id = 'user_id' OR learner_id = 'user_id'
ORDER BY scheduled_at DESC;
\`\`\`

### Get user's credit balance
\`\`\`sql
SELECT balance FROM credits WHERE user_id = 'user_id';
\`\`\`

### Get user's feed posts
\`\`\`sql
SELECT p.*, u.name, u.avatar_url
FROM posts p
JOIN users u ON p.author_id = u.id
ORDER BY p.created_at DESC
LIMIT 20;
\`\`\`

## Troubleshooting

### RLS Policy Issues
- Ensure `auth.uid()` is properly set
- Check policy conditions match your use case
- Test with authenticated and unauthenticated users

### Storage Upload Failures
- Verify bucket exists and is accessible
- Check file size limits
- Ensure proper authentication

### Performance Issues
- Check indexes are created
- Monitor query performance in Supabase logs
- Consider pagination for large result sets

## Support

For issues or questions:
1. Check Supabase documentation: https://supabase.com/docs
2. Review RLS policies in Supabase Dashboard
3. Check database logs for errors
</parameter>
