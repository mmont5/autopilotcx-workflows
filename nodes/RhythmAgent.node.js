"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RhythmAgent = void 0;
async function scheduleReminder(request) {
    try {
        // Validate request
        if (!request.patientId || !request.scheduledTime || !request.channels.length) {
            throw new Error('Missing required fields: patientId, scheduledTime, channels');
        }
        // Generate unique reminder ID
        const reminderId = `REM-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        const scheduledTime = new Date(request.scheduledTime);
        const now = new Date();
        // Check if scheduled time is in the past
        if (scheduledTime <= now) {
            throw new Error('Scheduled time must be in the future');
        }
        // Calculate next reminder for repeat schedules
        let nextReminder;
        if (request.repeatSchedule) {
            const nextTime = new Date(scheduledTime);
            switch (request.repeatSchedule.frequency) {
                case 'daily':
                    nextTime.setDate(nextTime.getDate() + request.repeatSchedule.interval);
                    break;
                case 'weekly':
                    nextTime.setDate(nextTime.getDate() + (7 * request.repeatSchedule.interval));
                    break;
                case 'monthly':
                    nextTime.setMonth(nextTime.getMonth() + request.repeatSchedule.interval);
                    break;
            }
            nextReminder = nextTime.toISOString();
        }
        // Initialize delivery status
        const deliveryStatus = {
            email: 'pending',
            sms: 'pending',
            push: 'pending',
            phone: 'pending',
            mail: 'pending',
        };
        // Set status based on scheduled time
        const status = scheduledTime <= new Date(Date.now() + 5 * 60 * 1000) ? 'active' : 'scheduled';
        return {
            reminderId,
            status,
            scheduledTime: request.scheduledTime,
            nextReminder,
            channels: request.channels,
            deliveryStatus,
            engagement: {
                opened: false,
                clicked: false,
                responded: false,
            },
            repeatInfo: request.repeatSchedule ? {
                frequency: request.repeatSchedule.frequency,
                nextOccurrence: nextReminder,
                remainingOccurrences: request.repeatSchedule.endDate ?
                    Math.ceil((new Date(request.repeatSchedule.endDate).getTime() - scheduledTime.getTime()) / (24 * 60 * 60 * 1000)) : -1,
            } : undefined,
        };
    }
    catch (error) {
        throw new Error(`Reminder scheduling failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function sendNotification(request) {
    try {
        // Validate request
        if (!request.reminderId || !request.recipientId || !request.channels.length) {
            throw new Error('Missing required fields: reminderId, recipientId, channels');
        }
        // Generate unique notification ID
        const notificationId = `NOT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
        const channels = [];
        let successfulDeliveries = 0;
        let failedDeliveries = 0;
        // Simulate sending to each channel
        for (const channel of request.channels) {
            const success = Math.random() > 0.1; // 90% success rate
            const status = success ? 'sent' : 'failed';
            if (success) {
                successfulDeliveries++;
            }
            else {
                failedDeliveries++;
            }
            channels.push({
                channel,
                status,
                messageId: success ? `MSG-${Date.now()}-${Math.random().toString(36).substr(2, 5)}` : undefined,
                error: success ? undefined : 'Channel temporarily unavailable',
                timestamp: new Date().toISOString(),
            });
        }
        const totalChannels = channels.length;
        const deliveryRate = totalChannels > 0 ? (successfulDeliveries / totalChannels) * 100 : 0;
        const overallStatus = failedDeliveries === 0 ? 'sent' :
            successfulDeliveries === 0 ? 'failed' : 'partial';
        return {
            notificationId,
            status: overallStatus,
            channels,
            deliveryMetrics: {
                totalChannels,
                successfulDeliveries,
                failedDeliveries,
                deliveryRate,
            },
            engagement: {
                opened: false,
                clicked: false,
                responded: false,
            },
            nextActions: [
                'Monitor delivery status',
                'Track engagement metrics',
                'Follow up if no response',
                'Update reminder status',
            ],
        };
    }
    catch (error) {
        throw new Error(`Notification sending failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function trackReminderStatus(request) {
    try {
        // Validate request
        if (!request.reminderId) {
            throw new Error('Missing required field: reminderId');
        }
        // Simulate tracking data
        const deliveryHistory = [
            {
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
                channel: 'email',
                status: 'sent',
                details: 'Email sent successfully',
            },
            {
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
                channel: 'sms',
                status: 'delivered',
                details: 'SMS delivered to recipient',
            },
            {
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
                channel: 'email',
                status: 'read',
                details: 'Email opened by recipient',
            },
        ];
        // Calculate engagement metrics
        const totalSent = deliveryHistory.length;
        const totalDelivered = deliveryHistory.filter(d => d.status === 'delivered' || d.status === 'read').length;
        const totalOpened = deliveryHistory.filter(d => d.status === 'read').length;
        const totalClicked = Math.floor(totalOpened * 0.3); // 30% click rate
        const openRate = totalSent > 0 ? (totalOpened / totalSent) * 100 : 0;
        const clickRate = totalOpened > 0 ? (totalClicked / totalOpened) * 100 : 0;
        // Generate recommendations
        const recommendations = [];
        if (openRate < 50) {
            recommendations.push('Consider optimizing subject lines and timing');
        }
        if (clickRate < 20) {
            recommendations.push('Review call-to-action effectiveness');
        }
        if (totalDelivered < totalSent * 0.8) {
            recommendations.push('Check delivery channel reliability');
        }
        return {
            reminderId: request.reminderId,
            currentStatus: request.status || 'active',
            lastUpdated: new Date().toISOString(),
            deliveryHistory,
            engagementMetrics: {
                totalSent,
                totalDelivered,
                totalOpened,
                totalClicked,
                openRate,
                clickRate,
            },
            nextScheduledReminder: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            recommendations,
        };
    }
    catch (error) {
        throw new Error(`Status tracking failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
class RhythmAgent {
    constructor() {
        this.description = {
            displayName: 'RhythmAgent',
            name: 'rhythmAgent',
            group: ['transform'],
            version: 1,
            description: 'Reminder scheduling and notification management specialist. Handles reminder scheduling, notification delivery, and status tracking.',
            defaults: {
                name: 'RhythmAgent',
            },
            icon: 'file:rhythm.svg',
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    options: [
                        {
                            name: 'Schedule Reminder',
                            value: 'schedule',
                            description: 'Schedule a new reminder',
                        },
                        {
                            name: 'Send Notification',
                            value: 'notify',
                            description: 'Send notification across channels',
                        },
                        {
                            name: 'Track Status',
                            value: 'track',
                            description: 'Track reminder and notification status',
                        },
                    ],
                    default: 'schedule',
                    description: 'The operation to perform',
                },
                {
                    displayName: 'Patient ID',
                    name: 'patientId',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['schedule'],
                        },
                    },
                    description: 'Unique identifier for the patient',
                },
                {
                    displayName: 'Appointment ID',
                    name: 'appointmentId',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['schedule'],
                        },
                    },
                    description: 'Unique identifier for the appointment',
                },
                {
                    displayName: 'Reminder Type',
                    name: 'reminderType',
                    type: 'options',
                    options: [
                        { name: 'Appointment', value: 'appointment' },
                        { name: 'Medication', value: 'medication' },
                        { name: 'Follow-up', value: 'followup' },
                        { name: 'Payment', value: 'payment' },
                        { name: 'Test Result', value: 'test_result' },
                        { name: 'Custom', value: 'custom' },
                    ],
                    default: 'appointment',
                    displayOptions: {
                        show: {
                            operation: ['schedule'],
                        },
                    },
                    description: 'Type of reminder to schedule',
                },
                {
                    displayName: 'Scheduled Time',
                    name: 'scheduledTime',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['schedule'],
                        },
                    },
                    description: 'When to send the reminder (ISO string)',
                },
                {
                    displayName: 'Notification Channels',
                    name: 'channels',
                    type: 'multiOptions',
                    options: [
                        { name: 'Email', value: 'email' },
                        { name: 'SMS', value: 'sms' },
                        { name: 'Push', value: 'push' },
                        { name: 'Phone', value: 'phone' },
                        { name: 'Mail', value: 'mail' },
                    ],
                    default: ['email'],
                    displayOptions: {
                        show: {
                            operation: ['schedule', 'notify'],
                        },
                    },
                    description: 'Channels to use for notification',
                },
                {
                    displayName: 'Priority',
                    name: 'priority',
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
                            operation: ['schedule', 'notify'],
                        },
                    },
                    description: 'Priority level of the reminder/notification',
                },
                {
                    displayName: 'Message',
                    name: 'message',
                    type: 'string',
                    typeOptions: {
                        rows: 4,
                    },
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['schedule', 'notify'],
                        },
                    },
                    description: 'Message content for the reminder/notification',
                },
                {
                    displayName: 'Repeat Frequency',
                    name: 'repeatFrequency',
                    type: 'options',
                    options: [
                        { name: 'Once', value: 'once' },
                        { name: 'Daily', value: 'daily' },
                        { name: 'Weekly', value: 'weekly' },
                        { name: 'Monthly', value: 'monthly' },
                    ],
                    default: 'once',
                    displayOptions: {
                        show: {
                            operation: ['schedule'],
                        },
                    },
                    description: 'How often to repeat the reminder',
                },
                {
                    displayName: 'Repeat Interval',
                    name: 'repeatInterval',
                    type: 'number',
                    default: 1,
                    displayOptions: {
                        show: {
                            operation: ['schedule'],
                        },
                    },
                    description: 'Interval between repetitions',
                },
                {
                    displayName: 'End Date',
                    name: 'endDate',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['schedule'],
                        },
                    },
                    description: 'When to stop repeating (ISO string)',
                },
                {
                    displayName: 'Reminder ID',
                    name: 'reminderId',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['notify', 'track'],
                        },
                    },
                    description: 'ID of the reminder to notify or track',
                },
                {
                    displayName: 'Recipient ID',
                    name: 'recipientId',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['notify'],
                        },
                    },
                    description: 'ID of the notification recipient',
                },
                {
                    displayName: 'Recipient Type',
                    name: 'recipientType',
                    type: 'options',
                    options: [
                        { name: 'Patient', value: 'patient' },
                        { name: 'Provider', value: 'provider' },
                        { name: 'Family', value: 'family' },
                        { name: 'Caregiver', value: 'caregiver' },
                    ],
                    default: 'patient',
                    displayOptions: {
                        show: {
                            operation: ['notify'],
                        },
                    },
                    description: 'Type of recipient',
                },
                {
                    displayName: 'Subject',
                    name: 'subject',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['notify'],
                        },
                    },
                    description: 'Subject line for email notifications',
                },
                {
                    displayName: 'Tracking Action',
                    name: 'trackingAction',
                    type: 'options',
                    options: [
                        { name: 'Check Status', value: 'check_status' },
                        { name: 'Update Status', value: 'update_status' },
                        { name: 'Resend', value: 'resend' },
                        { name: 'Cancel', value: 'cancel' },
                    ],
                    default: 'check_status',
                    displayOptions: {
                        show: {
                            operation: ['track'],
                        },
                    },
                    description: 'Action to perform on tracking',
                },
                {
                    displayName: 'Status',
                    name: 'status',
                    type: 'options',
                    options: [
                        { name: 'Pending', value: 'pending' },
                        { name: 'Sent', value: 'sent' },
                        { name: 'Delivered', value: 'delivered' },
                        { name: 'Read', value: 'read' },
                        { name: 'Failed', value: 'failed' },
                        { name: 'Cancelled', value: 'cancelled' },
                    ],
                    default: 'pending',
                    displayOptions: {
                        show: {
                            operation: ['track'],
                        },
                    },
                    description: 'Status to update (for update_status action)',
                },
                {
                    displayName: 'Tracking Notes',
                    name: 'trackingNotes',
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
                    description: 'Additional notes for tracking',
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
                    case 'schedule':
                        const reminderRequest = {
                            patientId: this.getNodeParameter('patientId', i),
                            appointmentId: this.getNodeParameter('appointmentId', i),
                            reminderType: this.getNodeParameter('reminderType', i),
                            scheduledTime: this.getNodeParameter('scheduledTime', i),
                            channels: this.getNodeParameter('channels', i),
                            priority: this.getNodeParameter('priority', i),
                            message: this.getNodeParameter('message', i),
                            repeatSchedule: this.getNodeParameter('repeatFrequency', i) !== 'once' ? {
                                frequency: this.getNodeParameter('repeatFrequency', i),
                                interval: this.getNodeParameter('repeatInterval', i),
                                endDate: this.getNodeParameter('endDate', i),
                            } : undefined,
                        };
                        result = await scheduleReminder(reminderRequest);
                        break;
                    case 'notify':
                        const notificationRequest = {
                            reminderId: this.getNodeParameter('reminderId', i),
                            recipientId: this.getNodeParameter('recipientId', i),
                            recipientType: this.getNodeParameter('recipientType', i),
                            channels: this.getNodeParameter('channels', i),
                            message: this.getNodeParameter('message', i),
                            subject: this.getNodeParameter('subject', i),
                            priority: this.getNodeParameter('priority', i),
                        };
                        result = await sendNotification(notificationRequest);
                        break;
                    case 'track':
                        const trackingRequest = {
                            reminderId: this.getNodeParameter('reminderId', i),
                            action: this.getNodeParameter('trackingAction', i),
                            status: this.getNodeParameter('status', i),
                            notes: this.getNodeParameter('trackingNotes', i),
                        };
                        result = await trackReminderStatus(trackingRequest);
                        break;
                    default:
                        throw new Error(`Operation ${operation} not supported`);
                }
                returnData.push({
                    json: {
                        operation,
                        result,
                        agent: 'RhythmAgent',
                        timestamp: new Date().toISOString(),
                    },
                });
            }
            catch (error) {
                returnData.push({
                    json: {
                        operation: this.getNodeParameter('operation', i),
                        error: error instanceof Error ? error.message : 'Unknown error',
                        agent: 'RhythmAgent',
                        timestamp: new Date().toISOString(),
                    },
                });
            }
        }
        return [returnData];
    }
}
exports.RhythmAgent = RhythmAgent;
