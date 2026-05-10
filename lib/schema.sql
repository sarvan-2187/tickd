-- Run this SQL in your Neon console to initialize the database schema.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email        TEXT UNIQUE NOT NULL,
  app_password TEXT,          -- AES-256-GCM encrypted, stored as "iv:tag:ciphertext" (base64)
  locked_until TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS otps (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash  TEXT NOT NULL,   -- SHA-256 hash of the 6-digit OTP
  attempts   INT DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  used       BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recurring_tasks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title      TEXT NOT NULL,
  status     TEXT CHECK(status IN ('pending','completed')) DEFAULT 'pending',
  task_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  rollover   BOOLEAN DEFAULT TRUE,
  recurring_task_id UUID REFERENCES recurring_tasks(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user+date task queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_date ON tasks(user_id, task_date);
-- Index for OTP lookup by user
CREATE INDEX IF NOT EXISTS idx_otps_user ON otps(user_id);
