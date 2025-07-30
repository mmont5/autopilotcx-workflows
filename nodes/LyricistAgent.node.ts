import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

/**
 * LyricistAgent - Multilingual Support and Localization
 * 
 * The LyricistAgent translates and localizes content, ensuring every customer
 * is served in their preferred language. It provides comprehensive multilingual
 * support with cultural adaptation and localization.
 * 
 * Key Responsibilities:
 * - Translate content between multiple languages
 * - Detect user language preferences
 * - Localize content for cultural context
 * - Adapt communication for different regions
 * - Ensure cultural sensitivity and appropriateness
 */

interface TranslationRequest {
	text: string;
	sourceLanguage: string;
	targetLanguage: string;
	context?: string;
	industry?: string;
	specialty?: string;
}

interface LanguageDetection {
	text: string;
	confidence: number;
	detectedLanguage: string;
	alternatives: string[];
	region?: string;
}

interface LocalizationRequest {
	content: string;
	sourceLocale: string;
	targetLocale: string;
	contentType: 'email' | 'sms' | 'web' | 'chat' | 'document';
	culturalContext?: Record<string, any>;
}

interface TranslationResult {
	originalText: string;
	translatedText: string;
	sourceLanguage: string;
	targetLanguage: string;
	confidence: number;
	context: string;
	metadata: {
		wordCount: number;
		characterCount: number;
		translationTime: number;
	};
}

