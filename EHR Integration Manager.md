CURRENT CODE:

/**
 * EHR INTEGRATION MANAGER MODULE - FINAL FIXED VERSION
 * Handles: All EHR system integrations (Epic, Cerner, Allscripts, etc.)
 * Purpose: Fetch appointment slots from EHR systems
 * Returns: Standardized slot format for all EHR systems
 *
 * 🔧 FIX #1: Now respects Google Business Hours (Mon-Fri only, no Sat/Sun)
 * 🔧 FIX #2: NO DateTime objects - all dates converted to ISO strings immediately
 * CRITICAL: N8N cannot serialize Date/DateTime objects - must use strings only!
 */

// Get input data with fallback for testing
let inputData;
try {
  inputData = $input.all();
} catch (e) {
  inputData = [{
    json: {
      callEHRIntegration: true,
      ehrIntegrationParams: {
        datePreference: 'Monday',
        timeOfDay: 'afternoon',
        urgency: 'next_available',
        specialty: 'Sports Medicine',
        practitionerId: 'Dr. Hassan'
      },
      collectedData: {},
      demoContext: {}
    }
  }];
}

const item = inputData[0].json;
const shouldCallEHR = item.callEHRIntegration || item.callEpicAPI || false;
const ehrParams = item.ehrIntegrationParams || item.epicAPIParams || {};
const collectedData = item.collectedData || {};
const demoContext = item.demoContext || {};

console.log('🏥 EHR INTEGRATION MANAGER:', { shouldCallEHR, ehrParams });

// Determine which EHR system to use
function detectEHRSystem(demoContext) {
  // Check demo metadata for EHR system
  const ehrSystem = demoContext.ehrSystem || demoContext.metadata?.ehr_system;

  if (ehrSystem) {
    return ehrSystem.toLowerCase();
  }

  // Default to Epic for healthcare demos
  if (demoContext.companyIndustry === 'Healthcare' || demoContext.industry === 'healthcare') {
    return 'epic';
  }

  return 'none';
}

// Call Epic FHIR API
async function callEpicAPI(params) {
  console.log('📞 Calling Epic FHIR API at gateway IP...');

  try {
    // 🚨 CRITICAL FIX: Use Docker gateway IP to reach host machine from container
    // Gateway IP found via: docker network inspect n8n_default | grep Gateway
    const apiUrl = 'http://172.18.0.1:3002/api/v1/epic/appointments/search';
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patientType: params.patientType || 'new',
        urgency: params.urgency,
        timePreference: params.timeOfDay,
        serviceType: params.serviceType || params.specialty,
        providerId: params.providerId || params.practitionerId,
        demoId: params.demoId || demoContext.demoId
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Epic API response received:', data);

      if (data.slots && data.slots.length > 0) {
        // Format Epic slots to standardized format
        return data.slots.map(slot => ({
          day: slot.dayOfWeek,
          date: slot.displayDate,
          time: slot.displayTime,
          fullDateTime: `${slot.dayOfWeek}, ${slot.displayDate} at ${slot.displayTime}`,
          start: slot.start,
          end: slot.end,
          practitioner: slot.provider,
          location: slot.location,
          appointmentType: slot.serviceType,
          id: slot.id,
          source: 'epic'
        }));
      }
    }

    throw new Error('Epic API returned no slots');
  } catch (error) {
    console.log('⚠️ Epic API failed:', error.message);
    throw error;
  }
}

// Placeholder for Cerner integration
async function callCernerAPI(params) {
  console.log('📞 Calling Cerner API...');
  // TODO: Implement Cerner FHIR integration
  throw new Error('Cerner integration not yet implemented');
}

// Placeholder for Allscripts integration
async function callAllscriptsAPI(params) {
  console.log('📞 Calling Allscripts API...');
  // TODO: Implement Allscripts integration
  throw new Error('Allscripts integration not yet implemented');
}

