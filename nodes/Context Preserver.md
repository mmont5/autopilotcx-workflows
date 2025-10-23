CURRENT CODE:

// Context Preserver Node
// Purpose: Preserve pausedBookingState and pausedBookingData that gets lost
// when passing through "Message a model" LangChain AI node
//
// Position in workflow: AFTER "Message a model" and BEFORE "Healthcare Question Detector"

const items = $input.all();
const llmOutput = items[0].json;

// 🚨 CRITICAL FIX: Get paused state from Healthcare Concierge Prompt Builder's CURRENT execution
// The "Message a model" node strips all fields except the LLM response
// But we can retrieve the original data from the Prompt Builder node in THIS execution
const promptBuilderData = $('Healthcare Concierge Prompt Builder').first().json;

console.log('🔗 Context Preserver - Restoring lost context data');
console.log('📥 LLM Output Keys:', Object.keys(llmOutput));
console.log('📦 Prompt Builder Keys:', Object.keys(promptBuilderData));
console.log('⏸️  Paused Booking State:', promptBuilderData.pausedBookingState);
console.log('📋 Paused Booking Data:', promptBuilderData.pausedBookingData ? Object.keys(promptBuilderData.pausedBookingData) : 'none');

// Extract message from LLM output (handle different response formats)
let message = '';
if (llmOutput.content && Array.isArray(llmOutput.content) && llmOutput.content.length > 0) {
  // LangChain format: content array with text objects
  message = llmOutput.content[0].text || '';
} else if (llmOutput.message) {
  message = llmOutput.message;
} else if (llmOutput.text) {
  message = llmOutput.text;
} else if (llmOutput.output) {
  message = llmOutput.output;
}

console.log('💬 Extracted Message Length:', message.length);

// Combine LLM output with the preserved context data
return items.map((item, index) => ({
  json: {
    // Keep the LLM's message response
    message: message,

    // Restore the paused state data from Prompt Builder
    pausedBookingState: promptBuilderData.pausedBookingState || null,
    pausedBookingData: promptBuilderData.pausedBookingData || null,

    // Restore other important context from Prompt Builder
    demoContext: promptBuilderData.demoContext || {},
    userMessage: promptBuilderData.userMessage || '',

    // Pass through content array if it exists
    content: llmOutput.content || null
  },
  pairedItem: index
}));
