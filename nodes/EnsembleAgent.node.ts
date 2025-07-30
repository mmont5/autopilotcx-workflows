import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

/**
 * EnsembleAgent - Customer Support and Issue Resolution
 * 
 * The EnsembleAgent orchestrates customer support operations, ensuring seamless
 * issue resolution and exceptional customer service. It manages support requests,
 * escalations, and tracks resolutions through completion.
 * 
 * Key Responsibilities:
 * - Handle customer support requests efficiently
 * - Escalate complex issues to appropriate teams
 * - Track resolution progress and timelines
 * - Coordinate multi-channel support operations
 * - Ensure customer satisfaction and follow-up
 */

interface SupportRequest {
	customerId: string;
	issueType: 'technical' | 'billing' | 'appointment' | 'general' | 'urgent';
	priority: 'low' | 'medium' | 'high' | 'critical';
	description: string;
	channel: 'email' | 'phone' | 'chat' | 'web' | 'social';
	contactInfo: {
		email?: string;
		phone?: string;
		name: string;
	};
	metadata?: Record<string, any>;
}

interface EscalationRequest {
	supportTicketId: string;
	reason: 'complex_technical' | 'billing_dispute' | 'legal_issue' | 'system_outage' | 'customer_escalation';
	currentLevel: 'tier1' | 'tier2' | 'tier3';
	targetLevel: 'tier2' | 'tier3' | 'management';
	description: string;
	urgency: 'normal' | 'high' | 'urgent';
}

interface ResolutionTracking {
	ticketId: string;
	status: 'open' | 'in_progress' | 'pending_customer' | 'resolved' | 'closed';
	assignedTo: string;
	estimatedResolution: string;
	actualResolution?: string;
	notes: string[];
}

interface SupportResponse {
	ticketId: string;
	status: 'created' | 'assigned' | 'in_progress' | 'resolved';
	priority: string;
	assignedAgent?: string;
	estimatedResolution: string;
	nextSteps: string[];
	communicationHistory: Array<{
		timestamp: string;
		agent: string;
		message: string;
		type: 'initial' | 'update' | 'resolution' | 'followup';
	}>;
}

function parseTimeToMs(timeString: string): number {
	const timeMap: Record<string, number> = {
		'30 minutes': 30 * 60 * 1000,
		'1 hour': 60 * 60 * 1000,
		'2 hours': 2 * 60 * 60 * 1000,
		'4 hours': 4 * 60 * 60 * 1000,
		'8 hours': 8 * 60 * 60 * 1000,
		'24 hours': 24 * 60 * 60 * 1000,
		'48 hours': 48 * 60 * 60 * 1000,
		'72 hours': 72 * 60 * 60 * 1000,
	};
	return timeMap[timeString] || 60 * 60 * 1000; // Default to 1 hour
}

