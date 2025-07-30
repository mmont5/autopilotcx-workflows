-- Update "Symptoms" to "Sports Medicine" for healthcare industry
UPDATE public.services 
SET name = 'Sports Medicine', 
    description = 'Sports medicine and athletic injury care'
WHERE name = 'Symptoms' 
  AND industry_id = (SELECT id FROM public.industry WHERE name ILIKE '%healthcare%');

-- Verify the update
SELECT name, description, industry_id 
FROM public.services 
WHERE industry_id = (SELECT id FROM public.industry WHERE name ILIKE '%healthcare%')
ORDER BY name; 