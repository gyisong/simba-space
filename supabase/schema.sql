-- =============================================
-- minihompy schema
-- Supabase SQL Editor에서 실행
-- =============================================

-- user_profiles
CREATE TABLE user_profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name       text NOT NULL,
  role       text NOT NULL DEFAULT 'member' CHECK (role IN ('superadmin', 'admin', 'member')),
  is_active  boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- projects (사업 포트폴리오)
CREATE TABLE projects (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text NOT NULL,
  region            text NOT NULL,
  start_date        date NOT NULL,
  end_date          date,
  partner_company   text NOT NULL,
  impact_text       text NOT NULL,
  description       text NOT NULL,
  cover_image_url   text,
  is_published      boolean NOT NULL DEFAULT false,
  sort_order        int NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- project_images (사업별 갤러리)
CREATE TABLE project_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url   text NOT NULL,
  caption     text,
  sort_order  int NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- weekly_reports (주간보고)
CREATE TABLE weekly_reports (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_name  text NOT NULL,
  period_start  date NOT NULL,
  period_end    date NOT NULL,
  activities    text NOT NULL,
  next_plan     text NOT NULL,
  issues        text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- calendar_events (캘린더)
CREATE TABLE calendar_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title       text NOT NULL,
  event_date  date NOT NULL,
  category    text NOT NULL CHECK (category IN ('외근', '출장', '휴가', '대회의실', '공통', '기타')),
  note        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- contact_messages (문의 폼)
CREATE TABLE contact_messages (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  email       text NOT NULL,
  message     text NOT NULL,
  is_read     boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- guestbook (방명록)
CREATE TABLE guestbook (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  message     text NOT NULL,
  is_hidden   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- diary (다이어리, 관리자 전용)
CREATE TABLE diary (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  content     text NOT NULL,
  is_private  boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- =============================================
-- RLS 비활성화 (빗로그와 동일 방식)
-- =============================================
ALTER TABLE user_profiles    DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects         DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_images   DISABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_reports   DISABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events  DISABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook        DISABLE ROW LEVEL SECURITY;
ALTER TABLE diary            DISABLE ROW LEVEL SECURITY;

-- =============================================
-- Storage bucket (사업 이미지)
-- =============================================
-- Supabase 대시보드 Storage에서 수동 생성:
-- 버킷명: project-images
-- Public: true
