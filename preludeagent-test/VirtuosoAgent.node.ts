import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

/**
 * VirtuosoAgent - Real-time Engagement and Interaction Specialist
 * 
 * The VirtuosoAgent handles live chat, telehealth, and real-time customer interactions.
 * It delivers high-touch, expert-level support and engagement with emotional intelligence
 * and adaptive personality management.
 * 
 * Key Responsibilities:
 * - Real-time customer interaction handling
 * - Emotional intelligence and sentiment analysis
 * - Adaptive personality management
 * - Live chat and telehealth support
 * - Expert-level engagement optimization
 */

interface InteractionRequest {
	type: 'chat' | 'telehealth' | 'support' | 'consultation';
	userIntent: string;
	userEmotion?: 'happy' | 'frustrated' | 'anxious' | 'neutral' | 'excited';
	context: Record<string, any>;
	industry: string;
	specialty?: string;
}

interface PersonalityProfile {
	tone: 'professional' | 'friendly' | 'empathetic' | 'authoritative' | 'casual';
	style: 'formal' | 'conversational' | 'technical' | 'educational';
	adaptation: 'user_emotion' | 'industry_context' | 'urgency_level';
}

interface EmotionalResponse {
	detectedEmotion: string;
	confidence: number;
	recommendedTone: string;
	responseStrategy: string;
	escalationNeeded: boolean;
}

