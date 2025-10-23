# Healthcare Caring Responses Reference

**Purpose:** Consolidated caring, empathetic response templates for healthcare booking flows.

**Tone:** Professional nurse - caring, concise, empathetic (1-2 sentences max)

---

## Initial Greeting (Appointment Request)

```javascript
const greetings = [
  `Absolutely! I'm ${agentName} from ${companyName}, and I'd be happy to help you schedule your appointment. I'm here to make this process as smooth and comfortable as possible for you. Are you a new patient or an existing patient?`,
  `Of course! I'd love to help you get your appointment scheduled. I'm ${agentName} from ${companyName}, and I'm here to take care of everything for you. Are you a new patient or an existing patient?`,
  `Wonderful! I'm so glad you reached out. I'm ${agentName} from ${companyName}, and I'm here to help you get your appointment scheduled right away. Are you a new patient or an existing patient?`,
  `I'm delighted to help you schedule your appointment! I'm ${agentName} from ${companyName}, and I'm here to make sure you get the care you need. Are you a new patient or an existing patient?`,
  `Absolutely! Let's get your appointment scheduled. I'm ${agentName} from ${companyName}, and I'm here to help you every step of the way. Are you a new patient or an existing patient?`
];
```

---

## New Patient Welcome

```javascript
const newPatientResponses = [
  `Thank you so much for letting me know you're a new patient. I'm here to make this as easy as possible for you. Could you please share your First Name and Last Name with me?`,
  `Wonderful! I'm so glad to welcome you as a new patient. To get started, could you please provide your First Name and Last Name?`,
  `Thank you for sharing that! I'm here to help you every step of the way. May I please have your First Name and Last Name?`,
  `Perfect! Welcome to ${companyName}. To begin, could you please share your First Name and Last Name?`,
  `Great! I'm excited to help you as a new patient. Could you please provide your First Name and Last Name?`
];
```

---

## Existing Patient Welcome

```javascript
const existingPatientResponses = [
  `Welcome back! It's wonderful to hear from you again. Could you please share your First Name and Last Name with me?`,
  `Thank you! It's great to have you back with us. May I please have your First Name and Last Name?`,
  `So glad you're continuing your care with us! Could you please provide your First Name and Last Name?`,
  `Welcome back! I'm here to help you. May I please have your First Name and Last Name?`,
  `It's wonderful to see you again! Could you please share your First Name and Last Name?`
];
```

---

## After Collecting Name

```javascript
const dobResponses = [
  `Thank you ${firstName}! I have ${firstName} ${lastName} as your name. Could you please share your Date of Birth? (Example: MM/DD/YYYY)`,
  `Perfect, ${firstName}! I've got your name as ${firstName} ${lastName}. May I please have your Date of Birth? (Example: MM/DD/YYYY)`,
  `Thank you so much, ${firstName}! I have ${firstName} ${lastName}. What is your Date of Birth? (Example: MM/DD/YYYY)`,
  `Great, ${firstName}! I've noted ${firstName} ${lastName}. Could you please provide your Date of Birth? (Example: MM/DD/YYYY)`
];
```

---

## Pain Level (Empathetic Responses)

```javascript
function getEmpathyMessage(painLevel) {
  if (painLevel >= 8) {
    return `I'm so sorry you're in such significant pain. `;
  } else if (painLevel >= 5) {
    return `I understand you're dealing with discomfort. `;
  } else {
    return `Thank you for sharing that. `;
  }
}

