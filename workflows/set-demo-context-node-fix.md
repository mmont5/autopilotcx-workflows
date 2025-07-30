# Set Demo Context Node Fix

**Node Name:** Set Demo Context  
**Issue:** The body field assignment is causing booking data to be lost. Need to fix the assignments to properly preserve booking data.

**Updated Assignments for Set Demo Context Node:**

Replace the current assignments with these:

```json
{
  "assignments": [
    {
      "id": "23ead7dc-9089-4ae3-a8de-b5e217ee37f6",
      "name": "userContext",
      "value": "={{ $json.body?.userContext || $json.userContext || {} }}",
      "type": "object"
    },
    {
      "id": "82a19ca6-cc89-471c-9ec4-4409c109a72b",
      "name": "body",
      "value": "={{ $json.body || $json }}",
      "type": "string"
    },
    {
      "id": "44989cb0-7ac6-431f-842c-9497ac4795e5",
      "name": "supabase_url",
      "value": "https://twtxouksqmgexkfwmlub.supabase.co",
      "type": "string"
    },
    {
      "id": "6b9a18ab-b1ae-4788-86aa-bfc5ef7435dc",
      "name": "supabase_api_key",
      "value": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3dHhvdWtzcW1nZXhrZndtbHViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5ODU4MjEsImV4cCI6MjA2MjU2MTgyMX0.6x4kuGgORXttRiLSd6qIN-IFrU3s2VXk4mBup76FQuU",
      "type": "string"
    },
    {
      "id": "c701144c-e61d-4878-a2f1-2ca7e04ae7fb",
      "name": "bookingState",
      "value": "={{ $json.bookingState || $json.body?.bookingState || '' }}",
      "type": "string"
    },
    {
      "id": "09b6a324-7918-4385-a814-e3baaea47daa",
      "name": "bookingData",
      "value": "={{ $json.bookingData || $json.body?.bookingData || {} }}",
      "type": "string"
    },
    {
      "id": "96980c31-6829-4e5d-a08d-988fabc0f66b",
      "name": "company_name",
      "value": "={{ $json.company_name || $json.body?.company_name || $json.body?.data?.company_name || '' }}",
      "type": "string"
    },
    {
      "id": "b7fd796d-e871-4c74-a12c-68d7f170ac41",
      "name": "agent_name",
      "value": "={{ $json.agent_name || $json.body?.agent_name || $json.body?.data?.agent_name || '' }}",
      "type": "string"
    },
    {
      "id": "ed6a0153-ff89-4c60-a75f-ca1835b44f2f",
      "name": "demoId",
      "value": "={{ $json.id || $json.body?.id || $json.body?.demoId || '' }}",
      "type": "string"
    },
    {
      "id": "314e7c00-10e9-4ae4-8f3b-ccf1a7fedfb0",
      "name": "industry",
      "value": "={{ $json.industry || $json.body?.industry || 'healthcare' }}",
      "type": "string"
    },
    {
      "id": "a71b1e83-4561-4a5e-9234-25001371bb89",
      "name": "category",
      "value": "={{ $json.category || $json.body?.category || 'pain_management' }}",
      "type": "string"
    }
  ]
}
```

**Key Changes Made:**

1. **Fixed body field assignment**: Changed from `"={{ $json.body }}"` to `"={{ $json.body || $json }}"` to prevent undefined values
2. **Fixed bookingState assignment**: Changed order to check `$json.bookingState` first, then `$json.body?.bookingState`
3. **Fixed bookingData assignment**: Changed order to check `$json.bookingData` first, then `$json.body?.bookingData`

**What this fixes:**

1. **Prevents undefined body**: The body field will now fall back to the entire JSON if body is undefined
2. **Preserves booking data**: The bookingState and bookingData assignments now check the top-level fields first
3. **Maintains data flow**: All other assignments remain the same but with better fallback logic

**Instructions:**
1. Go to N8N UI → Find the "Set Demo Context" node
2. Click on the node to open its settings
3. In the "Assignments" section, replace all the current assignments with the ones above
4. Save the workflow
5. Export the updated workflow JSON and replace the file in `/workflows`

This should fix the issue where booking data is being lost in the Set Demo Context node. 