async function handleRealTimeInteraction(request: InteractionRequest): Promise<any> {
	try {
		// Extract context data for dynamic response generation
		const context = request.context;
		const companyName = context.companyName || 'our practice';
		const agentName = context.agentName || 'your assistant';
		const procedures = context.procedures || [];
		const locations = context.locations || [];
		const contact = context.contact || {};
		const insuranceNote = context.insuranceNote || '';
		const userMessage = context.userMessage || '';
		const intent = context.intent || 'general';
		const industry = request.industry;
		const specialty = request.specialty;

		// Dynamic response generation based on context and user intent
		let response = '';
		let suggestedActions = [];

		// Analyze user intent from the actual message
		const messageLower = userMessage.toLowerCase();
		
		if (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('hey')) {
			// Greeting response
			response = `Hello! I'm ${agentName} at ${companyName}. I'm here to help you with your healthcare needs.\n\n`;
			
			if (procedures.length > 0) {
				response += `We offer the following services:\n`;
				procedures.forEach((proc: string, index: number) => {
					response += `• ${proc}\n`;
				});
				response += `\n`;
			}
			
			response += `How can I assist you today?`;
			
			suggestedActions = [
				{ text: "Book an appointment", action: "booking", style: "primary" },
				{ text: "Check insurance coverage", action: "insurance", style: "secondary" },
				{ text: "See locations & hours", action: "location", style: "secondary" },
				{ text: "Learn about procedures", action: "procedures", style: "secondary" },
				{ text: "Contact information", action: "contact", style: "secondary" }
			];
			
		} else if (messageLower.includes('appointment') || messageLower.includes('book') || messageLower.includes('schedule')) {
			// Booking intent
			response = `I'd be happy to help you schedule an appointment at ${companyName}. `;
			
			if (locations.length > 0) {
				response += `We have ${locations.length} location${locations.length > 1 ? 's' : ''} available:\n`;
				locations.forEach((loc: any, index: number) => {
					response += `• ${loc.name}: ${loc.address}\n`;
				});
				response += `\n`;
			}
			
			response += `To get started, I'll need a few details about your appointment. Are you a new patient or an existing patient?`;
			
			suggestedActions = [
				{ text: "New Patient", action: "new_patient", style: "primary" },
				{ text: "Existing Patient", action: "existing_patient", style: "primary" },
				{ text: "Check insurance first", action: "insurance_check", style: "secondary" }
			];
			
		} else if (messageLower.includes('insurance') || messageLower.includes('coverage') || messageLower.includes('verify')) {
			// Insurance intent
			response = `I can help you with insurance verification. `;
			
			if (insuranceNote) {
				response += `${insuranceNote}\n\n`;
			}
			
			response += `To verify your coverage, I'll need some information about your insurance policy. What insurance provider do you have?`;
			
			suggestedActions = [
				{ text: "Blue Cross Blue Shield", action: "insurance_bcbs", style: "secondary" },
				{ text: "Aetna", action: "insurance_aetna", style: "secondary" },
				{ text: "Cigna", action: "insurance_cigna", style: "secondary" },
				{ text: "UnitedHealthcare", action: "insurance_united", style: "secondary" },
				{ text: "Other", action: "insurance_other", style: "secondary" }
			];
			
		} else if (messageLower.includes('location') || messageLower.includes('address') || messageLower.includes('where')) {
			// Location intent
			if (locations.length > 0) {
				response = `Here are our ${locations.length} location${locations.length > 1 ? 's' : ''}:\n\n`;
				locations.forEach((loc: any, index: number) => {
					response += `**${loc.name}**\n${loc.address}\n`;
					if (contact.phone) {
						response += `Phone: ${contact.phone}\n`;
					}
					response += `Hours: Monday-Friday 8:00 AM - 5:00 PM\n\n`;
				});
			} else {
				response = `I can provide you with our location information. `;
				if (contact.phone) {
					response += `You can also call us at ${contact.phone} for directions.`;
				}
			}
			
			suggestedActions = [
				{ text: "Book appointment", action: "booking", style: "primary" },
				{ text: "Get directions", action: "directions", style: "secondary" },
				{ text: "Contact us", action: "contact", style: "secondary" }
			];
			
		} else if (messageLower.includes('procedure') || messageLower.includes('service') || messageLower.includes('treatment')) {
			// Procedure intent
			if (procedures.length > 0) {
				response = `At ${companyName}, we offer the following procedures and treatments:\n\n`;
				procedures.forEach((proc: string, index: number) => {
					response += `• **${proc}**\n`;
				});
				response += `\nWould you like to learn more about any specific procedure or schedule a consultation?`;
			} else {
				response = `I can provide you with information about our procedures and treatments. What specific information are you looking for?`;
			}
			
			suggestedActions = [
				{ text: "Schedule consultation", action: "consultation", style: "primary" },
				{ text: "Learn more", action: "procedure_info", style: "secondary" },
				{ text: "Book appointment", action: "booking", style: "secondary" }
			];
			
		} else if (messageLower.includes('contact') || messageLower.includes('phone') || messageLower.includes('email')) {
			// Contact intent
			response = `Here's how you can contact ${companyName}:\n\n`;
			
			if (contact.phone) {
				response += `📞 **Phone:** ${contact.phone}\n`;
			}
			if (contact.email) {
				response += `📧 **Email:** ${contact.email}\n`;
			}
			if (contact.website) {
				response += `🌐 **Website:** ${contact.website}\n`;
			}
			
			response += `\nOur office hours are Monday-Friday 8:00 AM - 5:00 PM.`;
			
			suggestedActions = [
				{ text: "Book appointment", action: "booking", style: "primary" },
				{ text: "Call now", action: "call", style: "secondary" },
				{ text: "Send email", action: "email", style: "secondary" }
			];
			
		} else {
			// General/fallback response
			response = `Thank you for contacting ${companyName}. I'm ${agentName}, your virtual assistant. `;
			
			if (procedures.length > 0) {
				response += `I can help you with:\n`;
				response += `• Booking appointments\n`;
				response += `• Insurance verification\n`;
				response += `• Information about our procedures\n`;
				response += `• Location and contact details\n`;
				response += `• General questions about our services\n\n`;
			}
			
			response += `How can I assist you today?`;
			
			suggestedActions = [
				{ text: "Book an appointment", action: "booking", style: "primary" },
				{ text: "Check insurance coverage", action: "insurance", style: "secondary" },
				{ text: "See locations & hours", action: "location", style: "secondary" },
				{ text: "Learn about procedures", action: "procedures", style: "secondary" },
				{ text: "Contact information", action: "contact", style: "secondary" }
			];
		}

		return {
			status: 'success',
			response,
			suggestedActions,
			interactionType: request.type,
			userIntent: userMessage,
			detectedEmotion: request.userEmotion || 'neutral',
			confidence: 0.95,
			responseTime: Date.now(),
			metadata: {
				industry: request.industry,
				specialty: request.specialty,
				context: request.context,
				companyName,
				agentName,
				procedures,
				locations,
				contact
			},
		};
	} catch (error) {
		throw new Error(`Interaction handling failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

async function managePersonalityAdaptation(profile: PersonalityProfile, context: any): Promise<any> {
	try {
		// Simulate personality adaptation based on context
		const adaptations: Record<string, Record<string, string>> = {
			professional: {
				formal: "I understand your concern. Let me provide you with a comprehensive solution.",
				technical: "Based on the technical specifications, here's the optimal approach.",
				authoritative: "As your healthcare provider, I recommend the following course of action.",
			},
			friendly: {
				conversational: "Hey there! I'm here to help you out with whatever you need.",
				casual: "No worries at all! Let's get this sorted out together.",
				empathetic: "I completely understand how you're feeling. Let me help you through this.",
			},
			empathetic: {
				supportive: "I can see this is important to you. Let me make sure we address your needs properly.",
				understanding: "I understand this situation can be challenging. I'm here to support you.",
				reassuring: "You're in good hands. Let me help you navigate this process.",
			},
			authoritative: {
				formal: "Based on my expertise, here's what I recommend for your situation.",
				technical: "The evidence clearly indicates this is the optimal approach.",
				authoritative: "As your healthcare provider, this is the course of action I prescribe.",
			},
			casual: {
				conversational: "Hey! Let's figure this out together.",
				casual: "No problem at all! We'll get this sorted.",
				empathetic: "I totally get it. Let me help you out.",
			},
		};

		const adaptation = adaptations[profile.tone]?.[profile.style] || 
			"I'm here to help you with your needs. How can I assist you today?";

		return {
			status: 'success',
			adaptedPersonality: {
				tone: profile.tone,
				style: profile.style,
				adaptation: profile.adaptation,
			},
			response: adaptation,
			confidence: 0.90,
			adaptationFactors: {
				userEmotion: context.userEmotion,
				industryContext: context.industry,
				urgencyLevel: context.urgency,
			},
		};
	} catch (error) {
		throw new Error(`Personality adaptation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

async function processEmotionalIntelligence(emotionData: any): Promise<EmotionalResponse> {
	try {
		// Simulate emotional intelligence processing
		const emotionStrategies = {
			happy: {
				recommendedTone: 'friendly',
				responseStrategy: 'maintain_positive_momentum',
				escalationNeeded: false,
			},
			frustrated: {
				recommendedTone: 'empathetic',
				responseStrategy: 'acknowledge_and_resolve',
				escalationNeeded: true,
			},
			anxious: {
				recommendedTone: 'reassuring',
				responseStrategy: 'calm_and_guide',
				escalationNeeded: false,
			},
			neutral: {
				recommendedTone: 'professional',
				responseStrategy: 'inform_and_assist',
				escalationNeeded: false,
			},
			excited: {
				recommendedTone: 'enthusiastic',
				responseStrategy: 'channel_enthusiasm',
				escalationNeeded: false,
			},
		};

		const detectedEmotion = emotionData.emotion || 'neutral';
		const strategy = emotionStrategies[detectedEmotion as keyof typeof emotionStrategies] || emotionStrategies.neutral;

		return {
			detectedEmotion,
			confidence: 0.88,
			recommendedTone: strategy.recommendedTone,
			responseStrategy: strategy.responseStrategy,
			escalationNeeded: strategy.escalationNeeded,
		};
	} catch (error) {
		throw new Error(`Emotional processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

export class VirtuosoAgent implements INodeType {
	description: INodeTypeDescription = {
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
				description: 'Detected user emotion',
			},
			{
				displayName: 'Industry',
				name: 'industry',
				type: 'string',
				default: 'healthcare',
				displayOptions: {
					show: {
						operation: ['interact', 'personality'],
					},
				},
				description: 'Industry context for interaction',
			},
			{
				displayName: 'Specialty',
				name: 'specialty',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['interact', 'personality'],
					},
				},
				description: 'Medical specialty or business focus area',
			},
			{
				displayName: 'Context (JSON)',
				name: 'context',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						operation: ['interact', 'personality'],
					},
				},
				description: 'Additional context for the interaction',
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
				displayName: 'Emotion Data (JSON)',
				name: 'emotionData',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						operation: ['emotion'],
					},
				},
				description: 'Emotion analysis data',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				let result;

				switch (operation) {
					case 'interact':
						const request: InteractionRequest = {
							type: this.getNodeParameter('interactionType', i) as any,
							userIntent: this.getNodeParameter('userIntent', i) as string,
							userEmotion: this.getNodeParameter('userEmotion', i) as any,
							context: JSON.parse(this.getNodeParameter('context', i) as string),
							industry: this.getNodeParameter('industry', i) as string,
							specialty: this.getNodeParameter('specialty', i) as string,
						};
						result = await handleRealTimeInteraction(request);
						break;

					case 'personality':
						const profile: PersonalityProfile = {
							tone: this.getNodeParameter('personalityTone', i) as any,
							style: this.getNodeParameter('personalityStyle', i) as any,
							adaptation: this.getNodeParameter('adaptationType', i) as any,
						};
						const context = JSON.parse(this.getNodeParameter('context', i) as string);
						result = await managePersonalityAdaptation(profile, context);
						break;

					case 'emotion':
						const emotionData = {
							emotion: this.getNodeParameter('userEmotion', i) as string,
							...JSON.parse(this.getNodeParameter('emotionData', i) as string),
						};
						result = await processEmotionalIntelligence(emotionData);
						break;

					default:
						throw new Error(`Operation ${operation} not supported`);
				}

				returnData.push({
					json: {
						operation,
						result,
						agent: 'VirtuosoAgent',
						timestamp: new Date().toISOString(),
					},
				});
			} catch (error) {
				returnData.push({
					json: {
						operation: this.getNodeParameter('operation', i) as string,
						error: error instanceof Error ? error.message : 'Unknown error',
						agent: 'VirtuosoAgent',
						timestamp: new Date().toISOString(),
					},
				});
			}
		}

		return [returnData];
	}
}