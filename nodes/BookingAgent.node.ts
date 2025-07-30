import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

/**
 * BookingAgent - Deterministic Healthcare Appointment Booking
 * 
 * The BookingAgent handles all appointment booking requests using a deterministic
 * state machine approach for fast, reliable responses without LLM calls.
 * Works for any healthcare provider with proper data persistence and context preservation.
 */

export class BookingAgent implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BookingAgent',
		name: 'bookingAgent',
		icon: 'file:custom-booking.svg',
		group: ['transform'],
		version: 1,
		description: 'Handle healthcare appointment booking with deterministic state machine',
		defaults: {
			name: 'BookingAgent',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Book Appointment',
						value: 'book',
						description: 'Handle appointment booking flow',
					},
				],
				default: 'book',
				noDataExpression: true,
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// RESPONSE VARIATIONS FOR HUMAN-LIKE INTERACTIONS
		const responseVariations = {
			welcome: [
				"Hi there! I'm {agentName} from {companyName}. I'm here to help you get scheduled. Are you a new patient or have you been here before?",
				"Welcome! I'm {agentName} from {companyName}. I'd love to help you schedule your appointment. Are you a new patient or an existing patient?",
				"Hello! I'm {agentName} from {companyName}. I'm here to assist you with scheduling. Are you a new patient or have you visited us before?",
				"Hi! I'm {agentName} from {companyName}. I'd be happy to help you book your appointment. Are you a new patient or an existing patient?",
				"Welcome! I'm {agentName} from {companyName}. I'm here to help you get scheduled. Are you a new patient or have you been here before?",
				"Hello! I'd love to assist you with scheduling. Are you a new patient or an existing patient?",
				"Hi there! I'm {agentName} from {companyName}. I'm here to help you book your appointment. Are you a new patient or have you visited us before?",
				"Welcome! I'd be happy to help you get scheduled. Are you a new patient or an existing patient?",
				"Hello! I'm here to assist you with booking. Are you a new patient or have you been here before?",
				"Hi! I'd love to help you schedule your appointment. Are you a new patient or an existing patient?"
			],
			patientType: [
				"Hi there! I'm {agentName} from {companyName}. I'm here to help you get scheduled. Are you a new patient or have you been here before?",
				"Welcome! I'm {agentName} from {companyName}. I'd love to help you schedule your appointment. Are you a new patient or an existing patient?",
				"Hello! I'm {agentName} from {companyName}. I'm here to assist you with scheduling. Are you a new patient or have you visited us before?",
				"Hi! I'm {agentName} from {companyName}. I'd be happy to help you book your appointment. Are you a new patient or an existing patient?",
				"Welcome! I'm {agentName} from {companyName}. I'm here to help you get scheduled. Are you a new patient or have you been here before?",
				"Hello! I'd love to assist you with scheduling. Are you a new patient or an existing patient?",
				"Hi there! I'm {agentName} from {companyName}. I'm here to help you book your appointment. Are you a new patient or have you visited us before?",
				"Welcome! I'm {agentName} from {companyName}. I'd be happy to help you get scheduled. Are you a new patient or an existing patient?",
				"Hello! I'm {agentName} from {companyName}. I'm here to assist you with booking. Are you a new patient or have you been here before?",
				"Hi! I'm {agentName} from {companyName}. I'd love to help you schedule your appointment. Are you a new patient or an existing patient?"
			],
			nameRequest: [
				"Perfect! Could you please share your <span style=\"font-weight: bold; color: orange;\">First Name and Last Name</span>? This helps us create your appointment properly.",
				"Great! I'd love to get your <span style=\"font-weight: bold; color: orange;\">First Name and Last Name</span> so we can set up your appointment correctly.",
				"Wonderful! Could you please provide your <span style=\"font-weight: bold; color: orange;\">First Name and Last Name</span>? This helps us prepare for your visit.",
				"Excellent! I'd be happy to help you get scheduled. Could you share your <span style=\"font-weight: bold; color: orange;\">First Name and Last Name</span>?",
				"Perfect! To help us set up your appointment properly, could you please share your <span style=\"font-weight: bold; color: orange;\">First Name and Last Name</span>?",
				"Great! I'd love to assist you with scheduling. Could you provide your <span style=\"font-weight: bold; color: orange;\">First Name and Last Name</span>?",
				"Wonderful! To help us prepare for your visit, could you please share your <span style=\"font-weight: bold; color: orange;\">First Name and Last Name</span>?",
				"Excellent! I'd be happy to help you get scheduled. Could you share your <span style=\"font-weight: bold; color: orange;\">First Name and Last Name</span>?",
				"Perfect! To help us set up your appointment properly, could you please provide your <span style=\"font-weight: bold; color: orange;\">First Name and Last Name</span>?",
				"Great! I'd love to assist you with scheduling. Could you share your <span style=\"font-weight: bold; color: orange;\">First Name and Last Name</span>?"
			],
			dobRequest: [
				"Thank you! Could you please share your <span style=\"font-weight: bold; color: orange;\">Date of Birth</span>? (Example: MM/DD/YYYY) This helps us ensure we have all the right information for your appointment.",
				"Perfect! I'd love to get your <span style=\"font-weight: bold; color: orange;\">Date of Birth</span> (Example: MM/DD/YYYY) to make sure we have everything ready for your visit.",
				"Great! Could you please provide your <span style=\"font-weight: bold; color: orange;\">Date of Birth</span>? (Example: MM/DD/YYYY) This helps us prepare everything properly for your appointment.",
				"Wonderful! I'd be happy to help you get scheduled. Could you share your <span style=\"font-weight: bold; color: orange;\">Date of Birth</span>? (Example: MM/DD/YYYY)",
				"Thank you! To help us ensure we have all the right information, could you please share your <span style=\"font-weight: bold; color: orange;\">Date of Birth</span>? (Example: MM/DD/YYYY)",
				"Perfect! I'd love to assist you with scheduling. Could you provide your <span style=\"font-weight: bold; color: orange;\">Date of Birth</span>? (Example: MM/DD/YYYY)",
				"Great! To help us prepare everything properly, could you please share your <span style=\"font-weight: bold; color: orange;\">Date of Birth</span>? (Example: MM/DD/YYYY)",
				"Wonderful! I'd be happy to help you get scheduled. Could you share your <span style=\"font-weight: bold; color: orange;\">Date of Birth</span>? (Example: MM/DD/YYYY)",
				"Thank you! To help us ensure we have all the right information, could you please provide your <span style=\"font-weight: bold; color: orange;\">Date of Birth</span>? (Example: MM/DD/YYYY)",
				"Perfect! I'd love to assist you with scheduling. Could you share your <span style=\"font-weight: bold; color: orange;\">Date of Birth</span>? (Example: MM/DD/YYYY)"
			],
			phoneRequest: [
				"Thank you! Could you please share your <span style=\"font-weight: bold; color: orange;\">Phone Number</span>? (Example: +14071234567) This helps us reach you if we need to confirm anything about your appointment.",
				"Perfect! I'd love to get your <span style=\"font-weight: bold; color: orange;\">Phone Number</span> (Example: +14071234567) so we can contact you if needed about your appointment.",
				"Great! Could you please provide your <span style=\"font-weight: bold; color: orange;\">Phone Number</span>? (Example: +14071234567) This helps us reach you if we need to confirm anything.",
				"Wonderful! I'd be happy to help you get scheduled. Could you share your <span style=\"font-weight: bold; color: orange;\">Phone Number</span>? (Example: +14071234567)",
				"Thank you! To help us reach you if needed, could you please share your <span style=\"font-weight: bold; color: orange;\">Phone Number</span>? (Example: +14071234567)",
				"Perfect! I'd love to assist you with scheduling. Could you provide your <span style=\"font-weight: bold; color: orange;\">Phone Number</span>? (Example: +14071234567)",
				"Great! To help us contact you if needed, could you please share your <span style=\"font-weight: bold; color: orange;\">Phone Number</span>? (Example: +14071234567)",
				"Wonderful! I'd be happy to help you get scheduled. Could you share your <span style=\"font-weight: bold; color: orange;\">Phone Number</span>? (Example: +14071234567)",
				"Thank you! To help us reach you if needed, could you please provide your <span style=\"font-weight: bold; color: orange;\">Phone Number</span>? (Example: +14071234567)",
				"Perfect! I'd love to assist you with scheduling. Could you share your <span style=\"font-weight: bold; color: orange;\">Phone Number</span>? (Example: +14071234567)"
			],
			emailRequest: [
				"Great! And could you please share your <span style=\"font-weight: bold; color: orange;\">Email Address</span>? This helps us send you appointment confirmations.",
				"Perfect! I'd love to get your <span style=\"font-weight: bold; color: orange;\">Email Address</span> so we can send you appointment details.",
				"Thank you! Could you please provide your <span style=\"font-weight: bold; color: orange;\">Email Address</span>? This helps us keep you updated.",
				"Excellent! I'd be happy to help you get scheduled. Could you share your <span style=\"font-weight: bold; color: orange;\">Email Address</span>?",
				"Great! To help us send you confirmations, could you please share your <span style=\"font-weight: bold; color: orange;\">Email Address</span>?",
				"Perfect! I'd love to assist you with scheduling. Could you provide your <span style=\"font-weight: bold; color: orange;\">Email Address</span>?",
				"Thank you! To help us keep you updated, could you please share your <span style=\"font-weight: bold; color: orange;\">Email Address</span>?",
				"Excellent! I'd be happy to help you get scheduled. Could you share your <span style=\"font-weight: bold; color: orange;\">Email Address</span>?",
				"Great! To help us send you confirmations, could you please provide your <span style=\"font-weight: bold; color: orange;\">Email Address</span>?",
				"Perfect! I'd love to assist you with scheduling. Could you share your <span style=\"font-weight: bold; color: orange;\">Email Address</span>?"
			],
			appointmentTiming: [
				"Absolutely! I'd be happy to help you find the perfect appointment time. How soon would you like to book your appointment?",
				"Perfect! I'd love to help you get scheduled at a time that works best for you. How soon would you like to book your appointment?",
				"Wonderful! I'm here to help you find the most convenient appointment time. How soon would you like to book your appointment?",
				"Great! I'd be delighted to help you get scheduled. How soon would you like to book your appointment?",
				"Excellent! I'm here to make scheduling as easy as possible for you. How soon would you like to book your appointment?",
				"Perfect! I'd love to help you find the right appointment time. How soon would you like to book your appointment?",
				"Wonderful! I'm here to help you get scheduled at a time that works for you. How soon would you like to book your appointment?",
				"Great! I'd be happy to help you find the perfect appointment slot. How soon would you like to book your appointment?",
				"Excellent! I'm here to make your scheduling experience smooth and easy. How soon would you like to book your appointment?",
				"Perfect! I'd love to help you get scheduled at a time that's convenient for you. How soon would you like to book your appointment?",
				"Absolutely! I'm here to help you find the best appointment time. How soon would you like to book your appointment?",
				"Wonderful! I'd be delighted to help you get scheduled. How soon would you like to book your appointment?",
				"Great! I'm here to make scheduling as stress-free as possible. How soon would you like to book your appointment?",
				"Excellent! I'd love to help you find the perfect appointment slot. How soon would you like to book your appointment?",
				"Perfect! I'm here to help you get scheduled at a time that works best for you. How soon would you like to book your appointment?",
				"Absolutely! I'd be happy to help you find the most convenient appointment time. How soon would you like to book your appointment?",
				"Wonderful! I'm here to make your scheduling experience as smooth as possible. How soon would you like to book your appointment?",
				"Great! I'd love to help you get scheduled at a time that's perfect for you. How soon would you like to book your appointment?",
				"Excellent! I'm here to help you find the right appointment time. How soon would you like to book your appointment?",
				"Perfect! I'd be delighted to help you get scheduled. How soon would you like to book your appointment?"
			],
			dayOfWeek: [
				"Thank you! I'd love to help you find the perfect day. What day of the week works best for you?",
				"Perfect! I'm here to help you get scheduled on a day that's convenient for you. What day of the week works best?",
				"Wonderful! I'd be happy to help you find the right day. What day of the week works best for you?",
				"Great! I'm here to make scheduling as easy as possible. What day of the week works best for you?",
				"Excellent! I'd love to help you find the perfect day. What day of the week works best for you?",
				"Thank you! I'm here to help you get scheduled on a day that works for you. What day of the week works best?",
				"Perfect! I'd be happy to help you find the right day. What day of the week works best for you?",
				"Wonderful! I'm here to make your scheduling experience smooth. What day of the week works best for you?",
				"Great! I'd love to help you find the perfect day. What day of the week works best for you?",
				"Excellent! I'm here to help you get scheduled on a day that's convenient. What day of the week works best?",
				"Thank you! I'd be delighted to help you find the right day. What day of the week works best for you?",
				"Perfect! I'm here to make scheduling as stress-free as possible. What day of the week works best for you?",
				"Wonderful! I'd love to help you find the perfect day. What day of the week works best for you?",
				"Great! I'm here to help you get scheduled on a day that works for you. What day of the week works best?",
				"Excellent! I'd be happy to help you find the right day. What day of the week works best for you?",
				"Thank you! I'm here to make your scheduling experience smooth. What day of the week works best for you?",
				"Perfect! I'd love to help you find the perfect day. What day of the week works best for you?",
				"Wonderful! I'm here to help you get scheduled on a day that's convenient. What day of the week works best?",
				"Great! I'd be delighted to help you find the right day. What day of the week works best for you?",
				"Excellent! I'm here to make scheduling as easy as possible. What day of the week works best for you?"
			],
			timeOfDay: [
				"Perfect! I'd love to help you find the ideal time. What time of day works best for you?",
				"Great! I'm here to help you get scheduled at a time that's convenient for you. What time of day works best?",
				"Wonderful! I'd be happy to help you find the perfect time. What time of day works best for you?",
				"Excellent! I'm here to make scheduling as smooth as possible. What time of day works best for you?",
				"Perfect! I'd love to help you find the right time. What time of day works best for you?",
				"Great! I'm here to help you get scheduled at a time that works for you. What time of day works best?",
				"Wonderful! I'd be happy to help you find the ideal time. What time of day works best for you?",
				"Excellent! I'm here to make your scheduling experience easy. What time of day works best for you?",
				"Perfect! I'd love to help you find the perfect time. What time of day works best for you?",
				"Great! I'm here to help you get scheduled at a time that's convenient. What time of day works best?",
				"Thank you! I'd be delighted to help you find the right time. What time of day works best for you?",
				"Wonderful! I'm here to make scheduling as stress-free as possible. What time of day works best for you?",
				"Excellent! I'd love to help you find the ideal time. What time of day works best for you?",
				"Perfect! I'm here to help you get scheduled at a time that works for you. What time of day works best?",
				"Great! I'd be happy to help you find the perfect time. What time of day works best for you?",
				"Thank you! I'm here to make your scheduling experience smooth. What time of day works best for you?",
				"Wonderful! I'd love to help you find the right time. What time of day works best for you?",
				"Excellent! I'm here to help you get scheduled at a time that's convenient. What time of day works best?",
				"Perfect! I'd be delighted to help you find the ideal time. What time of day works best for you?",
				"Great! I'm here to make scheduling as easy as possible. What time of day works best for you?"
			],
			appointmentTimingRequest: [
				"I'd love to help you find the perfect appointment time. When would you like to schedule your appointment?",
				"I'm here to help you get scheduled at a time that works for you. When would you like to schedule your appointment?",
				"I'd be happy to help you find the ideal appointment time. When would you like to schedule your appointment?",
				"I'm here to make scheduling as smooth as possible. When would you like to schedule your appointment?",
				"I'd love to help you find the right appointment time. When would you like to schedule your appointment?",
				"I'm here to help you get scheduled at a time that's convenient. When would you like to schedule your appointment?",
				"I'd be happy to help you find the perfect appointment time. When would you like to schedule your appointment?",
				"I'm here to make your scheduling experience easy. When would you like to schedule your appointment?",
				"I'd love to help you find the ideal appointment time. When would you like to schedule your appointment?",
				"I'm here to help you get scheduled at a time that works for you. When would you like to schedule your appointment?"
			],
			appointmentTimingError: [
				"I'd love to help you find the perfect appointment time. Could you please let me know when you'd like to schedule your appointment?",
				"I'm here to help you get scheduled. Could you please tell me when you'd like to schedule your appointment?",
				"I'd be happy to help you find the ideal appointment time. Could you please let me know your preferred timing?",
				"I'm here to make scheduling as smooth as possible. Could you please tell me when you'd like to schedule your appointment?",
				"I'd love to help you find the right appointment time. Could you please let me know your preferred timing?",
				"I'm here to help you get scheduled. Could you please tell me when you'd like to schedule your appointment?",
				"I'd be happy to help you find the perfect appointment time. Could you please let me know your preferred timing?",
				"I'm here to make your scheduling experience easy. Could you please tell me when you'd like to schedule your appointment?",
				"I'd love to help you find the ideal appointment time. Could you please let me know your preferred timing?",
				"I'm here to help you get scheduled. Could you please tell me when you'd like to schedule your appointment?"
			],
			dayOfWeekRequest: [
				"I'd love to help you find the perfect day. Which day of the week works best for you?",
				"I'm here to help you get scheduled on a day that's convenient. Which day of the week works best for you?",
				"I'd be happy to help you find the right day. Which day of the week works best for you?",
				"I'm here to make scheduling as smooth as possible. Which day of the week works best for you?",
				"I'd love to help you find the perfect day. Which day of the week works best for you?",
				"I'm here to help you get scheduled on a day that works for you. Which day of the week works best for you?",
				"I'd be happy to help you find the right day. Which day of the week works best for you?",
				"I'm here to make your scheduling experience easy. Which day of the week works best for you?",
				"I'd love to help you find the perfect day. Which day of the week works best for you?",
				"I'm here to help you get scheduled on a day that's convenient. Which day of the week works best for you?"
			],
			dayOfWeekError: [
				"I'd love to help you find the perfect day. Could you please let me know which day of the week works best for you?",
				"I'm here to help you get scheduled. Could you please tell me which day of the week works best for you?",
				"I'd be happy to help you find the right day. Could you please let me know your preferred day?",
				"I'm here to make scheduling as smooth as possible. Could you please tell me which day of the week works best for you?",
				"I'd love to help you find the perfect day. Could you please let me know your preferred day?",
				"I'm here to help you get scheduled. Could you please tell me which day of the week works best for you?",
				"I'd be happy to help you find the right day. Could you please let me know your preferred day?",
				"I'm here to make your scheduling experience easy. Could you please tell me which day of the week works best for you?",
				"I'd love to help you find the perfect day. Could you please let me know your preferred day?",
				"I'm here to help you get scheduled. Could you please tell me which day of the week works best for you?"
			],
			timeOfDayRequest: [
				"I'd love to help you find the perfect time. What time of day works best for you?",
				"I'm here to help you get scheduled at a time that's convenient. What time of day works best for you?",
				"I'd be happy to help you find the right time. What time of day works best for you?",
				"I'm here to make scheduling as smooth as possible. What time of day works best for you?",
				"I'd love to help you find the perfect time. What time of day works best for you?",
				"I'm here to help you get scheduled at a time that works for you. What time of day works best for you?",
				"I'd be happy to help you find the right time. What time of day works best for you?",
				"I'm here to make your scheduling experience easy. What time of day works best for you?",
				"I'd love to help you find the perfect time. What time of day works best for you?",
				"I'm here to help you get scheduled at a time that's convenient. What time of day works best for you?"
			],
			timeOfDayError: [
				"I'd love to help you find the perfect time. Could you please let me know what time of day works best for you?",
				"I'm here to help you get scheduled. Could you please tell me what time of day works best for you?",
				"I'd be happy to help you find the right time. Could you please let me know your preferred time?",
				"I'm here to make scheduling as smooth as possible. Could you please tell me what time of day works best for you?",
				"I'd love to help you find the perfect time. Could you please let me know your preferred time?",
				"I'm here to help you get scheduled. Could you please tell me what time of day works best for you?",
				"I'd be happy to help you find the right time. Could you please let me know your preferred time?",
				"I'm here to make your scheduling experience easy. Could you please tell me what time of day works best for you?",
				"I'd love to help you find the perfect time. Could you please let me know your preferred time?",
				"I'm here to help you get scheduled. Could you please tell me what time of day works best for you?"
			],
			locationSelection: [
				"Excellent! Which of our locations would be most convenient for you? We want to make sure you can get to us easily.",
				"Perfect! Which of our locations would work best for you? We want to make your visit as convenient as possible.",
				"Great! Which of our locations would be most convenient for you? We want to make sure you can get to us easily.",
				"Wonderful! Which of our locations would work best for you? We want to make your visit as convenient as possible.",
				"Excellent! Which of our locations would be most convenient for you? We want to make sure you can get to us easily.",
				"Perfect! Which of our locations would work best for you? We want to make your visit as convenient as possible.",
				"Great! Which of our locations would be most convenient for you? We want to make sure you can get to us easily.",
				"Wonderful! Which of our locations would work best for you? We want to make your visit as convenient as possible.",
				"Excellent! Which of our locations would be most convenient for you? We want to make sure you can get to us easily.",
				"Perfect! Which of our locations would work best for you? We want to make your visit as convenient as possible."
			],
			painLevel: [
				"Perfect! {location} is a great choice. To help us provide the best care for you, could you tell me how you're feeling on a scale of 1 to 10? This helps us understand how to best support you.",
				"Great choice with {location}! To help us provide the best care for you, could you tell me how you're feeling on a scale of 1 to 10? This helps us understand how to best support you.",
				"Excellent choice! To help us prepare for your visit, could you let me know how you're feeling on a scale of 1 to 10? This information helps us provide the most appropriate care.",
				"Wonderful choice! To help us provide the best care for you, could you tell me how you're feeling on a scale of 1 to 10? This helps us understand how to best support you.",
				"Perfect! {location} is an excellent choice. To help us provide the best care for you, could you tell me how you're feeling on a scale of 1 to 10? This helps us understand how to best support you.",
				"Great choice with {location}! To help us prepare for your visit, could you let me know how you're feeling on a scale of 1 to 10? This information helps us provide the most appropriate care.",
				"Excellent choice! To help us provide the best care for you, could you tell me how you're feeling on a scale of 1 to 10? This helps us understand how to best support you.",
				"Wonderful choice! To help us prepare for your visit, could you let me know how you're feeling on a scale of 1 to 10? This information helps us provide the most appropriate care.",
				"Perfect! {location} is a great choice. To help us provide the best care for you, could you tell me how you're feeling on a scale of 1 to 10? This helps us understand how to best support you.",
				"Great choice with {location}! To help us prepare for your visit, could you let me know how you're feeling on a scale of 1 to 10? This information helps us provide the most appropriate care."
			],
			symptoms: [
				"Thank you for sharing your pain level with me. Now, could you please describe your symptoms in detail? For example, are you experiencing back pain, neck pain, joint stiffness, numbness, tingling, or any other specific symptoms? This helps us prepare for your visit and ensure you get the right care.",
				"I appreciate you sharing that with me. Could you please describe your symptoms in detail? For example, are you experiencing pain in your back, neck, shoulders, knees, or other areas? Are there any specific movements that make it worse or better? This information helps us provide the most appropriate care.",
				"Thank you for being open with me. Could you please describe your symptoms in detail? For example, are you experiencing shooting pain, dull aches, stiffness, weakness, or any other specific symptoms? This helps us understand what you're going through and prepare for your visit.",
				"I appreciate you sharing that with me. Could you please describe your symptoms in detail? For example, are you experiencing pain, numbness, tingling, weakness, or any other specific symptoms? Where exactly are you feeling these symptoms? This helps us provide the right care.",
				"Thank you for being open with me. Could you please describe your symptoms in detail? For example, are you experiencing back pain, neck pain, joint pain, muscle weakness, or any other specific symptoms? How long have you been experiencing these symptoms? This helps us prepare for your visit.",
				"I appreciate you sharing that with me. Could you please describe your symptoms in detail? For example, are you experiencing pain, stiffness, limited range of motion, or any other specific symptoms? What makes these symptoms better or worse? This helps us provide the most appropriate care.",
				"Thank you for being open with me. Could you please describe your symptoms in detail? For example, are you experiencing pain in specific areas, numbness, tingling, weakness, or any other symptoms? How long have you been dealing with these symptoms? This helps us understand your situation better.",
				"I appreciate you sharing that with me. Could you please describe your symptoms in detail? For example, are you experiencing chronic pain, acute pain, stiffness, muscle spasms, or any other specific symptoms? What activities or movements affect these symptoms? This helps us prepare for your visit.",
				"Thank you for being open with me. Could you please describe your symptoms in detail? For example, are you experiencing pain, discomfort, limited mobility, or any other specific symptoms? Where exactly are you feeling these symptoms? This helps us provide the right care.",
				"I appreciate you sharing that with me. Could you please describe your symptoms in detail? For example, are you experiencing back pain, neck pain, joint issues, muscle problems, or any other specific symptoms? How long have you been experiencing these symptoms? This helps us prepare for your visit."
			],
			procedure: [
				"Thank you for sharing your symptoms with me. I want to make sure we get you scheduled for the right type of care. What <span style=\"font-weight: bold; color: orange;\">procedure</span> or treatment are you interested in? I'm here to help you understand your options.",
				"I appreciate you sharing that with me. To help you get the most appropriate care, what <span style=\"font-weight: bold; color: orange;\">procedure</span> or treatment are you looking for? I want to make sure we have everything ready for your visit.",
				"Thank you for being open with me. I want to ensure you get the right care for your needs. What <span style=\"font-weight: bold; color: orange;\">procedure</span> or treatment are you interested in?",
				"I appreciate you sharing that with me. I want to make sure we get you scheduled for the right type of care. What <span style=\"font-weight: bold; color: orange;\">procedure</span> or treatment are you interested in? I'm here to help you understand your options.",
				"Thank you for being open with me. To help you get the most appropriate care, what <span style=\"font-weight: bold; color: orange;\">procedure</span> or treatment are you looking for? I want to make sure we have everything ready for your visit.",
				"I appreciate you sharing that with me. I want to ensure you get the right care for your needs. What <span style=\"font-weight: bold; color: orange;\">procedure</span> or treatment are you interested in?",
				"Thank you for sharing your symptoms with me. I want to make sure we get you scheduled for the right type of care. What <span style=\"font-weight: bold; color: orange;\">procedure</span> or treatment are you interested in? I'm here to help you understand your options.",
				"I appreciate you sharing that with me. To help you get the most appropriate care, what <span style=\"font-weight: bold; color: orange;\">procedure</span> or treatment are you looking for? I want to make sure we have everything ready for your visit.",
				"Thank you for being open with me. I want to ensure you get the right care for your needs. What <span style=\"font-weight: bold; color: orange;\">procedure</span> or treatment are you interested in?",
				"I appreciate you sharing that with me. I want to make sure we get you scheduled for the right type of care. What <span style=\"font-weight: bold; color: orange;\">procedure</span> or treatment are you interested in? I'm here to help you understand your options."
			],
			insurance: [
				"Please note that we are not currently accepting Medicare or Medicaid patients at this time. What <span style=\"font-weight: bold; color: orange;\">insurance</span> do you have? I'm here to help you understand your coverage.",
				"Please note that we are not currently accepting Medicare or Medicaid patients at this time. To help you with insurance verification, what <span style=\"font-weight: bold; color: orange;\">insurance provider</span> do you have?",
				"Please note that we are not currently accepting Medicare or Medicaid patients at this time. What <span style=\"font-weight: bold; color: orange;\">insurance provider</span> do you have? This helps us verify your benefits.",
				"Please note that we are not currently accepting Medicare or Medicaid patients at this time. What <span style=\"font-weight: bold; color: orange;\">insurance</span> do you have? I'm here to help you understand your coverage.",
				"Please note that we are not currently accepting Medicare or Medicaid patients at this time. To help you with insurance verification, what <span style=\"font-weight: bold; color: orange;\">insurance provider</span> do you have?",
				"Please note that we are not currently accepting Medicare or Medicaid patients at this time. What <span style=\"font-weight: bold; color: orange;\">insurance provider</span> do you have? This helps us verify your benefits.",
				"Please note that we are not currently accepting Medicare or Medicaid patients at this time. What <span style=\"font-weight: bold; color: orange;\">insurance</span> do you have? I'm here to help you understand your coverage.",
				"Please note that we are not currently accepting Medicare or Medicaid patients at this time. To help you with insurance verification, what <span style=\"font-weight: bold; color: orange;\">insurance provider</span> do you have?",
				"Please note that we are not currently accepting Medicare or Medicaid patients at this time. What <span style=\"font-weight: bold; color: orange;\">insurance provider</span> do you have? This helps us verify your benefits.",
				"Please note that we are not currently accepting Medicare or Medicaid patients at this time. What <span style=\"font-weight: bold; color: orange;\">insurance</span> do you have? I'm here to help you understand your coverage."
			],
			policyHolder: [
				"Thank you! Now I need to collect some additional insurance information to help verify your benefits. What is the <span style=\"font-weight: bold; color: orange;\">policy holder's name</span>?",
				"Perfect! To help us verify your insurance benefits, could you please provide the <span style=\"font-weight: bold; color: orange;\">policy holder's name</span>?",
				"Great! I need to gather some additional insurance details. What is the <span style=\"font-weight: bold; color: orange;\">policy holder's name</span>?",
				"Thank you! To help us verify your benefits, could you please provide the <span style=\"font-weight: bold; color: orange;\">policy holder's name</span>?",
				"Excellent! I need to collect some additional insurance information. What is the <span style=\"font-weight: bold; color: orange;\">policy holder's name</span>?",
				"Perfect! To help us verify your insurance benefits, could you please provide the <span style=\"font-weight: bold; color: orange;\">policy holder's name</span>?",
				"Great! I need to gather some additional insurance details. What is the <span style=\"font-weight: bold; color: orange;\">policy holder's name</span>?",
				"Thank you! To help us verify your benefits, could you please provide the <span style=\"font-weight: bold; color: orange;\">policy holder's name</span>?",
				"Excellent! I need to collect some additional insurance information. What is the <span style=\"font-weight: bold; color: orange;\">policy holder's name</span>?",
				"Perfect! To help us verify your insurance benefits, could you please provide the <span style=\"font-weight: bold; color: orange;\">policy holder's name</span>?"
			],
			policyNumber: [
				"Thank you! What is your <span style=\"font-weight: bold; color: orange;\">policy number</span>?",
				"Perfect! Could you please provide your <span style=\"font-weight: bold; color: orange;\">policy number</span>?",
				"Great! What is your <span style=\"font-weight: bold; color: orange;\">policy number</span>?",
				"Thank you! Could you please provide your <span style=\"font-weight: bold; color: orange;\">policy number</span>?",
				"Excellent! What is your <span style=\"font-weight: bold; color: orange;\">policy number</span>?",
				"Perfect! Could you please provide your <span style=\"font-weight: bold; color: orange;\">policy number</span>?",
				"Great! What is your <span style=\"font-weight: bold; color: orange;\">policy number</span>?",
				"Thank you! Could you please provide your <span style=\"font-weight: bold; color: orange;\">policy number</span>?",
				"Excellent! What is your <span style=\"font-weight: bold; color: orange;\">policy number</span>?",
				"Perfect! Could you please provide your <span style=\"font-weight: bold; color: orange;\">policy number</span>?"
			],
			groupNumber: [
				"Thank you! What is your <span style=\"font-weight: bold; color: orange;\">group number</span>?",
				"Perfect! Could you please provide your <span style=\"font-weight: bold; color: orange;\">group number</span>?",
				"Great! What is your <span style=\"font-weight: bold; color: orange;\">group number</span>?",
				"Thank you! Could you please provide your <span style=\"font-weight: bold; color: orange;\">group number</span>?",
				"Excellent! What is your <span style=\"font-weight: bold; color: orange;\">group number</span>?",
				"Perfect! Could you please provide your <span style=\"font-weight: bold; color: orange;\">group number</span>?",
				"Great! What is your <span style=\"font-weight: bold; color: orange;\">group number</span>?",
				"Thank you! Could you please provide your <span style=\"font-weight: bold; color: orange;\">group number</span>?",
				"Excellent! What is your <span style=\"font-weight: bold; color: orange;\">group number</span>?",
				"Perfect! Could you please provide your <span style=\"font-weight: bold; color: orange;\">group number</span>?"
			],
			confirmation: [
				"Perfect! I want to make sure I have everything right before we proceed. Let me confirm the details we've discussed so far.",
				"Great! I want to make sure I have everything right before we proceed. Let me confirm the details we've discussed so far.",
				"Excellent! I want to make sure I have everything right before we proceed. Let me confirm the details we've discussed so far.",
				"Wonderful! I want to make sure I have everything right before we proceed. Let me confirm the details we've discussed so far.",
				"Perfect! I want to make sure I have everything right before we proceed. Let me confirm the details we've discussed so far.",
				"Great! I want to make sure I have everything right before we proceed. Let me confirm the details we've discussed so far.",
				"Excellent! I want to make sure I have everything right before we proceed. Let me confirm the details we've discussed so far.",
				"Wonderful! I want to make sure I have everything right before we proceed. Let me confirm the details we've discussed so far.",
				"Perfect! I want to make sure I have everything right before we proceed. Let me confirm the details we've discussed so far.",
				"Great! I want to make sure I have everything right before we proceed. Let me confirm the details we've discussed so far."
			],
			completion: [
				"Perfect! Thank you for providing all this information. We'll review your details and get back to you shortly to confirm your appointment. You should receive a confirmation email or phone call within the next business day.",
				"Excellent! Thank you for taking the time to provide all this information. We'll review your details and contact you soon to confirm your appointment. You should hear from us within the next business day.",
				"Wonderful! Thank you for providing all this information. We'll review your details and get back to you shortly to confirm your appointment. You should receive a confirmation email or phone call within the next business day.",
				"Great! Thank you for taking the time to provide all this information. We'll review your details and contact you soon to confirm your appointment. You should hear from us within the next business day.",
				"Perfect! Thank you for providing all this information. We'll review your details and get back to you shortly to confirm your appointment. You should receive a confirmation email or phone call within the next business day.",
				"Excellent! Thank you for taking the time to provide all this information. We'll review your details and contact you soon to confirm your appointment. You should hear from us within the next business day.",
				"Wonderful! Thank you for providing all this information. We'll review your details and get back to you shortly to confirm your appointment. You should receive a confirmation email or phone call within the next business day.",
				"Great! Thank you for taking the time to provide all this information. We'll review your details and contact you soon to confirm your appointment. You should hear from us within the next business day.",
				"Perfect! Thank you for providing all this information. We'll review your details and get back to you shortly to confirm your appointment. You should receive a confirmation email or phone call within the next business day.",
				"Excellent! Thank you for taking the time to provide all this information. We'll review your details and contact you soon to confirm your appointment. You should hear from us within the next business day."
			]
		};

		// Helper function to get random variation
		const getRandomVariation = (category: string): string => {
			const variations = responseVariations[category as keyof typeof responseVariations] || ["I'm here to help you."];
			return variations[Math.floor(Math.random() * variations.length)];
		};

		// Helper function to format response with dynamic data
		const formatResponse = (template: string, data: any = {}): string => {
			return template.replace(/\{([^}]+)\}/g, (match, key) => {
				return data[key.trim()] || match;
			});
		};

		// Helper function to validate email format
		const validateEmail = (email: string): boolean => {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			return emailRegex.test(email);
		};

		// Helper function to validate phone number format
		const validatePhone = (phone: string): boolean => {
			// Remove all non-digit characters and check length
			const digitsOnly = phone.replace(/\D/g, '');
			return digitsOnly.length >= 10 && digitsOnly.length <= 15;
		};

		// Helper function to validate date of birth format
		const validateDOB = (dob: string): boolean => {
			// Check for MM/DD/YYYY or MM-DD-YYYY format
			const dobRegex = /^(0?[1-9]|1[0-2])[-\/](0?[1-9]|[12]\d|3[01])[-\/](19|20)\d{2}$/;
			
			// Test the regex first
			if (!dobRegex.test(dob)) {
				return false;
			}
			
			// Additional validation: check if it's a valid date
			try {
				const parts = dob.split(/[-\/]/);
				const month = parseInt(parts[0]) - 1; // JS months are 0-indexed
				const day = parseInt(parts[1]);
				const year = parseInt(parts[2]);
				
				const date = new Date(year, month, day);
				
				// Check if the date is valid and matches the input
				return date.getFullYear() === year && 
					   date.getMonth() === month && 
					   date.getDate() === day &&
					   year >= 1900 && year <= 2099;
			} catch (error) {
				return false;
			}
		};

		// Helper function to validate policy number format
		const validatePolicyNumber = (policy: string): boolean => {
			// Policy numbers are typically alphanumeric and at least 6 characters
			return policy.length >= 6 && /^[A-Za-z0-9-]+$/.test(policy);
		};

		const validateGroupNumber = (group: string): boolean => {
			// Group numbers can be:
			// - All numbers (like 123456789)
			// - All letters (like ABC123)
			// - Mix of letters and numbers (like 2A-98765432 or ABC123456)
			// - Can contain hyphens, spaces, and other common characters
			return group.length >= 3 && /^[a-zA-Z0-9\s\-_.,/#]+$/.test(group);
		};

		const validateName = (name: string): boolean => {
			return name.length >= 2 && /^[a-zA-Z\s\-']+$/.test(name);
		};

		const validateLocation = (location: string): boolean => {
			return location.length >= 3 && /^[a-zA-Z\s,.-]+$/.test(location);
		};

		const validatePainLevel = (pain: string): boolean => {
			const painNum = parseInt(pain);
			return !isNaN(painNum) && painNum >= 1 && painNum <= 10;
		};

		const validateSymptoms = (symptoms: string): boolean => {
			return symptoms.length >= 5 && /^[a-zA-Z\s,.-]+$/.test(symptoms);
		};

		const validateProcedure = (procedure: string): boolean => {
			return procedure.length >= 3 && /^[a-zA-Z\s,.-]+$/.test(procedure);
		};

		// NEW VALIDATION FUNCTIONS FOR APPOINTMENT TIMING
		const validateAppointmentTiming = (timing: string): boolean => {
			const validTimings = ['next available', 'next week', 'after 2 weeks', 'next month', 'asap', 'soon', 'later'];
			return validTimings.some(valid => timing.toLowerCase().includes(valid));
		};

		const validateDayOfWeek = (day: string): boolean => {
			const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
			return validDays.some(valid => day.toLowerCase().includes(valid));
		};

		const validateTimeOfDay = (time: string): boolean => {
			const validTimes = ['morning', 'afternoon', 'evening', 'am', 'pm', 'early', 'late'];
			return validTimes.some(valid => time.toLowerCase().includes(valid));
		};

		// Helper function to validate insurance provider
		const validateInsurance = (insurance: string): boolean => {
			// Insurance should have at least 3 characters and contain letters, spaces, commas, periods, and hyphens
			return insurance.length >= 3 && /^[A-Za-z\s,.-]+$/.test(insurance);
		};

		// Helper function to validate policy holder name
		const validatePolicyHolder = (policyHolder: string): boolean => {
			// Policy holder should have at least 2 characters and contain letters (including accented characters), spaces, hyphens, and apostrophes
			return policyHolder.length >= 2 && /^[A-Za-zÀ-ÿ\s'-]+$/.test(policyHolder);
		};

		// Comprehensive validation functions
		const validationUtils: any = {
			validatePatientType: (input: string) => {
				if (!input || typeof input !== 'string') return { isValid: false, error: "Please specify if you're a new or existing patient." };
				const inputLower = input.toLowerCase();
				if (inputLower.includes('new') || inputLower.includes('new_patient')) {
					return { isValid: true, value: 'new' };
				} else if (inputLower.includes('existing') || inputLower.includes('existing_patient')) {
					return { isValid: true, value: 'existing' };
				}
				return { isValid: false, error: "Please specify if you're a new or existing patient." };
			},

			validateFullName: (input: string) => {
				if (!input || typeof input !== 'string') return { isValid: false, error: "Please provide your first and last name." };
				const trimmed = input.trim();
				if (trimmed.length < 2) return { isValid: false, error: "Please provide your first and last name." };
				
				const nameParts = trimmed.split(' ').filter(part => part.length > 0);
				if (nameParts.length < 2) return { isValid: false, error: "Please provide both your first and last name." };
				
				const nameRegex = /^[a-zA-Z\s\-']+$/;
				if (!nameRegex.test(trimmed)) return { isValid: false, error: "Please provide a valid name using only letters, spaces, hyphens, and apostrophes." };
				
				const correctedName = nameParts.map(part => 
					part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
				).join(' ');
				
				return { isValid: true, value: correctedName };
			},

			validateDateOfBirth: (input: string) => {
				if (!input || typeof input !== 'string') return { isValid: false, error: "Please provide your date of birth." };
				const trimmed = input.trim();
				
				const dateFormats = [
					/^\d{1,2}\/\d{1,2}\/\d{4}$/, // MM/DD/YYYY
					/^\d{1,2}-\d{1,2}-\d{4}$/,   // MM-DD-YYYY
					/^\d{4}-\d{1,2}-\d{1,2}$/,   // YYYY-MM-DD
					/^\d{8}$/                     // MMDDYYYY
				];
				
				let isValidFormat = false;
				for (const format of dateFormats) {
					if (format.test(trimmed)) {
						isValidFormat = true;
						break;
					}
				}
				
				if (!isValidFormat) return { isValid: false, error: "Please provide your date of birth in a valid format (e.g., MM/DD/YYYY)." };
				
				const currentYear = new Date().getFullYear();
				const yearMatch = trimmed.match(/\d{4}/);
				if (yearMatch) {
					const birthYear = parseInt(yearMatch[0]);
					if (birthYear < 1900 || birthYear > currentYear) {
						return { isValid: false, error: "Please provide a valid date of birth." };
					}
				}
				
				return { isValid: true, value: trimmed };
			},

			validatePhone: (input: string) => {
				if (!input || typeof input !== 'string') return { isValid: false, error: "Please provide your phone number." };
				const trimmed = input.trim();
				
				const digitsOnly = trimmed.replace(/\D/g, '');
				
				if (digitsOnly.length < 10) return { isValid: false, error: "Please provide a valid phone number with at least 10 digits." };
				if (digitsOnly.length > 15) return { isValid: false, error: "Please provide a valid phone number." };
				
				const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
				if (!phoneRegex.test(digitsOnly)) return { isValid: false, error: "Please provide a valid phone number." };
				
				return { isValid: true, value: trimmed };
			},

			validateEmail: (input: string) => {
				if (!input || typeof input !== 'string') return { isValid: false, error: "Please provide your email address." };
				const trimmed = input.trim();
				
				const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailRegex.test(trimmed)) return { isValid: false, error: "Please provide a valid email address." };
				
				if (trimmed.length > 254) return { isValid: false, error: "Email address is too long." };
				
				return { isValid: true, value: trimmed };
			},

			validateLocation: (input: string, availableLocations: string[]) => {
				if (!input || typeof input !== 'string') return { isValid: false, error: "Please select a location." };
				const trimmed = input.trim();
				
				if (availableLocations && availableLocations.length > 0) {
					const locationLower = trimmed.toLowerCase();
					const matchingLocation = availableLocations.find(loc => 
						loc.toLowerCase() === locationLower || 
						loc.toLowerCase().includes(locationLower) ||
						locationLower.includes(loc.toLowerCase())
					);
					
					if (!matchingLocation) {
						return { isValid: false, error: `Please select from our available locations: ${availableLocations.join(', ')}` };
					}
					
					return { isValid: true, value: matchingLocation };
				}
				
				if (trimmed.length < 2) return { isValid: false, error: "Please provide a valid location." };
				
				return { isValid: true, value: trimmed };
			},

			validatePainLevel: (input: string) => {
				if (!input || typeof input !== 'string') return { isValid: false, error: "Please provide your pain level." };
				const trimmed = input.trim();
				
				const painLevel = parseInt(trimmed);
				if (isNaN(painLevel)) return { isValid: false, error: "Please provide your pain level as a number from 1 to 10." };
				
				if (painLevel < 1 || painLevel > 10) return { isValid: false, error: "Please provide your pain level as a number from 1 to 10." };
				
				return { isValid: true, value: painLevel.toString() };
			},

			validateSymptoms: (input: string) => {
				if (!input || typeof input !== 'string') return { isValid: false, error: "Please describe your symptoms." };
				const trimmed = input.trim();
				
				if (trimmed.length < 3) return { isValid: false, error: "Please provide a more detailed description of your symptoms." };
				if (trimmed.length > 500) return { isValid: false, error: "Please provide a shorter description of your symptoms." };
				
				return { isValid: true, value: trimmed };
			},

			validateProcedure: (input: string, availableProcedures: string[]) => {
				if (!input || typeof input !== 'string') return { isValid: false, error: "Please select a procedure." };
				const trimmed = input.trim();
				
				if (availableProcedures && availableProcedures.length > 0) {
					const procedureLower = trimmed.toLowerCase();
					const matchingProcedure = availableProcedures.find(proc => 
						proc.toLowerCase() === procedureLower || 
						proc.toLowerCase().includes(procedureLower) ||
						procedureLower.includes(proc.toLowerCase())
					);
					
					if (!matchingProcedure && !procedureLower.includes('other')) {
						return { isValid: false, error: `Please select from our available procedures: ${availableProcedures.join(', ')}` };
					}
					
					return { isValid: true, value: matchingProcedure || trimmed };
				}
				
				if (trimmed.length < 2) return { isValid: false, error: "Please provide a valid procedure." };
				
				return { isValid: true, value: trimmed };
			},

			validateInsurance: (input: string, availableInsurance: string[]) => {
				if (!input || typeof input !== 'string') return { isValid: false, error: "Please provide your insurance information." };
				const trimmed = input.trim();
				
				if (availableInsurance && availableInsurance.length > 0) {
					const insuranceLower = trimmed.toLowerCase();
					const matchingInsurance = availableInsurance.find(ins => 
						ins.toLowerCase() === insuranceLower || 
						ins.toLowerCase().includes(insuranceLower) ||
						insuranceLower.includes(ins.toLowerCase())
					);
					
					if (!matchingInsurance && !insuranceLower.includes('other')) {
						return { isValid: false, error: `Please select from our accepted insurance providers: ${availableInsurance.join(', ')}` };
					}
					
					return { isValid: true, value: matchingInsurance || trimmed };
				}
				
				if (trimmed.length < 2) return { isValid: false, error: "Please provide valid insurance information." };
				
				return { isValid: true, value: trimmed };
			},

			validatePolicyHolder: (input: string) => {
				if (!input || typeof input !== 'string') return { isValid: false, error: "Please provide the Policy Holder's First Name and Last Name." };
				const trimmed = input.trim();
				
				if (trimmed.length < 2) return { isValid: false, error: "Please provide the Policy Holder's First Name and Last Name." };
				
				const nameParts = trimmed.split(' ').filter(part => part.length > 0);
				if (nameParts.length < 2) return { isValid: false, error: "Please provide both the Policy Holder's First Name and Last Name." };
				
				const nameRegex = /^[a-zA-Z\s\-']+$/;
				if (!nameRegex.test(trimmed)) return { isValid: false, error: "Please provide a valid name using only letters, spaces, hyphens, and apostrophes." };
				
				const correctedName = nameParts.map(part => 
					part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
				).join(' ');
				
				return { isValid: true, value: correctedName };
			},

			validateInsuranceId: (input: string) => {
				if (!input || typeof input !== 'string') return { isValid: false, error: "Please provide your insurance ID number." };
				const trimmed = input.trim();
				
				if (trimmed.length < 3) return { isValid: false, error: "Please provide a valid insurance ID number." };
				if (trimmed.length > 20) return { isValid: false, error: "Insurance ID number seems too long. Please check and try again." };
				
				return { isValid: true, value: trimmed };
			},

			validateGroupNumber: (input: string) => {
				if (!input || typeof input !== 'string') return { isValid: false, error: "Please provide your group number." };
				const trimmed = input.trim();
				
				if (trimmed.length < 2) return { isValid: false, error: "Please provide a valid group number." };
				if (trimmed.length > 15) return { isValid: false, error: "Group number seems too long. Please check and try again." };
				
				return { isValid: true, value: trimmed };
			},

			validateAdditionalInfo: (input: string) => {
				if (!input || typeof input !== 'string') return { isValid: true, value: "" };
				const trimmed = input.trim();
				
				if (trimmed.length > 1000) return { isValid: false, error: "Additional information is too long. Please provide a shorter description." };
				
				return { isValid: true, value: trimmed };
			}
		};

		// Spell check functionality
		const spellCheck = (input: string, fieldType: string): { corrected: string, suggestions: string[] } => {
			
			const commonCorrections: { [key: string]: { [key: string]: string } } = {
				name: {
					"jon": "John", "jane": "Jane", "mike": "Mike", "sarah": "Sarah", "david": "David",
					"emily": "Emily", "robert": "Robert", "lisa": "Lisa", "michael": "Michael",
					"jennifer": "Jennifer", "william": "William", "elizabeth": "Elizabeth",
					"jogn": "John", "jpgn": "John", "jhon": "John", "jahn": "John",
					"jene": "Jane", "jain": "Jane",
					"myke": "Mike",
					"sara": "Sarah",
					"dave": "David", "davd": "David",
					"emili": "Emily", "emly": "Emily",
					"rob": "Robert", "bob": "Robert",
					"michal": "Michael",
					"jen": "Jennifer", "jenny": "Jennifer",
					"will": "William", "bill": "William",
					"liz": "Elizabeth", "beth": "Elizabeth"
				},
				location: {
					"downtown": "Downtown", "medical": "Medical", "center": "Center", "office": "Office",
					"clinic": "Clinic", "hospital": "Hospital", "building": "Building", "floor": "Floor",
					"street": "Street", "avenue": "Avenue", "road": "Road"
				},
				symptoms: {
					"pain": "pain", "headache": "headache", "nausea": "nausea", "dizziness": "dizziness",
					"fatigue": "fatigue", "swelling": "swelling", "stiffness": "stiffness",
					"back": "back", "neck": "neck", "shoulder": "shoulder", "knee": "knee",
					"chest": "chest", "abdominal": "abdominal", "joint": "joint"
				},
				procedure: {
					"therapy": "therapy", "consultation": "consultation", "examination": "examination",
					"scan": "scan", "test": "test", "treatment": "treatment", "surgery": "surgery",
					"physical": "physical", "occupational": "occupational", "speech": "speech"
				},
				insurance: {
					"blue": "Blue", "cross": "Cross", "shield": "Shield", "aetna": "Aetna",
					"cigna": "Cigna", "united": "United", "health": "Health", "care": "Care",
					"medicare": "Medicare", "medicaid": "Medicaid"
				}
			};

			const corrections = commonCorrections[fieldType] || {};
			const words = input.toLowerCase().split(' ');
			
			const correctedWords = words.map(word => {
				
				// First try exact match
				if (corrections[word]) {
					return corrections[word];
				}
				
				// If no exact match, try fuzzy matching with higher threshold for names
				let bestMatch = word;
				let bestDistance = Infinity;
				const maxDistance = fieldType === 'name' ? 3 : 2; // More lenient for names
				
				Object.keys(corrections).forEach(correctWord => {
					const distance = levenshteinDistance(word, correctWord);
					if (distance <= maxDistance && distance < bestDistance) {
						bestMatch = corrections[correctWord];
						bestDistance = distance;
					}
				});
				
				// Only use correction if it's significantly better (distance <= 2 for names, <= 1 for others)
				const useCorrection = fieldType === 'name' ? bestDistance <= 2 : bestDistance <= 1;
				let finalWord = useCorrection ? bestMatch : word;
				
				// Auto-capitalize the first letter for names
				if (fieldType === 'name' && finalWord.length > 0) {
					finalWord = finalWord.charAt(0).toUpperCase() + finalWord.slice(1).toLowerCase();
				}
				
				return finalWord;
			});
			
			const corrected = correctedWords.join(' ');
			
			// Generate suggestions for unknown words
			const suggestions: string[] = [];
			words.forEach(word => {
				if (!corrections[word] && word.length > 2) {
					// Find similar words
					Object.keys(corrections).forEach(correctWord => {
						const maxDistance = fieldType === 'name' ? 3 : 2;
						if (levenshteinDistance(word, correctWord) <= maxDistance) {
							suggestions.push(corrections[correctWord]);
						}
					});
				}
			});

			return { corrected, suggestions: Array.from(new Set(suggestions)) };
		};

		// Levenshtein distance for fuzzy matching
		const levenshteinDistance = (str1: string, str2: string): number => {
			const matrix = [];
			for (let i = 0; i <= str2.length; i++) {
				matrix[i] = [i];
			}
			for (let j = 0; j <= str1.length; j++) {
				matrix[0][j] = j;
			}
			for (let i = 1; i <= str2.length; i++) {
				for (let j = 1; j <= str1.length; j++) {
					if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
						matrix[i][j] = matrix[i - 1][j - 1];
					} else {
						matrix[i][j] = Math.min(
							matrix[i - 1][j - 1] + 1,
							matrix[i][j - 1] + 1,
							matrix[i - 1][j] + 1
						);
					}
				}
			}
			return matrix[str2.length][str1.length];
		};

		for (let i = 0; i < items.length; i++) {
			const data = items[i].json;
			
					// Extract data from multiple sources
		const originalContext = data.original_context as any;
		const demoData = originalContext?.demoData || data;
		const config = originalContext?.config || data.config || {};
		const webhookData = originalContext?.webhookData || {};
		const fullContext = originalContext?.fullContext || {};

		// DEBUG: Log all available data sources
		console.log("🔧 DEBUG - Original context:", originalContext);
		console.log("🔧 DEBUG - Demo data:", demoData);
		console.log("🔧 DEBUG - Config:", config);

		// Extract key information - DYNAMIC FOR ANY PROVIDER
		// Try config first, then fall back to demoData
		const demoId = config.id || config.demoId || demoData.id || demoData.demoId;
		let companyName = config.company_name || config.companyName || demoData.company_name || demoData.companyName || "our practice";
		let agentName = config.agent_name || config.agentName || demoData.agent_name || demoData.agentName || "your assistant";

		// Extract locations from config first, then demo data - DYNAMIC
		const locations = config.locations || demoData.locations || [];
		const locationNames = locations.map((loc: any) => loc.city).filter(Boolean);

		// Extract business hours and days of operation from Google Places data
		const businessHours = config.businessHours || demoData.businessHours || {};
		const openingHours = locations.map((loc: any) => ({
			name: loc.name || loc.city,
			hours: loc.hours || loc.opening_hours?.weekday_text || []
		})).filter((loc: any) => loc.hours && loc.hours.length > 0);

		// Helper function to get available days for a location
		const getAvailableDays = (locationName: string): string[] => {
			// Get business hours from the demo data or config
			const businessHours = config?.businessHours || demoData?.businessHours || {};
			const locations = config?.locations || demoData?.locations || [];
			
			// Find the specific location
			const location = locations.find((loc: any) => 
				loc.name?.toLowerCase().includes(locationName.toLowerCase()) ||
				locationName.toLowerCase().includes(loc.name?.toLowerCase())
			);
			
			if (location && location.hours && Array.isArray(location.hours)) {
				// Parse weekday_text format: ["Monday: 9:00 AM – 5:00 PM", "Tuesday: 9:00 AM – 5:00 PM", ...]
				const availableDays: string[] = [];
				
				location.hours.forEach((dayInfo: string) => {
					if (dayInfo && typeof dayInfo === 'string') {
						// Extract day name from format "Monday: 9:00 AM – 5:00 PM"
						const dayMatch = dayInfo.match(/^([A-Za-z]+):/);
						if (dayMatch && dayMatch[1]) {
							const dayName = dayMatch[1];
							// Check if it's not "Closed" or similar
							if (!dayInfo.toLowerCase().includes('closed') && 
								!dayInfo.toLowerCase().includes('unavailable')) {
								availableDays.push(dayName);
							}
						}
					}
				});
				
				return availableDays.length > 0 ? availableDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
			}
			
			// Fallback to default business days if no specific data
			return ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
		};

		// Helper function to get business hours for a location
		const getBusinessHours = (locationName: string): string => {
			const location = openingHours.find((loc: any) => 
				loc.name.toLowerCase().includes(locationName.toLowerCase()) || 
				locationName.toLowerCase().includes(loc.name.toLowerCase())
			);
			
			if (!location || !location.hours) {
				return "9:00 AM - 5:00 PM"; // Fallback hours
			}

			// Return the first day's hours as a general reference
			return location.hours[0] || "9:00 AM - 5:00 PM";
		};

		// Helper function to get business hours for a specific day from all locations
		const getBusinessHoursForDay = (dayName: string, locations: any[]): string => {
			for (const location of locations) {
				if (location.hours && Array.isArray(location.hours)) {
					const dayInfo = location.hours.find((day: string) => 
						day.toLowerCase().startsWith(dayName.toLowerCase())
					);
					if (dayInfo && !dayInfo.toLowerCase().includes('closed')) {
						// Extract hours from format "Monday: 9:00 AM – 5:00 PM"
						const hoursMatch = dayInfo.match(/:\s*(.+)$/);
						if (hoursMatch && hoursMatch[1]) {
							return hoursMatch[1].trim();
						}
					}
				}
			}
			return "9:00 AM - 5:00 PM"; // Fallback hours
		};

			// DYNAMIC SERVICES - Pull from config first, then demo data, Supabase, or client website
			let serviceNames: string[] = [];
			
			// DEBUG: Log all data sources to understand what's available
			console.log("🔧 DEBUG - Config received:", config);
			console.log("🔧 DEBUG - Config services:", config.services);
			console.log("🔧 DEBUG - Config keys:", Object.keys(config));
			console.log("🔧 DEBUG - Demo data received:", demoData);
			console.log("🔧 DEBUG - Demo data services:", demoData.services);
			console.log("🔧 DEBUG - Demo data demo_services:", demoData.demo_services);
			
			// First try to get services from config
			if (config.services && Array.isArray(config.services)) {
				console.log("�� DEBUG - Processing config.services:", config.services);
				console.log("🔧 DEBUG - First config service type:", typeof config.services[0]);
				console.log("🔧 DEBUG - First config service value:", config.services[0]);
				
				serviceNames = config.services.map((service: any) => {
					console.log("🔧 DEBUG - Processing config service:", service, "Type:", typeof service);
					if (typeof service === 'string') {
						console.log("🔧 DEBUG - Returning string config service:", service);
						return service;
					}
					const result = service.name || service.title || service.service_name || service;
					console.log("🔧 DEBUG - Returning object config service result:", result);
					return result;
				}).filter(Boolean);
				console.log("🔧 DEBUG - Services from config.services:", serviceNames);
			}
			
			// If no services in config, try demo data
			if (serviceNames.length === 0 && demoData.services && Array.isArray(demoData.services)) {
				console.log("🔧 DEBUG - Found services in demoData.services:", demoData.services);
				serviceNames = [...demoData.services]; // Direct copy - this works
				console.log("🔧 DEBUG - Services copied successfully:", serviceNames);
			}
			
			// If no services in demo data, try demo_services table
			if (serviceNames.length === 0 && demoData.demo_services && Array.isArray(demoData.demo_services)) {
				serviceNames = demoData.demo_services.map((service: any) => service.service_name || service.name).filter(Boolean);
				console.log("🔧 DEBUG - Services from demoData.demo_services:", serviceNames);
			}
			
			// If still no services, use generic healthcare fallback
			if (serviceNames.length === 0) {
				serviceNames = [
					"General Consultation",
					"Specialized Treatment",
					"Diagnostic Services",
					"Preventive Care",
					"Follow-up Care"
				];
				console.log("🔧 DEBUG - Using generic fallback services:", serviceNames);
			}

		// Insurance providers - DYNAMIC
		let insuranceProviders: string[] = [];
		
		// Try to get from config first
		if (config.insurance_providers && Array.isArray(config.insurance_providers)) {
			insuranceProviders = config.insurance_providers.map((provider: any) => provider.name || provider).filter(Boolean);
			console.log("🔧 DEBUG - Insurance providers from config:", insuranceProviders);
		}
		
		// If no insurance providers in config, try demo data
		if (insuranceProviders.length === 0 && demoData.insurance_providers && Array.isArray(demoData.insurance_providers)) {
			insuranceProviders = demoData.insurance_providers.map((provider: any) => provider.name || provider).filter(Boolean);
			console.log("🔧 DEBUG - Insurance providers from demoData:", insuranceProviders);
		}
		
		// Fallback to common providers
		if (insuranceProviders.length === 0) {
			insuranceProviders = [
				"Aetna",
				"Blue Cross Blue Shield", 
				"Cigna",
				"UnitedHealth",
				"Humana",
				"Kaiser Permanente",
				"Anthem",
				"Molina Healthcare"
			];
			console.log("🔧 DEBUG - Using fallback insurance providers:", insuranceProviders);
		}

			// Get current booking state and data
			// CRITICAL FIX: Get booking state from multiple possible sources
			let currentBookingState = data.bookingState || webhookData.bookingState || originalContext?.webhookData?.bookingState || "initial";
			let currentBookingData: any = {};
			
			// CRITICAL FIX: Handle booking data from multiple possible sources
			// The data is stored in originalContext.webhookData.bookingData
			console.log("🔧 DEBUG - ALL DATA RECEIVED:", JSON.stringify(data, null, 2));
			console.log("🔧 DEBUG - ALL WEBHOOK DATA:", JSON.stringify(webhookData, null, 2));
			console.log("🔧 DEBUG - ALL ORIGINAL CONTEXT:", JSON.stringify(originalContext, null, 2));
			
			const bookingDataSource = data.bookingData || webhookData.bookingData || originalContext?.webhookData?.bookingData || "{}";
			console.log("🔧 DEBUG - Raw bookingDataSource:", bookingDataSource);
			console.log("🔧 DEBUG - Raw bookingDataSource type:", typeof bookingDataSource);
			console.log("🔧 DEBUG - originalContext?.webhookData?.bookingData:", originalContext?.webhookData?.bookingData);
			console.log("🔧 DEBUG - data.bookingData:", data.bookingData);
			console.log("🔧 DEBUG - webhookData.bookingData:", webhookData.bookingData);
			
			try {
				if (typeof bookingDataSource === 'string') {
					currentBookingData = JSON.parse(bookingDataSource);
				} else if (typeof bookingDataSource === 'object' && bookingDataSource !== null) {
					currentBookingData = bookingDataSource;
				} else {
					currentBookingData = {};
				}
			} catch (error) {
				console.log("🔧 DEBUG - Error parsing booking data:", error);
				currentBookingData = {};
			}

			// DEBUG: Log the current booking data
			console.log("🔧 DEBUG - Current Booking Data:", currentBookingData);
			console.log("🔧 DEBUG - Current Booking Data Keys:", Object.keys(currentBookingData));
			console.log("🔧 DEBUG - Current Booking State:", currentBookingState);
			console.log("🔧 DEBUG - Raw bookingData from input:", data.bookingData);
			console.log("🔧 DEBUG - Raw webhookData.bookingData:", webhookData.bookingData);
			console.log("🔧 DEBUG - All data keys:", Object.keys(data));
			console.log("🔧 DEBUG - All webhookData keys:", Object.keys(webhookData));

			// Get user input from multiple possible sources
			const userInput = data.message || webhookData.message || "";
			const userAction = data.action || webhookData.action || webhookData.userAction || "";

			// DEBUG: Log all incoming data to understand what's being sent
			console.log("🔧 DEBUG - Incoming data from frontend:");
			console.log("🔧 DEBUG - data.message:", data.message);
			console.log("🔧 DEBUG - data.action:", data.action);
			console.log("🔧 DEBUG - webhookData.message:", webhookData.message);
			console.log("🔧 DEBUG - webhookData.action:", webhookData.action);
			console.log("🔧 DEBUG - webhookData.userAction:", webhookData.userAction);
			console.log("🔧 DEBUG - Final userInput:", userInput);
			console.log("🔧 DEBUG - Final userAction:", userAction);

			// Determine the actual action from user input or button click
			let detectedAction = userAction;
			if (!detectedAction && userInput) {
				const inputLower = userInput.toLowerCase();
				if (inputLower.includes('new patient') || inputLower.includes('new_patient')) {
					detectedAction = 'new_patient';
				} else if (inputLower.includes('existing patient') || inputLower.includes('existing_patient')) {
					detectedAction = 'existing_patient';
				} else if (inputLower.startsWith('procedure_')) {
					// Handle procedure button clicks
					detectedAction = userInput;
				} else if (inputLower.startsWith('location_')) {
					// Handle location button clicks
					detectedAction = userInput;
				} else if (inputLower.startsWith('insurance_')) {
					// Handle insurance button clicks
					detectedAction = userInput;
				} else if (inputLower.startsWith('pain_')) {
					// Handle pain level button clicks
					detectedAction = userInput;
				} else if (inputLower.startsWith('timing_')) {
					// Handle appointment timing button clicks
					detectedAction = userInput;
				} else if (inputLower.startsWith('day_')) {
					// Handle day of week button clicks
					detectedAction = userInput;
				} else if (inputLower.startsWith('time_')) {
					// Handle time of day button clicks
					detectedAction = userInput;
				} else if (inputLower.startsWith('confirm_booking')) {
					// Handle confirmation button clicks
					detectedAction = userInput;
				} else if (inputLower.startsWith('edit_booking')) {
					// Handle edit booking button clicks
					detectedAction = userInput;
				}
			}
			
			// TEMPORARY: Hardcode action for testing dynamic day logic
			if (currentBookingState === 'collecting_appointment_timing' && userInput.toLowerCase().includes('next week')) {
				detectedAction = 'timing_next_week';
			}

			console.log("🚀 DETERMINISTIC BOOKING: Processing state:", currentBookingState);
			console.log("🚀 DETERMINISTIC BOOKING - Input:", userInput);
			console.log("🚀 DETERMINISTIC BOOKING - Action:", detectedAction);

			// STATE MACHINE LOGIC
			let response = "";
			let suggestedActions: any[] = [];
			let nextState = currentBookingState;
			
			// CRITICAL FIX: Properly merge incoming booking data with current data
			let updatedBookingData = { ...currentBookingData };
			
			// If we have incoming booking data, merge it with current data
			if (data.bookingData && typeof data.bookingData === 'object') {
				updatedBookingData = { ...updatedBookingData, ...data.bookingData };
			} else if (data.bookingData && typeof data.bookingData === 'string') {
				try {
					const incomingData = JSON.parse(data.bookingData);
					updatedBookingData = { ...updatedBookingData, ...incomingData };
				} catch (error) {
					console.log("🔧 DEBUG - Error parsing incoming booking data:", error);
				}
			}
			
			// Also check webhookData for booking data
			if (webhookData.bookingData && typeof webhookData.bookingData === 'object') {
				updatedBookingData = { ...updatedBookingData, ...webhookData.bookingData };
			} else if (webhookData.bookingData && typeof webhookData.bookingData === 'string') {
				try {
					const incomingData = JSON.parse(webhookData.bookingData);
					updatedBookingData = { ...updatedBookingData, ...incomingData };
				} catch (error) {
					console.log("🔧 DEBUG - Error parsing webhookData booking data:", error);
				}
			}
			
			console.log("🔧 DEBUG - Merged booking data:", updatedBookingData);
			console.log("🔧 DEBUG - Merged booking data keys:", Object.keys(updatedBookingData));
			console.log("🔧 DEBUG - Merged booking data values:", Object.values(updatedBookingData));
			let spellCheckResult: { corrected: string; suggestions: string[] } | null = null;
			
			// DEBUG: Log the initial state
			console.log("🔧 DEBUG - Starting state machine with:", {
				currentState: currentBookingState,
				userInput: userInput,
				detectedAction: detectedAction,
				initialBookingData: updatedBookingData,
				rawCurrentBookingData: currentBookingData
			});

			switch (currentBookingState) {
				case "initial":
					// CRITICAL FIX: Show proper greeting first, then ask for patient type
					response = formatResponse(getRandomVariation("welcome"), { agentName, companyName });
					suggestedActions = [
						{ text: "New Patient", action: "new_patient" },
						{ text: "Existing Patient", action: "existing_patient" }
					];
					nextState = "patient_type_selected";
					break;
					
				case "patient_type_selected":
					if (detectedAction === "new_patient" || userInput.toLowerCase().includes("new")) {
						const patientType = "new";
						response = getRandomVariation("nameRequest");
						suggestedActions = []; // NO BUTTONS - moved past initial state
						nextState = "collecting_name";
						updatedBookingData.patientType = patientType;
					} else if (detectedAction === "existing_patient" || userInput.toLowerCase().includes("existing")) {
						const patientType = "existing";
						response = getRandomVariation("nameRequest");
						suggestedActions = []; // NO BUTTONS - moved past initial state
						nextState = "collecting_name";
						updatedBookingData.patientType = patientType;
					} else {
						response = "I didn't quite catch that. Are you a new patient or an existing patient?";
						suggestedActions = [
							{ text: "New Patient", action: "new_patient" },
							{ text: "Existing Patient", action: "existing_patient" }
						];
					}
					break;
					
				case "collecting_name":
					console.log("🔧 NAME COLLECTION - Function called with userInput:", userInput);
					if (userInput && userInput.trim()) {
						const fullName = userInput.trim();
						console.log("🔧 NAME DEBUG - Original input:", fullName);
						
						// Apply spell check
						spellCheckResult = spellCheck(fullName, "name");
						const correctedName = spellCheckResult.corrected;
						console.log("🔧 NAME DEBUG - Spell check result:", spellCheckResult);
						console.log("🔧 NAME DEBUG - Corrected name:", correctedName);
						
						// Extract name from input
						const nameParts = correctedName.split(" ");
						console.log("🔧 NAME DEBUG - Name parts:", nameParts);
						console.log("🔧 NAME DEBUG - Name parts length:", nameParts.length);
						console.log("🔧 NAME DEBUG - Validate name result:", validateName(correctedName));
						
						if (nameParts.length >= 2 && validateName(correctedName)) {
							updatedBookingData.firstName = nameParts[0];
							updatedBookingData.lastName = nameParts.slice(1).join(" ");
							console.log("🔧 DEBUG - Stored name data:", { firstName: updatedBookingData.firstName, lastName: updatedBookingData.lastName });
							console.log("🔧 DEBUG - Updated booking data after name:", updatedBookingData);
							
							// ALWAYS show the corrected name in the response
							response = `Perfect! I've recorded your name as ${correctedName}. ${getRandomVariation("dobRequest")}`;
							console.log("🔧 DEBUG - Final response being sent:", response);
							
							suggestedActions = [];
							nextState = "collecting_dob";
						} else if (nameParts.length < 2) {
							console.log("🔧 NAME DEBUG - Not enough name parts");
							response = "I need both your first name and last name. Could you please provide your full name?";
							suggestedActions = [];
						} else {
							console.log("🔧 NAME DEBUG - Name validation failed");
							response = "I need a valid name. Please enter your first and last name using only letters, spaces, hyphens, and apostrophes.";
							suggestedActions = [];
						}
					} else {
						response = "I need your first name and last name to help you get scheduled. Could you please provide your full name?";
						suggestedActions = [];
					}
					break;
					
				case "collecting_dob":
					if (userInput && userInput.trim()) {
						const dob = userInput.trim();
						if (validateDOB(dob)) {
							updatedBookingData.dateOfBirth = dob;
							response = getRandomVariation("phoneRequest");
							suggestedActions = [];
							nextState = "collecting_phone";
						} else {
							response = "I need a valid date of birth. Please enter it in MM/DD/YYYY format (e.g., 12/25/1980)";
							suggestedActions = [];
						}
					} else {
						response = "I need your date of birth to help you get scheduled. Could you please provide it?";
						suggestedActions = [];
					}
					break;
					
				case "collecting_phone":
					if (userInput && userInput.trim()) {
						const phone = userInput.trim();
						if (validatePhone(phone)) {
							updatedBookingData.phone = phone;
							response = getRandomVariation("emailRequest");
							suggestedActions = [];
							nextState = "collecting_email";
						} else {
							response = "I need a valid phone number. Please enter your phone number with at least 10 digits (e.g., 555-123-4567 or 5551234567)";
							suggestedActions = [];
						}
					} else {
						response = "I need your phone number to help you get scheduled. Could you please provide it?";
						suggestedActions = [];
					}
					break;
					
				case "collecting_email":
					if (userInput && userInput.trim()) {
						const email = userInput.trim();
						if (validateEmail(email)) {
							updatedBookingData.email = email;
							response = getRandomVariation("appointmentTiming");
							suggestedActions = [
								{ text: "Next Available", action: "timing_next_available" },
								{ text: "Next Week", action: "timing_next_week" },
								{ text: "After 2 Weeks", action: "timing_after_2_weeks" },
								{ text: "Next Month", action: "timing_next_month" }
							];
							nextState = "collecting_appointment_timing";
						} else {
							response = "I need a valid email address. Please enter your email in the format: example@domain.com";
							suggestedActions = [];
						}
					} else {
						response = "I need your email address to help you get scheduled. Could you please provide it?";
						suggestedActions = [];
					}
					break;

				case "collecting_appointment_timing":
					if (detectedAction && detectedAction.startsWith("timing_")) {
						const timing = detectedAction.replace("timing_", "").replace(/_/g, " ");
						updatedBookingData.appointmentTiming = timing;
						response = `Perfect! I've selected ${timing} for you. ${getRandomVariation("dayOfWeek")}`;
						suggestedActions = [
							{ text: "Monday", action: "day_monday" },
							{ text: "Tuesday", action: "day_tuesday" },
							{ text: "Wednesday", action: "day_wednesday" },
							{ text: "Thursday", action: "day_thursday" },
							{ text: "Friday", action: "day_friday" },
							{ text: "Saturday", action: "day_saturday" },
							{ text: "Sunday", action: "day_sunday" }
						];
						nextState = "collecting_day_of_week";
					} else if (userInput && userInput.trim()) {
						const timing = userInput.trim();
						if (validateAppointmentTiming(timing)) {
							updatedBookingData.appointmentTiming = timing;
							response = getRandomVariation("dayOfWeek");
							suggestedActions = [
								{ text: "Monday", action: "day_monday" },
								{ text: "Tuesday", action: "day_tuesday" },
								{ text: "Wednesday", action: "day_wednesday" },
								{ text: "Thursday", action: "day_thursday" },
								{ text: "Friday", action: "day_friday" },
								{ text: "Saturday", action: "day_saturday" },
								{ text: "Sunday", action: "day_sunday" }
							];
							nextState = "collecting_day_of_week";
						} else {
							response = getRandomVariation("appointmentTimingError");
							suggestedActions = [
								{ text: "Next Available", action: "timing_next_available" },
								{ text: "Next Week", action: "timing_next_week" },
								{ text: "After 2 Weeks", action: "timing_after_2_weeks" },
								{ text: "Next Month", action: "timing_next_month" }
							];
						}
					} else {
						response = getRandomVariation("appointmentTimingRequest");
						suggestedActions = [
							{ text: "Next Available", action: "timing_next_available" },
							{ text: "Next Week", action: "timing_next_week" },
							{ text: "After 2 Weeks", action: "timing_after_2_weeks" },
							{ text: "Next Month", action: "timing_next_month" }
						];
					}
					break;

				case "collecting_day_of_week":
					// Get available days from Google Places data
					const allLocations = config?.locations || demoData?.locations || [];
					const allAvailableDays = new Set<string>();
					
					// DEBUG: Log what data is available
					console.log("🔧 DEBUG - Config locations:", config?.locations);
					console.log("🔧 DEBUG - Demo data locations:", demoData?.locations);
					console.log("🔧 DEBUG - All locations:", allLocations);
					console.log("🔧 DEBUG - All locations length:", allLocations.length);
					
					// Collect available days from all locations
					allLocations.forEach((location: any, index: number) => {
						console.log(`🔧 DEBUG - Location ${index}:`, location);
						console.log(`🔧 DEBUG - Location ${index} hours:`, location.hours);
						
						if (location.hours && Array.isArray(location.hours)) {
							location.hours.forEach((dayInfo: string) => {
								console.log(`🔧 DEBUG - Day info:`, dayInfo);
								if (dayInfo && typeof dayInfo === 'string') {
									// Extract day name from format "Monday: 9:00 AM – 5:00 PM"
									const dayMatch = dayInfo.match(/^([A-Za-z]+):/);
									if (dayMatch && dayMatch[1]) {
										const dayName = dayMatch[1];
										console.log(`🔧 DEBUG - Extracted day name:`, dayName);
										// Check if it's not "Closed" or similar
										if (!dayInfo.toLowerCase().includes('closed') && 
											!dayInfo.toLowerCase().includes('unavailable')) {
											allAvailableDays.add(dayName);
											console.log(`🔧 DEBUG - Added day:`, dayName);
										} else {
											console.log(`🔧 DEBUG - Skipped closed day:`, dayName);
										}
									}
								}
							});
						}
					});
					
					console.log("🔧 DEBUG - All available days before sorting:", Array.from(allAvailableDays));
					
					// Convert to array and sort by day order
					const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
					const availableDays = Array.from(allAvailableDays).sort((a, b) => 
						dayOrder.indexOf(a) - dayOrder.indexOf(b)
					);
					
					console.log("🔧 DEBUG - Available days after sorting:", availableDays);
					
					// Fallback to default business days if no specific data
					const finalAvailableDays = availableDays.length > 0 ? availableDays : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
					
					console.log("🔧 DEBUG - Final available days:", finalAvailableDays);
					
					if (detectedAction && detectedAction.startsWith("day_")) {
						const day = detectedAction.replace("day_", "");
						updatedBookingData.dayOfWeek = day;
						// Get business hours for the selected day from any location
						const businessHours = getBusinessHoursForDay(day, allLocations);
						updatedBookingData.businessHours = businessHours;
						response = `Perfect! I've selected ${day} for you. ${businessHours ? `Our hours are ${businessHours}.` : ''} ${getRandomVariation("timeOfDay")}`;
						suggestedActions = [
							{ text: "Morning (AM)", action: "time_morning" },
							{ text: "Afternoon (PM)", action: "time_afternoon" }
						];
						nextState = "collecting_time_of_day";
					} else if (userInput && userInput.trim()) {
						const day = userInput.trim();
						if (validateDayOfWeek(day)) {
							updatedBookingData.dayOfWeek = day;
							const businessHours = getBusinessHoursForDay(day, allLocations);
							updatedBookingData.businessHours = businessHours;
							response = getRandomVariation("timeOfDay");
							suggestedActions = [
								{ text: "Morning (AM)", action: "time_morning" },
								{ text: "Afternoon (PM)", action: "time_afternoon" }
							];
							nextState = "collecting_time_of_day";
						} else {
							response = getRandomVariation("dayOfWeekError");
							suggestedActions = finalAvailableDays.map(day => ({
								text: day,
								action: `day_${day.toLowerCase()}`
							}));
						}
					} else {
						response = getRandomVariation("dayOfWeekRequest");
						suggestedActions = finalAvailableDays.map(day => ({
							text: day,
							action: `day_${day.toLowerCase()}`
						}));
					}
					break;

				case "collecting_time_of_day":
					if (detectedAction && detectedAction.startsWith("time_")) {
						const time = detectedAction.replace("time_", "");
						updatedBookingData.timeOfDay = time;
						response = `Perfect! I've selected ${time} for you. ${getRandomVariation("locationSelection")}`;
						// DYNAMIC LOCATIONS - Use demo data or fallback
						if (locationNames && locationNames.length > 0) {
							suggestedActions = locationNames.map((location: string) => ({
								text: location,
								action: `location_${location.toLowerCase().replace(/\s+/g, '_')}`
							}));
						} else {
							suggestedActions = [];
						}
						nextState = "collecting_location";
					} else if (userInput && userInput.trim()) {
						const time = userInput.trim();
						if (validateTimeOfDay(time)) {
							updatedBookingData.timeOfDay = time;
							response = getRandomVariation("locationSelection");
							// DYNAMIC LOCATIONS - Use demo data or fallback
							if (locationNames && locationNames.length > 0) {
								suggestedActions = locationNames.map((location: string) => ({
									text: location,
									action: `location_${location.toLowerCase().replace(/\s+/g, '_')}`
								}));
							} else {
								suggestedActions = [];
							}
							nextState = "collecting_location";
						} else {
							response = getRandomVariation("timeOfDayError");
							suggestedActions = [
								{ text: "Morning (AM)", action: "time_morning" },
								{ text: "Afternoon (PM)", action: "time_afternoon" }
							];
						}
					} else {
						response = getRandomVariation("timeOfDayRequest");
						suggestedActions = [
							{ text: "Morning (AM)", action: "time_morning" },
							{ text: "Afternoon (PM)", action: "time_afternoon" }
						];
					}
					break;
					
				case "collecting_location":
					if (detectedAction && detectedAction.startsWith("location_")) {
						const location = detectedAction.replace("location_", "").replace(/_/g, " ");
						updatedBookingData.location = location;
						// Show confirmation without buttons, then move to next state
						response = `Perfect! I've selected ${location} for you. ${formatResponse(getRandomVariation("painLevel"), { location })}`;
						suggestedActions = [
							{ text: "1", action: "pain_1" },
							{ text: "2", action: "pain_2" },
							{ text: "3", action: "pain_3" },
							{ text: "4", action: "pain_4" },
							{ text: "5", action: "pain_5" },
							{ text: "6", action: "pain_6" },
							{ text: "7", action: "pain_7" },
							{ text: "8", action: "pain_8" },
							{ text: "9", action: "pain_9" },
							{ text: "10", action: "pain_10" }
						];
						nextState = "collecting_pain_level";
					} else if (userInput && userInput.trim()) {
						const location = userInput.trim();
						// Apply spell check
						const spellCheckResult = spellCheck(location, "location");
						const correctedLocation = spellCheckResult.corrected;
						
						if (validateLocation(correctedLocation)) {
							updatedBookingData.location = correctedLocation;
							response = formatResponse(getRandomVariation("painLevel"), { location: correctedLocation });
							suggestedActions = [
								{ text: "1", action: "pain_1" },
								{ text: "2", action: "pain_2" },
								{ text: "3", action: "pain_3" },
								{ text: "4", action: "pain_4" },
								{ text: "5", action: "pain_5" },
								{ text: "6", action: "pain_6" },
								{ text: "7", action: "pain_7" },
								{ text: "8", action: "pain_8" },
								{ text: "9", action: "pain_9" },
								{ text: "10", action: "pain_10" }
							];
							nextState = "collecting_pain_level";
						} else {
							response = "I need a valid location. Please enter a location name with at least 3 characters using only letters, spaces, commas, periods, and hyphens.";
							suggestedActions = [];
						}
					} else {
						// DYNAMIC LOCATIONS - Use demo data or fallback
						if (locationNames && locationNames.length > 0) {
							response = `Which location would you prefer? We have ${locationNames.join(', ')}.`;
							suggestedActions = locationNames.map((location: string) => ({
								text: location,
								action: `location_${location.toLowerCase().replace(/\s+/g, '_')}`
							}));
						} else {
							response = "Which location would you prefer? Please let me know your preferred location.";
							suggestedActions = [];
						}
					}
					break;
					
				case "collecting_pain_level":
					if (detectedAction && detectedAction.startsWith("pain_")) {
						const painLevel = detectedAction.replace("pain_", "");
						updatedBookingData.painLevel = painLevel;
						// Show confirmation without buttons, then move to next state
						response = `Perfect! I've recorded your pain level as ${painLevel}. ${getRandomVariation("symptoms")}`;
						suggestedActions = [];
						nextState = "collecting_symptoms";
					} else if (userInput && userInput.trim()) {
						// Try to extract pain level from text
						const painMatch = userInput.match(/(\d+)/);
						if (painMatch && validatePainLevel(painMatch[1])) {
							updatedBookingData.painLevel = painMatch[1];
							response = getRandomVariation("symptoms");
							suggestedActions = [];
							nextState = "collecting_symptoms";
						} else {
							response = "I need to know how you're feeling on a scale of 1 to 10. Could you please provide a number between 1 and 10?";
							suggestedActions = [
								{ text: "1", action: "pain_1" },
								{ text: "2", action: "pain_2" },
								{ text: "3", action: "pain_3" },
								{ text: "4", action: "pain_4" },
								{ text: "5", action: "pain_5" },
								{ text: "6", action: "pain_6" },
								{ text: "7", action: "pain_7" },
								{ text: "8", action: "pain_8" },
								{ text: "9", action: "pain_9" },
								{ text: "10", action: "pain_10" }
							];
						}
					} else {
						response = "I need to know how you're feeling on a scale of 1 to 10. Could you please provide a number between 1 and 10?";
						suggestedActions = [
							{ text: "1", action: "pain_1" },
							{ text: "2", action: "pain_2" },
							{ text: "3", action: "pain_3" },
							{ text: "4", action: "pain_4" },
							{ text: "5", action: "pain_5" },
							{ text: "6", action: "pain_6" },
							{ text: "7", action: "pain_7" },
							{ text: "8", action: "pain_8" },
							{ text: "9", action: "pain_9" },
							{ text: "10", action: "pain_10" }
						];
					}
					break;
					
				case "collecting_symptoms":
					if (userInput && userInput.trim()) {
						const symptoms = userInput.trim();
						// Apply spell check
						const spellCheckResult = spellCheck(symptoms, "symptoms");
						const correctedSymptoms = spellCheckResult.corrected;
						
						if (validateSymptoms(correctedSymptoms)) {
							updatedBookingData.symptoms = correctedSymptoms;
							response = getRandomVariation("procedure");
							console.log("🔧 DEBUG - Creating procedure buttons with serviceNames:", serviceNames);
							console.log("🔧 DEBUG - serviceNames length:", serviceNames.length);
							suggestedActions = serviceNames.map(service => ({
								text: service,
								action: `procedure_${service.toLowerCase().replace(/\s+/g, '_')}`
							}));
							console.log("🔧 DEBUG - Created suggestedActions:", suggestedActions);
							nextState = "collecting_procedure";
						} else {
							response = "I need a valid description of your symptoms. Please provide at least 5 characters describing your symptoms using only letters, spaces, commas, periods, and hyphens.";
							suggestedActions = [];
						}
					} else {
						response = "Could you please tell me about your symptoms? This helps us understand how to best help you.";
						suggestedActions = [];
					}
					break;
					
				case "collecting_procedure":
					if (detectedAction && detectedAction.startsWith("procedure_")) {
						const procedure = detectedAction.replace("procedure_", "").replace(/_/g, " ");
						updatedBookingData.procedure = procedure;
						// Show confirmation without buttons, then move to next state
						response = `Perfect! I've selected ${procedure} for you. ${getRandomVariation("insurance")}`;
						suggestedActions = insuranceProviders.map(provider => ({
							text: provider,
							action: `insurance_${provider.toLowerCase().replace(/\s+/g, '_')}`
						}));
						nextState = "collecting_insurance";
					} else if (userInput && userInput.trim()) {
						const procedure = userInput.trim();
						// Apply spell check
						const spellCheckResult = spellCheck(procedure, "procedure");
						const correctedProcedure = spellCheckResult.corrected;
						
						if (validateProcedure(correctedProcedure)) {
							updatedBookingData.procedure = correctedProcedure;
							response = getRandomVariation("insurance");
							suggestedActions = insuranceProviders.map(provider => ({
								text: provider,
								action: `insurance_${provider.toLowerCase().replace(/\s+/g, '_')}`
							}));
							nextState = "collecting_insurance";
						} else {
							response = "I need a valid procedure or treatment name. Please enter at least 3 characters using only letters, spaces, commas, periods, and hyphens.";
							suggestedActions = [];
						}
					} else {
						response = "What procedure or treatment are you interested in? We offer several services to help you.";
						suggestedActions = serviceNames.map(service => ({
							text: service,
							action: `procedure_${service.toLowerCase().replace(/\s+/g, '_')}`
						}));
					}
					break;
					
				case "collecting_insurance":
					if (detectedAction && detectedAction.startsWith("insurance_")) {
						const insurance = detectedAction.replace("insurance_", "").replace(/_/g, " ");
						updatedBookingData.insurance = insurance;
						// Show confirmation without buttons, then move to next state
						response = `Perfect! I've selected ${insurance} for you. ${getRandomVariation("policyHolder")}`;
						suggestedActions = [];
						nextState = "collecting_policy_holder";
					} else if (userInput && userInput.trim()) {
						const insurance = userInput.trim();
						// Apply spell check
						const spellCheckResult = spellCheck(insurance, "insurance");
						const correctedInsurance = spellCheckResult.corrected;
						
						if (validateInsurance(correctedInsurance)) {
							updatedBookingData.insurance = correctedInsurance;
							response = getRandomVariation("policyHolder");
							suggestedActions = [];
							nextState = "collecting_policy_holder";
						} else {
							response = "I need a valid insurance provider name. Please enter at least 3 characters using only letters, spaces, commas, periods, and hyphens.";
							suggestedActions = [];
						}
					} else {
						response = "What insurance do you have? We accept most major insurance providers.";
						suggestedActions = insuranceProviders.map(provider => ({
							text: provider,
							action: `insurance_${provider.toLowerCase().replace(/\s+/g, '_')}`
						}));
					}
					break;
					
				case "collecting_policy_holder":
					if (userInput && userInput.trim()) {
						const policyHolder = userInput.trim();
						if (validatePolicyHolder(policyHolder)) {
							updatedBookingData.policyHolder = policyHolder;
							response = getRandomVariation("policyNumber");
							suggestedActions = [];
							nextState = "collecting_policy_number";
						} else {
							response = "I need a valid policy holder name. Please enter at least 2 characters using only letters, spaces, hyphens, and apostrophes.";
							suggestedActions = [];
						}
					} else {
						response = "I need the policy holder's name to help verify your insurance benefits. Could you please provide it?";
						suggestedActions = [];
					}
					break;
					
				case "collecting_policy_number":
					if (userInput && userInput.trim()) {
						const policyNumber = userInput.trim();
						if (validatePolicyNumber(policyNumber)) {
							updatedBookingData.policyNumber = policyNumber;
							response = getRandomVariation("groupNumber");
							suggestedActions = [];
							nextState = "collecting_group_number";
						} else {
							response = "I need a valid policy number. Please enter your policy number (at least 6 characters, letters and numbers only)";
							suggestedActions = [];
						}
					} else {
						response = "I need your policy number to help verify your insurance benefits. Could you please provide it?";
						suggestedActions = [];
					}
					break;
					
				case "collecting_group_number":
					if (userInput && userInput.trim()) {
						const groupNumber = userInput.trim();
						if (validateGroupNumber(groupNumber)) {
							updatedBookingData.groupNumber = groupNumber;
							response = "Thank you for providing your insurance information. Is there any <span style=\"font-weight: bold; color: orange;\">additional information</span> you'd like to share with us? This helps us prepare for your visit.";
							suggestedActions = [];
							nextState = "collecting_additional_info";
						} else {
							response = "I need a valid group number. Please enter your <span style=\"font-weight: bold; color: orange;\">Group Number</span> (can be all numbers, all letters, or a mix of letters and numbers, at least 3 characters)";
							suggestedActions = [];
						}
					} else {
						response = "I need your group number to help verify your insurance benefits. Could you please provide it?";
						suggestedActions = [];
					}
					break;
					
				case "collecting_additional_info":
					if (userInput && userInput.trim()) {
						updatedBookingData.additionalInfo = userInput.trim();
					}
					
					// DEBUG: Log the booking data before creating summary
					console.log("🔧 DEBUG - Summary Booking Data:", updatedBookingData);
					console.log("🔧 DEBUG - Summary Booking Data Keys:", Object.keys(updatedBookingData));
					console.log("🔧 DEBUG - Summary Booking Data Values:", Object.values(updatedBookingData));
					
					response = getRandomVariation("confirmation");
					response += "\n\nHere's what I have:";
					
					// Helper function to highlight missing fields - FIXED to properly check for data
					const highlightIfMissing = (value: string | undefined | null, fieldName: string): string => {
						if (!value || value === '' || value === 'Not provided' || value === undefined || value === null) {
							return `<span style="font-weight: bold; color: orange;">${fieldName}</span>: Not provided`;
						}
						return `${fieldName}: ${value}`;
					};
					
					// Personal Information Section - REMOVED EMOJIS
					response += "\n\n**Personal Information**";
					const fullName = updatedBookingData.firstName && updatedBookingData.lastName
						? `${updatedBookingData.firstName} ${updatedBookingData.lastName}`
						: (updatedBookingData.firstName || updatedBookingData.lastName || '');
					response += `\n• ${highlightIfMissing(fullName, 'Name')}`;
					response += `\n• ${highlightIfMissing(updatedBookingData.dateOfBirth, 'Date of Birth')}`;
					
					// Contact Details Section - REMOVED EMOJIS
					response += "\n\n**Contact Details**";
					response += `\n• ${highlightIfMissing(updatedBookingData.phone, 'Phone')}`;
					response += `\n• ${highlightIfMissing(updatedBookingData.email, 'Email')}`;
					
					// Appointment Preferences Section - REMOVED EMOJIS
					response += "\n\n**Appointment Preferences**";
					response += `\n• ${highlightIfMissing(updatedBookingData.appointmentTiming, 'Preferred Timing')}`;
					response += `\n• ${highlightIfMissing(updatedBookingData.dayOfWeek, 'Preferred Day')}`;
					response += `\n• ${highlightIfMissing(updatedBookingData.timeOfDay, 'Preferred Time')}`;
					response += `\n• ${highlightIfMissing(updatedBookingData.location, 'Preferred Location')}`;
					response += `\n• ${highlightIfMissing(updatedBookingData.businessHours, 'Business Hours')}`;
					
					// Medical Information Section - REMOVED EMOJIS
					response += "\n\n**Medical Information**";
					response += `\n• ${highlightIfMissing(updatedBookingData.painLevel, 'Pain Level')}/10`;
					response += `\n• ${highlightIfMissing(updatedBookingData.symptoms, 'Symptoms')}`;
					response += `\n• ${highlightIfMissing(updatedBookingData.procedure, 'Procedure/Treatment')}`;
					
					// Insurance Details Section - REMOVED EMOJIS
					response += "\n\n**Insurance Information**";
					response += `\n• ${highlightIfMissing(updatedBookingData.insurance, 'Insurance Provider')}`;
					response += `\n• ${highlightIfMissing(updatedBookingData.policyHolder, 'Policy Holder')}`;
					response += `\n• ${highlightIfMissing(updatedBookingData.policyNumber, 'Policy Number')}`;
					response += `\n• ${highlightIfMissing(updatedBookingData.groupNumber, 'Group Number')}`;
					
					// Additional Information Section - REMOVED EMOJIS
					response += "\n\n**Additional Information**";
					if (updatedBookingData.additionalInfo) {
						response += `\n• ${updatedBookingData.additionalInfo}`;
					}
					else {
						response += `\n• No additional information provided`;
					}
					response += "\n\nIs this information correct?";
					suggestedActions = [
						{ text: "Yes, that's correct", action: "confirm_booking" },
						{ text: "No, I need to make changes", action: "edit_booking" }
					];
					nextState = "confirmation";
					break;
					
				case "confirmation":
					if (detectedAction === "confirm_booking" || userInput.toLowerCase().includes("yes") || userInput.toLowerCase().includes("correct")) {
						response = getRandomVariation("completion");
						suggestedActions = [];
						nextState = "complete";
					} else if (detectedAction === "edit_booking" || userInput.toLowerCase().includes("no") || userInput.toLowerCase().includes("change")) {
						response = "I understand you'd like to make changes. Let me know what information needs to be corrected.";
						suggestedActions = [];
						nextState = "collecting_additional_info";
					} else {
						response = "Is this information correct?";
						suggestedActions = [
							{ text: "Yes, that's correct", action: "confirm_booking" },
							{ text: "No, I need to make changes", action: "edit_booking" }
						];
					}
					break;
					
				default:
					response = "I'm here to help you book your appointment. Let's start fresh. Are you a new patient or an existing patient?";
					suggestedActions = [
						{ text: "New Patient", action: "new_patient" },
						{ text: "Existing Patient", action: "existing_patient" }
					];
					nextState = "patient_type_selected";
					break;
			}

			// CRITICAL: Preserve the original_context structure that downstream agents expect
			const preservedContext = {
				demoData: originalContext?.demoData || data,
				webhookData: originalContext?.webhookData || {
					message: userInput,
					bookingState: nextState,
					bookingData: JSON.stringify(updatedBookingData),
					userAction: detectedAction,
					timestamp: new Date().toISOString()
				},
				fullContext: originalContext?.fullContext || {}
			};

			// RETURN RESPONSE
			returnData.push({
				json: {
					// Pass through all original data
					...data,
					
					// Deterministic response
					agent_response: response,
					suggestedActions: suggestedActions,
					bookingState: nextState,
					bookingData: JSON.stringify(updatedBookingData),
					conversation_stage: nextState === "complete" ? "booking_complete" : "booking_in_progress",
					timestamp: new Date().toISOString(),
					
					// CRITICAL FIX: Set nextAgent for workflow routing
					nextAgent: nextState === "complete" ? "Google Calendar Condition" : "BookingAgent",
					
					// Business context
					demoId: demoId,
					companyName: companyName,
					agentName: agentName,
					serviceNames: serviceNames,
					insuranceProviders: insuranceProviders,
					locationNames: locationNames,
					
					// CRITICAL: Preserve the original_context structure
					original_context: preservedContext,
					
					// Debug info
					debug_info: {
						currentState: nextState,
						userInput: userInput,
						userAction: detectedAction,
						hasButtons: suggestedActions.length > 0,
						llmUsed: false, // Deterministic approach - no LLM
						deterministic: true,
						serviceNames: serviceNames,
						insuranceProviders: insuranceProviders
					}
				},
			});
		}

		return [returnData];
	}
} 