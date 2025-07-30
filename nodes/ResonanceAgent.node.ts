import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

/**
 * ResonanceAgent - Feedback Collection and Analysis
 * 
 * The ResonanceAgent collects, analyzes, and reports on customer feedback to
 * drive continuous improvement and customer satisfaction. It provides insights
 * into service quality and identifies opportunities for enhancement.
 * 
 * Key Responsibilities:
 * - Collect comprehensive customer feedback
 * - Analyze feedback sentiment and themes
 * - Generate actionable insights and reports
 * - Track satisfaction metrics over time
 * - Identify improvement opportunities
 */

interface FeedbackRequest {
	customerId: string;
	interactionId: string;
	feedbackType: 'appointment' | 'service' | 'communication' | 'facility' | 'overall' | 'custom';
	rating: number; // 1-5 scale
	categories: string[];
	comments: string;
	sentiment?: 'positive' | 'neutral' | 'negative';
	priority: 'low' | 'medium' | 'high';
	metadata?: Record<string, any>;
}

interface AnalysisRequest {
	feedbackIds: string[];
	timeRange: {
		start: string;
		end: string;
	};
	analysisType: 'sentiment' | 'themes' | 'trends' | 'comparative' | 'comprehensive';
	filters?: {
		feedbackType?: string[];
		rating?: number[];
		categories?: string[];
	};
}

interface ReportRequest {
	analysisId: string;
	reportType: 'summary' | 'detailed' | 'executive' | 'actionable';
	format: 'json' | 'pdf' | 'csv' | 'dashboard';
	includeCharts: boolean;
	timeRange: {
		start: string;
		end: string;
	};
	recipients?: string[];
}

interface FeedbackResult {
	feedbackId: string;
	customerId: string;
	interactionId: string;
	status: 'submitted' | 'processed' | 'analyzed';
	rating: number;
	overallScore: number;
	sentiment: 'positive' | 'neutral' | 'negative';
	confidence: number;
	themes: Array<{
		theme: string;
		score: number;
		mentions: number;
		keywords: string[];
	}>;
	categories: string[];
	processedAt: string;
	nextSteps: string[];
}

interface AnalysisResult {
	analysisId: string;
	timeRange: {
		start: string;
		end: string;
	};
	summary: {
		totalFeedback: number;
		averageRating: number;
		sentimentDistribution: {
			positive: number;
			neutral: number;
			negative: number;
		};
		topThemes: string[];
		improvementAreas: string[];
	};
	sentimentAnalysis: {
		overallSentiment: 'positive' | 'neutral' | 'negative';
		confidence: number;
		keyDrivers: Array<{
			factor: string;
			impact: number;
			trend: 'improving' | 'stable' | 'declining';
		}>;
	};
	themeAnalysis: Array<{
		theme: string;
		frequency: number;
		sentiment: 'positive' | 'neutral' | 'negative';
		trend: 'increasing' | 'stable' | 'decreasing';
		recommendations: string[];
	}>;
	trends: Array<{
		metric: string;
		values: Array<{
			date: string;
			value: number;
		}>;
		trend: 'up' | 'down' | 'stable';
	}>;
	recommendations: Array<{
		priority: 'high' | 'medium' | 'low';
		category: string;
		action: string;
		expectedImpact: string;
		timeline: string;
	}>;
}

interface ReportResult {
	reportId: string;
	reportType: string;
	format: string;
	generatedAt: string;
	summary: {
		executiveSummary: string;
		keyFindings: string[];
		criticalIssues: string[];
		successStories: string[];
	};
	metrics: {
		overallSatisfaction: number;
		responseTime: number;
		resolutionRate: number;
		recommendationLikelihood: number;
		customerEffortScore: number;
	};
	insights: Array<{
		insight: string;
		confidence: number;
		supportingData: string[];
		actionability: 'high' | 'medium' | 'low';
	}>;
	actionItems: Array<{
		priority: 'critical' | 'high' | 'medium' | 'low';
		action: string;
		owner: string;
		timeline: string;
		expectedOutcome: string;
		successMetrics: string[];
	}>;
	reportUrl?: string;
	distributionStatus: {
		recipients: string[];
		delivered: boolean;
		deliveryTime?: string;
	};
}

