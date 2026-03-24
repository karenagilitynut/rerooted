/*
  # Update check-ins table for AI-assisted flow

  1. Changes
    - Drop old columns: notice, shift, choose
    - Add new columns for simplified flow:
      - `what_stuck` (text) - The one thing that stuck with them
      - `pattern_match` (text) - AI-generated pattern they confirmed
      - `alternative_truth` (text) - Alternative interpretation they selected
      - `identity_shift` (text) - What they want to practice instead

  2. Migration Strategy
    - Use ALTER TABLE to drop old columns if they exist
    - Add new columns with appropriate types
    - No data preservation needed as this is a new flow

  3. Notes
    - Simplified from multi-field to single answer per step
    - Reduces typing by 70%+
    - All text fields for simple storage
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'notice'
  ) THEN
    ALTER TABLE checkins DROP COLUMN notice;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'shift'
  ) THEN
    ALTER TABLE checkins DROP COLUMN shift;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'choose'
  ) THEN
    ALTER TABLE checkins DROP COLUMN choose;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'what_stuck'
  ) THEN
    ALTER TABLE checkins ADD COLUMN what_stuck text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'pattern_match'
  ) THEN
    ALTER TABLE checkins ADD COLUMN pattern_match text NOT NULL DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'alternative_truth'
  ) THEN
    ALTER TABLE checkins ADD COLUMN alternative_truth text NOT NULL DEFAULT '';
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
