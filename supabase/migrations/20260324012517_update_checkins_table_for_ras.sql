/*
  # Update check-ins table for RAS-based check-in flow

  1. Changes
    - Rename `what_happened` column to `notice` to reflect new RAS step 1
    - Rename `reflections` column to `shift` to reflect new RAS step 2
    - Add `choose` column (jsonb) to store RAS step 3 responses

  2. Migration Strategy
    - Use ALTER TABLE to rename columns
    - Add new column with default value
    - No data loss - column renames preserve existing data

  3. Notes
    - This updates the schema to match the new Notice → Shift → Choose flow
    - All columns remain JSONB for flexible array storage
    - Existing check-ins will have empty arrays for the new `choose` field
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'what_happened'
  ) THEN
    ALTER TABLE checkins RENAME COLUMN what_happened TO notice;
  END IF;
END $$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'reflections'
  ) THEN
    ALTER TABLE checkins RENAME COLUMN reflections TO shift;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'checkins' AND column_name = 'choose'
  ) THEN
    ALTER TABLE checkins ADD COLUMN choose jsonb NOT NULL DEFAULT '[]'::jsonb;
  END IF;
END $$;
