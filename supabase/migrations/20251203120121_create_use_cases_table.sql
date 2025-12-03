/*
  # Create use_cases table

  1. New Tables
    - `use_cases`
      - `id` (uuid, primary key) - Unique identifier for each use case
      - `title` (varchar 255, not null) - Title of the use case
      - `short_description` (text, not null) - Brief description
      - `full_description` (text, not null) - Detailed description
      - `department` (varchar 50, not null) - Department name
      - `status` (varchar 50, not null) - Current status of the use case
      - `owner_name` (varchar 255, not null) - Name of the use case owner
      - `owner_email` (varchar 255, not null) - Email of the use case owner
      - `image_url` (text) - URL to the use case image
      - `business_impact` (text) - Description of business impact
      - `technology_stack` (jsonb) - Array of technologies used
      - `internal_links` (jsonb) - Object containing internal links
      - `tags` (jsonb) - Array of tags
      - `related_use_case_ids` (jsonb) - Array of related use case IDs
      - `application_url` (text) - URL to the application
      - `created_at` (timestamptz) - Creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `use_cases` table
    - Add policy for public read access
    - Add policy for authenticated users to create use cases
    - Add policy for authenticated users to update use cases
    - Add policy for authenticated users to delete use cases

  3. Important Notes
    - Department must be one of: Marketing, R&D, Procurement, IT, HR, Operations
    - Status must be one of: Ideation, Pre-Evaluation, Evaluation, PoC, MVP, Live, Archived
    - Email format is validated using regex
    - Indexes added for performance on department, status, created_at, and tags
*/

CREATE TABLE IF NOT EXISTS use_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title varchar(255) NOT NULL,
  short_description text NOT NULL,
  full_description text NOT NULL,
  department varchar(50) NOT NULL,
  status varchar(50) NOT NULL,
  owner_name varchar(255) NOT NULL,
  owner_email varchar(255) NOT NULL,
  image_url text,
  business_impact text,
  technology_stack jsonb DEFAULT '[]'::jsonb,
  internal_links jsonb DEFAULT '{}'::jsonb,
  tags jsonb DEFAULT '[]'::jsonb,
  related_use_case_ids jsonb DEFAULT '[]'::jsonb,
  application_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_use_cases_department ON use_cases(department);
CREATE INDEX IF NOT EXISTS idx_use_cases_status ON use_cases(status);
CREATE INDEX IF NOT EXISTS idx_use_cases_created_at ON use_cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_use_cases_tags ON use_cases USING GIN(tags);

ALTER TABLE use_cases
  DROP CONSTRAINT IF EXISTS check_department,
  ADD CONSTRAINT check_department CHECK (
    department IN ('Marketing', 'R&D', 'Procurement', 'IT', 'HR', 'Operations')
  );

ALTER TABLE use_cases
  DROP CONSTRAINT IF EXISTS check_status,
  ADD CONSTRAINT check_status CHECK (
    status IN ('Ideation', 'Pre-Evaluation', 'Evaluation', 'PoC', 'MVP', 'Live', 'Archived')
  );

ALTER TABLE use_cases
  DROP CONSTRAINT IF EXISTS check_email_format,
  ADD CONSTRAINT check_email_format CHECK (
    owner_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  );

ALTER TABLE use_cases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read use cases"
  ON use_cases
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create use cases"
  ON use_cases
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update use cases"
  ON use_cases
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete use cases"
  ON use_cases
  FOR DELETE
  TO authenticated
  USING (true);