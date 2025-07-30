"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreludeAgent = void 0;
async function handleOnboarding(onboardingData) {
    try {
        const message = onboardingData.message ? onboardingData.message.trim() : "";
        const companyName = onboardingData.company_name || "our practice";
        const agentName = onboardingData.agent_name || "your care coordinator";
        const category = onboardingData.category || onboardingData.industry || "your needs";
        const userType = onboardingData.userType || 'new_customer';
        let response = "";
        let suggestedActions = [];
        let intent = "general";
        let nextAgent = "ComposerAgent";
        if (message) {
            const lowerMsg = message.toLowerCase();
            // Clinical intent detection
            if (lowerMsg.includes("pain") ||
                lowerMsg.includes("hurt") ||
                lowerMsg.includes("ache") ||
                lowerMsg.includes("back") ||
                lowerMsg.includes("neck") ||
                lowerMsg.includes("shoulder") ||
                lowerMsg.includes("spine") ||
                lowerMsg.includes("injury") ||
                lowerMsg.includes("discomfort") ||
                lowerMsg.includes("symptom")) {
                intent = "clinical";
                nextAgent = "MedleyAgent";
                response = "I'm so sorry to hear you're experiencing discomfort. Your comfort and well-being are very important to us. Would you like to schedule an appointment with Dr. Hassan, or learn more about treatment options?";
                suggestedActions = [
                    { label: "Book Appointment", value: "I want to book an appointment" },
                    { label: "Treatment Options", value: "Tell me about treatment options" },
                    { label: "Speak to Care Coordinator", value: "I want to speak to a care coordinator" }
                ];
            }
            else if (lowerMsg.includes("appointment") ||
                lowerMsg.includes("book") ||
                lowerMsg.includes("schedule") ||
                lowerMsg.includes("reschedule") ||
                lowerMsg.includes("new patient") ||
                lowerMsg.includes("existing patient") ||
                lowerMsg.includes("make appointment") ||
                lowerMsg.includes("set up appointment") ||
                lowerMsg.includes("book appointment") ||
                lowerMsg.includes("schedule appointment") ||
                lowerMsg.includes("cancel appointment") ||
                lowerMsg.includes("change appointment") ||
                lowerMsg.includes("appointment time") ||
                lowerMsg.includes("available time") ||
                lowerMsg.includes("next available")) {
                intent = "appointment";
                nextAgent = "BookingAgent";
                response = `Hi there! I'm ${agentName}, and I'm here to help you get the care you need at ${companyName}. I understand this might be a difficult time for you, and I want to make this process as gentle and smooth as possible. To get started, could you please let me know if you're a:`;
                suggestedActions = [
                    { label: "New Patient", value: "new_patient" },
                    { label: "Existing Patient", value: "existing_patient" }
                ];
            }
            else if (lowerMsg.includes("insurance") ||
                lowerMsg.includes("coverage") ||
                lowerMsg.includes("verify")) {
                intent = "insurance";
                nextAgent = "MedleyAgent";
                response = "I can help you with insurance verification. Would you like to check your coverage or upload your insurance card?";
                suggestedActions = [
                    { label: "Verify Coverage", value: "Verify insurance" },
                    { label: "Upload Card", value: "Upload insurance card" },
                    { label: "Check Accepted Plans", value: "What insurance do you accept?" }
                ];
            }
            else if (lowerMsg.includes("location") ||
                lowerMsg.includes("address") ||
                lowerMsg.includes("where")) {
                intent = "location";
                nextAgent = "HarmonyAgent";
                response = "I can help you find our locations and get directions. We have offices in Old Bridge, Jersey City, and South Plainfield. Which location would you prefer?";
                suggestedActions = [
                    { label: "Old Bridge", value: "Old Bridge location" },
                    { label: "Jersey City", value: "Jersey City location" },
                    { label: "South Plainfield", value: "South Plainfield location" }
                ];
            }
            else if (lowerMsg.includes("hours") ||
                lowerMsg.includes("schedule") ||
                lowerMsg.includes("when")) {
                intent = "hours";
                nextAgent = "HarmonyAgent";
                response = "Our offices are open Monday through Friday from 8:00 AM to 5:00 PM. We're closed on weekends and major holidays. When would you like to schedule your appointment?";
                suggestedActions = [
                    { label: "Book Appointment", value: "I want to book an appointment" },
                    { label: "Ask About Hours", value: "Tell me more about your hours" }
                ];
            }
            else {
                // General fallback
                intent = "general";
                nextAgent = "ComposerAgent";
                response = `Welcome to ${companyName}! I'm ${agentName}, and I'm here to help you with any questions you might have about our services, appointments, or anything else. How can I assist you today?`;
                suggestedActions = [
                    { label: "Book Appointment", value: "book_appointment" },
                    { label: "Learn About Services", value: "learn_services" },
                    { label: "Contact Information", value: "contact_info" },
                    { label: "Office Hours", value: "office_hours" }
                ];
            }
        }
        else {
            // No user message yet, send a warm greeting
            intent = "welcome";
            nextAgent = "HarmonyAgent";
            response = `Welcome to ${companyName}! I'm ${agentName}. How can I help you with ${category}?`;
            suggestedActions = [
                { label: "Book Appointment", value: "I want to book an appointment" },
                { label: "Ask a Question", value: "I have a question" },
                { label: "Learn About Services", value: "Tell me about your services" }
            ];
        }
        // Personalize response based on user type
        const personalization = {
            userType,
            industry: onboardingData.industry || 'healthcare',
            entryPoint: onboardingData.entryPoint || 'website',
            companyName,
            agentName,
        };
        return {
            status: 'onboarded',
            intent,
            message: response,
            suggestedActions,
            timestamp: new Date().toISOString(),
            nextAgent,
            collectedData: onboardingData.userData || {},
            personalization,
        };
    }
    catch (error) {
        throw new Error(`Onboarding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function collectInitialData(initialData) {
    try {
        const requiredFields = ['name', 'email', 'phone'];
        const collected = {};
        const missing = [];
        // Check what data is already available
        requiredFields.forEach(field => {
            if (initialData[field] && initialData[field] !== '') {
                collected[field] = initialData[field];
            }
            else {
                missing.push(field);
            }
        });
        // Calculate completion percentage
        const completion = requiredFields.length > 0 ?
            ((requiredFields.length - missing.length) / requiredFields.length) * 100 : 100;
        const recommendations = missing.length > 0 ?
            [`Please provide: ${missing.join(', ')}`] :
            ['All required information collected successfully'];
        return {
            status: 'collected',
            data: initialData,
            fields: Object.keys(initialData),
            completion,
            missing,
            recommendations,
        };
    }
    catch (error) {
        throw new Error(`Data collection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function setupFirstTouch(firstTouchData) {
    try {
        const companyName = firstTouchData.company_name || "our practice";
        const userType = firstTouchData.userType || 'new_customer';
        const industry = firstTouchData.industry || 'healthcare';
        const welcomeMessage = `Welcome to ${companyName}! I'm here to help you get started with your personalized experience.`;
        const journeyConfig = {
            userType,
            industry,
            entryPoint: firstTouchData.entryPoint || 'website',
            communicationStyle: firstTouchData.communication_style || 'professional',
            preferredContact: firstTouchData.preferred_contact || 'email',
            journeySteps: [
                'welcome',
                'data_collection',
                'service_introduction',
                'appointment_scheduling',
                'follow_up',
            ],
        };
        const nextSteps = [
            'Complete your profile',
            'Learn about our services',
            'Schedule your first appointment',
            'Set up your preferences',
        ];
        return {
            status: 'setup',
            data: firstTouchData,
            welcomeMessage,
            journeyConfig,
            nextSteps,
        };
    }
    catch (error) {
        throw new Error(`First touch setup failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
class PreludeAgent {
    constructor() {
        this.description = {
            displayName: 'PreludeAgent',
            name: 'preludeAgent',
            group: ['transform'],
            version: 1,
            description: 'Onboarding and first-touch experience specialist. Welcomes users and sets up personalized journeys.',
            defaults: {
                name: 'PreludeAgent',
            },
            icon: 'file:prelude.svg',
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    options: [
                        {
                            name: 'Handle Onboarding',
                            value: 'onboarding',
                            description: 'Handle user onboarding with intent detection and routing',
                        },
                        {
                            name: 'Collect Initial Data',
                            value: 'collect',
                            description: 'Collect essential user information and preferences',
                        },
                        {
                            name: 'Setup First Touch',
                            value: 'firstTouch',
                            description: 'Setup personalized user journey and preferences',
                        },
                    ],
                    default: 'onboarding',
                    description: 'The operation to perform',
                },
                {
                    displayName: 'Onboarding Data (JSON)',
                    name: 'onboardingData',
                    type: 'json',
                    default: '{}',
                    displayOptions: {
                        show: {
                            operation: ['onboarding'],
                        },
                    },
                    description: 'User message and context for onboarding',
                },
                {
                    displayName: 'Initial Data (JSON)',
                    name: 'initialData',
                    type: 'json',
                    default: '{}',
                    displayOptions: {
                        show: {
                            operation: ['collect'],
                        },
                    },
                    description: 'User information to collect and validate',
                },
                {
                    displayName: 'First Touch Data (JSON)',
                    name: 'firstTouchData',
                    type: 'json',
                    default: '{}',
                    displayOptions: {
                        show: {
                            operation: ['firstTouch'],
                        },
                    },
                    description: 'Data for setting up personalized user journey',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        // FIXED: Process only the first item to prevent duplicates
        if (items.length === 0) {
            return [[]];
        }
        // Process only the first item
        const firstItem = items[0];
        const returnData = [];
        try {
            const operation = this.getNodeParameter('operation', 0);
            let result;
            switch (operation) {
                case 'onboarding':
                    const onboardingData = this.getNodeParameter('onboardingData', 0);
                    const parsedOnboardingData = typeof onboardingData === 'string'
                        ? JSON.parse(onboardingData)
                        : onboardingData;
                    result = await handleOnboarding(parsedOnboardingData);
                    break;
                case 'collect':
                    const initialData = this.getNodeParameter('initialData', 0);
                    const parsedInitialData = typeof initialData === 'string'
                        ? JSON.parse(initialData)
                        : initialData;
                    result = await collectInitialData(parsedInitialData);
                    break;
                case 'firstTouch':
                    const firstTouchData = this.getNodeParameter('firstTouchData', 0);
                    const parsedFirstTouchData = typeof firstTouchData === 'string'
                        ? JSON.parse(firstTouchData)
                        : firstTouchData;
                    result = await setupFirstTouch(parsedFirstTouchData);
                    break;
                default:
                    throw new Error(`Operation ${operation} not supported`);
            }
            // Preserve all input data and merge with result
            const inputData = firstItem.json;
            // CRITICAL: Preserve the original_context structure that downstream agents expect
            const originalContext = inputData.original_context;
            const preservedContext = {
                demoData: (originalContext === null || originalContext === void 0 ? void 0 : originalContext.demoData) || inputData,
                webhookData: (originalContext === null || originalContext === void 0 ? void 0 : originalContext.webhookData) || {
                    message: inputData.message || "",
                    bookingState: inputData.bookingState || "",
                    bookingData: inputData.bookingData || "{}",
                    userAction: inputData.userAction || "",
                    timestamp: new Date().toISOString()
                },
                fullContext: (originalContext === null || originalContext === void 0 ? void 0 : originalContext.fullContext) || {}
            };
            returnData.push({
                json: {
                    ...inputData,
                    operation,
                    ...result,
                    agent: 'PreludeAgent',
                    timestamp: new Date().toISOString(),
                    // CRITICAL: Preserve the original_context structure
                    original_context: preservedContext,
                },
            });
        }
        catch (error) {
            // CRITICAL: Preserve the original_context structure even in error cases
            const originalContext = firstItem.json.original_context;
            const preservedContext = {
                demoData: (originalContext === null || originalContext === void 0 ? void 0 : originalContext.demoData) || firstItem.json,
                webhookData: (originalContext === null || originalContext === void 0 ? void 0 : originalContext.webhookData) || {
                    message: firstItem.json.message || "",
                    bookingState: firstItem.json.bookingState || "",
                    bookingData: firstItem.json.bookingData || "{}",
                    userAction: firstItem.json.userAction || "",
                    timestamp: new Date().toISOString()
                },
                fullContext: (originalContext === null || originalContext === void 0 ? void 0 : originalContext.fullContext) || {}
            };
            returnData.push({
                json: {
                    operation: this.getNodeParameter('operation', 0),
                    error: error instanceof Error ? error.message : 'Unknown error',
                    agent: 'PreludeAgent',
                    timestamp: new Date().toISOString(),
                    // CRITICAL: Preserve the original_context structure even in error cases
                    original_context: preservedContext,
                },
            });
        }
        return [returnData];
    }
}
exports.PreludeAgent = PreludeAgent;
