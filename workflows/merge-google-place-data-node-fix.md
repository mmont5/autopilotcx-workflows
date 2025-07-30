# Merge Google Place Data Node Fix

The Merge Google Place Data node is not preserving the action field, which is causing the action detection to fail in the BookingAgent. Here's the fix:

## Current Code (lines 295-325):
```javascript
return items.map((item, i) => {
  // Get the main data from the Initial Processing node (Supabase row)
  const mainData = $items("Initial Processing")[0]?.json || {};
  // Get the Google Places result from the previous node (this node's input)
  const googleData = item.json?.result || {};

  // Find the message from the mainData, item.json, or userContext
  const message =
    mainData.message ||
    item.json.message ||
    (mainData.body && mainData.body.message) ||
    (item.json.body && item.json.body.message) ||
    "";

  // CRITICAL FIX: Preserve booking state from previous interactions
  // Get booking state from the current item (previous interaction response)
  const bookingState = item.json.bookingState || "";
  const bookingData = item.json.bookingData || "{}";

  // Merge all context: current item, mainData, and google_place, and always include message
  return {
    json: {
      ...item.json,         // preserves all context from previous nodes (headers, params, body, etc.)
      ...mainData,          // main data from Initial Processing
      google_place: googleData, // Google Places data
      message,              // always include message for PreludeAgent
      // CRITICAL FIX: Preserve booking state from previous interaction
      bookingState,         // <-- ADDED: Preserve booking state
      bookingData           // <-- ADDED: Preserve booking data
    },
    pairedItem: i
  };
});
```

## Fixed Code:
```javascript
return items.map((item, i) => {
  // Get the main data from the Initial Processing node (Supabase row)
  const mainData = $items("Initial Processing")[0]?.json || {};
  // Get the Google Places result from the previous node (this node's input)
  const googleData = item.json?.result || {};

  // Find the message from the mainData, item.json, or userContext
  const message =
    mainData.message ||
    item.json.message ||
    (mainData.body && mainData.body.message) ||
    (item.json.body && item.json.body.message) ||
    "";

  // CRITICAL FIX: Preserve booking state and action from previous interactions
  // Get booking state from the current item (previous interaction response)
  const bookingState = item.json.bookingState || "";
  const bookingData = item.json.bookingData || "{}";
  const action = item.json.action || mainData.action || "";

  // Merge all context: current item, mainData, and google_place, and always include message
  return {
    json: {
      ...item.json,         // preserves all context from previous nodes (headers, params, body, etc.)
      ...mainData,          // main data from Initial Processing
      google_place: googleData, // Google Places data
      message,              // always include message for PreludeAgent
      // CRITICAL FIX: Preserve booking state and action from previous interaction
      bookingState,         // <-- ADDED: Preserve booking state
      bookingData,          // <-- ADDED: Preserve booking data
      action                // <-- ADDED: Preserve action
    },
    pairedItem: i
  };
});
```

## Key Changes:
1. **Added action preservation**: `const action = item.json.action || mainData.action || "";`
2. **Added action to output**: `action` field is now included in the returned JSON
3. **Multiple sources**: Action is extracted from both `item.json.action` (current request) and `mainData.action` (from Initial Processing)

This fix ensures that the action field is preserved through the Merge Google Place Data node and will be available in the `fullContext` that the Pass Context Forward node uses to create the `webhookDataForContext.userAction` field.