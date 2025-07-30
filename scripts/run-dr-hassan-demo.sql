-- Insert Dr. Hassan's demo data
INSERT INTO demo (
  id,
  company_name,
  logo,
  tagline,
  owner_first_name,
  owner_last_name,
  ownertitle,
  ownerbio,
  ownerimageurl,
  company_phone,
  company_email,
  website,
  locations,
  specialists,
  team_members,
  industry_id,
  category_id,
  social_accounts,
  metadata,
  status,
  created_at,
  updated_at
) VALUES (
  '96a4a085-7f59-4d17-852b-576b3163c57d',
  'Hassan Spine & Sports Medicine',
  'https://example.com/logo.png',
  'Expert Spine Care & Sports Medicine',
  'Shady',
  'Hassan',
  'Medical Director',
  'Board-certified in pain management and sports medicine with over 15 years of experience.',
  'https://example.com/dr-hassan.jpg',
  '214-423-1352',
  'info@hassanspine.com',
  'https://hassanspine.com',
  '[
    {
      "name": "Old Bridge Office",
      "address1": "200 Perrine Road",
      "address2": "Suite 220",
      "city": "Old Bridge",
      "state": "NJ",
      "zip": "08857",
      "phone": "214-423-1352",
      "hours": "Mon-Fri 8am-5pm",
      "is_main": true
    },
    {
      "name": "Jersey City Office",
      "address1": "709 Newark Avenue",
      "address2": "",
      "city": "Jersey City",
      "state": "NJ",
      "zip": "07306",
      "phone": "214-423-1352",
      "hours": "Mon-Fri 8am-5pm",
      "is_main": false
    },
    {
      "name": "South Plainfield Office",
      "address1": "906 Oak Tree Road",
      "address2": "Suite Q",
      "city": "South Plainfield",
      "state": "NJ",
      "zip": "07080",
      "phone": "214-423-1352",
      "hours": "Mon-Fri 8am-5pm",
      "is_main": false
    }
  ]',
  '[
    {
      "first_name": "Shady",
      "last_name": "Hassan",
      "title": "Medical Director",
      "specialty": "Pain Management",
      "bio": "Board-certified in pain management and sports medicine.",
      "image_url": "https://example.com/dr-hassan.jpg"
    }
  ]',
  '[
    {
      "first_name": "Jane",
      "last_name": "Doe",
      "role": "Nurse",
      "bio": "Experienced RN specializing in pain management.",
      "image_url": "https://example.com/jane-doe.jpg"
    }
  ]',
  'medical',
  'pain-management',
  '[
    {
      "network": "facebook",
      "url": "https://facebook.com/hassanspine"
    },
    {
      "network": "linkedin",
      "url": "https://linkedin.com/company/hassanspine"
    }
  ]',
  '{
    "languages": ["English", "Spanish"],
    "insurance": ["Aetna", "Blue Cross Blue Shield", "Cigna", "United Healthcare", "Horizon Blue Cross Blue Shield", "AmeriHealth"],
    "office_hours": {
      "Monday": "8:00 AM - 5:00 PM",
      "Tuesday": "8:00 AM - 5:00 PM",
      "Wednesday": "8:00 AM - 5:00 PM",
      "Thursday": "8:00 AM - 5:00 PM",
      "Friday": "8:00 AM - 5:00 PM"
    },
    "specialties": ["Pain Management", "Sports Medicine", "Spine Care", "Podiatry", "Orthopedics"],
    "awards": ["Top Doctor 2023", "Patient Choice Award"],
    "testimonials": [
      {
        "rating": 5,
        "text": "Dr. Hassan is amazing! He helped me get back to running after my injury.",
        "author": "John D."
      }
    ],
    "payment_methods": ["Credit Card", "Insurance", "Cash"],
    "category_ids": ["52ac4d54-5594-4b00-8393-28d4e25f19b3", "f0579e36-d7ef-4e9e-8223-d5bb4c19171a"]
  }',
  'active',
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  updated_at = NOW(); 