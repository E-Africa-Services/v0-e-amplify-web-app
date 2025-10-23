-- E-Amplify Database Schema
-- Complete setup with all tables, relationships, indexes, and constraints

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM ('learner', 'mentor', 'collaborator');
CREATE TYPE user_goal AS ENUM ('learn', 'teach', 'collaborate');
CREATE TYPE session_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no_show');
CREATE TYPE transaction_type AS ENUM ('earned', 'spent', 'bonus', 'refund', 'purchase');
CREATE TYPE post_reaction_type AS ENUM ('heart', 'amplify');
CREATE TYPE review_rating AS ENUM ('1', '2', '3', '4', '5');

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  bio TEXT,
  avatar_url VARCHAR(500),
  cover_image_url VARCHAR(500),
  location VARCHAR(255),
  primary_goal user_goal NOT NULL,
  roles user_role[] DEFAULT ARRAY['learner']::user_role[],
  
  -- Profile Information
  skills TEXT[] DEFAULT ARRAY[]::TEXT[],
  teach_topics TEXT,
  learn_topics TEXT,
  why_here TEXT,
  availability VARCHAR(255),
  
  -- Pricing (for mentors)
  price_per_session DECIMAL(10, 2),
  price_per_month DECIMAL(10, 2),
  
  -- Stats
  total_sessions INTEGER DEFAULT 0,
  total_earnings DECIMAL(15, 2) DEFAULT 0,
  total_spent DECIMAL(15, 2) DEFAULT 0,
  average_rating DECIMAL(3, 2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  joined_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_primary_goal ON users(primary_goal);
CREATE INDEX idx_users_roles ON users USING GIN(roles);
CREATE INDEX idx_users_skills ON users USING GIN(skills);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- ============================================================================
-- MENTORSHIP SESSIONS TABLE
-- ============================================================================

CREATE TABLE mentorship_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  learner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status session_status DEFAULT 'scheduled',
  
  scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  price DECIMAL(10, 2) NOT NULL,
  credits_used INTEGER NOT NULL,
  
  notes TEXT,
  feedback TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT different_users CHECK (mentor_id != learner_id),
  CONSTRAINT valid_duration CHECK (duration_minutes > 0),
  CONSTRAINT valid_price CHECK (price >= 0)
);

CREATE INDEX idx_sessions_mentor_id ON mentorship_sessions(mentor_id);
CREATE INDEX idx_sessions_learner_id ON mentorship_sessions(learner_id);
CREATE INDEX idx_sessions_status ON mentorship_sessions(status);
CREATE INDEX idx_sessions_scheduled_at ON mentorship_sessions(scheduled_at DESC);
CREATE INDEX idx_sessions_mentor_learner ON mentorship_sessions(mentor_id, learner_id);

-- ============================================================================
-- CREDITS TABLE
-- ============================================================================

CREATE TABLE credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  balance INTEGER DEFAULT 0,
  total_earned INTEGER DEFAULT 0,
  total_spent INTEGER DEFAULT 0,
  
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT non_negative_balance CHECK (balance >= 0)
);

CREATE INDEX idx_credits_user_id ON credits(user_id);

-- ============================================================================
-- CREDIT TRANSACTIONS TABLE
-- ============================================================================

CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  type transaction_type NOT NULL,
  amount INTEGER NOT NULL,
  description VARCHAR(500) NOT NULL,
  
  related_session_id UUID REFERENCES mentorship_sessions(id) ON DELETE SET NULL,
  related_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT non_zero_amount CHECK (amount != 0)
);

CREATE INDEX idx_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_transactions_type ON credit_transactions(type);
CREATE INDEX idx_transactions_created_at ON credit_transactions(created_at DESC);
CREATE INDEX idx_transactions_user_created ON credit_transactions(user_id, created_at DESC);

-- ============================================================================
-- POSTS TABLE
-- ============================================================================

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  image_url VARCHAR(500),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT non_empty_content CHECK (LENGTH(TRIM(content)) > 0)
);

CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);

-- ============================================================================
-- POST REACTIONS TABLE
-- ============================================================================

CREATE TABLE post_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  reaction_type post_reaction_type NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(post_id, user_id, reaction_type)
);

CREATE INDEX idx_reactions_post_id ON post_reactions(post_id);
CREATE INDEX idx_reactions_user_id ON post_reactions(user_id);
CREATE INDEX idx_reactions_type ON post_reactions(reaction_type);

-- ============================================================================
-- POST COMMENTS TABLE
-- ============================================================================

CREATE TABLE post_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES post_comments(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT non_empty_comment CHECK (LENGTH(TRIM(content)) > 0)
);

CREATE INDEX idx_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_comments_author_id ON post_comments(author_id);
CREATE INDEX idx_comments_parent_id ON post_comments(parent_comment_id);
CREATE INDEX idx_comments_created_at ON post_comments(created_at DESC);

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================

CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES mentorship_sessions(id) ON DELETE SET NULL,
  
  rating review_rating NOT NULL,
  title VARCHAR(255),
  content TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT different_users CHECK (mentor_id != reviewer_id)
);

CREATE INDEX idx_reviews_mentor_id ON reviews(mentor_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- ============================================================================
-- CONNECTIONS/FOLLOWERS TABLE
-- ============================================================================

CREATE TABLE connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(follower_id, following_id),
  CONSTRAINT different_users CHECK (follower_id != following_id)
);

CREATE INDEX idx_connections_follower ON connections(follower_id);
CREATE INDEX idx_connections_following ON connections(following_id);

-- ============================================================================
-- SKILLS TABLE (for better skill management)
-- ============================================================================

CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  skill_name VARCHAR(255) NOT NULL,
  proficiency_level VARCHAR(50) DEFAULT 'intermediate',
  years_of_experience INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  UNIQUE(user_id, skill_name)
);

CREATE INDEX idx_skills_user_id ON skills(user_id);
CREATE INDEX idx_skills_name ON skills(skill_name);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  
  related_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  related_session_id UUID REFERENCES mentorship_sessions(id) ON DELETE SET NULL,
  
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_type CHECK (type IN ('session_booked', 'session_completed', 'review_received', 'new_follower', 'message', 'system'))
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);

-- ============================================================================
-- MESSAGES TABLE (for direct messaging)
-- ============================================================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT different_users CHECK (sender_id != recipient_id)
);

CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_conversation ON messages(sender_id, recipient_id);

-- ============================================================================
-- CREDIT PACKAGES TABLE
-- ============================================================================

CREATE TABLE credit_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  name VARCHAR(255) NOT NULL,
  description TEXT,
  credits INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  discount_percentage DECIMAL(5, 2) DEFAULT 0,
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT positive_credits CHECK (credits > 0),
  CONSTRAINT positive_price CHECK (price > 0),
  CONSTRAINT valid_discount CHECK (discount_percentage >= 0 AND discount_percentage <= 100)
);

CREATE INDEX idx_packages_active ON credit_packages(is_active);

-- ============================================================================
-- ACTIVITY LOG TABLE
-- ============================================================================

CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  activity_type VARCHAR(100) NOT NULL,
  description TEXT,
  metadata JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT valid_activity_type CHECK (activity_type IN ('session_completed', 'post_created', 'review_given', 'skill_added', 'profile_updated', 'connection_made'))
);

CREATE INDEX idx_activity_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_type ON activity_log(activity_type);
CREATE INDEX idx_activity_created_at ON activity_log(created_at DESC);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Users: Public read, authenticated users can update their own
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Credits: Users can only see their own
CREATE POLICY "Users can view their own credits" ON credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own credits" ON credits FOR UPDATE USING (auth.uid() = user_id);

-- Credit Transactions: Users can only see their own
CREATE POLICY "Users can view their own transactions" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- Posts: Public read, authenticated users can create/update/delete their own
CREATE POLICY "Posts are viewable by everyone" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can create posts" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own posts" ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own posts" ON posts FOR DELETE USING (auth.uid() = author_id);

-- Post Reactions: Users can manage their own reactions
CREATE POLICY "Reactions are viewable by everyone" ON post_reactions FOR SELECT USING (true);
CREATE POLICY "Users can create reactions" ON post_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reactions" ON post_reactions FOR DELETE USING (auth.uid() = user_id);

-- Post Comments: Public read, authenticated users can create/update/delete their own
CREATE POLICY "Comments are viewable by everyone" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON post_comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Users can update their own comments" ON post_comments FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Users can delete their own comments" ON post_comments FOR DELETE USING (auth.uid() = author_id);

-- Reviews: Public read, authenticated users can create/update/delete their own
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY "Users can update their own reviews" ON reviews FOR UPDATE USING (auth.uid() = reviewer_id);
CREATE POLICY "Users can delete their own reviews" ON reviews FOR DELETE USING (auth.uid() = reviewer_id);

-- Connections: Users can manage their own connections
CREATE POLICY "Connections are viewable by everyone" ON connections FOR SELECT USING (true);
CREATE POLICY "Users can create connections" ON connections FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete their own connections" ON connections FOR DELETE USING (auth.uid() = follower_id);

-- Skills: Public read, users can manage their own
CREATE POLICY "Skills are viewable by everyone" ON skills FOR SELECT USING (true);
CREATE POLICY "Users can create their own skills" ON skills FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own skills" ON skills FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own skills" ON skills FOR DELETE USING (auth.uid() = user_id);

-- Notifications: Users can only see their own
CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Messages: Users can see messages they sent or received
CREATE POLICY "Users can view their messages" ON messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their received messages" ON messages FOR UPDATE USING (auth.uid() = recipient_id);

-- Activity Log: Users can only see their own
CREATE POLICY "Users can view their own activity" ON activity_log FOR SELECT USING (auth.uid() = user_id);

-- Mentorship Sessions: Participants can view, mentors/learners can manage
CREATE POLICY "Session participants can view" ON mentorship_sessions FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = learner_id);
CREATE POLICY "Mentors can create sessions" ON mentorship_sessions FOR INSERT WITH CHECK (auth.uid() = mentor_id);
CREATE POLICY "Participants can update sessions" ON mentorship_sessions FOR UPDATE USING (auth.uid() = mentor_id OR auth.uid() = learner_id);

-- ============================================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ============================================================================

-- Update user updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_update_timestamp BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_user_timestamp();

-- Update post updated_at timestamp
CREATE OR REPLACE FUNCTION update_post_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_update_timestamp BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION update_post_timestamp();

-- Update comment updated_at timestamp
CREATE OR REPLACE FUNCTION update_comment_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER comments_update_timestamp BEFORE UPDATE ON post_comments
FOR EACH ROW EXECUTE FUNCTION update_comment_timestamp();

-- Update review updated_at timestamp
CREATE OR REPLACE FUNCTION update_review_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_update_timestamp BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_review_timestamp();

-- Update credits timestamp
CREATE OR REPLACE FUNCTION update_credits_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER credits_update_timestamp BEFORE UPDATE ON credits
FOR EACH ROW EXECUTE FUNCTION update_credits_timestamp();

-- Update session timestamp
CREATE OR REPLACE FUNCTION update_session_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sessions_update_timestamp BEFORE UPDATE ON mentorship_sessions
FOR EACH ROW EXECUTE FUNCTION update_session_timestamp();
