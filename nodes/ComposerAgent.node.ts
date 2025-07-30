import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

/**
 * ComposerAgent - Content and Communication Architect
 * 
 * The ComposerAgent is responsible for designing and generating personalized communication journeys,
 * email/text templates, and customer touchpoints. It ensures all messaging is on-brand and tailored
 * to the user's journey.
 * 
 * Key Responsibilities:
 * - Generate personalized content for different platforms
 * - Create email and text message templates
 * - Design customer journey touchpoints
 * - Ensure brand consistency across all communications
 * - Optimize content for engagement and conversion
 */

interface ContentGenerationRequest {
	platform: 'email' | 'sms' | 'social' | 'web' | 'chat';
	tone: 'professional' | 'friendly' | 'urgent' | 'educational' | 'promotional';
	audience: 'new_customer' | 'existing_customer' | 'prospect' | 'support';
	industry: string;
	specialty?: string;
	contentType: 'welcome' | 'appointment' | 'reminder' | 'follow_up' | 'promotional' | 'support';
	customData?: Record<string, any>;
}

interface ContentTemplate {
	id: string;
	name: string;
	content: string;
	variables: string[];
	platform: string;
	industry: string;
	version: string;
	createdAt: string;
}

interface PatternAnalysis {
	engagementRates: Record<string, number>;
	optimalTiming: Record<string, string>;
	contentPerformance: Record<string, any>;
	recommendations: string[];
}

