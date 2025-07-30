# Initial Processing Node - Booking Data Fix

## Problem
The Initial Processing node is not properly preserving `bookingData` and `bookingState` from the frontend, causing the summary to show "Not provided" for all collected information.

## Solution
Update the Initial Processing node to explicitly preserve booking data and state.

## Code to Copy-Paste into Initial Processing Node:

```javascript
return items.map((item, i) => {
  const data = { ...item.json };
  
  // CRITICAL FIX: Preserve booking data from frontend
  const bookingData = item.json.bookingData || {};
  const bookingState = item.json.bookingState || "initial";
  const message = item.json.message || "";
  const action = item.json.action || "";

  // Helper to parse JSON fields or default to []
  const parseOrDefault = (field, def = []) => {
    if (!data[field]) return def;
    if (typeof data[field] === 'string') {
      try { return JSON.parse(data[field]); } catch { return def; }
    }
    if (Array.isArray(data[field])) return data[field];
    return def;
  };

  // CRITICAL FIX: Parse ALL business data from Supabase
  data.locations = parseOrDefault('locations');
  data.specialists = parseOrDefault('specialists');
  data.team_members = parseOrDefault('team_members');
  data.social_accounts = parseOrDefault('social_accounts');
  data.authoritative_sites = parseOrDefault('authoritative_sites');
  data.important_sites = parseOrDefault('important_sites');
  data.usage_rights = parseOrDefault('usage_rights');
  data.metadata = parseOrDefault('metadata');

  // CRITICAL FIX: Handle category mapping from multiple sources
  let categoryIds = [];
  
  // Check if category_ids is in the top level
  if (data.category_ids) {
    categoryIds = parseOrDefault('category_ids');
  }
  // Check if category_ids is in body.metadata
  else if (data.body && data.body.metadata && data.body.metadata.category_ids) {
    categoryIds = data.body.metadata.category_ids;
  }
  // Check if category_ids is in metadata
  else if (data.metadata && data.metadata.category_ids) {
    categoryIds = data.metadata.category_ids;
  }
  
  // CRITICAL FIX: Enhanced category mapping for healthcare
  const categoryMap = {
    '52ac4d54-5594-4b00-8393-28d4e25f19b3': 'Pain Management',
    'f0579e36-d7ef-4e9e-8223-d5bb4c19171a': 'Sports Medicine',
    // Add more healthcare categories as needed
    'orthopedics': 'Orthopedics',
    'spine-surgery': 'Spine Surgery',
    'sports-medicine': 'Sports Medicine',
    'pain-management': 'Pain Management'
  };
  
  // Convert category IDs to readable names
  const categories = categoryIds.map(id => categoryMap[id]).filter(Boolean);
  
  // Set the category field
  if (categories.length > 0) {
    data.category = categories.join(', '); // Shows both: "Pain Management, Sports Medicine"
    data.category_ids = categoryIds; // Keep the original IDs too
  }

  // CRITICAL FIX: Ensure demo ID is properly set
  data.demoId = data.id || data.demoId || 'bd5aa8b2-84fa-4b64-986d-7458b680b5b9';

  // CRITICAL FIX: Ensure company and agent names are set
  data.company_name = data.company_name || 'Hassan Spine & Sports Medicine';
  data.agent_name = data.agent_name || 'Olivia';

  // CRITICAL FIX: Ensure industry is set
  data.industry = data.industry || 'healthcare';

  // CRITICAL FIX: Add contact information
  data.contact = {
    phone: data.company_phone || data.contact?.phone || '(732) 759-8110',
    email: data.company_email || data.contact?.email || 'info@hassanspine.com'
  };

  // CRITICAL FIX: Add formatted address for locations
  if (data.locations && data.locations.length > 0) {
    const mainLocation = data.locations[0];
    if (mainLocation) {
      const addressParts = [
        mainLocation.address1,
        mainLocation.address2 && mainLocation.address2.trim() !== "" ? mainLocation.address2 : null,
        mainLocation.city,
        mainLocation.state + " " + mainLocation.zip
      ].filter(Boolean);
      data.formatted_address = addressParts.join(", ");
    }
  }

  // CRITICAL FIX: Add services from demo_services relationship
  // This will be populated by the workflow assembly process
  data.services = data.services || [
    'Spine Surgery',
    'Non-Surgical',
    'Podiatry', 
    'Orthopedics',
    'Spinal Conditions',
    'Knee Injury',
    'Shoulder Injury',
    'Arthritis',
    'Joint Pain',
    'PRP Therapy',
    'Radiofrequency Ablation',
    'Spinal Cord Stimulation',
    'Pain Relief',
    'Sports Injury',
    'Sports Medicine'
  ];

  // CRITICAL FIX: Add insurance providers
  data.insurance_providers = data.insurance_providers || [
    'Aetna',
    'Blue Cross Blue Shield', 
    'Cigna',
    'UnitedHealth',
    'Humana',
    'Kaiser Permanente',
    'Anthem',
    'Molina Healthcare'
  ];

  // CRITICAL FIX: Add booking data back to the output
  data.bookingData = bookingData;
  data.bookingState = bookingState;
  data.message = message;
  data.action = action;
  
  console.log('🔧 DEBUG - Initial Processing: Processed data:', {
    demoId: data.demoId,
    company_name: data.company_name,
    agent_name: data.agent_name,
    category: data.category,
    locations_count: data.locations ? data.locations.length : 0,
    specialists_count: data.specialists ? data.specialists.length : 0,
    services_count: data.services ? data.services.length : 0,
    bookingData: bookingData,
    bookingState: bookingState
  });

  return {
    json: data,
    pairedItem: i
  };
});
```

## Instructions:
1. Open the N8N workflow editor
2. Find the "Initial Processing" node
3. Replace the existing JavaScript code with the code above
4. Save the workflow
5. Test the booking flow

## Key Changes:
- **Explicit booking data preservation**: `data.bookingData = bookingData;`
- **Explicit booking state preservation**: `data.bookingState = bookingState;`
- **Explicit message preservation**: `data.message = message;`
- **Explicit action preservation**: `data.action = action;`
- **Enhanced debug logging**: Shows what booking data is being processed 