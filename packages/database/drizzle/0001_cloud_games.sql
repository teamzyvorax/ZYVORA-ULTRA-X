CREATE TABLE IF NOT EXISTS "cloud_files" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "name" text NOT NULL,
  "mime_type" text NOT NULL DEFAULT 'application/octet-stream',
  "size" integer NOT NULL DEFAULT 0,
  "storage_key" text NOT NULL,
  "created_at" timestamptz NOT NULL DEFAULT now(),
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "cloud_files_user_idx" ON "cloud_files" ("user_id");

CREATE TABLE IF NOT EXISTS "games" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" text NOT NULL UNIQUE,
  "title" text NOT NULL,
  "description" text NOT NULL,
  "category" text NOT NULL,
  "status" text NOT NULL DEFAULT 'active',
  "created_at" timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "game_progress" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "game_id" uuid NOT NULL REFERENCES "games"("id") ON DELETE CASCADE,
  "score" integer NOT NULL DEFAULT 0,
  "level" integer NOT NULL DEFAULT 1,
  "updated_at" timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS "game_progress_user_idx" ON "game_progress" ("user_id");

INSERT INTO "games" ("slug", "title", "description", "category") VALUES
('pixel-mission-ultra-9k', 'Zyvora Pixel Mission Ultra 9K', 'Flagship pixel mission experience for the ZYVORA universe.', 'Pixel'),
('cyber-chess', 'Cyber Chess', 'Competitive chess inside the ZYVORA cyber arena.', 'Strategy'),
('zombie-survival', 'Zombie Survival', 'Survive waves, upgrade your loadout and climb the leaderboard.', 'Action'),
('sos-arena', 'SOS Arena', 'Fast tactical rounds built for the ZYVORA Games Hub.', 'Arcade')
ON CONFLICT ("slug") DO NOTHING;
