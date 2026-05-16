-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- Creates blog tables in the public schema

-- Status enum
CREATE TYPE public."BlogPostStatus" AS ENUM ('draft', 'published', 'archived');

-- Blog posts
CREATE TABLE public.blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  status public."BlogPostStatus" NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reading_time INTEGER,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE
);

CREATE INDEX blog_posts_author_id_idx ON public.blog_posts(author_id);
CREATE INDEX blog_posts_slug_idx ON public.blog_posts(slug);
CREATE INDEX blog_posts_status_published_at_idx ON public.blog_posts(status, published_at DESC);

-- Blog categories
CREATE TABLE public.blog_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Blog post <-> category junction
CREATE TABLE public.blog_post_categories (
  post_id INTEGER NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES public.blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Seed default categories
INSERT INTO public.blog_categories (name, slug, description) VALUES
  ('Camping Tips', 'camping-tips', 'Practical advice for campers of all levels'),
  ('Gear Reviews', 'gear-reviews', 'Honest reviews of camping gear and equipment'),
  ('Trip Reports', 'trip-reports', 'First-hand accounts of camping trips'),
  ('Destinations', 'destinations', 'Campground and destination spotlights'),
  ('Sustainability', 'sustainability', 'Leave No Trace and eco-friendly camping');
