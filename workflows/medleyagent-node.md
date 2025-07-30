# MedleyAgent Node - Button Fix

## **Problem**
MedleyAgent is overriding the "New Patient" and "Existing Patient" buttons with generic buttons.

## **Solution**
Preserve the buttons from Build Booking Prompt node instead of overriding them.

## **Code for MedleyAgent Node**

Replace your current MedleyAgent node with this code:

```javascript
// Handle both array and object LLM responses
const llmData = $json;
const original = $item(0).$json || {};

let agent_response = "";
let suggestedActions = [];
let llm_used = false;

// If input is an array, use the first element
let llmObj = Array.isArray(llmData) && llmData.length > 0 ? llmData[0] : llmData;

if (llmObj && typeof llmObj.text === 'string' && llmObj.text.trim()) {
  agent_response = llmObj.text.trim();
  llm_used = true;
} else {
  agent_response = "I'm so sorry, I couldn't process your request right now. Would you like to book an appointment or learn about treatment options?";
  llm_used = false;
}

// CRITICAL FIX: Preserve suggestedActions from Build Booking Prompt instead of overriding
suggestedActions = original.suggestedActions || [];

// Only add pain scale buttons if the LLM asks for a pain rating AND no buttons exist
if (agent_response.toLowerCase().includes("how would you rate your pain") && suggestedActions.length === 0) {
  console.log("🚀 MEDLEYAGENT: Adding pain scale buttons");
  suggestedActions = Array.from({ length: 10 }, (_, i) => ({
    label: `${i + 1}`,
    value: `Pain level ${i + 1}`
  }));
}

console.log("🚀 MEDLEYAGENT: Preserved suggestedActions:", suggestedActions);

// Return a single n8n item, properly linked
return [{
  json: {
    ...original,
    agent_response,
    suggestedActions, // CRITICAL: Use preserved buttons instead of overriding
    llm_used,
    debug_info: {
      llm_used,
      llm_raw: llmObj,
      fallback_used: !llm_used,
      llm_text: llmObj.text || "no text field",
      original_fields: Object.keys(original),
      preserved_buttons: suggestedActions
    }
  },
  pairedItem: 0
}];
```

## **What This Fixes**

✅ **Preserves buttons** from Build Booking Prompt node
✅ **No more button override** - keeps "New Patient" and "Existing Patient" buttons
✅ **Still adds pain scale** when needed
✅ **Debug logging** to track button preservation

## **Expected Result**

The "New Patient" and "Existing Patient" buttons should now show up because MedleyAgent preserves them instead of overriding with generic buttons. 