"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MedleyAgent = void 0;
class MedleyAgent {
    constructor() {
        this.description = {
            displayName: 'MedleyAgent',
            name: 'medleyAgent',
            icon: 'file:medley.svg',
            group: ['transform'],
            version: 1,
            description: 'Universal clinical/medical logic and demo responses with dynamic context awareness.',
            defaults: {
                name: 'MedleyAgent',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Clinical Data',
                    name: 'clinicalData',
                    type: 'json',
                    default: '{}',
                    description: 'Data for clinical processing',
                },
                {
                    displayName: 'Dynamic Context',
                    name: 'dynamicContext',
                    type: 'json',
                    default: '{}',
                    description: 'Dynamic context from workflow (company, specialists, locations, etc.)',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        // Universal empathy templates for fallback
        const responseTemplates = [
            "Thank you for trusting us with your {symptom}. We're here to help you feel better.",
            "We understand how {symptom} can affect your daily life. Let's work together to address this.",
            "You're not alone in facing {symptom}. Our team is dedicated to helping you regain your quality of life.",
            "Your comfort and well-being are our top priorities. Let's address your {symptom} together.",
            "It takes courage to reach out about your {symptom}. We're honored to be part of your care journey.",
            "We truly care about your health. Thank you for sharing your experience with {symptom}.",
            "Our team is here to listen, support, and guide you through your {symptom}.",
            "Thank you for allowing us to be part of your healing process. We'll help with your {symptom}.",
            "We understand how challenging {symptom} can be. Let's talk about how we can help you feel better.",
            "Your trust means a lot to us. Together, we'll find the best way to manage your {symptom}."
        ];
        // Body parts and symptoms for extraction (same as chat API)
        const BODY_PARTS = [
            'back', 'neck', 'shoulder', 'knee', 'hip', 'foot', 'ankle', 'wrist', 'elbow', 'leg', 'arm', 'hand', 'spine', 'joint', 'muscle', 'head', 'headache'
        ];
        const SYMPTOMS = [
            'pain', 'ache', 'soreness', 'stiffness', 'discomfort', 'tightness', 'injury', 'hurt', 'numbness', 'weakness', 'tingling', 'swelling', 'cramp', 'spasm', 'burning', 'throbbing', 'tenderness', 'fatigue', 'trouble', 'bothering', 'uncomfortable', 'symptom', 'issue', 'problem'
        ];
        // Function to extract symptoms and body parts
        function extractSymptomsAndBodyParts(text) {
            if (!text || typeof text !== 'string')
                return null;
            const lowerText = text.toLowerCase();
            const foundSymptoms = [];
            const foundBodyParts = [];
            // Check for symptoms
            SYMPTOMS.forEach(symptom => {
                if (lowerText.includes(symptom)) {
                    foundSymptoms.push(symptom);
                }
            });
            // Check for body parts
            BODY_PARTS.forEach(part => {
                if (lowerText.includes(part)) {
                    foundBodyParts.push(part);
                }
            });
            // Combine found symptoms and body parts
            const combined = [...foundBodyParts, ...foundSymptoms];
            return combined.length > 0 ? combined.join(' ') : null;
        }
        function getEmpatheticResponse(symptom) {
            const template = responseTemplates[Math.floor(Math.random() * responseTemplates.length)];
            return template.replace("{symptom}", symptom);
        }
        function getIndustrySpecificWelcome(agentName, companyName, industry) {
            const welcomeMessages = {
                healthcare: `Hi there! I'm ${agentName} from ${companyName}. I'm here to help you get the care you need. What brings you in today?`,
                automotive: `Hi there! I'm ${agentName} from ${companyName}. I'm here to help you with your vehicle needs. What can I help you with today?`,
                legal: `Hi there! I'm ${agentName} from ${companyName}. I'm here to help you with your legal needs. What brings you in today?`,
                real_estate: `Hi there! I'm ${agentName} from ${companyName}. I'm here to help you with your real estate needs. What can I help you with today?`,
                default: `Hi there! I'm ${agentName} from ${companyName}. I'm here to help you. What can I assist you with today?`
            };
            return welcomeMessages[industry] || welcomeMessages.default;
        }
        for (let i = 0; i < items.length; i++) {
            const data = items[i].json;
            // FIXED: Check if user is in booking flow - prevent duplicate responses
            const bookingState = data.bookingState || "";
            const isInBookingFlow = bookingState && bookingState !== "" && bookingState !== "initial";
            console.log('=== MEDLEYAGENT - CHECK BOOKING STATE ===');
            console.log('Booking state:', bookingState);
            console.log('Is in booking flow:', isInBookingFlow);
            if (isInBookingFlow) {
                console.log('⏭️ User is in booking flow - SKIP MedleyAgent response');
                // Return empty response to prevent duplicate responses
                returnData.push({
                    json: {
                        agent_response: "", // Empty response to prevent duplicate
                        suggestedActions: [],
                        skipResponse: true, // Flag to indicate no response should be sent
                        bookingState: bookingState,
                        bookingData: data.bookingData || "{}",
                        // Preserve original context
                        original_context: data.original_context || {}
                    },
                });
                continue; // Skip to next item
            }
            console.log('✅ User not in booking flow - proceed with MedleyAgent');
            // Extract context from the workflow with proper type guards
            const companyName = (data.company && typeof data.company === 'object' && 'name' in data.company) ? data.company.name :
                (typeof data.companyName === 'string' ? data.companyName : "our practice");
            const agentName = (typeof data.agentName === 'string' ? data.agentName : "Sarah");
            const industry = (typeof data.industry === 'string' ? data.industry :
                (data.company && typeof data.company === 'object' && 'industry' in data.company) ? data.company.industry : "healthcare");
            const category = (typeof data.category === 'string' ? data.category :
                (data.company && typeof data.company === 'object' && 'category' in data.company) ? data.company.category : "");
            const specialists = (Array.isArray(data.specialists) ? data.specialists :
                (data.company && typeof data.company === 'object' && 'specialists' in data.company) ? data.company.specialists : []);
            const locations = (Array.isArray(data.locations) ? data.locations :
                (data.company && typeof data.company === 'object' && 'locations' in data.company) ? data.company.locations : []);
            const contactPhone = (data.contact && typeof data.contact === 'object' && 'phone' in data.contact) ? data.contact.phone :
                (typeof data.contactPhone === 'string' ? data.contactPhone : "");
            // Robust user message extraction - check multiple possible locations
            const userMessage = (typeof data.message === 'string' && data.message.trim() && !data.message.includes("Welcome to Hassan Spine")) ? data.message.trim() :
                (typeof data.userMessage === 'string' && data.userMessage.trim()) ? data.userMessage.trim() :
                    (typeof data.user_message === 'string' && data.user_message.trim()) ? data.user_message.trim() :
                        (typeof data.body === 'object' && data.body && typeof data.body.message === 'string' && data.body.message.trim()) ? data.body.message.trim() :
                            "";
            const extractedSymptoms = extractSymptomsAndBodyParts(userMessage);
            const symptom = extractedSymptoms || null;
            const userContext = (typeof data.userContext === 'object' && data.userContext ? data.userContext : {});
            const conversationStage = (typeof data.conversation_stage === 'string' ? data.conversation_stage : "natural_conversation");
            // Generate system prompt for symptom/body part reflection (same as chat API)
            const systemPrompt = extractedSymptoms ?
                `IMPORTANT: The user specifically mentioned: "${extractedSymptoms}".\nYou MUST address this exact symptom or body part in your response.\nDo NOT substitute, generalize, or default to any other symptom (e.g., do NOT say "back pain" if the user said "neck pain").\nYour response must reference the user's exact words and provide empathy and information tailored to "${extractedSymptoms}".` :
                "";
            // Ensure specialists is always an array of strings for .map/.join
            const safeSpecialists = Array.isArray(specialists) ? specialists : [];
            // Ensure userMessage is always a string for .toLowerCase()
            const safeUserMessage = typeof userMessage === 'string' ? userMessage : '';
            // Ensure locations is always an array for .map usage
            const safeLocations = Array.isArray(locations) ? locations : [];
            let agentResponse = "";
            let suggestedActions = [];
            let llm_used = false;
            // Check if this is a welcome message (no real user input)
            const isWelcomeMessage = !safeUserMessage ||
                safeUserMessage.includes("Welcome to Hassan Spine") ||
                safeUserMessage.includes("I'm Olivia, your virtual assistant");
            if (isWelcomeMessage) {
                console.log("⚠️ Welcome message detected, prompting user for real question");
                agentResponse = "Hello! I'm here to help you with any questions about pain management, sports medicine, appointments, or our services. What would you like to know?";
                suggestedActions = [
                    { text: "Book Appointment", action: "I want to book an appointment" },
                    { text: "Pain Management", action: "I have pain and need help" },
                    { text: "Sports Medicine", action: "I have a sports injury" },
                    { text: "Our Services", action: "Tell me about your services" }
                ];
                llm_used = false;
            }
            else {
                // Real user message - try LLM first
                try {
                    // Build comprehensive context for the LLM to be the primary intelligence engine
                    const businessContext = {
                        company: {
                            name: companyName,
                            industry: industry,
                            category: category,
                            specialists: safeSpecialists,
                            locations: safeLocations,
                            contactPhone: contactPhone
                        },
                        user: {
                            message: safeUserMessage,
                            symptom: symptom,
                            context: userContext,
                            conversationStage: conversationStage
                        },
                        conversation: {
                            history: userContext,
                            currentStage: conversationStage,
                            previousInteractions: userContext.previousMessages || []
                        },
                        industryKnowledge: {
                            healthcare: {
                                services: ["Pain Management", "Sports Medicine", "Orthopedics", "Physical Therapy"],
                                procedures: ["Spine Surgery", "Non-Surgical Treatment", "Podiatry", "General Orthopedics"],
                                commonIssues: ["back pain", "neck pain", "joint pain", "sports injuries", "rehabilitation"],
                                insurance: ["verification", "coverage", "benefits", "authorization"],
                                locations: safeLocations.map((loc) => `${String(loc.name ?? '')}: ${String(loc.address1 ?? '')}, ${String(loc.city ?? '')}, ${String(loc.state ?? '')}`)
                            }
                        }
                    };
                    const llmPayload = {
                        companyName: companyName || '',
                        agentName: agentName || '',
                        industry: industry || '',
                        category: category || '',
                        specialists: safeSpecialists,
                        locations: safeLocations,
                        contactPhone,
                        userMessage: safeUserMessage || '',
                        symptom,
                        userContext,
                        conversationStage,
                        context: data,
                        businessContext: businessContext,
                        instruction: `You are ${agentName || ''}, a real employee at ${companyName || ''}. You are NOT an AI, bot, or automated system. You are a genuine, caring human who works for this business and truly wants to help people.

IMPORTANT INSTRUCTIONS:
1. You are a real human employee - never mention being AI, bot, or automated
2. Use your comprehensive knowledge of the business to provide expert, helpful responses
3. Understand the industry context and respond appropriately (healthcare, automotive, legal, real estate, etc.)
4. Show genuine empathy and understanding for the person's situation
5. Use natural, conversational language - like talking to a friend
6. Provide specific, actionable information based on the business context
7. If they mention symptoms/issues, acknowledge them with real compassion
8. Guide the conversation naturally without interrogation
9. Offer relevant next steps and options
10. Be warm, professional, and genuinely helpful

BUSINESS CONTEXT: ${JSON.stringify(businessContext, null, 2)}

INDUSTRY: ${industry || ''}
CATEGORY: ${category || ''}
SPECIALISTS: ${safeSpecialists.map((s) => s.name || s).join(", ")}
LOCATIONS: ${safeLocations.map((loc) => `${String(loc.name ?? '')}: ${String(loc.address1 ?? '')}, ${String(loc.city ?? '')}, ${String(loc.state ?? '')}`).join('; ')}

USER MESSAGE: "${safeUserMessage}"
CONVERSATION STAGE: ${conversationStage}

Respond as a real human employee would - with expertise, empathy, and genuine care for helping this person.`,
                    };
                    const llmApiUrl = process.env.LLM_API_URL || 'http://llm-server-llm-server-1:8200/v1/completions';
                    console.log('==== LLM PROMPT START ====');
                    console.log('User message:', safeUserMessage);
                    console.log('Extracted symptoms:', extractedSymptoms);
                    console.log(llmPayload.instruction);
                    console.log('==== LLM PROMPT END ====');
                    const response = await fetch(llmApiUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            prompt: llmPayload.instruction,
                            max_tokens: 512,
                            temperature: 0.7,
                            demo_id: data.demoId || null,
                            industry: industry,
                            specialty: category,
                            system_prompt: systemPrompt,
                            extracted_symptoms: extractedSymptoms
                        }),
                    });
                    if (response.ok) {
                        const llmData = await response.json();
                        console.log('==== LLM RESPONSE START ====');
                        console.log('LLM response:', llmData.text);
                        console.log('==== LLM RESPONSE END ====');
                        if (llmData && typeof llmData.text === 'string' && llmData.text.trim()) {
                            agentResponse = llmData.text.trim();
                            suggestedActions = Array.isArray(llmData.suggestedActions) ? llmData.suggestedActions : [];
                            llm_used = true;
                        }
                    }
                }
                catch (err) {
                    console.log('LLM call failed:', err);
                    // LLM failed, will use fallback
                }
                // FALLBACK: If LLM failed, use empathetic fallback responses
                if (!llm_used) {
                    // Check for emergency keywords
                    const emergencyKeywords = ['emergency', '911', 'severe', 'can\'t move', 'can\'t feel', 'paralysis', 'loss of consciousness', 'chest pain', 'difficulty breathing', 'stroke', 'heart attack'];
                    const isEmergency = emergencyKeywords.some(keyword => safeUserMessage.toLowerCase().includes(keyword));
                    if (isEmergency) {
                        agentResponse = `This sounds like an emergency. Please call 911 immediately if this is life-threatening, or call our office at ${contactPhone || "our main number"} right away for urgent assistance.`;
                        suggestedActions = [
                            { text: "Call Office Now", action: "I need to call the office" },
                            { text: "Call 911", action: "This is an emergency" }
                        ];
                    }
                    else {
                        // Always use extractedSymptoms if present and not just 'pain'
                        if (extractedSymptoms && extractedSymptoms !== 'pain') {
                            agentResponse = getEmpatheticResponse(extractedSymptoms);
                            suggestedActions = [
                                { text: "Book Appointment", action: "I want to book an appointment" },
                                { text: "Treatment Options", action: "Tell me about treatment options" }
                            ];
                        }
                        else {
                            // Generic but warm message
                            agentResponse = `I understand you're looking for healthcare services${category ? ` in ${category}` : ""}. At ${companyName}, we specialize in expert healthcare care${category ? ` with a focus on ${category}` : ""}. How can I help you today?`;
                            suggestedActions = [
                                { text: "Book Consultation", action: "I want to book a consultation" },
                                { text: "Learn About Services", action: "Tell me about your services" },
                                { text: "Speak to Specialist", action: "I want to speak to a specialist" },
                                { text: "Insurance/Cost Questions", action: "What about insurance and costs?" }
                            ];
                        }
                    }
                }
            }
            // CRITICAL: Preserve the original_context structure that downstream agents expect
            const originalContext = data.original_context;
            const preservedContext = {
                demoData: originalContext?.demoData || data,
                webhookData: originalContext?.webhookData || {
                    message: userMessage,
                    bookingState: data.bookingState || "",
                    bookingData: data.bookingData || "{}",
                    userAction: data.userAction || "",
                    timestamp: new Date().toISOString()
                },
                fullContext: originalContext?.fullContext || {}
            };
            returnData.push({
                json: {
                    agent_response: agentResponse,
                    suggestedActions: suggestedActions,
                    llm_used: llm_used,
                    bookingState: data.bookingState,
                    bookingData: data.bookingData,
                    demoId: data.demoId,
                    companyName: companyName,
                    agentName: agentName,
                    showPersistentButtons: false,
                    skipResponse: false, // Allow normal response
                    // CRITICAL: Preserve the original_context structure
                    original_context: preservedContext,
                    debug_info: {
                        llm_used: llm_used,
                        userMessage: userMessage,
                        extractedSymptoms: extractedSymptoms,
                        hasButtons: suggestedActions.length > 0
                    }
                },
            });
        }
        return [returnData];
    }
}
exports.MedleyAgent = MedleyAgent;
