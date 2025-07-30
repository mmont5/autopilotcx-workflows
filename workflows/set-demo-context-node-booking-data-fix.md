# Set Demo Context Node - Booking Data Fix

## Problem
The Set Demo Context node is not properly preserving `bookingData` and `bookingState` from the Initial Processing node, causing the summary to show "Not provided" for all collected information.

## Solution
Update the Set Demo Context node to explicitly preserve booking data and state.

## Code to Copy-Paste into Set Demo Context Node:

### Assignments to Add/Update:

```json
{
  "body": "={{ $json }}",
  "bookingState": "={{ $json.bookingState || 'initial' }}",
  "bookingData": "={{ $json.bookingData || {} }}",
  "message": "={{ $json.message || '' }}",
  "action": "={{ $json.action || '' }}",
  "demoId": "={{ $json.demoId || 'bd5aa8b2-84fa-4b64-986d-7458b680b5b9' }}",
  "company_name": "={{ $json.company_name || 'Hassan Spine & Sports Medicine' }}",
  "agent_name": "={{ $json.agent_name || 'Olivia' }}",
  "industry": "={{ $json.industry || 'healthcare' }}",
  "category": "={{ $json.category || 'Pain Management, Sports Medicine' }}",
  "locations": "={{ $json.locations || [] }}",
  "specialists": "={{ $json.specialists || [] }}",
  "services": "={{ $json.services || [] }}",
  "insurance_providers": "={{ $json.insurance_providers || [] }}",
  "contact": "={{ $json.contact || {} }}",
  "formatted_address": "={{ $json.formatted_address || '' }}",
  "metadata": "={{ $json.metadata || {} }}",
  "category_ids": "={{ $json.category_ids || [] }}"
}
```

## Instructions:
1. Open the N8N workflow editor
2. Find the "Set Demo Context" node
3. In the Assignments section, add/update the assignments above
4. Make sure to preserve any existing assignments that are not listed above
5. Save the workflow
6. Test the booking flow

## Key Changes:
- **Explicit booking data preservation**: `"bookingData": "={{ $json.bookingData || {} }}"`
- **Explicit booking state preservation**: `"bookingState": "={{ $json.bookingState || 'initial' }}"`
- **Explicit message preservation**: `"message": "={{ $json.message || '' }}"`
- **Explicit action preservation**: `"action": "={{ $json.action || '' }}"`
- **Fallback values**: Ensures data is preserved even if some fields are missing

## Important Notes:
- The `$json` refers to the output from the "Initial Processing" node
- The `||` operator provides fallback values if the data is missing
- This ensures that booking data flows through the entire workflow 