async function collectFeedback(request: FeedbackRequest): Promise<FeedbackResult> {
	try {
		// Validate request
		if (!request.customerId || !request.interactionId || !request.comments) {
			throw new Error('Missing required fields: customerId, interactionId, comments');
		}

		if (request.rating < 1 || request.rating > 5) {
			throw new Error('Rating must be between 1 and 5');
		}

		// Generate unique feedback ID
		const feedbackId = `FB-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

		// Analyze sentiment from comments
		const sentimentKeywords = {
			positive: ['great', 'excellent', 'amazing', 'wonderful', 'good', 'satisfied', 'happy', 'love'],
			negative: ['terrible', 'awful', 'bad', 'poor', 'disappointed', 'frustrated', 'angry', 'hate'],
		};

		let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
		let confidence = 0.5;

		const commentLower = request.comments.toLowerCase();
		const positiveMatches = sentimentKeywords.positive.filter(word => commentLower.includes(word)).length;
		const negativeMatches = sentimentKeywords.negative.filter(word => commentLower.includes(word)).length;

		if (positiveMatches > negativeMatches) {
			sentiment = 'positive';
			confidence = Math.min(0.9, 0.5 + (positiveMatches * 0.1));
		} else if (negativeMatches > positiveMatches) {
			sentiment = 'negative';
			confidence = Math.min(0.9, 0.5 + (negativeMatches * 0.1));
		}

		// Extract themes from comments
		const commonThemes = ['service', 'communication', 'timeliness', 'professionalism', 'facility', 'cost'];
		const themes = commonThemes
			.filter(theme => commentLower.includes(theme))
			.map(theme => ({
				theme,
				score: Math.random() * 5,
				mentions: (commentLower.match(new RegExp(theme, 'g')) || []).length,
				keywords: [theme],
			}));

		// Calculate overall score
		const overallScore = (request.rating * 0.6) + (confidence * 0.4);

		return {
			feedbackId,
			customerId: request.customerId,
			interactionId: request.interactionId,
			status: 'submitted',
			rating: request.rating,
			overallScore,
			sentiment,
			confidence,
			themes,
			categories: request.categories,
			processedAt: new Date().toISOString(),
			nextSteps: [
				'Feedback processed and categorized',
				'Sentiment analysis completed',
				'Themes extracted for further analysis',
				'Ready for trend analysis',
			],
		};
	} catch (error) {
		throw new Error(`Feedback collection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

async function analyzeFeedback(request: AnalysisRequest): Promise<AnalysisResult> {
	try {
		// Validate request
		if (!request.feedbackIds.length || !request.timeRange.start || !request.timeRange.end) {
			throw new Error('Missing required fields: feedbackIds, timeRange');
		}

		// Generate unique analysis ID
		const analysisId = `ANAL-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

		// Simulate comprehensive analysis
		const totalFeedback = request.feedbackIds.length;
		const averageRating = 3.8 + (Math.random() * 1.2); // 3.8-5.0 range
		
		const sentimentDistribution = {
			positive: Math.floor(totalFeedback * 0.6),
			neutral: Math.floor(totalFeedback * 0.25),
			negative: Math.floor(totalFeedback * 0.15),
		};

		const overallSentiment = sentimentDistribution.positive > sentimentDistribution.negative ? 'positive' : 'negative';

		// Generate key drivers
		const keyDrivers = [
			{ factor: 'Response Time', impact: 0.85, trend: 'improving' as const },
			{ factor: 'Service Quality', impact: 0.92, trend: 'stable' as const },
			{ factor: 'Communication', impact: 0.78, trend: 'improving' as const },
			{ factor: 'Facility Cleanliness', impact: 0.65, trend: 'stable' as const },
		];

		// Generate theme analysis
		const themeAnalysis = [
			{
				theme: 'Service Quality',
				frequency: Math.floor(totalFeedback * 0.4),
				sentiment: 'positive' as const,
				trend: 'increasing' as const,
				recommendations: ['Maintain current service standards', 'Provide additional training opportunities'],
			},
			{
				theme: 'Communication',
				frequency: Math.floor(totalFeedback * 0.3),
				sentiment: 'positive' as const,
				trend: 'stable' as const,
				recommendations: ['Continue clear communication practices', 'Implement feedback loops'],
			},
			{
				theme: 'Wait Times',
				frequency: Math.floor(totalFeedback * 0.2),
				sentiment: 'neutral' as const,
				trend: 'decreasing' as const,
				recommendations: ['Optimize scheduling processes', 'Implement real-time updates'],
			},
		];

		// Generate trends
		const trends = [
			{
				metric: 'Overall Satisfaction',
				values: Array.from({ length: 7 }, (_, i) => ({
					date: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
					value: 4.0 + (Math.random() * 0.5),
				})),
				trend: 'up' as const,
			},
		];

		// Generate recommendations
		const recommendations = [
			{
				priority: 'high' as const,
				category: 'Communication',
				action: 'Implement automated appointment reminders',
				expectedImpact: 'Reduce no-shows by 25%',
				timeline: '2 weeks',
			},
			{
				priority: 'medium' as const,
				category: 'Service Quality',
				action: 'Provide additional staff training',
				expectedImpact: 'Improve satisfaction scores by 15%',
				timeline: '1 month',
			},
		];

		return {
			analysisId,
			timeRange: request.timeRange,
			summary: {
				totalFeedback,
				averageRating,
				sentimentDistribution,
				topThemes: themeAnalysis.map(t => t.theme),
				improvementAreas: ['Wait Times', 'Facility Updates'],
			},
			sentimentAnalysis: {
				overallSentiment,
				confidence: 0.85,
				keyDrivers,
			},
			themeAnalysis,
			trends,
			recommendations,
		};
	} catch (error) {
		throw new Error(`Feedback analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

async function generateReport(request: ReportRequest): Promise<ReportResult> {
	try {
		// Validate request
		if (!request.analysisId || !request.reportType || !request.format) {
			throw new Error('Missing required fields: analysisId, reportType, format');
		}

		// Generate unique report ID
		const reportId = `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

		// Simulate report generation
		const metrics = {
			overallSatisfaction: 4.2,
			responseTime: 92,
			resolutionRate: 88,
			recommendationLikelihood: 85,
			customerEffortScore: 2.1,
		};

		const insights = [
			{
				insight: 'Customer satisfaction is trending upward over the past month',
				confidence: 0.92,
				supportingData: ['15% increase in positive feedback', 'Reduced wait times by 20%'],
				actionability: 'high' as const,
			},
			{
				insight: 'Communication quality is the strongest driver of satisfaction',
				confidence: 0.88,
				supportingData: ['92% positive sentiment in communication feedback'],
				actionability: 'medium' as const,
			},
		];

		const actionItems = [
			{
				priority: 'high' as const,
				action: 'Implement automated appointment reminders',
				owner: 'Operations Team',
				timeline: '2 weeks',
				expectedOutcome: 'Reduce no-shows by 25%',
				successMetrics: ['No-show rate', 'Patient satisfaction'],
			},
			{
				priority: 'medium' as const,
				action: 'Enhance staff communication training',
				owner: 'HR Department',
				timeline: '1 month',
				expectedOutcome: 'Improve communication scores by 15%',
				successMetrics: ['Communication satisfaction', 'Patient feedback scores'],
			},
		];

		return {
			reportId,
			reportType: request.reportType,
			format: request.format,
			generatedAt: new Date().toISOString(),
			summary: {
				executiveSummary: 'Overall customer satisfaction is strong with positive trends. Key focus areas include reducing wait times and enhancing communication.',
				keyFindings: [
					'Satisfaction scores increased by 15% this month',
					'Communication quality is the top driver of satisfaction',
					'Wait times remain a concern for 20% of customers',
				],
				criticalIssues: [
					'Facility maintenance needs attention',
					'Weekend appointment availability limited',
				],
				successStories: [
					'New online booking system well-received',
					'Staff training program showing positive results',
				],
			},
			metrics,
			insights,
			actionItems,
			reportUrl: `https://reports.example.com/${reportId}`,
			distributionStatus: {
				recipients: request.recipients || [],
				delivered: false,
			},
		};
	} catch (error) {
		throw new Error(`Report generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

export class ResonanceAgent implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ResonanceAgent',
		name: 'resonanceAgent',
		group: ['transform'],
		version: 1,
		description: 'Feedback collection and analysis specialist. Collects, analyzes, and reports on customer feedback for continuous improvement.',
		defaults: {
			name: 'ResonanceAgent',
		},
		icon: 'file:resonance.svg',
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Collect Feedback',
						value: 'collect',
						description: 'Collect and process customer feedback',
					},
					{
						name: 'Analyze Feedback',
						value: 'analyze',
						description: 'Analyze feedback for insights and trends',
					},
					{
						name: 'Generate Report',
						value: 'report',
						description: 'Generate comprehensive feedback reports',
					},
				],
				default: 'collect',
				description: 'The operation to perform',
			},
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['collect'],
					},
				},
				description: 'Unique identifier for the customer',
			},
			{
				displayName: 'Interaction ID',
				name: 'interactionId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['collect'],
					},
				},
				description: 'ID of the interaction being rated',
			},
			{
				displayName: 'Feedback Type',
				name: 'feedbackType',
				type: 'options',
				options: [
					{ name: 'Appointment', value: 'appointment' },
					{ name: 'Service', value: 'service' },
					{ name: 'Communication', value: 'communication' },
					{ name: 'Facility', value: 'facility' },
					{ name: 'Overall', value: 'overall' },
					{ name: 'Custom', value: 'custom' },
				],
				default: 'service',
				displayOptions: {
					show: {
						operation: ['collect'],
					},
				},
				description: 'Type of feedback being collected',
			},
			{
				displayName: 'Rating',
				name: 'rating',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 5,
				},
				default: 4,
				displayOptions: {
					show: {
						operation: ['collect'],
					},
				},
				description: 'Customer rating (1-5 scale)',
			},
			{
				displayName: 'Categories',
				name: 'categories',
				type: 'multiOptions',
				options: [
					{ name: 'Service Quality', value: 'service_quality' },
					{ name: 'Communication', value: 'communication' },
					{ name: 'Timeliness', value: 'timeliness' },
					{ name: 'Professionalism', value: 'professionalism' },
					{ name: 'Facility', value: 'facility' },
					{ name: 'Cost', value: 'cost' },
					{ name: 'Staff', value: 'staff' },
					{ name: 'Technology', value: 'technology' },
				],
				default: ['service_quality'],
				displayOptions: {
					show: {
						operation: ['collect'],
					},
				},
				description: 'Categories relevant to the feedback',
			},
			{
				displayName: 'Comments',
				name: 'comments',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['collect'],
					},
				},
				description: 'Detailed feedback comments',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				options: [
					{ name: 'Low', value: 'low' },
					{ name: 'Medium', value: 'medium' },
					{ name: 'High', value: 'high' },
				],
				default: 'medium',
				displayOptions: {
					show: {
						operation: ['collect'],
					},
				},
				description: 'Priority level of the feedback',
			},
			{
				displayName: 'Feedback IDs',
				name: 'feedbackIds',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['analyze'],
					},
				},
				description: 'Comma-separated list of feedback IDs to analyze',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['analyze', 'report'],
					},
				},
				description: 'Start date for analysis period (ISO string)',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['analyze', 'report'],
					},
				},
				description: 'End date for analysis period (ISO string)',
			},
			{
				displayName: 'Analysis Type',
				name: 'analysisType',
				type: 'options',
				options: [
					{ name: 'Sentiment', value: 'sentiment' },
					{ name: 'Themes', value: 'themes' },
					{ name: 'Trends', value: 'trends' },
					{ name: 'Comparative', value: 'comparative' },
					{ name: 'Comprehensive', value: 'comprehensive' },
				],
				default: 'comprehensive',
				displayOptions: {
					show: {
						operation: ['analyze'],
					},
				},
				description: 'Type of analysis to perform',
			},
			{
				displayName: 'Analysis ID',
				name: 'analysisId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['report'],
					},
				},
				description: 'ID of the analysis to generate report from',
			},
			{
				displayName: 'Report Type',
				name: 'reportType',
				type: 'options',
				options: [
					{ name: 'Summary', value: 'summary' },
					{ name: 'Detailed', value: 'detailed' },
					{ name: 'Executive', value: 'executive' },
					{ name: 'Actionable', value: 'actionable' },
				],
				default: 'executive',
				displayOptions: {
					show: {
						operation: ['report'],
					},
				},
				description: 'Type of report to generate',
			},
			{
				displayName: 'Report Format',
				name: 'reportFormat',
				type: 'options',
				options: [
					{ name: 'JSON', value: 'json' },
					{ name: 'PDF', value: 'pdf' },
					{ name: 'CSV', value: 'csv' },
					{ name: 'Dashboard', value: 'dashboard' },
				],
				default: 'pdf',
				displayOptions: {
					show: {
						operation: ['report'],
					},
				},
				description: 'Format of the generated report',
			},
			{
				displayName: 'Include Charts',
				name: 'includeCharts',
				type: 'boolean',
				default: true,
				displayOptions: {
					show: {
						operation: ['report'],
					},
				},
				description: 'Whether to include charts and visualizations',
			},
			{
				displayName: 'Recipients',
				name: 'recipients',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['report'],
					},
				},
				description: 'Comma-separated list of email recipients',
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
					case 'collect':
						const feedbackRequest: FeedbackRequest = {
							customerId: this.getNodeParameter('customerId', i) as string,
							interactionId: this.getNodeParameter('interactionId', i) as string,
							feedbackType: this.getNodeParameter('feedbackType', i) as any,
							rating: this.getNodeParameter('rating', i) as number,
							categories: this.getNodeParameter('categories', i) as any,
							comments: this.getNodeParameter('comments', i) as string,
							priority: this.getNodeParameter('priority', i) as any,
						};
						result = await collectFeedback(feedbackRequest);
						break;

					case 'analyze':
						const analysisRequest: AnalysisRequest = {
							feedbackIds: (this.getNodeParameter('feedbackIds', i) as string).split(',').map(id => id.trim()),
							timeRange: {
								start: this.getNodeParameter('startDate', i) as string,
								end: this.getNodeParameter('endDate', i) as string,
							},
							analysisType: this.getNodeParameter('analysisType', i) as any,
						};
						result = await analyzeFeedback(analysisRequest);
						break;

					case 'report':
						const reportRequest: ReportRequest = {
							analysisId: this.getNodeParameter('analysisId', i) as string,
							reportType: this.getNodeParameter('reportType', i) as any,
							format: this.getNodeParameter('reportFormat', i) as any,
							includeCharts: this.getNodeParameter('includeCharts', i) as boolean,
							timeRange: {
								start: this.getNodeParameter('startDate', i) as string,
								end: this.getNodeParameter('endDate', i) as string,
							},
							recipients: (this.getNodeParameter('recipients', i) as string).split(',').map(email => email.trim()),
						};
						result = await generateReport(reportRequest);
						break;

					default:
						throw new Error(`Operation ${operation} not supported`);
				}

				returnData.push({
					json: {
						operation,
						result,
						agent: 'ResonanceAgent',
						timestamp: new Date().toISOString(),
					},
				});
			} catch (error) {
				returnData.push({
					json: {
						operation: this.getNodeParameter('operation', i) as string,
						error: error instanceof Error ? error.message : 'Unknown error',
						agent: 'ResonanceAgent',
						timestamp: new Date().toISOString(),
					},
				});
			}
		}

		return [returnData];
	}
} 