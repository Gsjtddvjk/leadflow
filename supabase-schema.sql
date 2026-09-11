-- ============================================
-- LeadFlow + My DTF Store — Supabase Schema
-- ============================================

-- 1. جدول العملاء (Leads)
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  service TEXT,
  source TEXT DEFAULT 'Manual',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contact', 'proposal', 'won', 'lost')),
  value NUMERIC DEFAULT 0,
  meters NUMERIC DEFAULT 0,
  notes TEXT,
  created TIMESTAMPTZ DEFAULT NOW(),
  updated TIMESTAMPTZ
);

-- 2. جدول عملاء الموقع (Website Leads)
CREATE TABLE IF NOT EXISTS website_leads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  service TEXT,
  meters NUMERIC DEFAULT 0,
  quantity INTEGER DEFAULT 1,
  notes TEXT,
  source TEXT DEFAULT 'Website',
  status TEXT DEFAULT 'new',
  created TIMESTAMPTZ DEFAULT NOW()
);

-- 3. جدول عملاء Meta Ads
CREATE TABLE IF NOT EXISTS meta_leads (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  service TEXT,
  source TEXT DEFAULT 'Meta Ads',
  status TEXT DEFAULT 'new',
  value NUMERIC DEFAULT 0,
  notes TEXT,
  meta_lead_id TEXT,
  meta_form_id TEXT,
  meta_ad_id TEXT,
  created TIMESTAMPTZ DEFAULT NOW()
);

-- 4. جدول الإعدادات
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  agency_name TEXT DEFAULT 'LeadFlow',
  currency TEXT DEFAULT 'د.ج',
  meta_access_token TEXT,
  meta_ad_account_id TEXT,
  auto_sync_enabled BOOLEAN DEFAULT false,
  auto_sync_interval INTEGER DEFAULT 3600000,
  created TIMESTAMPTZ DEFAULT NOW(),
  updated TIMESTAMPTZ
);

-- 5. إدخال الإعدادات الافتراضية
INSERT INTO settings (id, agency_name, currency) VALUES (1, 'My DTF Store', 'د.ج')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Row Level Security (RLS)
-- ============================================

-- تفعيل RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- سياسة للقراءة والكتابة (للتجربة - يمكن تقييدها لاحقًا)
CREATE POLICY "Allow all for leads" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all for website_leads" ON website_leads FOR ALL USING (true);
CREATE POLICY "Allow all for meta_leads" ON meta_leads FOR ALL USING (true);
CREATE POLICY "Allow all for settings" ON settings FOR ALL USING (true);

-- ============================================
-- Realtime (اختياري - للتحديثات الحية)
-- ============================================

-- تفعيل Realtime للجداول
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
ALTER PUBLICATION supabase_realtime ADD TABLE website_leads;