// 🔧 NEW: Get closed days from Google hours
function getClosedDays(demoContext) {
  console.log('📅 Checking Google hours for closed days...');

  const closedDays = new Set();

  // Get Google hours from demo context (populated by Google Places API)
  const googleHours = demoContext.locations?.[0]?.google_hours?.periods || [];

  if (googleHours.length === 0) {
    console.log('⚠️ No Google hours found, defaulting to weekends closed');
    closedDays.add(0); // Sunday
    closedDays.add(6); // Saturday
    return closedDays;
  }

  // Google hours format: periods array with { open: { day: 1, time: '0900' }, close: { day: 1, time: '1700' } }
  // day: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday

  const allDays = [0, 1, 2, 3, 4, 5, 6];
  const openDaysArray = googleHours.map(period => period.open?.day).filter(d => d !== undefined);

  allDays.forEach(day => {
    if (!openDaysArray.includes(day)) {
      closedDays.add(day);
      console.log(`   ❌ Day ${day} is CLOSED`);
    } else {
      console.log(`   ✅ Day ${day} is OPEN`);
    }
  });

  console.log(`📊 Closed days: ${Array.from(closedDays).join(', ')}`);
  return closedDays;
}

// 🔧 FIXED: Generate fallback slots respecting business hours
function generateFallbackSlots(params, demoContext) {
  console.log('🔄 Generating fallback slots with business hours check...');

  const closedDays = getClosedDays(demoContext);
  const slots = [];
  const today = new Date();

  const daysToAdd = params.urgency === 'next_available' ? 1 :
                    params.urgency === 'next_week' ? 7 :
                    params.urgency === '2_weeks' ? 14 : 5;

  let daysChecked = 0;
  let currentDay = daysToAdd;

  // Generate 3 slots, but SKIP closed days
  while (slots.length < 3 && daysChecked < 30) {
    const slotDate = new Date(today);
    slotDate.setDate(today.getDate() + currentDay);

    const dayOfWeek = slotDate.getDay(); // 0=Sunday, 6=Saturday

    // 🚨 CRITICAL FIX: Skip if business is closed on this day
    if (closedDays.has(dayOfWeek)) {
      console.log(`   ⏭️ Skipping ${slotDate.toLocaleDateString('en-US', { weekday: 'long' })} - business is CLOSED`);
      currentDay++;
      daysChecked++;
      continue;
    }

    // Determine time based on preference
    let hour = 14;
    if (params.timeOfDay === 'morning') {
      hour = 9 + (slots.length * 1); // 9 AM, 10 AM, 11 AM
    } else if (params.timeOfDay === 'afternoon') {
      hour = 14 + slots.length; // 2 PM, 3 PM, 4 PM
    } else if (params.timeOfDay === 'evening') {
      hour = 17 + slots.length; // 5 PM, 6 PM, 7 PM
    } else {
      // 'any' or 'anytime' - mix of times
      const times = [9, 14, 16];
      hour = times[slots.length % times.length];
    }

    slotDate.setHours(hour, 0, 0, 0);

    const dayName = slotDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dateStr = slotDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const timeStr = slotDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

    console.log(`   ✅ Generated slot ${slots.length + 1}: ${dayName}, ${dateStr} at ${timeStr}`);

    // 🚨 CRITICAL: All fields must be STRINGS - NO Date objects or N8N will crash!
    slots.push({
      day: dayName,
      date: dateStr,
      time: timeStr,
      fullDateTime: `${dayName}, ${dateStr} at ${timeStr}`,
      // ✅ Convert to ISO strings immediately - NO Date objects
      start: slotDate.toISOString(),
      end: new Date(slotDate.getTime() + 30 * 60000).toISOString(),
      practitioner: params.practitionerId || params.providerId || 'Provider',
      location: demoContext.locations?.[0]?.city || 'Main Office',
      appointmentType: params.specialty || params.serviceType || 'Consultation',
      id: `fallback-slot-${slots.length + 1}`,
      source: 'fallback'
    });

    currentDay++;
    daysChecked++;
  }

  console.log(`✅ Generated ${slots.length} fallback slots (all on open days)`);
  return slots;
}