async function handleSupportRequest(request: SupportRequest): Promise<SupportResponse> {
	try {
		// Generate unique ticket ID
		const ticketId = `SUP-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
		
		// Determine priority and response time
		const priorityConfig = {
			critical: { responseTime: '1 hour', escalationThreshold: '2 hours' },
			high: { responseTime: '4 hours', escalationThreshold: '8 hours' },
			medium: { responseTime: '24 hours', escalationThreshold: '48 hours' },
			low: { responseTime: '48 hours', escalationThreshold: '72 hours' },
		};

		const config = priorityConfig[request.priority];
		const estimatedResolution = new Date(Date.now() + parseTimeToMs(config.responseTime)).toISOString();

		// Assign agent based on issue type and priority
		const agentAssignment = {
			technical: 'TechSupport',
			billing: 'BillingTeam',
			appointment: 'SchedulingTeam',
			general: 'CustomerService',
			urgent: 'EmergencyTeam',
		};

		const assignedAgent = agentAssignment[request.issueType] || 'CustomerService';

		// Create initial response
		const initialMessage = {
			timestamp: new Date().toISOString(),
			agent: 'System',
			message: `Thank you for contacting us. Your ticket #${ticketId} has been created and assigned to our ${assignedAgent}. We will respond within ${config.responseTime}.`,
			type: 'initial' as const,
		};

		return {
			ticketId,
			status: 'created',
			priority: request.priority,
			assignedAgent,
			estimatedResolution,
			nextSteps: [
				`Agent ${assignedAgent} will review your request within ${config.responseTime}`,
				'You will receive updates via your preferred contact method',
				'If no response within escalation threshold, issue will be escalated automatically',
			],
			communicationHistory: [initialMessage],
		};
	} catch (error) {
		throw new Error(`Support request handling failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

async function escalateIssue(request: EscalationRequest): Promise<any> {
	try {
		// Validate escalation path
		const validEscalations = {
			tier1: ['tier2', 'tier3'],
			tier2: ['tier3', 'management'],
			tier3: ['management'],
		};

		const allowedTargets = validEscalations[request.currentLevel as keyof typeof validEscalations] || [];
		
		if (!allowedTargets.includes(request.targetLevel)) {
			throw new Error(`Invalid escalation from ${request.currentLevel} to ${request.targetLevel}`);
		}

		// Determine escalation urgency and response time
		const urgencyConfig = {
			urgent: { responseTime: '30 minutes', autoEscalate: true },
			high: { responseTime: '2 hours', autoEscalate: false },
			normal: { responseTime: '4 hours', autoEscalate: false },
		};

		const config = urgencyConfig[request.urgency];
		const escalationTime = new Date().toISOString();

		// Create escalation record
		const escalationRecord = {
			ticketId: request.supportTicketId,
			escalationId: `ESC-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
			fromLevel: request.currentLevel,
			toLevel: request.targetLevel,
			reason: request.reason,
			urgency: request.urgency,
			description: request.description,
			escalatedAt: escalationTime,
			expectedResponse: new Date(Date.now() + parseTimeToMs(config.responseTime)).toISOString(),
			status: 'pending',
			autoEscalated: config.autoEscalate,
		};

		// Generate escalation notification
		const notification = {
			timestamp: escalationTime,
			agent: 'System',
			message: `Issue escalated from ${request.currentLevel} to ${request.targetLevel}. Reason: ${request.reason}. Expected response within ${config.responseTime}.`,
			type: 'escalation' as const,
		};

		return {
			status: 'escalated',
			escalationRecord,
			notification,
			nextSteps: [
				`${request.targetLevel} team will review within ${config.responseTime}`,
				'Customer will be notified of escalation',
				'Progress updates will be provided regularly',
			],
		};
	} catch (error) {
		throw new Error(`Issue escalation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

async function trackResolution(tracking: ResolutionTracking): Promise<any> {
	try {
		// Update resolution status
		const statusUpdates = {
			open: { nextAction: 'Assign to agent', estimatedTime: '2 hours' },
			in_progress: { nextAction: 'Work on resolution', estimatedTime: '4 hours' },
			pending_customer: { nextAction: 'Wait for customer response', estimatedTime: '24 hours' },
			resolved: { nextAction: 'Close ticket', estimatedTime: '1 hour' },
			closed: { nextAction: 'Archive ticket', estimatedTime: '0 hours' },
		};

		const statusConfig = statusUpdates[tracking.status as keyof typeof statusUpdates];
		
		// Calculate progress percentage
		const progressMap = {
			open: 10,
			in_progress: 50,
			pending_customer: 75,
			resolved: 95,
			closed: 100,
		};

		const progress = progressMap[tracking.status as keyof typeof progressMap] || 0;

		// Generate tracking update
		const trackingUpdate = {
			ticketId: tracking.ticketId,
			currentStatus: tracking.status,
			progress: `${progress}%`,
			assignedTo: tracking.assignedTo,
			lastUpdated: new Date().toISOString(),
			estimatedResolution: tracking.estimatedResolution,
			actualResolution: tracking.actualResolution,
			nextAction: statusConfig.nextAction,
			timeToNextAction: statusConfig.estimatedTime,
			notes: tracking.notes,
			statusHistory: [
				{
					status: tracking.status,
					timestamp: new Date().toISOString(),
					agent: tracking.assignedTo,
					notes: tracking.notes[tracking.notes.length - 1] || 'Status updated',
				},
			],
		};

		return {
			status: 'tracking_updated',
			trackingUpdate,
			progress,
			nextSteps: [
				statusConfig.nextAction,
				`Estimated time to completion: ${statusConfig.estimatedTime}`,
				'Customer will be notified of status changes',
			],
		};
	} catch (error) {
		throw new Error(`Resolution tracking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

export class EnsembleAgent implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'EnsembleAgent',
		name: 'ensembleAgent',
		group: ['transform'],
		version: 1,
		description: 'Customer support and issue resolution specialist. Manages support requests, escalations, and tracks resolutions.',
		defaults: {
			name: 'EnsembleAgent',
		},
		icon: 'file:ensemble.svg',
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Handle Support Request',
						value: 'support',
						description: 'Create and manage customer support tickets',
					},
					{
						name: 'Escalate Issue',
						value: 'escalate',
						description: 'Escalate issues to higher support tiers',
					},
					{
						name: 'Track Resolution',
						value: 'track',
						description: 'Track and update resolution progress',
					},
				],
				default: 'support',
				description: 'The operation to perform',
			},
			{
				displayName: 'Customer ID',
				name: 'customerId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['support'],
					},
				},
				description: 'Unique identifier for the customer',
			},
			{
				displayName: 'Issue Type',
				name: 'issueType',
				type: 'options',
				options: [
					{ name: 'Technical', value: 'technical' },
					{ name: 'Billing', value: 'billing' },
					{ name: 'Appointment', value: 'appointment' },
					{ name: 'General', value: 'general' },
					{ name: 'Urgent', value: 'urgent' },
				],
				default: 'general',
				displayOptions: {
					show: {
						operation: ['support'],
					},
				},
				description: 'Type of support issue',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				options: [
					{ name: 'Low', value: 'low' },
					{ name: 'Medium', value: 'medium' },
					{ name: 'High', value: 'high' },
					{ name: 'Critical', value: 'critical' },
				],
				default: 'medium',
				displayOptions: {
					show: {
						operation: ['support'],
					},
				},
				description: 'Priority level of the issue',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['support', 'escalate'],
					},
				},
				description: 'Detailed description of the issue',
			},
			{
				displayName: 'Contact Channel',
				name: 'channel',
				type: 'options',
				options: [
					{ name: 'Email', value: 'email' },
					{ name: 'Phone', value: 'phone' },
					{ name: 'Chat', value: 'chat' },
					{ name: 'Web', value: 'web' },
					{ name: 'Social', value: 'social' },
				],
				default: 'email',
				displayOptions: {
					show: {
						operation: ['support'],
					},
				},
				description: 'Channel through which support was requested',
			},
			{
				displayName: 'Customer Name',
				name: 'customerName',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['support'],
					},
				},
				description: 'Name of the customer',
			},
			{
				displayName: 'Customer Email',
				name: 'customerEmail',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['support'],
					},
				},
				description: 'Email address of the customer',
			},
			{
				displayName: 'Customer Phone',
				name: 'customerPhone',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['support'],
					},
				},
				description: 'Phone number of the customer',
			},
			{
				displayName: 'Support Ticket ID',
				name: 'supportTicketId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['escalate', 'track'],
					},
				},
				description: 'ID of the support ticket to escalate or track',
			},
			{
				displayName: 'Escalation Reason',
				name: 'escalationReason',
				type: 'options',
				options: [
					{ name: 'Complex Technical Issue', value: 'complex_technical' },
					{ name: 'Billing Dispute', value: 'billing_dispute' },
					{ name: 'Legal Issue', value: 'legal_issue' },
					{ name: 'System Outage', value: 'system_outage' },
					{ name: 'Customer Escalation', value: 'customer_escalation' },
				],
				default: 'complex_technical',
				displayOptions: {
					show: {
						operation: ['escalate'],
					},
				},
				description: 'Reason for escalating the issue',
			},
			{
				displayName: 'Current Support Level',
				name: 'currentLevel',
				type: 'options',
				options: [
					{ name: 'Tier 1', value: 'tier1' },
					{ name: 'Tier 2', value: 'tier2' },
					{ name: 'Tier 3', value: 'tier3' },
				],
				default: 'tier1',
				displayOptions: {
					show: {
						operation: ['escalate'],
					},
				},
				description: 'Current support tier level',
			},
			{
				displayName: 'Target Support Level',
				name: 'targetLevel',
				type: 'options',
				options: [
					{ name: 'Tier 2', value: 'tier2' },
					{ name: 'Tier 3', value: 'tier3' },
					{ name: 'Management', value: 'management' },
				],
				default: 'tier2',
				displayOptions: {
					show: {
						operation: ['escalate'],
					},
				},
				description: 'Target support tier for escalation',
			},
			{
				displayName: 'Escalation Urgency',
				name: 'escalationUrgency',
				type: 'options',
				options: [
					{ name: 'Normal', value: 'normal' },
					{ name: 'High', value: 'high' },
					{ name: 'Urgent', value: 'urgent' },
				],
				default: 'normal',
				displayOptions: {
					show: {
						operation: ['escalate'],
					},
				},
				description: 'Urgency level of the escalation',
			},
			{
				displayName: 'Resolution Status',
				name: 'resolutionStatus',
				type: 'options',
				options: [
					{ name: 'Open', value: 'open' },
					{ name: 'In Progress', value: 'in_progress' },
					{ name: 'Pending Customer', value: 'pending_customer' },
					{ name: 'Resolved', value: 'resolved' },
					{ name: 'Closed', value: 'closed' },
				],
				default: 'open',
				displayOptions: {
					show: {
						operation: ['track'],
					},
				},
				description: 'Current status of the resolution',
			},
			{
				displayName: 'Assigned To',
				name: 'assignedTo',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['track'],
					},
				},
				description: 'Agent or team assigned to the ticket',
			},
			{
				displayName: 'Estimated Resolution',
				name: 'estimatedResolution',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['track'],
					},
				},
				description: 'Estimated time for resolution (ISO string)',
			},
			{
				displayName: 'Resolution Notes',
				name: 'resolutionNotes',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['track'],
					},
				},
				description: 'Notes about the resolution progress',
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
					case 'support':
						const supportRequest: SupportRequest = {
							customerId: this.getNodeParameter('customerId', i) as string,
							issueType: this.getNodeParameter('issueType', i) as any,
							priority: this.getNodeParameter('priority', i) as any,
							description: this.getNodeParameter('description', i) as string,
							channel: this.getNodeParameter('channel', i) as any,
							contactInfo: {
								name: this.getNodeParameter('customerName', i) as string,
								email: this.getNodeParameter('customerEmail', i) as string,
								phone: this.getNodeParameter('customerPhone', i) as string,
							},
						};
						result = await handleSupportRequest(supportRequest);
						break;

					case 'escalate':
						const escalationRequest: EscalationRequest = {
							supportTicketId: this.getNodeParameter('supportTicketId', i) as string,
							reason: this.getNodeParameter('escalationReason', i) as any,
							currentLevel: this.getNodeParameter('currentLevel', i) as any,
							targetLevel: this.getNodeParameter('targetLevel', i) as any,
							description: this.getNodeParameter('description', i) as string,
							urgency: this.getNodeParameter('escalationUrgency', i) as any,
						};
						result = await escalateIssue(escalationRequest);
						break;

					case 'track':
						const trackingRequest: ResolutionTracking = {
							ticketId: this.getNodeParameter('supportTicketId', i) as string,
							status: this.getNodeParameter('resolutionStatus', i) as any,
							assignedTo: this.getNodeParameter('assignedTo', i) as string,
							estimatedResolution: this.getNodeParameter('estimatedResolution', i) as string,
							notes: [this.getNodeParameter('resolutionNotes', i) as string].filter(Boolean),
						};
						result = await trackResolution(trackingRequest);
						break;

					default:
						throw new Error(`Operation ${operation} not supported`);
				}

				returnData.push({
					json: {
						operation,
						result,
						agent: 'EnsembleAgent',
						timestamp: new Date().toISOString(),
					},
				});
			} catch (error) {
				returnData.push({
					json: {
						operation: this.getNodeParameter('operation', i) as string,
						error: error instanceof Error ? error.message : 'Unknown error',
						agent: 'EnsembleAgent',
						timestamp: new Date().toISOString(),
					},
				});
			}
		}

		return [returnData];
	}
} 