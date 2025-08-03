/*
  # Create questions table

  1. New Tables
    - `questions`
      - `id` (uuid, primary key)
      - `quiz_id` (uuid, references quizzes)
      - `question_text` (text)
      - `question_type` (text)
      - `options` (jsonb array)
      - `correct_answer` (integer)
      - `time_limit` (integer, default 30)
      - `points` (integer, default 1000)
      - `image_url` (text, optional)
      - `order_index` (integer)

  2. Security
    - Enable RLS on `questions` table
    - Add policies for question access based on quiz ownership
*/

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid REFERENCES quizzes(id) ON DELETE CASCADE NOT NULL,
  question_text text NOT NULL,
  question_type text DEFAULT 'multiple_choice' NOT NULL,
  options jsonb NOT NULL DEFAULT '[]'::jsonb,
  correct_answer integer NOT NULL DEFAULT 0,
  time_limit integer DEFAULT 30 NOT NULL,
  points integer DEFAULT 1000 NOT NULL,
  image_url text,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Add constraint for question_type
ALTER TABLE questions ADD CONSTRAINT questions_question_type_check 
  CHECK (question_type IN ('multiple_choice', 'true_false', 'image_choice'));

-- Enable Row Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Questions are viewable if quiz is public"
  ON questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.is_public = true
    )
  );

CREATE POLICY "Users can view questions from own quizzes"
  ON questions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can create questions for own quizzes"
  ON questions
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can update questions in own quizzes"
  ON questions
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.creator_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.creator_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete questions from own quizzes"
  ON questions
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes 
      WHERE quizzes.id = questions.quiz_id 
      AND quizzes.creator_id = auth.uid()
    )
  );

-- Create index for better performance
CREATE INDEX IF NOT EXISTS questions_quiz_id_idx ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS questions_order_idx ON questions(quiz_id, order_index);