const symptomsResponses = [
  `${empathyMessage}Could you please describe the symptoms you're experiencing?`,
  `${empathyMessage}What symptoms have you been dealing with?`,
  `${empathyMessage}May I please know what symptoms you're experiencing?`,
  `${empathyMessage}Could you please tell me about your symptoms?`
];
```

---

## Insurance Information

```javascript
const insuranceResponses = [
  `Perfect! I've noted ${procedure}. Which insurance provider do you have?`,
  `Excellent! I have ${procedure} recorded. What insurance do you carry?`,
  `Great! I've got ${procedure}. Which insurance provider do you have?`,
  `Thank you! What insurance do you have?`
];
```

---

## Urgency / Timeframe

```javascript
const urgencyResponses = [
  `Perfect! I have all your insurance information. Thank you so much. Now, how soon would you like to be seen for your appointment?`,
  `Excellent! Your insurance details are recorded. Thank you. When would you like to schedule your visit?`,
  `Thank you! I've got all the insurance information. May I ask how soon you'd like to come in?`,
  `Great! I have your insurance details noted. When would be the best time for you to be seen?`
];
```

---

## Time Preference

```javascript
const timePreferenceResponses = [
  `Perfect! I understand your timeframe. Thank you. What time of day works best for you?`,
  `Excellent! I have your preferred timeframe. When during the day would you prefer to come in?`,
  `Thank you! I've noted your scheduling preference. What time of day would be most convenient?`,
  `Great! I have your timeframe recorded. When during the day would work best for you?`
];
```

---

## Slot Selection

```javascript
const slotDisplayResponses = [
  `Perfect! Here are your available appointments:`,
  `Wonderful! I found these available times for you:`,
  `Great! Here are your options:`,
  `Excellent! I have these appointments available:`,
  `Thank you! Here are the times I found:`
];
```

---

## Appointment Confirmation

```javascript
const confirmationResponses = [
  `Perfect! Your appointment is confirmed!

📅 Date: ${slot.day}, ${slot.date}
⏰ Time: ${slot.time}
📍 Location: ${location}

📧 A confirmation email has been sent to ${email}
📱 You'll receive SMS reminders before your appointment

We look forward to seeing you! If you need to make any changes, please call us.`,

  `Wonderful! Your appointment is all set!

✅ ${slot.day}, ${slot.date} at ${slot.time}
📍 ${location}

📧 Confirmation sent to ${email}

Thank you for choosing us for your care. We're here to help you feel better!`,

  `Excellent! Your appointment has been confirmed!

Date: ${slot.day}, ${slot.date}
Time: ${slot.time}
Location: ${location}

Confirmation email sent to ${email}

We're looking forward to seeing you and helping you with your care!`
];
```

---

## Additional Information Request

```javascript
const additionalInfoResponses = [
  `Excellent choice! I have you scheduled for ${slot.day}, ${slot.date} at ${slot.time}. Before we finalize everything, is there any additional information you'd like to share to help us serve you better? This could include specific concerns, questions, or special accommodations you may need.`,
  `Perfect! Your appointment is set for ${slot.day}, ${slot.date} at ${slot.time}. Is there anything else you'd like us to know before your visit? Any special needs or concerns?`,
  `Wonderful! I've got you scheduled for ${slot.day}, ${slot.date} at ${slot.time}. May I ask if there's any additional information you'd like to share with us? Any questions or special requests?`
];
```

---

## Validation / Error Messages

```javascript
const nameClarificationResponses = [
  `I want to make sure I get your name right. Could you please provide your First Name and Last Name? (Example: John Smith)`,
  `To ensure accuracy, could you please share your First Name and Last Name? (Example: John Smith)`,
  `May I please have your First Name and Last Name? (Example: John Smith)`
];

const dobClarificationResponses = [
  `I want to make sure I have that right. Could you please provide your date of birth in MM/DD/YYYY format? (Example: 01/15/1985)`,
  `To ensure accuracy, could you please share your date of birth as MM/DD/YYYY? (Example: 01/15/1985)`,
  `May I please have your date of birth in MM/DD/YYYY format? (Example: 01/15/1985)`
];

const phoneClarificationResponses = [
  `I want to make sure I can reach you. Could you please provide a valid phone number? (Example: 555-123-4567)`,
  `To ensure we can contact you, may I please have a valid phone number? (Example: 555-123-4567)`,
  `Could you please share a valid phone number? (Example: 555-123-4567)`
];

const emailClarificationResponses = [
  `I want to make sure I have that right. Could you please provide a valid email? (Example: john.doe@example.com)`,
  `To ensure accuracy, may I please have a valid email address? (Example: john.doe@example.com)`,
  `Could you please share a valid email address? (Example: john.doe@example.com)`
];
```

---

## Key Principles

1. **Always personalize** with patient's first name once collected
2. **Use empathy** especially for pain levels 5+
3. **Be concise** - 1-2 sentences maximum
4. **Sound caring** but not overly emotional
5. **Offer help** - "I'm here to help you"
6. **Show appreciation** - "Thank you for sharing that"
7. **Make it easy** - "I'm here to make this as smooth as possible"
8. **Professional warmth** - Like a caring nurse, not a robot

---

## Helper Function

```javascript
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}
```

Use this function to select a random response from any array above, providing natural variation in conversations.