async function generatePersonalizedContent(request: ContentGenerationRequest): Promise<any> {
	try {
		// Simulate AI-powered content generation
		const templates: Record<string, Record<string, string>> = {
			email: {
				welcome: `Dear {{customer_name}},

Welcome to {{practice_name}}! We're excited to have you as part of our family.

Your first appointment is scheduled for {{appointment_date}} at {{appointment_time}} at our {{location}} office.

Please arrive 15 minutes early to complete any necessary paperwork. If you have any questions, don't hesitate to call us at {{phone_number}}.

Best regards,
The {{practice_name}} Team`,
				appointment: `Hi {{customer_name}},

This is a friendly reminder about your upcoming appointment:

📅 Date: {{appointment_date}}
⏰ Time: {{appointment_time}}
📍 Location: {{location}}
👨‍⚕️ Provider: {{provider_name}}

Please bring:
- Photo ID
- Insurance card
- List of current medications
- Any relevant medical records

If you need to reschedule, please call us at least 24 hours in advance.

See you soon!
{{practice_name}}`,
				reminder: `Hi {{customer_name}},

Just a quick reminder about your appointment tomorrow:

📅 {{appointment_date}} at {{appointment_time}}
📍 {{location}}

We look forward to seeing you!

{{practice_name}}`,
			},
			sms: {
				reminder: `Hi {{customer_name}}! Your appointment is tomorrow at {{appointment_time}} at {{location}}. Reply STOP to opt out.`,
				confirmation: `Your appointment with {{practice_name}} is confirmed for {{appointment_date}} at {{appointment_time}}. See you soon!`,
			},
			social: {
				educational: `Did you know? {{fact_about_specialty}}

At {{practice_name}}, we're committed to helping you understand your health and treatment options.

Learn more: {{website_url}}

#{{specialty_hashtag}} #{{location_hashtag}} #{{practice_hashtag}}`,
			},
			web: {
				welcome: `Welcome to {{practice_name}}! We're here to help with your {{specialty}} needs.`,
				appointment: `Your appointment is confirmed for {{appointment_date}} at {{appointment_time}}.`,
				reminder: `Reminder: Your appointment is tomorrow at {{appointment_time}}.`,
			},
			chat: {
				welcome: `Hi {{customer_name}}! Welcome to {{practice_name}}. How can I help you today?`,
				appointment: `Great! Your appointment is scheduled for {{appointment_date}} at {{appointment_time}}.`,
				reminder: `Just a reminder: Your appointment is tomorrow at {{appointment_time}}.`,
			},
		};

		const baseTemplate = templates[request.platform]?.[request.contentType] || 
			`Thank you for choosing {{practice_name}}. We're here to help with your {{specialty}} needs.`;

		// Apply tone and personalization
		let content = baseTemplate;
		
		// Replace variables with actual data
		if (request.customData) {
			Object.entries(request.customData).forEach(([key, value]) => {
				content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
			});
		}

	return {
			status: 'success',
			content,
			platform: request.platform,
			tone: request.tone,
			contentType: request.contentType,
			industry: request.industry,
			specialty: request.specialty,
			generatedAt: new Date().toISOString(),
			metadata: {
				wordCount: content.split(' ').length,
				characterCount: content.length,
				estimatedReadTime: Math.ceil(content.split(' ').length / 200), // 200 words per minute
			},
		};
	} catch (error) {
		throw new Error(`Content generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

async function analyzeContentPatterns(data: any): Promise<PatternAnalysis> {
	try {
		// Simulate pattern analysis
		const analysis: PatternAnalysis = {
			engagementRates: {
				email: 0.85,
				sms: 0.92,
				social: 0.78,
				web: 0.65,
				chat: 0.88,
			},
			optimalTiming: {
				email: 'Tuesday 10:00 AM',
				sms: 'Monday 9:00 AM',
				social: 'Wednesday 2:00 PM',
				web: 'Thursday 11:00 AM',
				chat: 'Friday 3:00 PM',
			},
			contentPerformance: {
				topPerforming: ['appointment_reminders', 'educational_content', 'welcome_messages'],
				needsImprovement: ['promotional_content', 'follow_up_messages'],
				optimalLength: {
					email: '150-200 words',
					sms: '160 characters',
					social: '100-150 characters',
				},
			},
			recommendations: [
				'Increase personalization in welcome messages',
				'Add more educational content to social media',
				'Optimize appointment reminder timing',
				'Include clear call-to-actions in all messages',
			],
		};

		return analysis;
	} catch (error) {
		throw new Error(`Pattern analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

async function createContentTemplate(templateData: any): Promise<ContentTemplate> {
	try {
		const template: ContentTemplate = {
			id: `template_${Date.now()}`,
			name: templateData.name || 'Custom Template',
			content: templateData.content || '',
			variables: templateData.variables || [],
			platform: templateData.platform || 'email',
			industry: templateData.industry || 'general',
		version: '1.0',
			createdAt: new Date().toISOString(),
	};

		return template;
	} catch (error) {
		throw new Error(`Template creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

export class ComposerAgent implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ComposerAgent',
		name: 'composerAgent',
		group: ['transform'],
		version: 1,
		description: 'Content and communication architect for personalized journeys. Generates tailored content for emails, SMS, social media, and web platforms.',
		defaults: {
			name: 'ComposerAgent',
		},
		icon: 'file:composer.svg',
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Generate Content',
						value: 'generate',
						description: 'Generate personalized content for various platforms',
					},
					{
						name: 'Analyze Patterns',
						value: 'analyze',
						description: 'Analyze content performance and engagement patterns',
					},
					{
						name: 'Create Template',
						value: 'template',
						description: 'Create reusable content templates',
					},
				],
				default: 'generate',
				description: 'The operation to perform',
			},
			{
				displayName: 'Platform',
				name: 'platform',
				type: 'options',
				options: [
					{ name: 'Email', value: 'email' },
					{ name: 'SMS', value: 'sms' },
					{ name: 'Social Media', value: 'social' },
					{ name: 'Web', value: 'web' },
					{ name: 'Chat', value: 'chat' },
				],
				default: 'email',
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Target platform for content generation',
			},
			{
				displayName: 'Tone',
				name: 'tone',
				type: 'options',
				options: [
					{ name: 'Professional', value: 'professional' },
					{ name: 'Friendly', value: 'friendly' },
					{ name: 'Urgent', value: 'urgent' },
					{ name: 'Educational', value: 'educational' },
					{ name: 'Promotional', value: 'promotional' },
				],
				default: 'professional',
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Tone of voice for the content',
			},
			{
				displayName: 'Audience',
				name: 'audience',
				type: 'options',
				options: [
					{ name: 'New Customer', value: 'new_customer' },
					{ name: 'Existing Customer', value: 'existing_customer' },
					{ name: 'Prospect', value: 'prospect' },
					{ name: 'Support', value: 'support' },
				],
				default: 'new_customer',
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Target audience for the content',
			},
			{
				displayName: 'Content Type',
				name: 'contentType',
				type: 'options',
				options: [
					{ name: 'Welcome Message', value: 'welcome' },
					{ name: 'Appointment Confirmation', value: 'appointment' },
					{ name: 'Reminder', value: 'reminder' },
					{ name: 'Follow Up', value: 'follow_up' },
					{ name: 'Promotional', value: 'promotional' },
					{ name: 'Support', value: 'support' },
				],
				default: 'welcome',
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Type of content to generate',
			},
			{
				displayName: 'Industry',
				name: 'industry',
				type: 'string',
				default: 'healthcare',
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Industry context for content generation',
			},
			{
				displayName: 'Specialty',
				name: 'specialty',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Medical specialty or business focus area',
			},
			{
				displayName: 'Custom Data (JSON)',
				name: 'customData',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
				description: 'Custom data to personalize the content',
			},
			{
				displayName: 'Analysis Data',
				name: 'analysisData',
				type: 'json',
				default: '{}',
				displayOptions: {
					show: {
						operation: ['analyze'],
					},
				},
				description: 'Data to analyze for patterns and insights',
			},
			{
				displayName: 'Template Name',
				name: 'templateName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['template'],
					},
				},
				description: 'Name for the new template',
			},
			{
				displayName: 'Template Content',
				name: 'templateContent',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['template'],
					},
				},
				description: 'Content for the template',
			},
			{
				displayName: 'Template Variables',
				name: 'templateVariables',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['template'],
					},
				},
				description: 'Comma-separated list of variables (e.g., customer_name, appointment_date)',
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
				case 'generate':
						const request: ContentGenerationRequest = {
							platform: this.getNodeParameter('platform', i) as any,
							tone: this.getNodeParameter('tone', i) as any,
							audience: this.getNodeParameter('audience', i) as any,
							contentType: this.getNodeParameter('contentType', i) as any,
							industry: this.getNodeParameter('industry', i) as string,
							specialty: this.getNodeParameter('specialty', i) as string,
							customData: JSON.parse(this.getNodeParameter('customData', i) as string),
						};
						result = await generatePersonalizedContent(request);
					break;

				case 'analyze':
						const analysisData = JSON.parse(this.getNodeParameter('analysisData', i) as string);
						result = await analyzeContentPatterns(analysisData);
					break;

				case 'template':
						const templateData = {
							name: this.getNodeParameter('templateName', i) as string,
							content: this.getNodeParameter('templateContent', i) as string,
							variables: (this.getNodeParameter('templateVariables', i) as string).split(',').map(v => v.trim()).filter(v => v),
							platform: this.getNodeParameter('platform', i) as string,
							industry: this.getNodeParameter('industry', i) as string,
						};
						result = await createContentTemplate(templateData);
					break;

				default:
					throw new Error(`Operation ${operation} not supported`);
			}

			returnData.push({
				json: {
					operation,
					result,
						agent: 'ComposerAgent',
						timestamp: new Date().toISOString(),
					},
				});
			} catch (error) {
				returnData.push({
					json: {
						operation: this.getNodeParameter('operation', i) as string,
						error: error instanceof Error ? error.message : 'Unknown error',
						agent: 'ComposerAgent',
						timestamp: new Date().toISOString(),
				},
			});
			}
		}

		return [returnData];
	}
}