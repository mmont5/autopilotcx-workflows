"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaestroAgent = void 0;
async function orchestrateWorkflow(request) {
    try {
        // Get the intent from the input data
        const intent = request.businessContext.intent || 'general';
        // Map intent to the appropriate agent
        let nextAgent = 'VirtuosoAgent'; // default
        switch (intent) {
            case 'appointment':
                nextAgent = 'BookingAgent'; // FIXED: was 'Booking Node'
                break;
            case 'clinical':
                nextAgent = 'MedleyAgent';
                break;
            case 'escalate':
                nextAgent = 'HumanAgent';
                break;
            case 'billing':
                nextAgent = 'ScoreAgent';
                break;
            case 'feedback':
                nextAgent = 'HarmonyAgent';
                break;
            case 'composer':
                nextAgent = 'ComposerAgent';
                break;
            case 'general':
                nextAgent = 'ComposerAgent';
                break;
            default:
                nextAgent = 'VirtuosoAgent';
                break;
        }
        // Simulate workflow orchestration
        const workflowExecution = {
            workflowId: request.workflowId,
            status: 'running',
            agents: request.agents,
            startTime: new Date().toISOString(),
            performance: {
                startTime: Date.now(),
                agentCount: request.agents.length,
                priority: request.priority,
            },
        };
        // Simulate agent coordination
        const coordination = request.agents.map((agent, index) => ({
            agentId: agent,
            status: index === 0 ? 'busy' : 'idle',
            nextAgent: index < request.agents.length - 1 ? request.agents[index + 1] : undefined,
            handoffData: {
                workflowId: request.workflowId,
                step: index + 1,
                totalSteps: request.agents.length,
            },
            performance: {
                assignedAt: new Date().toISOString(),
                priority: request.priority,
            },
        }));
        return {
            status: 'success',
            workflowExecution,
            coordination,
            orchestrationId: `orch_${Date.now()}`,
            businessContext: request.businessContext,
            industry: request.industry,
            specialty: request.specialty,
            nextAgent: nextAgent, // This is the key field for routing
            intent: intent,
        };
    }
    catch (error) {
        throw new Error(`Workflow orchestration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function manageAgentCoordination(agents, context) {
    try {
        // Simulate agent coordination management
        const coordinationPlan = {
            sequence: agents,
            handoffs: agents.map((agent, index) => ({
                from: index > 0 ? agents[index - 1] : null,
                to: agent,
                data: {
                    context,
                    step: index + 1,
                    timestamp: new Date().toISOString(),
                },
            })),
            parallel: agents.filter((_, index) => index % 2 === 0), // Even indices run in parallel
            sequential: agents.filter((_, index) => index % 2 === 1), // Odd indices run sequentially
        };
        return {
            status: 'success',
            coordinationPlan,
            totalAgents: agents.length,
            estimatedDuration: agents.length * 30, // 30 seconds per agent
            optimization: {
                parallelExecution: coordinationPlan.parallel.length,
                sequentialExecution: coordinationPlan.sequential.length,
            },
        };
    }
    catch (error) {
        throw new Error(`Agent coordination failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
async function adaptPerformance(performanceData) {
    try {
        // Simulate performance adaptation
        const adaptations = {
            optimization: {
                agentOrder: performanceData.agentOrder || [],
                timing: performanceData.timing || {},
                resourceAllocation: performanceData.resources || {},
            },
            recommendations: [
                'Optimize agent handoff timing',
                'Increase parallel execution where possible',
                'Reduce sequential dependencies',
                'Improve error handling and recovery',
            ],
            metrics: {
                executionTime: performanceData.executionTime || 0,
                successRate: performanceData.successRate || 0.95,
                errorRate: performanceData.errorRate || 0.05,
                efficiency: performanceData.efficiency || 0.85,
            },
        };
        return {
            status: 'success',
            adaptations,
            appliedAt: new Date().toISOString(),
            nextOptimization: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        };
    }
    catch (error) {
        throw new Error(`Performance adaptation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
class MaestroAgent {
    constructor() {
        this.description = {
            displayName: 'MaestroAgent',
            name: 'maestroAgent',
            group: ['transform'],
            version: 1,
            description: 'The conductor and orchestrator of the CX Symphony Suite. Coordinates all agents and manages workflow execution.',
            defaults: {
                name: 'MaestroAgent',
            },
            icon: 'file:maestro.svg',
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Operation',
                    name: 'operation',
                    type: 'options',
                    options: [
                        {
                            name: 'Orchestrate Workflow',
                            value: 'orchestrate',
                            description: 'Orchestrate a complete workflow with multiple agents',
                        },
                        {
                            name: 'Manage Coordination',
                            value: 'coordinate',
                            description: 'Manage agent coordination and handoffs',
                        },
                        {
                            name: 'Adapt Performance',
                            value: 'adapt',
                            description: 'Adapt orchestration based on performance data',
                        },
                    ],
                    default: 'orchestrate',
                    description: 'The operation to perform',
                },
                {
                    displayName: 'Workflow ID',
                    name: 'workflowId',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['orchestrate'],
                        },
                    },
                    description: 'Unique identifier for the workflow',
                },
                {
                    displayName: 'Agents',
                    name: 'agents',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['orchestrate', 'coordinate'],
                        },
                    },
                    description: 'Comma-separated list of agent IDs to orchestrate',
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
                            operation: ['orchestrate'],
                        },
                    },
                    description: 'Priority level for the workflow',
                },
                {
                    displayName: 'Industry',
                    name: 'industry',
                    type: 'string',
                    default: 'healthcare',
                    displayOptions: {
                        show: {
                            operation: ['orchestrate', 'coordinate'],
                        },
                    },
                    description: 'Industry context for orchestration',
                },
                {
                    displayName: 'Specialty',
                    name: 'specialty',
                    type: 'string',
                    default: '',
                    displayOptions: {
                        show: {
                            operation: ['orchestrate', 'coordinate'],
                        },
                    },
                    description: 'Medical specialty or business focus area',
                },
                {
                    displayName: 'Business Context (JSON)',
                    name: 'businessContext',
                    type: 'json',
                    default: '{}',
                    displayOptions: {
                        show: {
                            operation: ['orchestrate'],
                        },
                    },
                    description: 'Business context and requirements',
                },
                {
                    displayName: 'Coordination Context (JSON)',
                    name: 'coordinationContext',
                    type: 'json',
                    default: '{}',
                    displayOptions: {
                        show: {
                            operation: ['coordinate'],
                        },
                    },
                    description: 'Context for agent coordination',
                },
                {
                    displayName: 'Performance Data (JSON)',
                    name: 'performanceData',
                    type: 'json',
                    default: '{}',
                    displayOptions: {
                        show: {
                            operation: ['adapt'],
                        },
                    },
                    description: 'Performance data for adaptation',
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        // FIXED: Process only the first item to prevent duplicates
        if (items.length === 0) {
            return [[]];
        }
        // Process only the first item
        const firstItem = items[0];
        const returnData = [];
        try {
            const operation = this.getNodeParameter('operation', 0);
            let result;
            switch (operation) {
                case 'orchestrate':
                    const request = {
                        workflowId: this.getNodeParameter('workflowId', 0),
                        agents: this.getNodeParameter('agents', 0).split(',').map(a => a.trim()),
                        priority: this.getNodeParameter('priority', 0),
                        businessContext: JSON.parse(this.getNodeParameter('businessContext', 0)),
                        industry: this.getNodeParameter('industry', 0),
                        specialty: this.getNodeParameter('specialty', 0),
                    };
                    result = await orchestrateWorkflow(request);
                    break;
                case 'coordinate':
                    const agents = this.getNodeParameter('agents', 0).split(',').map(a => a.trim());
                    const context = JSON.parse(this.getNodeParameter('coordinationContext', 0));
                    result = await manageAgentCoordination(agents, context);
                    break;
                case 'adapt':
                    const performanceData = JSON.parse(this.getNodeParameter('performanceData', 0));
                    result = await adaptPerformance(performanceData);
                    break;
                default:
                    throw new Error(`Operation ${operation} not supported`);
            }
            // CRITICAL FIX: Respect the Intent Classifier's decision, don't override it
            const inputData = firstItem.json;
            // Use the Intent Classifier's decision if available
            const intent = inputData.intent || 'general';
            const nextAgent = inputData.nextAgent || 'VirtuosoAgent'; // Use Intent Classifier's nextAgent
            console.log('=== MAESTROAGENT - RESPECTING INTENT CLASSIFIER ===');
            console.log('Intent from Intent Classifier:', intent);
            console.log('NextAgent from Intent Classifier:', nextAgent);
            console.log('NOT overriding Intent Classifier decision');
            // CRITICAL: Preserve the original_context structure that downstream agents expect
            const originalContext = inputData.original_context;
            const preservedContext = {
                demoData: (originalContext === null || originalContext === void 0 ? void 0 : originalContext.demoData) || inputData,
                webhookData: (originalContext === null || originalContext === void 0 ? void 0 : originalContext.webhookData) || {
                    message: inputData.message || "",
                    bookingState: inputData.bookingState || "",
                    bookingData: inputData.bookingData || "{}",
                    userAction: inputData.userAction || "",
                    timestamp: new Date().toISOString()
                },
                fullContext: (originalContext === null || originalContext === void 0 ? void 0 : originalContext.fullContext) || {}
            };
            returnData.push({
                json: {
                    ...inputData, // Preserve all input data
                    operation,
                    result,
                    agent: 'MaestroAgent',
                    timestamp: new Date().toISOString(),
                    nextAgent: nextAgent, // This is the key field for routing
                    intent: intent,
                    // CRITICAL: Preserve the original_context structure
                    original_context: preservedContext,
                },
            });
        }
        catch (error) {
            // CRITICAL: Preserve the original_context structure even in error cases
            const originalContext = firstItem.json.original_context;
            const preservedContext = {
                demoData: (originalContext === null || originalContext === void 0 ? void 0 : originalContext.demoData) || firstItem.json,
                webhookData: (originalContext === null || originalContext === void 0 ? void 0 : originalContext.webhookData) || {
                    message: firstItem.json.message || "",
                    bookingState: firstItem.json.bookingState || "",
                    bookingData: firstItem.json.bookingData || "{}",
                    userAction: firstItem.json.userAction || "",
                    timestamp: new Date().toISOString()
                },
                fullContext: (originalContext === null || originalContext === void 0 ? void 0 : originalContext.fullContext) || {}
            };
            returnData.push({
                json: {
                    operation: this.getNodeParameter('operation', 0),
                    error: error instanceof Error ? error.message : 'Unknown error',
                    agent: 'MaestroAgent',
                    timestamp: new Date().toISOString(),
                    nextAgent: 'VirtuosoAgent', // Default fallback
                    // CRITICAL: Preserve the original_context structure even in error cases
                    original_context: preservedContext,
                },
            });
        }
        return returnData;
    }
}
exports.MaestroAgent = MaestroAgent;
