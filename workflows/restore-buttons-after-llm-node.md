# Restore Buttons After LLM Node - FIXED BUTTON LOGIC

## **Updated Code for "Restore Buttons After LLM" Node**

**Replace the entire code in the "Restore Buttons After LLM" node with:**

```javascript
// FIXED BUTTON LOGIC: Restore Buttons After LLM Node
// Only add buttons in initial state, not in subsequent states

console.log("🚀 FIXED RESTORE: Adding buttons back after LLM with correct logic");

// Get the LLM response
const llmResponse = $json;

// Get the booking state from the current input (if available)
const bookingState = $json.bookingState || "patient_type";

console.log("🚀 LLM response:", llmResponse.text);
console.log("🚀 Booking state:", bookingState);

// CRITICAL FIX: Only generate buttons if we're in the initial state
let suggestedActions = [];

if (bookingState === "initial" || bookingState === "patient_type") {
  console.log("🚀 GENERATING BUTTONS: New Patient/Existing Patient for initial state");
  suggestedActions = [
    { text: "New Patient", action: "new_patient" },
    { text: "Existing Patient", action: "existing_patient" }
  ];
} else {
  console.log("🚀 NO BUTTONS: Advanced past initial state, no buttons needed");
  suggestedActions = []; // No buttons for any other state
}

console.log("🚀 Final suggestedActions:", suggestedActions);

// Return the response with correct buttons
return [{
  json: {
    agent_response: llmResponse.text || llmResponse.agent_response || "",
    suggestedActions: suggestedActions,
    bookingState: bookingState,
    // Preserve other important fields
    demoId: $json.demoId,
    companyName: $json.companyName,
    agentName: $json.agentName,
    // Add debug info
    debug_info: {
      buttons_generated: suggestedActions.length > 0,
      llm_text: llmResponse.text,
      booking_state: bookingState,
      button_logic_fixed: true
    }
  },
  pairedItem: {
    item: 0
  }
}];
```

## **Key Fixes:**

1. **State-Based Button Logic** - Only generates buttons when `bookingState` is "initial" or "patient_type"
2. **Clear Button Removal** - Sets `suggestedActions = []` for all other states
3. **Debug Logging** - Shows when buttons are generated or not
4. **Proper State Preservation** - Passes through the booking state correctly

## **Expected Results:**

- **First Response**: Has "New Patient" and "Existing Patient" buttons
- **Second Response**: NO buttons (asks for name)
- **Third Response**: NO buttons (asks for date of birth)
- **All Subsequent Responses**: NO buttons

This should fix the issue where buttons appear in the 2nd response! 