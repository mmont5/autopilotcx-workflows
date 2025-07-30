-- Update healthcare industry with correct procedure names
UPDATE industry 
SET highlighting_phrases = '[
  {
    "phrase": "first name and last name",
    "capitalized": "First Name and Last Name"
  },
  {
    "phrase": "First Name and Last Name",
    "capitalized": "First Name and Last Name"
  },
  {
    "phrase": "date of birth",
    "capitalized": "Date of Birth"
  },
  {
    "phrase": "Date of Birth",
    "capitalized": "Date of Birth"
  },
  {
    "phrase": "phone number",
    "capitalized": "Phone Number"
  },
  {
    "phrase": "Phone Number",
    "capitalized": "Phone Number"
  },
  {
    "phrase": "email address",
    "capitalized": "Email Address"
  },
  {
    "phrase": "Email Address",
    "capitalized": "Email Address"
  },
  {
    "phrase": "insurance ID number",
    "capitalized": "Insurance ID Number"
  },
  {
    "phrase": "Insurance ID Number",
    "capitalized": "Insurance ID Number"
  },
  {
    "phrase": "group number",
    "capitalized": "Group Number"
  },
  {
    "phrase": "Group Number",
    "capitalized": "Group Number"
  },
  {
    "phrase": "policy holder",
    "capitalized": "Policy Holder"
  },
  {
    "phrase": "Policy Holder",
    "capitalized": "Policy Holder"
  },
  {
    "phrase": "1 to 10",
    "capitalized": "1 to 10"
  },
  {
    "phrase": "scale of 1 to 10",
    "capitalized": "Scale of 1 to 10"
  },
  {
    "phrase": "Scale of 1 to 10",
    "capitalized": "Scale of 1 to 10"
  },
  {
    "phrase": "pain level",
    "capitalized": "Pain Level"
  },
  {
    "phrase": "Pain Level",
    "capitalized": "Pain Level"
  },
  {
    "phrase": "symptoms",
    "capitalized": "Symptoms"
  },
  {
    "phrase": "Symptoms",
    "capitalized": "Symptoms"
  },
  {
    "phrase": "lumbar sympathetic injections",
    "capitalized": "Lumbar Sympathetic Injections"
  },
  {
    "phrase": "Lumbar Sympathetic Injections",
    "capitalized": "Lumbar Sympathetic Injections"
  },
  {
    "phrase": "medial branch blocks",
    "capitalized": "Medial Branch Blocks"
  },
  {
    "phrase": "Medial Branch Blocks",
    "capitalized": "Medial Branch Blocks"
  },
  {
    "phrase": "mild procedure",
    "capitalized": "MILD Procedure"
  },
  {
    "phrase": "MILD Procedure",
    "capitalized": "MILD Procedure"
  },
  {
    "phrase": "nerve blocks",
    "capitalized": "Nerve Blocks"
  },
  {
    "phrase": "Nerve Blocks",
    "capitalized": "Nerve Blocks"
  },
  {
    "phrase": "epidural steroid injections",
    "capitalized": "Epidural Steroid Injections"
  },
  {
    "phrase": "Epidural Steroid Injections",
    "capitalized": "Epidural Steroid Injections"
  },
  {
    "phrase": "epidural",
    "capitalized": "Epidural"
  },
  {
    "phrase": "Epidural",
    "capitalized": "Epidural"
  },
  {
    "phrase": "non-surgical care",
    "capitalized": "Non-Surgical Care"
  },
  {
    "phrase": "Non-Surgical Care",
    "capitalized": "Non-Surgical Care"
  },
  {
    "phrase": "minimally invasive",
    "capitalized": "Minimally Invasive"
  },
  {
    "phrase": "Minimally Invasive",
    "capitalized": "Minimally Invasive"
  },
  {
    "phrase": "pain relief",
    "capitalized": "Pain Relief"
  },
  {
    "phrase": "Pain Relief",
    "capitalized": "Pain Relief"
  },
  {
    "phrase": "physical therapy",
    "capitalized": "Physical Therapy"
  },
  {
    "phrase": "Physical Therapy",
    "capitalized": "Physical Therapy"
  },
  {
    "phrase": "spine surgery",
    "capitalized": "Spine Surgery"
  },
  {
    "phrase": "Spine Surgery",
    "capitalized": "Spine Surgery"
  },
  {
    "phrase": "podiatry",
    "capitalized": "Podiatry"
  },
  {
    "phrase": "Podiatry",
    "capitalized": "Podiatry"
  },
  {
    "phrase": "orthopedics",
    "capitalized": "Orthopedics"
  },
  {
    "phrase": "Orthopedics",
    "capitalized": "Orthopedics"
  },
  {
    "phrase": "insurance",
    "capitalized": "Insurance"
  },
  {
    "phrase": "Insurance",
    "capitalized": "Insurance"
  },
  {
    "phrase": "location",
    "capitalized": "Location"
  },
  {
    "phrase": "Location",
    "capitalized": "Location"
  },
  {
    "phrase": "locations",
    "capitalized": "Locations"
  },
  {
    "phrase": "Locations",
    "capitalized": "Locations"
  }
]'::jsonb
WHERE name ILIKE '%healthcare%' OR name ILIKE '%medical%' OR name ILIKE '%health%'; 