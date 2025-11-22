# Phase 8: Database Persistence - SQL Schema (Corrected)

## Pages Table Creation

Execute this SQL in your Supabase SQL Editor to create the `pages` table:

```sql
-- Create pages table (corrected to use is_published)
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Untitled Page',
  slug TEXT NOT NULL DEFAULT 'untitled',
  blocks JSONB NOT NULL DEFAULT '[]'::jsonb,
  global_theme JSONB NOT NULL DEFAULT '{"name":"minimal","colors":{"primary":"#000000","background":"#FFFFFF","text":"#000000","accent":"#666666"},"typography":{"font":"Inter","headingSize":32,"bodySize":16}}'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS pages_user_id_idx ON pages(user_id);

-- Create unique constraint on user_id + slug (per-user unique slugs)
CREATE UNIQUE INDEX IF NOT EXISTS pages_user_slug_unique ON pages(user_id, slug);

-- Enable Row Level Security
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view own pages" ON pages;
DROP POLICY IF EXISTS "Users can insert own pages" ON pages;
DROP POLICY IF EXISTS "Users can update own pages" ON pages;
DROP POLICY IF EXISTS "Users can delete own pages" ON pages;
DROP POLICY IF EXISTS "Anyone can view published pages" ON pages;

-- Policy: Authenticated users can view their own pages
CREATE POLICY "Users can view own pages"
  ON pages FOR SELECT
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

-- Policy: Anyone can view published pages
CREATE POLICY "Anyone can view published pages"
  ON pages FOR SELECT
  TO public
  USING (is_published = true);

-- Policy: Authenticated users can insert their own pages
CREATE POLICY "Users can insert own pages"
  ON pages FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Policy: Authenticated users can update their own pages
CREATE POLICY "Users can update own pages"
  ON pages FOR UPDATE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id)
  WITH CHECK ((SELECT auth.uid()) = user_id);

-- Policy: Authenticated users can delete their own pages
CREATE POLICY "Users can delete own pages"
  ON pages FOR DELETE
  TO authenticated
  USING ((SELECT auth.uid()) = user_id);

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

## Key Changes from Original

1. **Column Name**: Changed `published` → `is_published` to match existing schema
2. **Default slug**: Added default value `'untitled'` to prevent NOT NULL errors
3. **JSON Format**: Single-line JSON for `global_theme` to avoid escaping issues
4. **RLS Policies**: 
   - Use `(SELECT auth.uid())` for better query plan caching
   - Explicitly set `TO authenticated` or `TO public` for clarity
   - Added `DROP POLICY IF EXISTS` for idempotency
5. **Index Optimization**: Removed redundant single-column slug index (slugs are unique per-user)

## After Running the SQL

1. Verify the table exists in Supabase Dashboard → Table Editor
2. Check that RLS policies are active (should see 5 policies)
3. Confirm column is named `is_published` not `published`
