ALTER TABLE public.articles
  ADD COLUMN IF NOT EXISTS content_images jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.articles.content_images IS
  'Ordered inline article images as JSON objects with url, alt, and afterParagraph (1-based paragraph position).';
