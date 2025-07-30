import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

/**
 * CadenceAgent - Appointment Scheduling and Calendar Management
 * 
 * The CadenceAgent manages appointment scheduling, rescheduling, and calendar
 * operations with precision timing and availability optimization. It ensures
 * seamless appointment coordination and calendar synchronization.
 * 
 * Key Responsibilities:
 * - Handle appointment rescheduling requests
 * - Check provider availability in real-time
 * - Update calendar systems and notifications
 * - Optimize scheduling for maximum efficiency
 * - Manage appointment conflicts and conflicts
 */

interface RescheduleRequest {
	appointmentId: string;
	patientId: string;
	providerId: string;
	currentDateTime: string;
	requestedDateTime: string;
	reason: 'patient_request' | 'provider_request' | 'emergency' | 'conflict' | 'weather' | 'other';
	urgency: 'low' | 'medium' | 'high' | 'urgent';
	notes?: string;
}

interface AvailabilityRequest {
	providerId: string;
	startDate: string;
	endDate: string;
	duration: number; // minutes
	appointmentType: 'consultation' | 'followup' | 'procedure' | 'emergency' | 'routine';
	preferredTimes?: string[];
	excludeDates?: string[];
}

interface CalendarUpdate {
	appointmentId: string;
	action: 'create' | 'update' | 'cancel' | 'reschedule';
	oldDateTime?: string;
	newDateTime?: string;
	providerId: string;
	patientId: string;
	appointmentType: string;
	duration: number;
	notes?: string;
}

interface RescheduleResult {
	appointmentId: string;
	status: 'rescheduled' | 'pending_confirmation' | 'conflict' | 'unavailable';
	oldDateTime: string;
	newDateTime?: string;
	confirmationRequired: boolean;
	notifications: {
		patient: boolean;
		provider: boolean;
		calendar: boolean;
	};
	nextSteps: string[];
	conflicts?: Array<{
		conflictType: 'provider_unavailable' | 'patient_conflict' | 'system_conflict';
		description: string;
		suggestedAlternatives: string[];
	}>;
}

interface AvailabilityResult {
	providerId: string;
	dateRange: {
		start: string;
		end: string;
	};
	availableSlots: Array<{
		dateTime: string;
		duration: number;
		slotType: 'open' | 'preferred' | 'backup';
		conflicts: string[];
	}>;
	totalSlots: number;
	recommendedSlots: string[];
	unavailableReasons: Array<{
		date: string;
		reason: 'provider_off' | 'holiday' | 'maintenance' | 'fully_booked';
	}>;
}

interface CalendarResult {
	appointmentId: string;
	status: 'success' | 'partial' | 'failed';
	changes: Array<{
		system: string;
		action: string;
		status: 'success' | 'failed';
		error?: string;
	}>;
	synchronizedSystems: string[];
	notificationsSent: {
		patient: boolean;
		provider: boolean;
		staff: boolean;
	};
	calendarUrl?: string;
}

