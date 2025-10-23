CURRENT CODE:

const nodeStartTime = Date.now();
console.log(`⏱️ [SHARED CONTEXT STORAGE] Started at ${nodeStartTime}`);

const input = $input.first().json;
const operation = input.operation || 'get';
const demoId = input.demoId || input.demo_id || '';
const demoContext = input.demoContext || {};
const message = input.message || '';
const currentState = input.currentState || 'initial';
const collectedData = input.collectedData || {};
const bookingState = input.bookingState || '';
const bookingData = input.bookingData || {};

console.log('🏪 Operation:', operation, '| Demo:', demoId);

if (operation === 'store') {
  // Store demo context
  if (!demoId || !demoContext.companyName) {
    const nodeEndTime = Date.now();
    console.log(`⏱️ [SHARED CONTEXT STORAGE] Completed in ${nodeEndTime - nodeStartTime}ms (error)`);

    // 🚨 FIX: Store timestamp as ISO string in variable
    const errorTimestamp = new Date().toISOString();

    return [{
      "json": {
        "success": false,
        "error": "Invalid store request",
        "timestamp": errorTimestamp
      },
      "pairedItem": 0
    }];
  }

  console.log('💾 Demo context stored for:', demoContext.companyName);

  const nodeEndTime = Date.now();
  console.log(`⏱️ [SHARED CONTEXT STORAGE] Completed in ${nodeEndTime - nodeStartTime}ms`);

  // 🚨 FIX: Store timestamp as ISO string in variable
  const storedTimestamp = new Date().toISOString();

  return [{
    "json": {
      "success": true,
      "operation": "store",
      "demoId": demoId,
      "demoContext": demoContext,
      "storedAt": storedTimestamp,
      "message": "Demo context stored successfully"
    },
    "pairedItem": 0
  }];

} else if (operation === 'get') {
  // Retrieve demo context - PASS THROUGH
  if (!demoId) {
    const nodeEndTime = Date.now();
    console.log(`⏱️ [SHARED CONTEXT STORAGE] Completed in ${nodeEndTime - nodeStartTime}ms (error)`);
    return [{
      "json": {
        "success": false,
        "error": "No demo ID provided",
        "message": message,
        "demoContext": null
      },
      "pairedItem": 0
    }];
  }

  console.log('🔍 Processing get for:', demoContext.companyName);

  const nodeEndTime = Date.now();
  console.log(`⏱️ [SHARED CONTEXT STORAGE] Completed in ${nodeEndTime - nodeStartTime}ms`);

  // 🚨 FIX: Store timestamp as ISO string in variable
  const getTimestamp = new Date().toISOString();

  return [{
    "json": {
      "success": true,
      "operation": "get",
      "demoId": demoId,
      "message": message,
      "demoContext": demoContext,
      "currentState": currentState,
      "collectedData": collectedData,
      "bookingState": bookingState,
      "bookingData": bookingData,
      "timestamp": getTimestamp,
      "source": "workflow_flow"
    },
    "pairedItem": 0
  }];
}

// Invalid operation
const nodeEndTime = Date.now();
console.log(`⏱️ [SHARED CONTEXT STORAGE] Completed in ${nodeEndTime - nodeStartTime}ms (invalid)`);

// 🚨 FIX: Store timestamp as ISO string in variable
const invalidTimestamp = new Date().toISOString();

return [{
  "json": {
    "success": false,
    "error": "Invalid operation. Use 'store' or 'get'",
    "timestamp": invalidTimestamp
  },
  "pairedItem": 0
}];