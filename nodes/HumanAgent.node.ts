import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

/**
 * HumanAgent - Human-in-the-Loop Intervention and Monitoring
 * 
 * The HumanAgent brings in a human touch when needed, handles escalations,
 * and monitors ongoing activity for compliance and empathy. It ensures that
 * complex situations receive appropriate human attention.
 * 
 * Key Responsibilities:
 * - Handle escalations from AI agents
 * - Provide human intervention for complex cases
 * - Monitor compliance and ethical considerations
 * - Ensure empathetic and appropriate responses
 * - Manage handoffs between AI and human agents
 */

interface EscalationRequest {
	reason: string;
	urgency: 'low' | 'medium' | 'high' | 'urgent';
	context: Record<string, any>;
	previousAgent: string;
	userData: Record<string, any>;
}

interface HumanIntervention {
	interventionId: string;
	status: 'pending' | 'assigned' | 'in_progress' | 'resolved';
	assignedTo?: string;
	priority: string;
	estimatedResponseTime: string;
	notes: string[];
}

function logAction(action: string, data: any) {
	console.log(`[HumanAgent] Action: ${action}`, data);
}

function validateJsonInput(input: string, action: string): any {
	try {
		return input ? JSON.parse(input) : {};
	} catch (e) {
		throw new Error(`Invalid JSON for ${action}: ${e}`);
	}
}

async function handleHumanIntervention(data: any, customMessage?: string): Promise<any> {
	logAction('Handle Human Intervention', data);
	
	try {
		const intervention: HumanIntervention = {
			interventionId: `int_${Date.now()}`,
			status: 'pending',
			priority: data.urgency || 'medium',
			estimatedResponseTime: data.urgency === 'urgent' ? 'immediate' : 
				data.urgency === 'high' ? '15 minutes' : '1 hour',
			notes: [
				`Intervention requested: ${data.reason || 'General assistance needed'}`,
				`Previous agent: ${data.previousAgent || 'Unknown'}`,
				`Urgency: ${data.urgency || 'medium'}`,
			],
		};

		return {
			success: true,
			action: 'handleIntervention',
			status: 'intervention_handled',
			message: customMessage || 'Human intervention handled.',
			intervention,
			data,
			timestamp: new Date().toISOString(),
		};
	} catch (error) {
		throw new Error(`Human intervention failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

async function transferToHuman(data: any, customMessage?: string): Promise<any> {
	logAction('Transfer To Human', data);
	
	try {
		// Determine appropriate human agent based on context
		const humanAgents = {
			clinical: 'Dr. Hassan',
			insurance: 'Insurance Specialist',
			appointment: 'Scheduling Coordinator',
			general: 'Care Coordinator',
		};

		const agentType = data.agentType || 'general';
		const assignedTo = humanAgents[agentType as keyof typeof humanAgents] || 'Care Coordinator';

		return {
			success: true,
			action: 'transferToHuman',
			status: 'transferred_to_human',
			message: customMessage || 'Transferred to human agent.',
			assignedTo,
			estimatedResponseTime: data.urgency === 'urgent' ? 'immediate' : '5-10 minutes',
			handoffNotes: [
				`Reason: ${data.reason || 'General assistance needed'}`,
				`Previous agent: ${data.previousAgent || 'Unknown'}`,
				`Urgency: ${data.urgency || 'medium'}`,
			],
			data,
			timestamp: new Date().toISOString(),
		};
	} catch (error) {
		throw new Error(`Transfer to human failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

async function monitorActivity(data: any, customMessage?: string): Promise<any> {
	logAction('Monitor Activity', data);
	
	try {
		// Simulate compliance monitoring
		const complianceChecks = {
			hipaa: data.hipaaCompliant !== false,
			ethical: data.ethicalGuidelines !== false,
			privacy: data.privacyProtected !== false,
			consent: data.consentObtained !== false,
		};

		const violations = Object.entries(complianceChecks)
			.filter(([_, compliant]) => !compliant)
			.map(([check, _]) => check);

		const recommendations = violations.length > 0 ? 
			[`Address ${violations.join(', ')} compliance issues`] : 
			['All compliance checks passed'];

		return {
			success: true,
			action: 'monitorActivity',
			status: 'activity_monitored',
			message: customMessage || 'Activity is being monitored.',
			monitoring: true,
			complianceChecks,
			violations,
			recommendations,
			data,
			timestamp: new Date().toISOString(),
		};
	} catch (error) {
		throw new Error(`Activity monitoring failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

export class HumanAgent implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HumanAgent',
		name: 'humanAgent',
		group: ['transform'],
		version: 1,
		description: 'Human-in-the-loop intervention and monitoring specialist. Handles escalations and ensures compliance.',
		defaults: {
			name: 'HumanAgent',
		},
		icon: 'file:human.svg',
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Action',
				name: 'action',
				type: 'options',
				options: [
					{
						name: 'Handle Human Intervention',
						value: 'handleIntervention',
						description: 'Escalate or resolve a situation requiring human intervention.',
					},
					{
						name: 'Transfer To Human',
						value: 'transferToHuman',
						description: 'Transfer the conversation or task to a human agent.',
					},
					{
						name: 'Monitor Activity',
						value: 'monitorActivity',
						description: 'Monitor ongoing activity for human review or compliance.',
					},
				],
				default: 'handleIntervention',
				description: 'The action to perform',
			},
			{
				displayName: 'Action Data (JSON)',
				name: 'actionData',
				type: 'json',
				default: '{}',
				description: 'Data for the selected action (must be valid JSON)',
			},
			{
				displayName: 'Custom Message',
				name: 'customMessage',
				type: 'string',
				default: '',
				description: 'Optional custom message for notifications or logs',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const action = this.getNodeParameter('action', i) as string;
				const actionDataRaw = this.getNodeParameter('actionData', i) as string;
				const customMessage = this.getNodeParameter('customMessage', i) as string;
				const actionData = validateJsonInput(actionDataRaw, action);
				let result;

				switch (action) {
					case 'handleIntervention':
						result = await handleHumanIntervention(actionData, customMessage);
						break;
					case 'transferToHuman':
						result = await transferToHuman(actionData, customMessage);
						break;
					case 'monitorActivity':
						result = await monitorActivity(actionData, customMessage);
						break;
					default:
						throw new Error(`Action ${action} not supported`);
				}

				returnData.push({
					json: {
						action,
						result,
						agent: 'HumanAgent',
						timestamp: new Date().toISOString(),
					},
				});
			} catch (error) {
				returnData.push({
					json: {
						action: this.getNodeParameter('action', i) as string,
						error: error instanceof Error ? error.message : 'Unknown error',
						agent: 'HumanAgent',
						timestamp: new Date().toISOString(),
					},
				});
			}
		}

		return [returnData];
	}
} 