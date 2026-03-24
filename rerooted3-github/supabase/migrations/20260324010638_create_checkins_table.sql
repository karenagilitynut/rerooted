/*
  # Create check-ins table

  1. New Tables
    - `checkins`
      - `id` (uuid, primary key) - Unique identifier for each check-in
      - `user_id` (uuid) - Reference to user (for future auth integration)
      - `attachment_type` (text) - User's attachment type (anxious, avoidant, fearful, secure)
      - `what_happened` (jsonb) - Array of responses to "what happened" questions
      - `reflections` (jsonb) - Array of responses to reflection prompts
      - `completed_at` (timestamptz) - When the check-in was completed
      - `created_at` (timestamptz) - When the record was created

  2. Security
    - Enable RLS on `checkins` table
    - Add policy for users to read their own check-ins
    - Add policy for users to insert their own check-ins

  3. Notes
    - Using JSONB for flexible storage of response arrays
    - user_id is nullable for now to support anonymous usage
    - completed_at tracks when user finished the check-in flow
*/

CREATE TABLE IF NOT EXISTS checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  attachment_type text NOT NULL CHECK (attachment_type IN ('anxious', 'avoidant', 'fearful', 'secure')),
  what_happened jsonb NOT NULL DEFAULT '[]'::jsonb,
  reflections jsonb NOT NULL DEFAULT '[]'::jsonb,
  completed_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own check-ins"
  ON checkins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own check-ins"
  ON checkins
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can insert check-ins"
  ON checkins
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE INDEX IF NOT EXISTS idx_checkins_user_id ON checkins(user_id);
CREATE INDEX IF NOT EXISTS idx_checkins_completed_at ON checkins(completed_at DESC);
