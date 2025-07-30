# Pass Context Forward Node Action Fix

The Pass Context Forward node is not correctly extracting the action from the fullContext. Here's the fix:

## Current Code (around line 370):
```javascript
// CRITICAL FIX: Create webhook data structure for chat interactions
const webhookDataForContext = {
  message: message,
  bookingState: previousBookingState,
  bookingData: previousBookingData,
  userAction: fullContext.userAction || "",
  timestamp: new Date().toISOString()
};
```

## Fixed Code:
```javascript
// CRITICAL FIX: Create webhook data structure for chat interactions
const webhookDataForContext = {
  message: message,
  bookingState: previousBookingState,
  bookingData: previousBookingData,
  userAction: fullContext.action || fullContext.userAction || "",
  timestamp: new Date().toISOString()
};
```

## Key Changes:
1. **Added action extraction**: `fullContext.action || fullContext.userAction || ""`
2. **Multiple sources**: Action is extracted from both `fullContext.action` (from Merge Google Place Data) and `fullContext.userAction` (fallback)

This fix ensures that the action field is correctly passed to the BookingAgent through the `webhookData.userAction` field.

## Summary:
The issue was that the action was being lost in two places:
1. **Merge Google Place Data node**: Not preserving the action field
2. **Pass Context Forward node**: Not extracting the action from the correct field

With both fixes applied, the action should flow correctly from the frontend through the workflow to the BookingAgent.