async function translateContent(request: TranslationRequest): Promise<TranslationResult> {
	try {
		// Simulate AI-powered translation
		const translations = {
			'en-es': {
				'Welcome to our practice': 'Bienvenido a nuestra práctica',
				'How can I help you today?': '¿Cómo puedo ayudarte hoy?',
				'Book an appointment': 'Reservar una cita',
				'Insurance verification': 'Verificación de seguro',
				'Thank you for choosing us': 'Gracias por elegirnos',
			},
			'es-en': {
				'Bienvenido a nuestra práctica': 'Welcome to our practice',
				'¿Cómo puedo ayudarte hoy?': 'How can I help you today?',
				'Reservar una cita': 'Book an appointment',
				'Verificación de seguro': 'Insurance verification',
				'Gracias por elegirnos': 'Thank you for choosing us',
			},
			'en-fr': {
				'Welcome to our practice': 'Bienvenue dans notre cabinet',
				'How can I help you today?': 'Comment puis-je vous aider aujourd\'hui?',
				'Book an appointment': 'Prendre rendez-vous',
				'Insurance verification': 'Vérification d\'assurance',
				'Thank you for choosing us': 'Merci de nous avoir choisis',
			},
		};

		const languagePair = `${request.sourceLanguage}-${request.targetLanguage}`;
		const translationMap = translations[languagePair as keyof typeof translations] || {};
		
		let translatedText = request.text;
		
		// Apply translations
		for (const [original, translated] of Object.entries(translationMap)) {
			// Replace original text with translated text
			if (typeof translated === 'string') {
				translatedText = translatedText.replace(new RegExp(original, 'gi'), translated);
			}
		}

		// If no specific translation found, provide a generic response
		if (translatedText === request.text) {
			translatedText = `[Translated to ${request.targetLanguage.toUpperCase()}] ${request.text}`;
		}

		return {
			originalText: request.text,
			translatedText,
			sourceLanguage: request.sourceLanguage,
			targetLanguage: request.targetLanguage,
			confidence: 0.85,
			context: request.context || 'general',
			metadata: {
				wordCount: request.text.split(' ').length,
				characterCount: request.text.length,
				translationTime: Date.now(),
			},
		};
	} catch (error) {
		throw new Error(`Translation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

async function detectLanguage(text: string): Promise<LanguageDetection> {
	try {
		// Simulate language detection
		const languagePatterns = {
			en: /^(?=.*[a-zA-Z])(?!.*[áéíóúñü]).*$/,
			es: /[áéíóúñü]/,
			fr: /[àâäéèêëïîôöùûüÿç]/,
			de: /[äöüß]/,
			it: /[àèéìíîòóù]/,
			pt: /[ãõâêîôû]/,
		};

		let detectedLanguage = 'en';
		let confidence = 0.7;

		// Check for language-specific characters
		for (const [lang, pattern] of Object.entries(languagePatterns)) {
			if (pattern.test(text)) {
				detectedLanguage = lang;
				confidence = 0.9;
				break;
			}
		}

		// Check for common words
		const commonWords = {
			es: ['hola', 'gracias', 'por', 'el', 'la', 'de', 'que', 'y'],
			fr: ['bonjour', 'merci', 'pour', 'le', 'la', 'de', 'que', 'et'],
			de: ['hallo', 'danke', 'für', 'der', 'die', 'das', 'und'],
			it: ['ciao', 'grazie', 'per', 'il', 'la', 'di', 'che', 'e'],
			pt: ['olá', 'obrigado', 'para', 'o', 'a', 'de', 'que', 'e'],
		};

		for (const [lang, words] of Object.entries(commonWords)) {
			const wordCount = words.filter(word => 
				text.toLowerCase().includes(word)
			).length;
			
			if (wordCount > 0) {
				detectedLanguage = lang;
				confidence = Math.min(0.95, 0.7 + (wordCount * 0.05));
				break;
			}
		}

		return {
			text,
			confidence,
			detectedLanguage,
			alternatives: ['en', 'es', 'fr'].filter(lang => lang !== detectedLanguage),
		};
	} catch (error) {
		throw new Error(`Language detection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

async function localizeContent(request: LocalizationRequest): Promise<any> {
	try {
		// Simulate content localization
		const localizations = {
			'en-US': {
				dateFormat: 'MM/DD/YYYY',
				currency: 'USD',
				measurements: 'imperial',
				greeting: 'Hello',
				timeFormat: '12-hour',
			},
			'es-ES': {
				dateFormat: 'DD/MM/YYYY',
				currency: 'EUR',
				measurements: 'metric',
				greeting: 'Hola',
				timeFormat: '24-hour',
			},
			'fr-FR': {
				dateFormat: 'DD/MM/YYYY',
				currency: 'EUR',
				measurements: 'metric',
				greeting: 'Bonjour',
				timeFormat: '24-hour',
			},
			'de-DE': {
				dateFormat: 'DD.MM.YYYY',
				currency: 'EUR',
				measurements: 'metric',
				greeting: 'Hallo',
				timeFormat: '24-hour',
			},
		};

		const sourceLocale = localizations[request.sourceLocale as keyof typeof localizations] || localizations['en-US'];
		const targetLocale = localizations[request.targetLocale as keyof typeof localizations] || localizations['en-US'];

		let localizedContent = request.content;

		// Apply cultural adaptations
		if (sourceLocale.greeting !== targetLocale.greeting) {
			localizedContent = localizedContent.replace(
				new RegExp(sourceLocale.greeting, 'gi'), 
				targetLocale.greeting
			);
		}

		// Add cultural context notes
		const culturalNotes = [
			`Date format: ${targetLocale.dateFormat}`,
			`Currency: ${targetLocale.currency}`,
			`Measurements: ${targetLocale.measurements}`,
			`Time format: ${targetLocale.timeFormat}`,
		];

		return {
			status: 'success',
			originalContent: request.content,
			localizedContent,
			sourceLocale: request.sourceLocale,
			targetLocale: request.targetLocale,
			adaptations: {
				dateFormat: targetLocale.dateFormat,
				currency: targetLocale.currency,
				measurements: targetLocale.measurements,
				timeFormat: targetLocale.timeFormat,
			},
			culturalNotes,
			contentType: request.contentType,
			localizedAt: new Date().toISOString(),
		};
	} catch (error) {
		throw new Error(`Localization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

export class LyricistAgent implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LyricistAgent',
		name: 'lyricistAgent',
		group: ['transform'],
		version: 1,
		description: 'Multilingual support and localization specialist. Translates and localizes content for global audiences.',
		defaults: {
			name: 'LyricistAgent',
		},
		icon: 'file:lyricist.svg',
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Translate Content',
						value: 'translate',
						description: 'Translate content between languages',
					},
					{
						name: 'Detect Language',
						value: 'detect',
						description: 'Detect the language of input text',
					},
					{
						name: 'Localize Content',
						value: 'localize',
						description: 'Localize content for cultural context',
					},
				],
				default: 'translate',
				description: 'The operation to perform',
			},
			{
				displayName: 'Text to Translate',
				name: 'text',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['translate'],
					},
				},
				description: 'Text to be translated',
			},
			{
				displayName: 'Source Language',
				name: 'sourceLanguage',
				type: 'options',
				options: [
					{ name: 'English', value: 'en' },
					{ name: 'Spanish', value: 'es' },
					{ name: 'French', value: 'fr' },
					{ name: 'German', value: 'de' },
					{ name: 'Italian', value: 'it' },
					{ name: 'Portuguese', value: 'pt' },
				],
				default: 'en',
				displayOptions: {
					show: {
						operation: ['translate'],
					},
				},
				description: 'Source language of the text',
			},
			{
				displayName: 'Target Language',
				name: 'targetLanguage',
				type: 'options',
				options: [
					{ name: 'English', value: 'en' },
					{ name: 'Spanish', value: 'es' },
					{ name: 'French', value: 'fr' },
					{ name: 'German', value: 'de' },
					{ name: 'Italian', value: 'it' },
					{ name: 'Portuguese', value: 'pt' },
				],
				default: 'es',
				displayOptions: {
					show: {
						operation: ['translate'],
					},
				},
				description: 'Target language for translation',
			},
			{
				displayName: 'Context',
				name: 'context',
				type: 'string',
				default: 'general',
				displayOptions: {
					show: {
						operation: ['translate'],
					},
				},
				description: 'Context for translation (e.g., medical, legal, general)',
			},
			{
				displayName: 'Industry',
				name: 'industry',
				type: 'string',
				default: 'healthcare',
				displayOptions: {
					show: {
						operation: ['translate'],
					},
				},
				description: 'Industry context for translation',
			},
			{
				displayName: 'Text to Analyze',
				name: 'detectText',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['detect'],
					},
				},
				description: 'Text to analyze for language detection',
			},
			{
				displayName: 'Content to Localize',
				name: 'localizeContent',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['localize'],
					},
				},
				description: 'Content to be localized',
			},
			{
				displayName: 'Source Locale',
				name: 'sourceLocale',
				type: 'options',
				options: [
					{ name: 'English (US)', value: 'en-US' },
					{ name: 'Spanish (Spain)', value: 'es-ES' },
					{ name: 'French (France)', value: 'fr-FR' },
					{ name: 'German (Germany)', value: 'de-DE' },
				],
				default: 'en-US',
				displayOptions: {
					show: {
						operation: ['localize'],
					},
				},
				description: 'Source locale for localization',
			},
			{
				displayName: 'Target Locale',
				name: 'targetLocale',
				type: 'options',
				options: [
					{ name: 'English (US)', value: 'en-US' },
					{ name: 'Spanish (Spain)', value: 'es-ES' },
					{ name: 'French (France)', value: 'fr-FR' },
					{ name: 'German (Germany)', value: 'de-DE' },
				],
				default: 'es-ES',
				displayOptions: {
					show: {
						operation: ['localize'],
					},
				},
				description: 'Target locale for localization',
			},
			{
				displayName: 'Content Type',
				name: 'contentType',
				type: 'options',
				options: [
					{ name: 'Email', value: 'email' },
					{ name: 'SMS', value: 'sms' },
					{ name: 'Web', value: 'web' },
					{ name: 'Chat', value: 'chat' },
					{ name: 'Document', value: 'document' },
				],
				default: 'email',
				displayOptions: {
					show: {
						operation: ['localize'],
					},
				},
				description: 'Type of content being localized',
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
					case 'translate':
						const request: TranslationRequest = {
							text: this.getNodeParameter('text', i) as string,
							sourceLanguage: this.getNodeParameter('sourceLanguage', i) as string,
							targetLanguage: this.getNodeParameter('targetLanguage', i) as string,
							context: this.getNodeParameter('context', i) as string,
							industry: this.getNodeParameter('industry', i) as string,
						};
						result = await translateContent(request);
						break;

					case 'detect':
						const text = this.getNodeParameter('detectText', i) as string;
						result = await detectLanguage(text);
						break;

					case 'localize':
						const localizationRequest: LocalizationRequest = {
							content: this.getNodeParameter('localizeContent', i) as string,
							sourceLocale: this.getNodeParameter('sourceLocale', i) as string,
							targetLocale: this.getNodeParameter('targetLocale', i) as string,
							contentType: this.getNodeParameter('contentType', i) as any,
						};
						result = await localizeContent(localizationRequest);
						break;

					default:
						throw new Error(`Operation ${operation} not supported`);
				}

				returnData.push({
					json: {
						operation,
						result,
						agent: 'LyricistAgent',
						timestamp: new Date().toISOString(),
					},
				});
			} catch (error) {
				returnData.push({
					json: {
						operation: this.getNodeParameter('operation', i) as string,
						error: error instanceof Error ? error.message : 'Unknown error',
						agent: 'LyricistAgent',
						timestamp: new Date().toISOString(),
					},
				});
			}
		}

		return [returnData];
	}
} 