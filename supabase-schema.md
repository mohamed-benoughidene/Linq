# Phase 8: Database Persistence - SQL Schema

## Pages Table Creation

Execute this SQL in your Supabase SQL Editor to create the `pages` table:

```sql
-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Page',
  slug TEXT NOT NULL,
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  global_theme JSONB NOT NULL DEFAULT '{
    "name": "minimal",
    "colors": {
      "primary": "#000000",
      "background": "#FFFFFF",
      "text": "#000000",
      "accent": "#666666"
    },
    "typography": {
      "font": "Inter",
      "headingSize": 32,
      "bodySize": 16
    }
  }'::jsonb,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS pages_user_id_idx ON pages(user_id);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS pages_slug_idx ON pages(slug);

-- Create unique constraint on user_id + slug
CREATE UNIQUE INDEX IF NOT EXISTS pages_user_slug_unique ON pages(user_id, slug);

-- Enable Row Level Security
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own pages
CREATE POLICY "Users can view own pages"
  ON pages FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own pages
CREATE POLICY "Users can insert own pages"
  ON pages FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own pages
CREATE POLICY "Users can update own pages"
  ON pages FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own pages
CREATE POLICY "Users can delete own pages"
  ON pages FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Anyone can view published pages
CREATE POLICY "Anyone can view published pages"
  ON pages FOR SELECT
  USING (published = true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function before update
DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## After Running the SQL

1. Verify the table exists in Supabase Dashboard → Table Editor
2. Check that RLS policies are active
3. Test by manually inserting a row (will fail if RLS is working correctly without auth)
