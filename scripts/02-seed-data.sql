-- E-Amplify Seed Data
-- Sample data for development and testing

-- ============================================================================
-- SEED USERS
-- ============================================================================

INSERT INTO users (id, email, name, bio, location, primary_goal, roles, skills, teach_topics, learn_topics, why_here, price_per_session, price_per_month, total_sessions, average_rating, total_reviews)
VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'sarah@example.com', 'Sarah Chen', 'Product designer with 10+ years of experience creating delightful user experiences. Passionate about mentoring the next generation of designers.', 'San Francisco, CA', 'teach', ARRAY['mentor', 'learner'], ARRAY['UI/UX Design', 'Figma', 'Design Systems', 'User Research', 'Prototyping', 'Interaction Design'], 'UI/UX Design, Design Systems, Figma, User Research', 'Advanced design patterns, emerging design tools', 'To share expertise and help others grow', 50.00, 180.00, 127, 4.9, 45),
  ('550e8400-e29b-41d4-a716-446655440002', 'marcus@example.com', 'Marcus Johnson', 'Full-stack engineer with a passion for clean code and mentoring. Let''s build something amazing together.', 'New York, NY', 'teach', ARRAY['mentor', 'learner'], ARRAY['React', 'Node.js', 'TypeScript', 'System Design', 'AWS', 'Docker'], 'React, Node.js, TypeScript, System Design', 'Advanced DevOps, Kubernetes', 'Teaching helps me learn better', 75.00, 250.00, 203, 5.0, 89),
  ('550e8400-e29b-41d4-a716-446655440003', 'priya@example.com', 'Priya Patel', 'Marketing Director with proven track record. Helped 50+ startups scale their marketing. Ready to share strategies that work.', 'Austin, TX', 'teach', ARRAY['mentor', 'learner'], ARRAY['Content Strategy', 'SEO', 'Analytics', 'Brand Building', 'Growth Marketing'], 'Content Strategy, SEO, Analytics, Brand Building', 'Advanced AI marketing tools', 'Impact over income', 60.00, 200.00, 89, 4.8, 34),
  ('550e8400-e29b-41d4-a716-446655440004', 'alex@example.com', 'Alex Rivera', 'Data Scientist making data science accessible. Specializing in practical ML applications for real-world problems.', 'Seattle, WA', 'teach', ARRAY['mentor', 'learner'], ARRAY['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'TensorFlow'], 'Python, Machine Learning, Data Analysis, SQL', 'Advanced ML deployment', 'Community building', 65.00, 220.00, 156, 4.9, 67),
  ('550e8400-e29b-41d4-a716-446655440005', 'emma@example.com', 'Emma Wilson', 'UX Researcher with 15 years of experience. Let''s uncover insights that drive better product decisions.', 'Boston, MA', 'teach', ARRAY['mentor', 'learner'], ARRAY['User Research', 'Usability Testing', 'Qualitative Analysis', 'Prototyping'], 'User Research, Usability Testing, Qualitative Analysis', 'Quantitative research methods', 'Mentoring passion', 55.00, 190.00, 94, 5.0, 42),
  ('550e8400-e29b-41d4-a716-446655440006', 'james@example.com', 'James Lee', 'Cloud infrastructure expert. I''ll help you build scalable, reliable systems from the ground up.', 'Portland, OR', 'teach', ARRAY['mentor', 'learner'], ARRAY['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'], 'AWS, Docker, Kubernetes, CI/CD', 'Advanced security practices', 'Giving back to community', 70.00, 240.00, 112, 4.7, 51),
  ('550e8400-e29b-41d4-a716-446655440007', 'john@example.com', 'John Smith', 'Aspiring product manager looking to learn from experienced mentors.', 'Chicago, IL', 'learn', ARRAY['learner'], ARRAY['Product Management', 'Analytics'], 'Product Management, Analytics, Strategy', 'Product Management fundamentals, User research', 'Career transition', NULL, NULL, 0, 0, 0),
  ('550e8400-e29b-41d4-a716-446655440008', 'lisa@example.com', 'Lisa Wong', 'Junior developer eager to improve React and backend skills.', 'San Diego, CA', 'learn', ARRAY['learner'], ARRAY['JavaScript', 'React'], 'JavaScript, React, Node.js', 'Advanced React patterns, Backend development', 'Skill improvement', NULL, NULL, 0, 0, 0);

-- ============================================================================
-- SEED CREDITS
-- ============================================================================

INSERT INTO credits (id, user_id, balance, total_earned, total_spent)
VALUES
  ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 500, 2000, 1500),
  ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 750, 3000, 2250),
  ('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 600, 2500, 1900),
  ('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', 450, 1800, 1350),
  ('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 800, 3200, 2400),
  ('650e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440006', 550, 2200, 1650),
  ('650e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440007', 200, 0, 0),
  ('650e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440008', 150, 0, 0);

-- ============================================================================
-- SEED CREDIT PACKAGES
-- ============================================================================

INSERT INTO credit_packages (id, name, description, credits, price, discount_percentage, is_active)
VALUES
  ('750e8400-e29b-41d4-a716-446655440001', 'Starter Pack', 'Perfect for getting started', 50, 9.99, 0, true),
  ('750e8400-e29b-41d4-a716-446655440002', 'Growth Pack', 'Most popular choice', 150, 24.99, 5, true),
  ('750e8400-e29b-41d4-a716-446655440003', 'Pro Pack', 'For serious learners', 300, 44.99, 10, true),
  ('750e8400-e29b-41d4-a716-446655440004', 'Elite Pack', 'Maximum value', 600, 79.99, 15, true);

-- ============================================================================
-- SEED MENTORSHIP SESSIONS
-- ============================================================================

INSERT INTO mentorship_sessions (id, mentor_id, learner_id, title, description, status, scheduled_at, duration_minutes, completed_at, price, credits_used)
VALUES
  ('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', 'Design Systems 101', 'Introduction to design systems and component architecture', 'completed', NOW() - INTERVAL '2 days', 60, NOW() - INTERVAL '2 days', 50.00, 50),
  ('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', 'React Advanced Patterns', 'Deep dive into React hooks and performance optimization', 'completed', NOW() - INTERVAL '1 day', 60, NOW() - INTERVAL '1 day', 75.00, 75),
  ('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', 'Content Strategy Workshop', 'Building a winning content strategy', 'scheduled', NOW() + INTERVAL '3 days', 90, NULL, 60.00, 90);

-- ============================================================================
-- SEED CREDIT TRANSACTIONS
-- ============================================================================

INSERT INTO credit_transactions (id, user_id, type, amount, description, related_user_id, created_at)
VALUES
  ('950e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'earned', 50, 'Mentorship session with John Smith', '550e8400-e29b-41d4-a716-446655440007', NOW() - INTERVAL '2 days'),
  ('950e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440007', 'spent', 50, 'Session with Sarah Chen', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '2 days'),
  ('950e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'bonus', 50, 'Monthly subscription credits', NULL, NOW() - INTERVAL '3 days'),
  ('950e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'earned', 75, 'Mentorship session with Lisa Wong', '550e8400-e29b-41d4-a716-446655440008', NOW() - INTERVAL '1 day'),
  ('950e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440008', 'spent', 75, 'Session with Marcus Johnson', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '1 day');

-- ============================================================================
-- SEED POSTS
-- ============================================================================

INSERT INTO posts (id, author_id, content, created_at)
VALUES
  ('a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Just completed my 10th mentorship session this month! The energy and curiosity from learners keeps me inspired. Today we dove deep into design systems and component architecture. What did you learn today?', NOW() - INTERVAL '2 hours'),
  ('a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Reflection: Teaching others has made me a better developer. When you explain concepts, you truly understand them. Grateful for this community that values growth over ego.', NOW() - INTERVAL '5 hours'),
  ('a50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', 'Big milestone: Just hit $2,000 in earnings from mentorship! But more importantly, I''ve helped 30+ people level up their marketing skills. Impact over income, always.', NOW() - INTERVAL '1 day');

-- ============================================================================
-- SEED POST REACTIONS
-- ============================================================================

INSERT INTO post_reactions (id, post_id, user_id, reaction_type, created_at)
VALUES
  ('b50e8400-e29b-41d4-a716-446655440001', 'a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'heart', NOW() - INTERVAL '1 hour'),
  ('b50e8400-e29b-41d4-a716-446655440002', 'a50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'amplify', NOW() - INTERVAL '1.5 hours'),
  ('b50e8400-e29b-41d4-a716-446655440003', 'a50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'heart', NOW() - INTERVAL '4 hours'),
  ('b50e8400-e29b-41d4-a716-446655440004', 'a50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'amplify', NOW() - INTERVAL '20 hours');

-- ============================================================================
-- SEED REVIEWS
-- ============================================================================

INSERT INTO reviews (id, mentor_id, reviewer_id, session_id, rating, title, content, created_at)
VALUES
  ('c50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', '850e8400-e29b-41d4-a716-446655440001', '5', 'Excellent mentor!', 'Sarah is an amazing mentor. She explained complex design concepts in a way that was easy to understand. Highly recommend!', NOW() - INTERVAL '1 day'),
  ('c50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', '850e8400-e29b-41d4-a716-446655440002', '5', 'Best React mentor', 'Marcus really knows his stuff. The session was packed with practical insights and actionable advice.', NOW() - INTERVAL '12 hours');

-- ============================================================================
-- SEED CONNECTIONS
-- ============================================================================

INSERT INTO connections (id, follower_id, following_id, created_at)
VALUES
  ('d50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '5 days'),
  ('d50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '3 days'),
  ('d50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '2 days'),
  ('d50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '2 days');

-- ============================================================================
-- SEED SKILLS
-- ============================================================================

INSERT INTO skills (id, user_id, skill_name, proficiency_level, years_of_experience)
VALUES
  ('e50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'UI/UX Design', 'expert', 10),
  ('e50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Figma', 'expert', 8),
  ('e50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'React', 'expert', 9),
  ('e50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Node.js', 'expert', 8),
  ('e50e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'Content Strategy', 'expert', 12),
  ('e50e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440003', 'SEO', 'expert', 10);

-- ============================================================================
-- SEED ACTIVITY LOG
-- ============================================================================

INSERT INTO activity_log (id, user_id, activity_type, description, created_at)
VALUES
  ('f50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'session_completed', 'Completed mentorship session with John Smith', NOW() - INTERVAL '2 days'),
  ('f50e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'post_created', 'Created a new post about design systems', NOW() - INTERVAL '2 hours'),
  ('f50e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'session_completed', 'Completed mentorship session with Lisa Wong', NOW() - INTERVAL '1 day'),
  ('f50e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440007', 'connection_made', 'Started following Sarah Chen', NOW() - INTERVAL '5 days');
