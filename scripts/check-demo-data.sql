-- Check existing demo records
SELECT id, company_name, industry, category, created_at 
FROM demo 
ORDER BY created_at DESC 
LIMIT 10;

-- Create Dr. Hassan demo record if it doesn't exist
INSERT INTO demo (
  id,
  company_name,
  industry,
  category,
  category_ids,
  specialists,
  locations,
  contact_phone,
  contact_email,
  logourl,
  tagline,
  created_at,
  updated_at
) VALUES (
  'hassan-demo-uuid-1234-5678-9abc-def012345678',
  'Hassan Spine & Sports Medicine',
  'healthcare',
  'Pain Management, Sports Medicine',
  '["52ac4d54-5594-4b00-8393-28d4e25f19b3", "f0579e36-d7ef-4e9e-8223-d5bb4c19171a"]',
  '[{"name": "Dr. Shady Hassan", "specialty": "Spine Surgery"}, {"name": "Dr. Olivia Hassan", "specialty": "Sports Medicine"}]',
  '[{"name": "Old Bridge Office", "address1": "123 Main St", "address2": "Suite 100", "city": "Old Bridge", "state": "NJ", "zip": "08857"}, {"name": "Jersey City Office", "address1": "456 Oak Ave", "address2": "Floor 2", "city": "Jersey City", "state": "NJ", "zip": "07302"}, {"name": "South Plainfield Office", "address1": "789 Pine Rd", "address2": "", "city": "South Plainfield", "state": "NJ", "zip": "07080"}]',
  '(732) 555-0123',
  'info@hassanspine.com',
  'https://example.com/hassan-logo.png',
  'Expert Spine & Sports Medicine Care',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Verify the record was created
SELECT id, company_name, industry, category 
FROM demo 
WHERE company_name LIKE '%Hassan%'; 