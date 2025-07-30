-- Seed authoritative sites for healthcare industry
-- Using the exact UUIDs from the test data and matching the actual schema

-- First, let's check if the industry and category exist
-- Run these queries first to verify the UUIDs:

-- SELECT id, name FROM industry WHERE name ILIKE '%health%';
-- SELECT id, name FROM category WHERE name ILIKE '%pain%';

-- Add authoritative sites for healthcare/pain management
INSERT INTO authoritative_sites (industry_id, category_id, site_name, site_url, site_type, category, reliability_rating, validation_status) VALUES
-- Pain Management Sites
('72de42f8-2a0b-4835-a764-212d1532a865', 'a4a4b4e4-7f1a-47a3-832c-3e6037a5c7f8', 'Mayo Clinic - Back Pain', 'https://www.mayoclinic.org/diseases-conditions/back-pain', 'medical', 'Pain Management', 95, 'validated'),
('72de42f8-2a0b-4835-a764-212d1532a865', 'a4a4b4e4-7f1a-47a3-832c-3e6037a5c7f8', 'WebMD Pain Management', 'https://www.webmd.com/pain-management/default.htm', 'medical', 'Pain Management', 85, 'validated'),
('72de42f8-2a0b-4835-a764-212d1532a865', 'a4a4b4e4-7f1a-47a3-832c-3e6037a5c7f8', 'Spine-Health', 'https://www.spine-health.com', 'medical', 'Pain Management', 90, 'validated'),
('72de42f8-2a0b-4835-a764-212d1532a865', 'a4a4b4e4-7f1a-47a3-832c-3e6037a5c7f8', 'Healthline Pain Management', 'https://www.healthline.com/health/pain-management', 'medical', 'Pain Management', 88, 'validated'),
('72de42f8-2a0b-4835-a764-212d1532a865', 'a4a4b4e4-7f1a-47a3-832c-3e6037a5c7f8', 'MedicineNet Pain Management', 'https://www.medicinenet.com/pain_management/article.htm', 'medical', 'Pain Management', 87, 'validated'),

-- Sports Medicine Sites
('72de42f8-2a0b-4835-a764-212d1532a865', 'a4a4b4e4-7f1a-47a3-832c-3e6037a5c7f8', 'American Orthopaedic Society for Sports Medicine', 'https://www.sportsmed.org', 'medical', 'Sports Medicine', 92, 'validated'),
('72de42f8-2a0b-4835-a764-212d1532a865', 'a4a4b4e4-7f1a-47a3-832c-3e6037a5c7f8', 'American College of Sports Medicine', 'https://www.acsm.org', 'medical', 'Sports Medicine', 94, 'validated'),

-- General Healthcare Sites
('72de42f8-2a0b-4835-a764-212d1532a865', 'a4a4b4e4-7f1a-47a3-832c-3e6037a5c7f8', 'Centers for Disease Control and Prevention', 'https://www.cdc.gov', 'government', 'Healthcare', 98, 'validated'),
('72de42f8-2a0b-4835-a764-212d1532a865', 'a4a4b4e4-7f1a-47a3-832c-3e6037a5c7f8', 'National Institutes of Health', 'https://www.nih.gov', 'government', 'Healthcare', 97, 'validated'),
('72de42f8-2a0b-4835-a764-212d1532a865', 'a4a4b4e4-7f1a-47a3-832c-3e6037a5c7f8', 'U.S. Food and Drug Administration', 'https://www.fda.gov', 'government', 'Healthcare', 96, 'validated'),

-- Dr. Hassan's Practice Site
('72de42f8-2a0b-4835-a764-212d1532a865', 'a4a4b4e4-7f1a-47a3-832c-3e6037a5c7f8', 'Hassan Spine & Sports Medicine', 'https://www.hassanspine.com', 'practice', 'Pain Management', 100, 'validated');

-- Verify the data was inserted
-- SELECT * FROM authoritative_sites WHERE industry_id = '72de42f8-2a0b-4835-a764-212d1532a865'; 