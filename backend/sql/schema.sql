-- Production-ready PostgreSQL schema for QR-Play
BEGIN;

-- require pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Posters
CREATE TABLE IF NOT EXISTS posters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('ACTIVE','INACTIVE')) DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_posters_slug ON posters(slug);
CREATE INDEX IF NOT EXISTS ix_posters_status ON posters(status);

-- Media types
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'media_type_enum') THEN
    CREATE TYPE media_type_enum AS ENUM ('POSTER','AUDIO','THUMBNAIL','QR');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS poster_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id UUID NOT NULL REFERENCES posters(id) ON DELETE CASCADE,
  media_type media_type_enum NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  mime_type TEXT,
  file_size BIGINT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_poster_media_poster_id ON poster_media(poster_id);
CREATE INDEX IF NOT EXISTS ix_poster_media_media_type ON poster_media(media_type);

-- Shape enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'shape_enum') THEN
    CREATE TYPE shape_enum AS ENUM ('rectangle','circle');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id UUID NOT NULL REFERENCES posters(id) ON DELETE CASCADE,
  section_name TEXT,
  shape shape_enum NOT NULL,
  x NUMERIC NOT NULL CHECK (x >= 0),
  y NUMERIC NOT NULL CHECK (y >= 0),
  width NUMERIC NULL CHECK (width >= 0),
  height NUMERIC NULL CHECK (height >= 0),
  radius NUMERIC NULL CHECK (radius >= 0),
  color TEXT DEFAULT '#0ea5e9',
  opacity NUMERIC DEFAULT 0.4 CHECK (opacity >= 0 AND opacity <= 1),
  startTime NUMERIC NOT NULL CHECK (startTime >= 0),
  endTime NUMERIC NOT NULL CHECK (endTime >= 0 AND endTime >= startTime),
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_sections_poster_id ON sections(poster_id);
CREATE INDEX IF NOT EXISTS ix_sections_display_order ON sections(poster_id, display_order);
CREATE INDEX IF NOT EXISTS ix_sections_startTime ON sections(poster_id, startTime);

-- Audit actions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'audit_action_enum') THEN
    CREATE TYPE audit_action_enum AS ENUM (
      'CREATE_POSTER', 'UPDATE_POSTER', 'DELETE_POSTER',
      'CREATE_SECTION', 'UPDATE_SECTION', 'DELETE_SECTION', 'LOGIN'
    );
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id UUID NULL REFERENCES posters(id) ON DELETE SET NULL,
  action audit_action_enum NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ix_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS ix_audit_logs_poster_id ON audit_logs(poster_id);
CREATE INDEX IF NOT EXISTS ix_audit_logs_created_at ON audit_logs(created_at);

COMMIT;
