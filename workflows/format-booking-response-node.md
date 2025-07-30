# Format Booking Response Node

## **Current Code**
Your Format Booking Response node should already be configured correctly.

## **Code to Verify**

```javascript
// Robust Google Calendar Fix
// Only create calendar data when booking is actually completed

return items.map((item, i) => {
  console.log('=== ROBUST GOOGLE CALENDAR FIX ===');
  console.log('Booking state:', item.json.bookingState);
  console.log('User input:', item.json.message || item.json.userMessage || '');
  
  // Check if booking is actually completed
  const isBookingCompleted = item.json.bookingState === 'submitted' || item.json.bookingState === 'completed';
  const hasRealPatientData = item.json.bookingData && item.json.bookingData.fullName && item.json.bookingData.email;
  
  console.log('Is booking completed:', isBookingCompleted);
  console.log('Has real patient data:', hasRealPatientData);
  
  if (isBookingCompleted && hasRealPatientData) {
    console.log('✅ Booking completed - create calendar data');
    
    // PART 1: Clean LLM Response - Remove Instruction Text
    let response = item.json.agent_response || item.json.text || "";
    
    // Remove any instruction text in brackets []
    response = response.replace(/\[.*?\]/g, '').trim();
    
    // Remove any remaining instruction text patterns
    response = response.replace(/(Please provide.*?)/g, '').trim();
    response = response.replace(/(Show.*?)/g, '').trim();
    response = response.replace(/(.*?buttons.*?)/g, '').trim();
    
    // Clean up any double spaces
    response = response.replace(/\s+/g, ' ').trim();
    
    // PART 2: Extract Date and Time (only for completed bookings)
    let selected_slot = item.json.selected_slot;
    let selected_slot_end = null;

    if (selected_slot) {
      const start = new Date(selected_slot);
      if (!isNaN(start.getTime())) {
        const end = new Date(start.getTime() + 30 * 60000); // 30 minutes later
        selected_slot_end = end.toISOString();
      }
    }

    return {
      json: {
        ...item.json,
        agent_response: response,  // Cleaned response
        selected_slot_end,        // Extracted date/time
        proceedToGoogleCalendar: true
      },
      pairedItem: i
    };
  } else {
    console.log('⏭️ Booking not completed - skip calendar data creation');
    
    // PART 1: Clean LLM Response - Remove Instruction Text
    let response = item.json.agent_response || item.json.text || "";
    
    // Remove any instruction text in brackets []
    response = response.replace(/\[.*?\]/g, '').trim();
    
    // Remove any remaining instruction text patterns
    response = response.replace(/(Please provide.*?)/g, '').trim();
    response = response.replace(/(Show.*?)/g, '').trim();
    response = response.replace(/(.*?buttons.*?)/g, '').trim();
    
    // Clean up any double spaces
    response = response.replace(/\s+/g, ' ').trim();
    
    // Skip calendar data creation for incomplete bookings
    return {
      json: {
        ...item.json,
        agent_response: response,  // Cleaned response
        selected_slot: null,       // No calendar data
        selected_slot_end: null,   // No calendar data
        proceedToGoogleCalendar: false
      },
      pairedItem: i
    };
  }
});
```

## **What This Node Does**

1. **Cleans LLM responses** - removes instruction text
2. **Handles calendar data** - only for completed bookings
3. **Formats final response** - ready for user display

## **Integration**

This node receives responses from both:
- **Call LLM for BookingAgent** (LLM responses)
- **Build Booking Prompt** (bypass responses - if Switch node is kept)

## **Expected Behavior**

- **Cleans responses** for better user experience
- **Preserves booking data** for summary
- **Handles calendar integration** when appropriate 