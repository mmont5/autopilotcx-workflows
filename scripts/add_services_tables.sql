-- 1. Create the master services table
CREATE TABLE IF NOT EXISTS public.services (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  industry_id uuid REFERENCES public.industry(id),
  category_id uuid REFERENCES public.category(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Create the demo_services join table
CREATE TABLE IF NOT EXISTS public.demo_services (
  demo_id uuid REFERENCES public.demo(id),
  service_id uuid REFERENCES public.services(id),
  PRIMARY KEY (demo_id, service_id)
);

-- 3. Seed example services for each industry
-- Remove the old Healthcare service seeds (if already inserted)
DELETE FROM public.services
WHERE industry_id = (SELECT id FROM public.industry WHERE name ILIKE '%healthcare%')
  AND name IN ('Back Pain', 'Sports Injury', 'Chronic Pain', 'Neck Pain', 'Headache');

-- Insert the correct services for Healthcare (Dr. Hassan)
INSERT INTO public.services (name, description, industry_id)
SELECT 'Spine Surgery', 'Spine surgery and related procedures', id FROM public.industry WHERE name ILIKE '%healthcare%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Non-Surgical', 'Non-surgical spine and pain management', id FROM public.industry WHERE name ILIKE '%healthcare%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Podiatry', 'Foot and ankle care', id FROM public.industry WHERE name ILIKE '%healthcare%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Orthopedics', 'Orthopedic care and surgery', id FROM public.industry WHERE name ILIKE '%healthcare%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Symptoms', 'General symptom assessment', id FROM public.industry WHERE name ILIKE '%healthcare%';

-- Real Estate
INSERT INTO public.services (name, description, industry_id)
SELECT 'Home Search', 'Find available homes', id FROM public.industry WHERE name ILIKE '%real estate%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Schedule Viewing', 'Book a home viewing', id FROM public.industry WHERE name ILIKE '%real estate%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Virtual Tour', 'Request a virtual property tour', id FROM public.industry WHERE name ILIKE '%real estate%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Pricing', 'Get property pricing info', id FROM public.industry WHERE name ILIKE '%real estate%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Agent Match', 'Connect with a real estate agent', id FROM public.industry WHERE name ILIKE '%real estate%';

-- Legal Services
INSERT INTO public.services (name, description, industry_id)
SELECT 'Consultation', 'Book a legal consultation', id FROM public.industry WHERE name ILIKE '%legal%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Case Review', 'Request a case review', id FROM public.industry WHERE name ILIKE '%legal%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Docs', 'Get help with legal documents', id FROM public.industry WHERE name ILIKE '%legal%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Fees', 'Inquire about legal fees', id FROM public.industry WHERE name ILIKE '%legal%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Contact', 'Contact the law office', id FROM public.industry WHERE name ILIKE '%legal%';

-- Financial Services
INSERT INTO public.services (name, description, industry_id)
SELECT 'Meet', 'Schedule a financial meeting', id FROM public.industry WHERE name ILIKE '%financial%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Services', 'Explore financial services', id FROM public.industry WHERE name ILIKE '%financial%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Rates', 'Get current rates', id FROM public.industry WHERE name ILIKE '%financial%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Quote', 'Request a quote', id FROM public.industry WHERE name ILIKE '%financial%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Contact', 'Contact the financial office', id FROM public.industry WHERE name ILIKE '%financial%';

-- Ecommerce & Online Services
INSERT INTO public.services (name, description, industry_id)
SELECT 'Shop', 'Browse products', id FROM public.industry WHERE name ILIKE '%ecommerce%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Track', 'Track your order', id FROM public.industry WHERE name ILIKE '%ecommerce%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Returns', 'Return an item', id FROM public.industry WHERE name ILIKE '%ecommerce%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Offers', 'View current offers', id FROM public.industry WHERE name ILIKE '%ecommerce%';
INSERT INTO public.services (name, description, industry_id)
SELECT 'Contact', 'Contact the store', id FROM public.industry WHERE name ILIKE '%ecommerce%'; 