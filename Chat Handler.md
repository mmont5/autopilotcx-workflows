CURRENT CODE:

const nodeStartTime = Date.now();
console.log(`⏱️ [CHAT HANDLER] Started at ${nodeStartTime}`);

const input = $input.first().json;

// Extract chat data from the webhook payload
const message = input.body?.message || '';
const demoId = input.body?.demoId || input.body?.demo_id || '';
const currentState = input.body?.currentState || 'initial';
const collectedData = input.body?.collectedData || {};
const bookingState = input.body?.bookingState || '';
const bookingData = input.body?.bookingData || {};

// CRITICAL: Extract paused booking state from webhook body (for context switching)
const pausedBookingState = input.body?.pausedBookingState || null;
const pausedBookingData = input.body?.pausedBookingData || null;

// CRITICAL FIX: Extract demo context from the webhook body
let demoContext = {};
if (input.body?.demoContext) {
  demoContext = input.body.demoContext;
  console.log('✅ Using demo context from webhook body:', demoContext.companyName);
} else if (input.body?.config?.branding) {
  demoContext = {
    companyName: input.body.config.branding.companyName || '',
    agentName: input.body.config.agentName || '',
    locations: input.body.config.branding.locations || [],
    services: input.body.config.branding.categories || [],
    insuranceProviders: input.body?.config?.branding?.insuranceProviders || input.body?.userContext?.insuranceProviders || []
  };
} else if (input.body?.userContext) {
  demoContext = {
    companyName: input.body.userContext.companyName || '',
    agentName: input.body.userContext.agentName || '',
    locations: [],
    services: [],
    insuranceProviders: input.body?.userContext?.insuranceProviders || []
  };
}

console.log('💬 Message:', message?.substring(0, 50));
console.log('🆔 Demo ID:', demoId);

if (!demoId) {
  console.log('❌ No demo ID provided for chat');
  return [{
    "json": {
      "success": false,
      "error": "No demo ID provided",
      "message": message
    },
    "pairedItem": 0
  }];
}

const nodeEndTime = Date.now();
console.log(`⏱️ [CHAT HANDLER] Completed in ${nodeEndTime - nodeStartTime}ms`);

// 🚨 CRITICAL FIX: Store timestamp as ISO string in variable first
const currentTimestamp = new Date().toISOString();

// Prepare data for shared storage retrieval
return [{
  "json": {
    "operation": "get",
    "demoId": demoId,
    "message": message,
    "demoContext": demoContext,
    "currentState": currentState,
    "collectedData": collectedData,
    "bookingState": bookingState,
    "bookingData": bookingData,
    "pausedBookingState": pausedBookingState,
    "pausedBookingData": pausedBookingData,
    "timestamp": currentTimestamp  // ✅ ISO string (not Date object)
  },
  "pairedItem": 0
}];