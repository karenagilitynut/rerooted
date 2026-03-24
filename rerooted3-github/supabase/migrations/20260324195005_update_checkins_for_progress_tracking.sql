/*
  # Update check-ins table for progress tracking

  1. Changes
    - Drop columns: what_stuck, pattern_match, alternative_truth, identity_shift
    - Add new columns matching required format:
      - `date` (timestamptz) - When the check-in occurred
      - `trigger` (text) - What stuck with them
      - `core_story` (text) - The pattern their brain was telling
      - `reframe` (text) - Alternative truth they selected
      - `identity_shift` (text) - What they want to practice instead

  2. Migration Strategy
    - Drop old columns if they exist
    - Add new columns with appropriate types
    - All text fields for simple storage
    - Date field for time-based analytics

  3. Notes
    - Matches required format for progress tracking
    - Enables pattern recognition and growth tracking
    - Supports emotional trend analysis
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'what_stuck'
  ) THEN
    ALTER TABLE checkins DROP COLUMN what_stuck;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'pattern_match'
  ) THEN
    ALTER TABLE checkins DROP COLUMN pattern_match;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'alternative_truth'
  ) THEN
    ALTER TABLE checkins DROP COLUMN alternative_truth;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'identity_shift'
  ) THEN
    ALTER TABLE checkins DROP COLUMN identity_shift;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'date'
  ) THEN
    ALTER TABLE checkins ADD COLUMN date timestamptz NOT NULL DEFAULT now();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'trigger'
  ) THEN
    ALTER TABLE checkins ADD COLUMN trigger text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'core_story'
  ) THEN
    ALTER TABLE checkins ADD COLUMN core_story text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'reframe'
  ) THEN
    ALTER TABLE checkins ADD COLUMN reframe text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'identity_shift'
  ) THEN
    ALTER TABLE checkins ADD COLUMN identity_shift text NOT NULL DEFAULT '';
  END IF;
END $$;
