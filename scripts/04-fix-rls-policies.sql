-- Drop existing policies on users table
DROP POLICY IF EXISTS "Users can read their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Public can read user profiles" ON users;

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all user profiles (for discovery)
CREATE POLICY "Authenticated users can read all profiles"
  ON users FOR SELECT
  USING (auth.role() = 'authenticated');

-- Policy: Allow authenticated users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Allow authenticated users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Fix RLS policies for related tables
DROP POLICY IF EXISTS "Users can read their own credits" ON credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON credits;

ALTER TABLE credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own credits"
  ON credits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits"
  ON credits FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Fix RLS policies for activity_log
DROP POLICY IF EXISTS "Users can read their own activity" ON activity_log;

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own activity"
  ON activity_log FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own activity"
  ON activity_log FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Fix RLS policies for posts
DROP POLICY IF EXISTS "Users can read all posts" ON posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON posts;

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all posts"
  ON posts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts"
  ON posts FOR DELETE
  USING (auth.uid() = author_id);

-- Fix RLS policies for post_reactions
DROP POLICY IF EXISTS "Users can read all reactions" ON post_reactions;
DROP POLICY IF EXISTS "Users can insert their own reactions" ON post_reactions;
DROP POLICY IF EXISTS "Users can delete their own reactions" ON post_reactions;

ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all reactions"
  ON post_reactions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert their own reactions"
  ON post_reactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions"
  ON post_reactions FOR DELETE
  USING (auth.uid() = user_id);

-- Fix RLS policies for mentorship_sessions
DROP POLICY IF EXISTS "Users can read their sessions" ON mentorship_sessions;
DROP POLICY IF EXISTS "Users can insert sessions" ON mentorship_sessions;
DROP POLICY IF EXISTS "Users can update their sessions" ON mentorship_sessions;

ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their mentorship sessions"
  ON mentorship_sessions FOR SELECT
  USING (auth.uid() = mentor_id OR auth.uid() = learner_id);

CREATE POLICY "Users can insert mentorship sessions"
  ON mentorship_sessions FOR INSERT
  WITH CHECK (auth.uid() = mentor_id OR auth.uid() = learner_id);

CREATE POLICY "Users can update their mentorship sessions"
  ON mentorship_sessions FOR UPDATE
  USING (auth.uid() = mentor_id OR auth.uid() = learner_id)
  WITH CHECK (auth.uid() = mentor_id OR auth.uid() = learner_id);

-- Fix RLS policies for reviews
DROP POLICY IF EXISTS "Users can read all reviews" ON reviews;
DROP POLICY IF EXISTS "Users can insert reviews" ON reviews;

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read all reviews"
  ON reviews FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = reviewer_id);

-- Fix RLS policies for connections
DROP POLICY IF EXISTS "Users can read connections" ON connections;
DROP POLICY IF EXISTS "Users can insert connections" ON connections;
DROP POLICY IF EXISTS "Users can delete connections" ON connections;

ALTER TABLE connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their connections"
  ON connections FOR SELECT
  USING (auth.uid() = follower_id OR auth.uid() = following_id);

CREATE POLICY "Users can insert connections"
  ON connections FOR INSERT
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their connections"
  ON connections FOR DELETE
  USING (auth.uid() = follower_id);
