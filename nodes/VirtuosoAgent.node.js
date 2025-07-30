"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VirtuosoAgent = void 0;
async function handleRealTimeInteraction(request) {
    try {
        // Extract context data for dynamic response generation
        const context = request.context;
        // Handle both array and object input structures
        let inputData = context;
        if (Array.isArray(context)) {
            // If context is an array, use the first item that has the data we need
            inputData = context.find(item => item.company_name || item.agent_name) || context[0] || {};
        }
        // Extract company and agent information with proper field names
        const companyName = inputData.company_name || inputData.companyName || 'our practice';
        const agentName = inputData.agent_name || inputData.agentName || 'your assistant';
        // Extract other context data
        const procedures = inputData.procedures || inputData.services || [];
        const locations = inputData.locations || [];
        const contact = inputData.contact || {};
        const insuranceNote = inputData.insuranceNote || '';
        const userMessage = inputData.message || inputData.userMessage || '';
        const intent = inputData.intent || 'general';
        const industry = request.industry;
        const categoryIds = inputData.category_ids || inputData.categoryIds || [];
        // Validate required data
        if (!companyName || companyName === 'our practice') {
            throw new Error('missing company or agent information');
        }
        // CRITICAL: Try LLM first for dynamic responses
        let llm_used = false;
        let agentResponse = '';
        let suggestedActions = [];
        // Real user message - try LLM first
        if (userMessage && userMessage.trim()) {
            // Build comprehensive context for the LLM to be the primary intelligence engine
            const llmPayload = {
                instruction: `You are ${agentName}, a healthcare assistant at ${companyName}. 

COMPANY CONTEXT:
- Company: ${companyName}
- Agent: ${agentName}
- Industry: ${industry || 'healthcare'}
- Categories: ${categoryIds.join(', ')}
- Services: ${procedures.join(', ')}
- Locations: ${locations.map((loc) => `${loc.name || 'Location'}: ${loc.address1 || ''} ${loc.city || ''} ${loc.state || ''}`).join(', ')}
- Contact: ${contact.phone || 'N/A'}

USER MESSAGE: "${userMessage}"

RESPONSE REQUIREMENTS:
1. Respond as ${agentName} from ${companyName}
2. Be empathetic, professional, and helpful
3. Use the company context to provide accurate information
4. If this is a clinical question, provide helpful medical guidance while noting you're not a doctor
5. If this is about booking, guide them to the booking process
6. If this is about insurance, help with insurance questions
7. Keep responses conversational and warm
8. Suggest relevant next actions when appropriate

RESPOND NOW:`,
                demo_id: inputData.demoId || inputData.id || null,
                max_tokens: 300
            };
            try {
                const llmApiUrl = process.env.LLM_API_URL || 'http://llm-server-llm-server-1:8200/v1/completions';
                console.log('==== LLM PROMPT START ====');
                console.log('VirtuosoAgent calling LLM for:', userMessage);
                console.log(llmPayload.instruction);
                console.log('==== LLM PROMPT END ====');
                const llmResponse = await fetch(llmApiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: llmPayload.instruction,
                        max_tokens: llmPayload.max_tokens,
                        demo_id: llmPayload.demo_id
                    })
                });
                if (llmResponse.ok) {
                    const llmData = await llmResponse.json();
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
        }
        // FALLBACK: If LLM failed or no user message, use empathetic fallback
        if (!llm_used) {
            if (!userMessage || userMessage.trim() === '') {
                // Welcome message
                agentResponse = `Hello! I'm ${agentName}, and I'm here to help you with any questions about ${companyName}. How can I assist you today?`;
                suggestedActions = [
                    { text: "Book Appointment", action: "I want to book an appointment" },
                    { text: "Learn About Services", action: "Tell me about your services" },
                    { text: "Contact Information", action: "How do I contact you?" },
                    { text: "Insurance Questions", action: "What about insurance and costs?" }
                ];
            }
            else {
                // Generic helpful response
                agentResponse = `Thank you for your question. I'm ${agentName} from ${companyName}, and I'm here to help. Could you please let me know what specific information you need?`;
                suggestedActions = [
                    { text: "Book Appointment", action: "I want to book an appointment" },
                    { text: "Learn About Services", action: "Tell me about your services" },
                    { text: "Contact Information", action: "How do I contact you?" },
                    { text: "Insurance Questions", action: "What about insurance and costs?" }
                ];
            }
        }
        return {
            status: 'success',
            agentResponse,
            suggestedActions,
            llm_used,
            timestamp: new Date().toISOString(),
            interactionId: `virtuoso_${Date.now()}`,
            context: {
                companyName,
                agentName,
                industry,
                userMessage,
                intent
            }
        };
    }
    catch (error) {
        throw new Error(`Real-time interaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function managePersonalityAdaptation(profile, context) {
    try {
        // Simulate personality adaptation based on context
        const adaptation = {
            tone: profile.tone,
            style: profile.style,
            adaptation: profile.adaptation,
            context: context,
            timestamp: new Date().toISOString(),
            adaptationId: `personality_${Date.now()}`
        };
        return {
            status: 'success',
            adaptation,
            recommendations: {
                responseTone: profile.tone,
                interactionStyle: profile.style,
                adaptationStrategy: profile.adaptation
            }
        };
    }
    catch (error) {
        throw new Error(`Personality adaptation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function processEmotionalIntelligence(emotionData) {
    try {
        // Simulate emotional intelligence processing
        const detectedEmotion = emotionData.emotion || 'neutral';
        const confidence = Math.random() * 0.3 + 0.7; // 0.7 to 1.0
        const toneMap = {
            'happy': 'friendly',
            'frustrated': 'empathetic',
            'anxious': 'calming',
            'neutral': 'professional',
            'excited': 'enthusiastic'
        };
        const responseStrategy = detectedEmotion === 'frustrated' || detectedEmotion === 'anxious'
            ? 'de-escalation'
            : 'engagement';
        return {
            detectedEmotion,
            confidence,
            recommendedTone: toneMap[detectedEmotion] || 'professional',
            responseStrategy,
            escalationNeeded: detectedEmotion === 'frustrated' && confidence > 0.8
        };
    }
    catch (error) {
        throw new Error(`Emotional intelligence processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
class VirtuosoAgent {
    constructor() {
        this.description = {
            displayName: 'VirtuosoAgent',
            name: 'virtuosoAgent',
            group: ['transform'],
            version: 1,
            description: 'Real-time engagement and interaction specialist. Handles live chat, telehealth, and customer interactions with emotional intelligence.',
            defaults: {
                name: 'VirtuosoAgent',
            },
            icon: 'file:virtuoso.svg',
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    options: [
                        {
                            name: 'Handle Interaction',
                            value: 'interact',
                            description: 'Handle real-time customer interactions',
                        },
                        {
                            name: 'Manage Personality',
                            value: 'personality',
                            description: 'Adapt personality based on context and user emotion',
                        },
                        {
                            name: 'Process Emotion',
                            value: 'emotion',
                            description: 'Analyze user emotion and recommend response strategy',
                        },
                    ],
                    default: 'interact',
                    description: 'The operation to perform',
                },
                {
                    displayName: 'Interaction Type',
                    name: 'interactionType',
                    type: 'options',
                    options: [
                        { name: 'Chat', value: 'chat' },
                        { name: 'Telehealth', value: 'telehealth' },
                        { name: 'Support', value: 'support' },
                        { name: 'Consultation', value: 'consultation' },
                    ],
                    default: 'chat',
                    displayOptions: {
                        show: {
                            operation: ['interact'],
                        },
                    },
                    description: 'Type of interaction to handle',
                },
                {
                    displayName: 'User Intent',
                    name: 'userIntent',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['interact'],
                        },
                    },
                    description: 'User intent or message content',
                },
                {
                    displayName: 'User Emotion',
                    name: 'userEmotion',
                    type: 'options',
                    options: [
                        { name: 'Happy', value: 'happy' },
                        { name: 'Frustrated', value: 'frustrated' },
                        { name: 'Anxious', value: 'anxious' },
                        { name: 'Neutral', value: 'neutral' },
                        { name: 'Excited', value: 'excited' },
                    ],
                    default: 'neutral',
                    displayOptions: {
                        show: {
                            operation: ['interact', 'emotion'],
                        },
                    },
                    description: 'User emotional state',
                },
                {
                    displayName: 'Context',
                    name: 'context',
                    type: 'json',
                    default: '{}',
                    displayOptions: {
                        show: {
                            operation: ['interact', 'personality'],
                        },
                    },
                    description: 'Context data for the interaction',
                },
                {
                    displayName: 'Industry',
                    name: 'industry',
                    type: 'string',
                    default: 'healthcare',
                    displayOptions: {
                        show: {
                            operation: ['interact'],
                        },
                    },
                    description: 'Industry context',
                },
                {
                    displayName: 'Specialty',
                    name: 'specialty',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['interact'],
                        },
                    },
                    description: 'Specialty or category',
                },
                {
                    displayName: 'Personality Tone',
                    name: 'personalityTone',
                    type: 'options',
                    options: [
                        { name: 'Professional', value: 'professional' },
                        { name: 'Friendly', value: 'friendly' },
                        { name: 'Empathetic', value: 'empathetic' },
                        { name: 'Authoritative', value: 'authoritative' },
                        { name: 'Casual', value: 'casual' },
                    ],
                    default: 'professional',
                    displayOptions: {
                        show: {
                            operation: ['personality'],
                        },
                    },
                    description: 'Tone for personality adaptation',
                },
                {
                    displayName: 'Personality Style',
                    name: 'personalityStyle',
                    type: 'options',
                    options: [
                        { name: 'Formal', value: 'formal' },
                        { name: 'Conversational', value: 'conversational' },
                        { name: 'Technical', value: 'technical' },
                        { name: 'Educational', value: 'educational' },
                    ],
                    default: 'conversational',
                    displayOptions: {
                        show: {
                            operation: ['personality'],
                        },
                    },
                    description: 'Style for personality adaptation',
                },
                {
                    displayName: 'Adaptation Type',
                    name: 'adaptationType',
                    type: 'options',
                    options: [
                        { name: 'User Emotion', value: 'user_emotion' },
                        { name: 'Industry Context', value: 'industry_context' },
                        { name: 'Urgency Level', value: 'urgency_level' },
                    ],
                    default: 'user_emotion',
                    displayOptions: {
                        show: {
                            operation: ['personality'],
                        },
                    },
                    description: 'Type of adaptation to apply',
                },
                {
                    displayName: 'Emotion Data',
                    name: 'emotionData',
                    type: 'json',
                    default: '{}',
                    displayOptions: {
                        show: {
                            operation: ['emotion'],
                        },
                    },
                    description: 'Emotion data for processing',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const operation = this.getNodeParameter('operation', i);
                let result;
                switch (operation) {
                    case 'interact':
                        // Handle context parameter properly
                        let contextParam = this.getNodeParameter('context', i);
                        let context;
                        try {
                            // Try to parse as JSON if it's a string
                            if (typeof contextParam === 'string') {
                                context = JSON.parse(contextParam);
                            }
                            else {
                                context = contextParam;
                            }
                        }
                        catch (error) {
                            // If parsing fails, use the raw input data
                            context = items[i].json;
                        }
                        const request = {
                            type: this.getNodeParameter('interactionType', i),
                            userIntent: this.getNodeParameter('userIntent', i),
                            userEmotion: this.getNodeParameter('userEmotion', i),
                            context: context,
                            industry: this.getNodeParameter('industry', i),
                            specialty: this.getNodeParameter('specialty', i),
                        };
                        result = await handleRealTimeInteraction(request);
                        break;
                    case 'personality':
                        const profile = {
                            tone: this.getNodeParameter('personalityTone', i),
                            style: this.getNodeParameter('personalityStyle', i),
                            adaptation: this.getNodeParameter('adaptationType', i),
                        };
                        const personalityContext = JSON.parse(this.getNodeParameter('context', i));
                        result = await managePersonalityAdaptation(profile, personalityContext);
                        break;
                    case 'emotion':
                        const emotionData = {
                            emotion: this.getNodeParameter('userEmotion', i),
                            ...JSON.parse(this.getNodeParameter('emotionData', i)),
                        };
                        result = await processEmotionalIntelligence(emotionData);
                        break;
                    default:
                        throw new Error(`Operation ${operation} not supported`);
                }
                // CRITICAL: Preserve the original_context structure that downstream agents expect
                const originalContext = items[i].json.original_context;
                const preservedContext = {
                    demoData: (originalContext === null || originalContext === void 0 ? void 0 : originalContext.demoData) || items[i].json,
                    webhookData: (originalContext === null || originalContext === void 0 ? void 0 : originalContext.webhookData) || {
                        message: items[i].json.message || "",
                        bookingState: items[i].json.bookingState || "",
                        bookingData: items[i].json.bookingData || "{}",
                        userAction: items[i].json.userAction || "",
                        timestamp: new Date().toISOString()
                    },
                    fullContext: (originalContext === null || originalContext === void 0 ? void 0 : originalContext.fullContext) || {}
                };
                returnData.push({
                    json: {
                        ...items[i].json, // Preserve all input data
                        operation,
                        result,
                        agent: 'VirtuosoAgent',
                        timestamp: new Date().toISOString(),
                        // CRITICAL: Preserve the original_context structure
                        original_context: preservedContext,
                        // Add response fields for downstream compatibility
                        agent_response: result.agentResponse || '',
                        suggestedActions: result.suggestedActions || [],
                        llm_used: result.llm_used || false,
                        bookingState: items[i].json.bookingState,
                        bookingData: items[i].json.bookingData,
                        showPersistentButtons: false,
                        debug_info: {
                            llm_used: result.llm_used || false,
                            userMessage: items[i].json.message || "",
                            intent: items[i].json.intent || "general",
                            hasButtons: (result.suggestedActions || []).length > 0
                        }
                    },
                });
            }
            catch (error) {
                returnData.push({
                    json: {
                        operation: this.getNodeParameter('operation', i),
                        error: error instanceof Error ? error.message : 'Unknown error',
                        agent: 'VirtuosoAgent',
                        timestamp: new Date().toISOString(),
                        // CRITICAL: Preserve the original_context structure even in error case
                        original_context: {
                            demoData: items[i].json,
                            webhookData: {
                                message: items[i].json.message || "",
                                bookingState: items[i].json.bookingState || "",
                                bookingData: items[i].json.bookingData || "{}",
                                userAction: items[i].json.userAction || "",
                                timestamp: new Date().toISOString()
                            },
                            fullContext: {}
                        }
                    },
                });
            }
        }
        return [returnData];
    }
}
exports.VirtuosoAgent = VirtuosoAgent;