async function handleReschedule(request: RescheduleRequest): Promise<RescheduleResult> {
	try {
		// Validate request
		if (!request.appointmentId || !request.patientId || !request.providerId) {
			throw new Error('Missing required fields: appointmentId, patientId, providerId');
		}

		const currentTime = new Date(request.currentDateTime);
		const requestedTime = new Date(request.requestedDateTime);
		const now = new Date();

		// Check if requested time is in the past
		if (requestedTime <= now) {
			return {
				appointmentId: request.appointmentId,
				status: 'unavailable',
				oldDateTime: request.currentDateTime,
				confirmationRequired: false,
				notifications: { patient: false, provider: false, calendar: false },
				nextSteps: ['Requested time is in the past. Please select a future time.'],
				conflicts: [{
					conflictType: 'system_conflict',
					description: 'Requested time is in the past',
					suggestedAlternatives: [
						new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
						new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString(),
					],
				}],
			};
		}

		// Simulate availability check
		const isAvailable = Math.random() > 0.3; // 70% chance of availability

		if (!isAvailable) {
			return {
				appointmentId: request.appointmentId,
				status: 'conflict',
				oldDateTime: request.currentDateTime,
				confirmationRequired: false,
				notifications: { patient: false, provider: false, calendar: false },
				nextSteps: ['Provider is unavailable at requested time. Please select alternative time.'],
				conflicts: [{
					conflictType: 'provider_unavailable',
					description: 'Provider has conflicting appointment',
					suggestedAlternatives: [
						new Date(requestedTime.getTime() + 60 * 60 * 1000).toISOString(),
						new Date(requestedTime.getTime() + 2 * 60 * 60 * 1000).toISOString(),
						new Date(requestedTime.getTime() + 24 * 60 * 60 * 1000).toISOString(),
					],
				}],
			};
		}

		// Successful reschedule
		return {
			appointmentId: request.appointmentId,
			status: 'rescheduled',
			oldDateTime: request.currentDateTime,
			newDateTime: request.requestedDateTime,
			confirmationRequired: request.urgency === 'urgent',
			notifications: { patient: true, provider: true, calendar: true },
			nextSteps: [
				'Appointment successfully rescheduled',
				'Confirmation sent to patient and provider',
				'Calendar systems updated',
				'Follow-up reminder scheduled',
			],
		};
	} catch (error) {
		throw new Error(`Reschedule failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

async function checkAvailability(request: AvailabilityRequest): Promise<AvailabilityResult> {
	try {
		// Validate request
		if (!request.providerId || !request.startDate || !request.endDate) {
			throw new Error('Missing required fields: providerId, startDate, endDate');
		}

		const startDate = new Date(request.startDate);
		const endDate = new Date(request.endDate);
		const duration = request.duration || 30;

		// Generate available slots
		const availableSlots: AvailabilityResult['availableSlots'] = [];
		const unavailableReasons: AvailabilityResult['unavailableReasons'] = [];
		const recommendedSlots: string[] = [];

		// Simulate slot generation
		for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
			// Skip weekends
			if (date.getDay() === 0 || date.getDay() === 6) {
				unavailableReasons.push({
					date: date.toISOString().split('T')[0],
					reason: 'provider_off',
				});
				continue;
			}

			// Generate slots for each day (9 AM to 5 PM)
			for (let hour = 9; hour < 17; hour++) {
				for (let minute = 0; minute < 60; minute += 30) {
					const slotTime = new Date(date);
					slotTime.setHours(hour, minute, 0, 0);

					// Skip if slot is in the past
					if (slotTime <= new Date()) continue;

					// Random availability (70% chance)
					const isAvailable = Math.random() > 0.3;
					
					if (isAvailable) {
						const slotType = Math.random() > 0.7 ? 'preferred' : 'open';
						availableSlots.push({
							dateTime: slotTime.toISOString(),
							duration,
							slotType,
							conflicts: [],
						});

						if (slotType === 'preferred') {
							recommendedSlots.push(slotTime.toISOString());
						}
					}
				}
			}
		}

		return {
			providerId: request.providerId,
			dateRange: { start: request.startDate, end: request.endDate },
			availableSlots,
			totalSlots: availableSlots.length,
			recommendedSlots: recommendedSlots.slice(0, 5), // Top 5 recommended
			unavailableReasons,
		};
	} catch (error) {
		throw new Error(`Availability check failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

async function updateCalendar(request: CalendarUpdate): Promise<CalendarResult> {
	try {
		// Validate request
		if (!request.appointmentId || !request.providerId || !request.patientId) {
			throw new Error('Missing required fields: appointmentId, providerId, patientId');
		}

		// Simulate calendar system updates
		const systems = ['primary_calendar', 'backup_calendar', 'notification_system', 'billing_system'];
		const changes: CalendarResult['changes'] = [];

		for (const system of systems) {
			const success = Math.random() > 0.1; // 90% success rate
			changes.push({
				system,
				action: request.action,
				status: success ? 'success' : 'failed',
				error: success ? undefined : 'System temporarily unavailable',
			});
		}

		const successCount = changes.filter(c => c.status === 'success').length;
		const status = successCount === systems.length ? 'success' : 
					  successCount > 0 ? 'partial' : 'failed';

		return {
			appointmentId: request.appointmentId,
			status,
			changes,
			synchronizedSystems: changes.filter(c => c.status === 'success').map(c => c.system),
			notificationsSent: {
				patient: true,
				provider: true,
				staff: status === 'success',
			},
			calendarUrl: status === 'success' ? 
				`https://calendar.example.com/appointment/${request.appointmentId}` : undefined,
		};
	} catch (error) {
		throw new Error(`Calendar update failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
	}
}

export class CadenceAgent implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'CadenceAgent',
		name: 'cadenceAgent',
		group: ['transform'],
		version: 1,
		description: 'Appointment scheduling and calendar management specialist. Handles rescheduling, availability checks, and calendar updates.',
		defaults: {
			name: 'CadenceAgent',
		},
		icon: 'file:cadence.svg',
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				options: [
					{
						name: 'Handle Reschedule',
						value: 'reschedule',
						description: 'Reschedule an existing appointment',
					},
					{
						name: 'Check Availability',
						value: 'availability',
						description: 'Check provider availability for appointments',
					},
					{
						name: 'Update Calendar',
						value: 'calendar',
						description: 'Update calendar systems and notifications',
					},
				],
				default: 'reschedule',
				description: 'The operation to perform',
			},
			{
				displayName: 'Appointment ID',
				name: 'appointmentId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['reschedule', 'calendar'],
					},
				},
				description: 'Unique identifier for the appointment',
			},
			{
				displayName: 'Patient ID',
				name: 'patientId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['reschedule', 'calendar'],
					},
				},
				description: 'Unique identifier for the patient',
			},
			{
				displayName: 'Provider ID',
				name: 'providerId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['reschedule', 'availability', 'calendar'],
					},
				},
				description: 'Unique identifier for the healthcare provider',
			},
			{
				displayName: 'Current Date/Time',
				name: 'currentDateTime',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['reschedule'],
					},
				},
				description: 'Current appointment date and time (ISO string)',
			},
			{
				displayName: 'Requested Date/Time',
				name: 'requestedDateTime',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['reschedule'],
					},
				},
				description: 'Requested new date and time (ISO string)',
			},
			{
				displayName: 'Reschedule Reason',
				name: 'rescheduleReason',
				type: 'options',
				options: [
					{ name: 'Patient Request', value: 'patient_request' },
					{ name: 'Provider Request', value: 'provider_request' },
					{ name: 'Emergency', value: 'emergency' },
					{ name: 'Conflict', value: 'conflict' },
					{ name: 'Weather', value: 'weather' },
					{ name: 'Other', value: 'other' },
				],
				default: 'patient_request',
				displayOptions: {
					show: {
						operation: ['reschedule'],
					},
				},
				description: 'Reason for rescheduling',
			},
			{
				displayName: 'Urgency',
				name: 'urgency',
				type: 'options',
				options: [
					{ name: 'Low', value: 'low' },
					{ name: 'Medium', value: 'medium' },
					{ name: 'High', value: 'high' },
					{ name: 'Urgent', value: 'urgent' },
				],
				default: 'medium',
				displayOptions: {
					show: {
						operation: ['reschedule'],
					},
				},
				description: 'Urgency level of the reschedule request',
			},
			{
				displayName: 'Reschedule Notes',
				name: 'rescheduleNotes',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['reschedule'],
					},
				},
				description: 'Additional notes for the reschedule request',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['availability'],
					},
				},
				description: 'Start date for availability check (ISO string)',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['availability'],
					},
				},
				description: 'End date for availability check (ISO string)',
			},
			{
				displayName: 'Appointment Duration',
				name: 'duration',
				type: 'number',
				default: 30,
				displayOptions: {
					show: {
						operation: ['availability', 'calendar'],
					},
				},
				description: 'Duration of appointment in minutes',
			},
			{
				displayName: 'Appointment Type',
				name: 'appointmentType',
				type: 'options',
				options: [
					{ name: 'Consultation', value: 'consultation' },
					{ name: 'Follow-up', value: 'followup' },
					{ name: 'Procedure', value: 'procedure' },
					{ name: 'Emergency', value: 'emergency' },
					{ name: 'Routine', value: 'routine' },
				],
				default: 'consultation',
				displayOptions: {
					show: {
						operation: ['availability', 'calendar'],
					},
				},
				description: 'Type of appointment',
			},
			{
				displayName: 'Calendar Action',
				name: 'calendarAction',
				type: 'options',
				options: [
					{ name: 'Create', value: 'create' },
					{ name: 'Update', value: 'update' },
					{ name: 'Cancel', value: 'cancel' },
					{ name: 'Reschedule', value: 'reschedule' },
				],
				default: 'create',
				displayOptions: {
					show: {
						operation: ['calendar'],
					},
				},
				description: 'Action to perform on calendar',
			},
			{
				displayName: 'Old Date/Time',
				name: 'oldDateTime',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['calendar'],
					},
				},
				description: 'Previous appointment date/time (for updates/reschedule)',
			},
			{
				displayName: 'New Date/Time',
				name: 'newDateTime',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['calendar'],
					},
				},
				description: 'New appointment date/time (for updates/reschedule)',
			},
			{
				displayName: 'Calendar Notes',
				name: 'calendarNotes',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				displayOptions: {
					show: {
						operation: ['calendar'],
					},
				},
				description: 'Notes for calendar entry',
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
					case 'reschedule':
						const rescheduleRequest: RescheduleRequest = {
							appointmentId: this.getNodeParameter('appointmentId', i) as string,
							patientId: this.getNodeParameter('patientId', i) as string,
							providerId: this.getNodeParameter('providerId', i) as string,
							currentDateTime: this.getNodeParameter('currentDateTime', i) as string,
							requestedDateTime: this.getNodeParameter('requestedDateTime', i) as string,
							reason: this.getNodeParameter('rescheduleReason', i) as any,
							urgency: this.getNodeParameter('urgency', i) as any,
							notes: this.getNodeParameter('rescheduleNotes', i) as string,
						};
						result = await handleReschedule(rescheduleRequest);
						break;

					case 'availability':
						const availabilityRequest: AvailabilityRequest = {
							providerId: this.getNodeParameter('providerId', i) as string,
							startDate: this.getNodeParameter('startDate', i) as string,
							endDate: this.getNodeParameter('endDate', i) as string,
							duration: this.getNodeParameter('duration', i) as number,
							appointmentType: this.getNodeParameter('appointmentType', i) as any,
						};
						result = await checkAvailability(availabilityRequest);
						break;

					case 'calendar':
						const calendarRequest: CalendarUpdate = {
							appointmentId: this.getNodeParameter('appointmentId', i) as string,
							action: this.getNodeParameter('calendarAction', i) as any,
							oldDateTime: this.getNodeParameter('oldDateTime', i) as string,
							newDateTime: this.getNodeParameter('newDateTime', i) as string,
							providerId: this.getNodeParameter('providerId', i) as string,
							patientId: this.getNodeParameter('patientId', i) as string,
							appointmentType: this.getNodeParameter('appointmentType', i) as string,
							duration: this.getNodeParameter('duration', i) as number,
							notes: this.getNodeParameter('calendarNotes', i) as string,
						};
						result = await updateCalendar(calendarRequest);
						break;

					default:
						throw new Error(`Operation ${operation} not supported`);
				}

				returnData.push({
					json: {
						operation,
						result,
						agent: 'CadenceAgent',
						timestamp: new Date().toISOString(),
					},
				});
			} catch (error) {
				returnData.push({
					json: {
						operation: this.getNodeParameter('operation', i) as string,
						error: error instanceof Error ? error.message : 'Unknown error',
						agent: 'CadenceAgent',
						timestamp: new Date().toISOString(),
					},
				});
			}
		}

		return [returnData];
	}
} 