// Main EHR integration logic
async function getAppointmentSlots() {
  if (!shouldCallEHR) {
    console.log('⏭️ Skipping EHR integration (not requested)');
    return [];
  }

  const ehrSystem = detectEHRSystem(demoContext);
  console.log(`🎯 Detected EHR system: ${ehrSystem}`);

  try {
    let slots = [];

    switch (ehrSystem) {
      case 'epic':
        slots = await callEpicAPI(ehrParams);
        break;

      case 'cerner':
        slots = await callCernerAPI(ehrParams);
        break;

      case 'allscripts':
        slots = await callAllscriptsAPI(ehrParams);
        break;

      case 'none':
      default:
        console.log('⚠️ No EHR system configured, using fallback with business hours');
        slots = generateFallbackSlots(ehrParams, demoContext);
        break;
    }

    return slots;

  } catch (error) {
    console.log('⚠️ EHR integration failed, using fallback with business hours:', error.message);
    return generateFallbackSlots(ehrParams, demoContext);
  }
}

// Execute EHR integration
const slots = await getAppointmentSlots();

console.log(`✅ EHR Integration Manager returning ${slots.length} slots`);
if (slots.length > 0) {
  console.log('📋 Slots generated:');
  slots.forEach((slot, i) => {
    console.log(`   ${i + 1}. ${slot.day}, ${slot.date} at ${slot.time} (source: ${slot.source})`);
  });
}

// Generate response message and quick actions for slot selection
const slotResponses = [
  `Perfect! Here are your available appointments:`,
  `Wonderful! I found these available times for you:`,
  `Great! Here are your options:`,
  `Excellent! I have these appointments available:`,
  `Thank you! Here are the times I found:`
];
const randomResponse = slotResponses[Math.floor(Math.random() * slotResponses.length)];

const quickActions = slots.map((slot, i) => ({
  text: `${slot.day}, ${slot.date} at ${slot.time}`,
  action: `slot_${i}`
}));

console.log(`📋 Generated ${quickActions.length} quick action buttons for slot selection`);
console.log('📋 Quick actions:', JSON.stringify(quickActions, null, 2));
console.log('📋 Slots:', JSON.stringify(slots, null, 2));

// 🚨 CRITICAL: Return data - ALL fields must be primitives (string/number/boolean/array/object)
// NEVER return Date or DateTime objects or N8N will crash!
// 🚨 CRITICAL: Must include pairedItem for N8N item linking!
return {
  json: {
    message: randomResponse,  // ✅ Return the message directly
    currentState: 'generating_appointment_slots',  // ✅ Slots are ready for selection
    bookingState: 'generating_appointment_slots',
    collectedData: {
      ...collectedData,
      availableSlots: slots,  // ✅ Slots are string-only objects
      callEHRIntegration: undefined,  // ✅ Clear the flag to prevent re-triggering
      callEpicAPI: undefined  // ✅ Clear the flag
    },
    bookingData: {
      ...collectedData,
      availableSlots: slots,
      callEHRIntegration: undefined,
      callEpicAPI: undefined
    },
    highlightedText: ['available'],
    quickActions: quickActions,  // ✅ Return quick actions directly
    demoContext: demoContext,
    routedTo: 'complete',  // 🚨 CRITICAL FIX: Route to complete (Merge Responses) to end workflow!
    routedFrom: 'ehr-integration-manager',
    // ✅ CRITICAL FIX: Convert Date to ISO string - NO Date objects returned!
    timestamp: new Date().toISOString(),
    module: 'ehr-integration-manager',
    ehrSystem: detectEHRSystem(demoContext),
    slotsReturned: slots.length,
    slotSource: slots.length > 0 ? slots[0].source : 'none'
  },
  pairedItem: 0  // ✅ CRITICAL: Link output to input item for N8N data flow
};