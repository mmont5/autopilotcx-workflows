# Pass Context Forward Node Revert Fix

The Pass Context Forward node is causing duplicate responses again. We need to revert it to the original working state. Here's the complete code to revert:

```javascript
// CRITICAL FIX: Process only the first item to prevent duplicates
const items = $input.all();

if (items.length === 0) {
  return [];
}

// Process only the first item
const item = items[0];

// Get the latest intent and next agent from PreludeAgent
const latestIntent = $node["PreludeAgent"].json.intent || '';
const nextAgent = $node["PreludeAgent"].json.nextAgent || '';

// Get the full, merged context from Merge Google Place Data
const fullContext = { ...$node["Merge Google Place Data"].json };

// Remove the outdated agent field if it exists
if ('agent' in fullContext) {
  delete fullContext.agent;
}

// Set or preserve conversation_stage
const conversationStage = fullContext.conversation_stage || "start";

// --- Find the user's message from all possible sources ---
let message = "";
// 1. Directly on the merged context
if (fullContext.message && fullContext.message.trim() !== "") {
  message = fullContext.message;
}
// 2. In the body object (common for webhooks)
else if (fullContext.body && fullContext.body.message) {
  message = fullContext.body.message;
}
// 3. In the original webhook node
else if ($node["Webhook"] && $node["Webhook"].json && $node["Webhook"].json.body && $node["Webhook"].json.body.message) {
  message = $node["Webhook"].json.body.message;
}
// 4. In the item itself
else if (item.json && item.json.message) {
  message = item.json.message;
}

// CRITICAL FIX: Get booking state from multiple sources to ensure it's preserved
// REVERTED: Use index [1] instead of [0] for Set Demo Context to prevent duplicates
const webhookData = $items("Set Demo Context")[1]?.json || {};
const previousBookingState = fullContext.bookingState || webhookData.bookingState || "";
const previousBookingData = fullContext.bookingData || webhookData.bookingData || "{}";

// CRITICAL FIX: Check if we're in an active booking session
const isInBookingSession = previousBookingState && previousBookingState !== "" && previousBookingState !== "complete";

// Override nextAgent if in active booking session
let finalNextAgent = nextAgent;
if (isInBookingSession) {
  finalNextAgent = "BookingAgent";
}

// CRITICAL FIX: Get complete demo data from Initial Processing
const demoData = $items("Initial Processing")[0]?.json || {};

// CRITICAL FIX: Create webhook data structure for chat interactions
const webhookDataForContext = {
  message: message,
  bookingState: previousBookingState,
  bookingData: previousBookingData,
  userAction: fullContext.action || fullContext.userAction || "",
  timestamp: new Date().toISOString()
};

// CRITICAL FIX: Create full context with enriched data
const fullContextForContext = {
  google_place: fullContext.google_place || {},
  result: fullContext.result || {},
  // Preserve any other enriched data
  ...Object.keys(fullContext).reduce((acc, key) => {
    if (['google_place', 'result'].includes(key)) {
      acc[key] = fullContext[key];
    }
    return acc;
  }, {})
};

// CRITICAL FIX: Build the unified context with ALL demo information preserved
return [{
  json: {
    ...fullContext,
    // CRITICAL FIX: Preserve ALL demo context with proper structure
    demoId: demoData.demoId || demoData.id || "bd5aa8b2-84fa-4b64-986d-7458b680b5b9",
    company_name: demoData.company_name || "Hassan Spine & Sports Medicine",
    agent_name: demoData.agent_name || "Olivia",
    industry: demoData.industry || 'healthcare',
    category: demoData.category || 'Pain Management, Sports Medicine',
    
    // CRITICAL FIX: Locations data - properly parsed
    locations: demoData.locations || [],
    formatted_address: demoData.formatted_address,
    
    // CRITICAL FIX: Contact information
    contact: demoData.contact || {
      phone: demoData.company_phone || "(732) 759-8110",
      email: demoData.company_email || "info@hassanspine.com"
    },
    
    // CRITICAL FIX: Practice details
    specialists: demoData.specialists || [],
    tagline: demoData.tagline,
    logourl: demoData.logourl,
    
    // CRITICAL FIX: Team information
    team_members: demoData.team_members || [],
    social_accounts: demoData.social_accounts || [],
    
    // CRITICAL FIX: Services and insurance - for BookingAgent
    services: demoData.services || [],
    insurance_providers: demoData.insurance_providers || [],
    
    // Google Places enriched data
    google_place: fullContext.google_place || {},
    
    // Intent and routing
    intent: latestIntent,
    nextAgent: finalNextAgent,
    conversation_stage: conversationStage,
    message,
    
    // CRITICAL FIX: Preserve booking state
    bookingState: previousBookingState,
    bookingData: previousBookingData,
    
    // CRITICAL FIX: Create the proper original_context structure that BookingAgent expects
    original_context: {
      demoData: {
        // ALL Dr. Hassan's business data from the 10-step form
        id: demoData.demoId || demoData.id,
        company_name: demoData.company_name,
        agent_name: demoData.agent_name,
        industry: demoData.industry,
        category: demoData.category,
        locations: demoData.locations,
        specialists: demoData.specialists,
        team_members: demoData.team_members,
        social_accounts: demoData.social_accounts,
        services: demoData.services,
        insurance_providers: demoData.insurance_providers,
        contact: demoData.contact,
        tagline: demoData.tagline,
        logourl: demoData.logourl,
        // Preserve all other demo fields
        ...Object.keys(demoData).reduce((acc, key) => {
          if (!['message', 'intent', 'nextAgent', 'bookingState', 'bookingData', 'confidence', 'urgency', 'timestamp', 'intent_detection_method'].includes(key)) {
            acc[key] = demoData[key];
          }
          return acc;
        }, {})
      },
      webhookData: webhookDataForContext,
      fullContext: fullContextForContext
    }
  },
  pairedItem: 0
}];
```

## Key Changes:
1. **Reverted index**: Changed back to `$items("Set Demo Context")[1]` instead of `[0]` to prevent duplicates
2. **Removed debug logs**: Removed the console.log statements that were causing issues
3. **Kept action fix**: Maintained the action extraction fix: `fullContext.action || fullContext.userAction || ""`

This should eliminate the duplicate responses while preserving the action flow fix.