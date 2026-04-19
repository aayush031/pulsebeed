CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS content_title_trgm_idx
ON "Content"
USING GIN ("title" gin_trgm_ops);
