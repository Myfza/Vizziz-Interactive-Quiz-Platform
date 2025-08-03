/*
  # Create game session tables for real-time multiplayer

  1. New Tables
    - `game_sessions`
      - `id` (uuid, primary key)
      - `quiz_id` (uuid, references quizzes)
      - `host_id` (uuid, references users)
      - `game_code` (text, unique)
      - `status` (text)
      - `current_question` (integer)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `game_participants`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references game_sessions)
      - `user_id` (uuid, references users, optional)
      - `nickname` (text)
      - `avatar` (text, optional)
      - `score` (integer)
      - `is_ready` (boolean)
      - `joined_at` (timestamp)

    - `game_answers`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references game_sessions)
      - `participant_id` (uuid, references game_participants)
      - `question_id` (uuid, references questions)
      - `selected_option` (integer)
      - `time_taken` (integer)
      - `points_earned` (integer)
      - `answered_at` (timestamp)

  2. Security
    - Enable RLS on all game tables
    - Add policies for game participation and management
*/

-- Game Sessions Table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  host_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  game_code text UNIQUE NOT NULL,
  status text DEFAULT 'waiting' NOT NULL,
  current_question integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Add constraint for status
ALTER TABLE game_sessions ADD CONSTRAINT game_sessions_status_check 
  CHECK (status IN ('waiting', 'active', 'finished'));

-- Game Participants Table
CREATE TABLE IF NOT EXISTS game_participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES game_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  nickname text NOT NULL,
  avatar text,
  score integer DEFAULT 0 NOT NULL,
  is_ready boolean DEFAULT false NOT NULL,
  joined_at timestamptz DEFAULT now() NOT NULL
);

-- Game Answers Table
CREATE TABLE IF NOT EXISTS game_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid REFERENCES game_sessions(id) ON DELETE CASCADE NOT NULL,
  participant_id uuid REFERENCES game_participants(id) ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
  selected_option integer NOT NULL,
  time_taken integer NOT NULL DEFAULT 0,
  points_earned integer NOT NULL DEFAULT 0,
  answered_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_answers ENABLE ROW LEVEL SECURITY;

-- Game Sessions Policies
CREATE POLICY "Anyone can view active game sessions"
  ON game_sessions
  FOR SELECT
  USING (status IN ('waiting', 'active'));

CREATE POLICY "Hosts can manage their game sessions"
  ON game_sessions
  FOR ALL
  TO authenticated
  USING (auth.uid() = host_id)
  WITH CHECK (auth.uid() = host_id);

-- Game Participants Policies
CREATE POLICY "Anyone can view game participants"
  ON game_participants
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can join games"
  ON game_participants
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Participants can update their own data"
  ON game_participants
  FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Hosts can manage participants in their games"
  ON game_participants
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM game_sessions 
      WHERE game_sessions.id = game_participants.session_id 
      AND game_sessions.host_id = auth.uid()
    )
  );

-- Game Answers Policies
CREATE POLICY "Participants can view answers in their games"
  ON game_answers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM game_participants 
      WHERE game_participants.id = game_answers.participant_id 
      AND (game_participants.user_id = auth.uid() OR auth.uid() IS NULL)
    )
  );

CREATE POLICY "Participants can submit their own answers"
  ON game_answers
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM game_participants 
      WHERE game_participants.id = game_answers.participant_id 
      AND (game_participants.user_id = auth.uid() OR auth.uid() IS NULL)
    )
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS game_sessions_code_idx ON game_sessions(game_code);
CREATE INDEX IF NOT EXISTS game_sessions_status_idx ON game_sessions(status);
CREATE INDEX IF NOT EXISTS game_participants_session_idx ON game_participants(session_id);
CREATE INDEX IF NOT EXISTS game_answers_session_idx ON game_answers(session_id);
CREATE INDEX IF NOT EXISTS game_answers_participant_idx ON game_answers(participant_id);

-- Create triggers for updated_at
CREATE TRIGGER update_game_sessions_updated_at
  BEFORE UPDATE ON game_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();