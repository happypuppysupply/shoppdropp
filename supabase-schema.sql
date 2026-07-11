-- ShoppDropp Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  company_name TEXT,
  role TEXT DEFAULT 'user',
  plan_id TEXT DEFAULT 'payg',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. STORES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.stores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  shopify_store_url TEXT,
  shopify_api_key TEXT,
  niche TEXT,
  status TEXT DEFAULT 'pending',
  vps_instance_id UUID,
  product_count INTEGER DEFAULT 0,
  max_products INTEGER DEFAULT 200,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. VPS INSTANCES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.vps_instances (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  server_type TEXT NOT NULL,
  ip_address TEXT,
  status TEXT DEFAULT 'provisioning',
  hourly_rate DECIMAL(6,4) NOT NULL DEFAULT 0.01,
  current_cost DECIMAL(10,2) DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 4. PRODUCTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  shopify_product_id BIGINT,
  title TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  compare_at_price DECIMAL(10,2),
  inventory_quantity INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  images JSONB DEFAULT '[]',
  ai_optimized BOOLEAN DEFAULT false,
  supplier_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 5. AI TASKS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ai_tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  task_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 6. ORDERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  shopify_order_id BIGINT UNIQUE,
  order_number TEXT,
  total_price DECIMAL(10,2),
  financial_status TEXT DEFAULT 'pending',
  line_items JSONB DEFAULT '[]',
  ai_handled BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 7. ANALYTICS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  sessions INTEGER DEFAULT 0,
  orders INTEGER DEFAULT 0,
  revenue DECIMAL(12,2) DEFAULT 0,
  ad_spend DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(store_id, date)
);

-- ============================================================
-- 8. USAGE BILLING TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.usage_billing (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
  billing_period_start DATE NOT NULL,
  billing_period_end DATE NOT NULL,
  vps_hours DECIMAL(8,2) DEFAULT 0,
  vps_cost DECIMAL(10,2) DEFAULT 0,
  ai_worker_hours DECIMAL(8,2) DEFAULT 0,
  markup_multiplier DECIMAL(3,2) DEFAULT 1.0,
  total_cost DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 9. API SETTINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.api_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  service TEXT NOT NULL,
  api_key TEXT,
  api_secret TEXT,
  access_token TEXT,
  settings_json JSONB DEFAULT '{}',
  UNIQUE(store_id, service)
);

-- ============================================================
-- ENABLE RLS
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vps_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================
CREATE POLICY "Users own their profile" ON public.profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own their stores" ON public.stores FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Users own their VPS" ON public.vps_instances FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users access products in own stores" ON public.products FOR ALL
  USING (EXISTS (SELECT 1 FROM public.stores WHERE stores.id = products.store_id AND stores.user_id = auth.uid()));

CREATE POLICY "Users access orders in own stores" ON public.orders FOR ALL
  USING (EXISTS (SELECT 1 FROM public.stores WHERE stores.id = orders.store_id AND stores.user_id = auth.uid()));

CREATE POLICY "Users access tasks in own stores" ON public.ai_tasks FOR ALL
  USING (EXISTS (SELECT 1 FROM public.stores WHERE stores.id = ai_tasks.store_id AND stores.user_id = auth.uid()));

CREATE POLICY "Users access analytics in own stores" ON public.analytics FOR ALL
  USING (EXISTS (SELECT 1 FROM public.stores WHERE stores.id = analytics.store_id AND stores.user_id = auth.uid()));

CREATE POLICY "Users access billing" ON public.usage_billing FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users access API settings in own stores" ON public.api_settings FOR ALL
  USING (EXISTS (SELECT 1 FROM public.stores WHERE stores.id = api_settings.store_id AND stores.user_id = auth.uid()));

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_stores_user_id ON public.stores(user_id);
CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);
CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);
CREATE INDEX IF NOT EXISTS idx_ai_tasks_store_id ON public.ai_tasks(store_id);
CREATE INDEX IF NOT EXISTS idx_analytics_store_date ON public.analytics(store_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_billing_user_period ON public.usage_billing(user_id, billing_period_start DESC);

-- ============================================================
-- AUTO-CREATE PROFILE TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
