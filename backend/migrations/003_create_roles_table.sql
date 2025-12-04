/*
  # Create roles table and seed default roles

  ## Summary
  This migration creates a roles table to support role-based access control (RBAC) and seeds it with three default roles.

  ## Changes

  ### 1. New Tables
    - `roles`
      - `id` (uuid, primary key, auto-generated)
      - `name` (text, unique, not null) - Role name (e.g., 'admin', 'editor', 'viewer')
      - `description` (text, nullable) - Optional description of the role
      - `created_at` (timestamptz, default now()) - Timestamp of role creation

  ### 2. Data Seeding
    Seeds three default roles:
    - **admin**: Full system access with all permissions
    - **editor**: Can create and modify content
    - **viewer**: Read-only access

  ### 3. Indexes
    - Index on `name` column for efficient role lookups by name

  ## Important Notes
    1. Uses `ON CONFLICT DO NOTHING` to prevent duplicate role insertion if migration is run multiple times
    2. Does not modify existing `users` table or its `role` column
    3. Roles table is separate from users table for future extensibility
    4. Role names are case-sensitive in the database but application logic handles case-insensitive comparison
*/

CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

INSERT INTO roles (name, description) VALUES
  ('admin', 'Administrator with full system access'),
  ('editor', 'Can create and modify content'),
  ('viewer', 'Read-only access')
ON CONFLICT (name) DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_roles_name ON roles(name);
