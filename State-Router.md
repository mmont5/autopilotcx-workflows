CURRENT CODE:

/**
   * STATE ROUTER MODULE
   * Purpose: Main entry point - routes incoming messages to appropriate handlers
   * This replaces the monolithic Complete State Manager
   */

  // Get input data from previous node
  const inputData = $input.all();
  const item = inputData[0].json;

  // Extract key data from input
  const message = item.message || '';

  // 🚨 CRITICAL FIX: Extract paused booking state for context switching
  const pausedBookingState = item.pausedBookingState || null;
  const pausedBookingData = item.pausedBookingData || null;

  // 🚨 CRITICAL FIX: If user is resuming booking, restore the paused state
  let bookingState = item.bookingState || item.currentState || item.nextState || 'initial';
  let bookingData = item.bookingData || item.collectedData || {};

  if (message === 'resume_booking' && pausedBookingState) {
    console.log('🔄 RESUMING BOOKING - Restoring paused state:', pausedBookingState);
    bookingState = pausedBookingState;
    bookingData = pausedBookingData || {};
  }

  const demoContext = item.demoContext || {};

  console.log('🔀 STATE ROUTER - Incoming:', {
    message,
    bookingState,
    pausedBookingState,
    bookingStateFromItem: item.bookingState,
    currentStateFromItem: item.currentState,
    nextStateFromItem: item.nextState,
    hasBookingData: Object.keys(bookingData).length > 0,
    bookingDataKeys: Object.keys(bookingData),
    hasPausedState: !!pausedBookingState,
    hasDemoContext: Object.keys(demoContext).length > 0
  });

  // Define state-to-module routing map
  const STATE_ROUTING = {
    // Patient Info states -> Module 3
    'initial': 'patient-info',
    'waiting_for_patient_type': 'patient-info',
    'waiting_for_name': 'patient-info',
    'waiting_for_dob': 'patient-info',

    // Contact Info states -> Module 4
    'waiting_for_phone': 'contact-info',
    'waiting_for_email': 'contact-info',

    // Medical Info states -> Module 5
    'waiting_for_location': 'medical-info',
    'waiting_for_service_selection': 'medical-info',
    'waiting_for_pain_level': 'medical-info',
    'waiting_for_symptoms': 'medical-info',

    // Appointment Scheduling states -> Module 6
    'waiting_for_insurance': 'appointment-scheduler',
    'waiting_for_policy_holder_name': 'appointment-scheduler',
    'waiting_for_policy_number': 'appointment-scheduler',
    'waiting_for_group_number': 'appointment-scheduler',
    'waiting_for_urgency': 'appointment-scheduler',
    'waiting_for_time_preference': 'appointment-scheduler',
    'calling_epic_api': 'appointment-scheduler',  // 🚨 FIX: Added missing EHR call state
    'error_no_slots': 'appointment-scheduler',  // 🚨 FIX: Added error state
    'waiting_for_day_selection': 'appointment-scheduler',
    'generating_appointment_slots': 'appointment-scheduler',
    'waiting_for_additional_info': 'appointment-scheduler',  // 🚨 FIX: Added missing state
    'collecting_additional_info': 'appointment-scheduler',  // 🚨 FIX: Added missing state
    'showing_summary': 'appointment-scheduler',  // 🚨 FIX: Added summary state
    'waiting_for_review_confirmation': 'appointment-scheduler',  // 🚨 FIX: Added confirmation state
    'handling_changes': 'appointment-scheduler',  // 🚨 FIX: Added changes state
    'appointment_confirmed': 'appointment-scheduler'
  };

  // Determine which module should handle this state
  let targetModule = STATE_ROUTING[bookingState];

  // ⚠️ CRITICAL FIX: If state is not in routing map, determine by data collected
  if (!targetModule) {
    console.log('⚠️ Unknown state, determining module by collected data:',
  bookingState);

    // Check what data we have and route accordingly
    if (!bookingData.patientType || !bookingData.patientName ||
  !bookingData.dateOfBirth) {
      targetModule = 'patient-info';
      console.log('→ Missing patient info, routing to patient-info');
    } else if (!bookingData.phoneNumber || !bookingData.email) {
      targetModule = 'contact-info';
      console.log('→ Missing contact info, routing to contact-info');
    } else if (!bookingData.location || !bookingData.procedure || !bookingData.painLevel
   || !bookingData.symptoms) {
      targetModule = 'medical-info';
      console.log('→ Missing medical info, routing to medical-info');
    } else {
      targetModule = 'appointment-scheduler';
      console.log('→ All info collected, routing to appointment-scheduler');
    }
  }

  // ✅ CRITICAL FIX: Handle completion states
  if (bookingState === 'appointment_confirmed') {
    console.log(`✅ Booking complete! Routing to final response`);

    // Return with special 'complete' flag
    return {
      json: {
        message,
        bookingState,
        bookingData,
        demoContext,
        routedTo: 'complete',  // Special flag for completion
        isComplete: true,      // Additional flag
        routedFrom: 'state-router',
        timestamp: new Date().toISOString()
      },
      pairedItem: 0  // ✅ CRITICAL: Link output to input item for N8N data flow
    };
  }

  console.log(`✅ Routing ${bookingState} → ${targetModule}`);

  // Prepare data to pass to the target module
  const routedData = {
    message,
    bookingState,
    bookingData,
    demoContext,
    pausedBookingState,   // 🚨 CRITICAL: Pass through paused state
    pausedBookingData,    // 🚨 CRITICAL: Pass through paused data
    routedTo: targetModule,
    routedFrom: 'state-router',
    timestamp: new Date().toISOString()
  };

  // Return data with routing information
  // N8N will use this to determine which node to execute next
  return {
    json: {
      ...routedData,
      // Add routing metadata
      routing: {
        currentState: bookingState,
        targetModule: targetModule,
        availableModules: Object.keys(STATE_ROUTING).reduce((acc, state) => {
          const module = STATE_ROUTING[state];
          if (!acc.includes(module)) acc.push(module);
          return acc;
        }, [])
      }
    },
    pairedItem: 0  // ✅ CRITICAL: Link output to input item for N8N data flow
  };