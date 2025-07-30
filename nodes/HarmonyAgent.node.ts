import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

// Simple sentiment analysis (demo only)
function analyzeSentiment(text: string): { sentiment: string; score: number } {
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'happy', 'satisfied', 'awesome', 'fantastic', 'helpful'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'unhappy', 'poor', 'disappointed', 'frustrated', 'angry', 'worse'];
    let score = 0;
    const lower = text.toLowerCase();
    for (const word of positiveWords) if (lower.includes(word)) score++;
    for (const word of negativeWords) if (lower.includes(word)) score--;
    let sentiment = 'neutral';
    if (score > 0) sentiment = 'positive';
    if (score < 0) sentiment = 'negative';
    return { sentiment, score };
}

// Basic language detection (demo only)
function detectLanguage(text: string): string {
    // Very basic: check for common Spanish words
    if (/\b(el|la|de|que|y|en|un|ser|se|no|haber|por|con|su|para|como|estar|tener)\b/i.test(text)) {
        return 'es';
    }
    // Default to English
    return 'en';
}

export class HarmonyAgent implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'HarmonyAgent',
        name: 'harmonyAgent',
        icon: 'file:harmony.svg',
        group: ['transform'],
        version: 1,
        description: 'Universal feedback collection, sentiment analysis, and general support with dynamic context awareness.',
        defaults: {
            name: 'HarmonyAgent',
        },
        inputs: ['main'],
        outputs: ['main'],
        properties: [
            {
                displayName: 'Feedback Data',
                name: 'feedbackData',
                type: 'string',
                default: '',
                description: 'Feedback to collect and analyze',
            },
            {
                displayName: 'User ID',
                name: 'userId',
                type: 'string',
                default: '',
                description: 'User or session ID (optional)',
                required: false,
            },
        ],
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            const data = { ...items[i].json } as any;
            const userMessage = (() => {
                if (typeof data.message === 'string') return data.message;
                if (typeof data.body === 'object' && data.body && typeof data.body.message === 'string') return data.body.message;
                return "";
            })().toLowerCase();
            
            // Extract dynamic context from the workflow data
            const companyName = (() => {
                if (typeof data.company_name === 'string') return data.company_name;
                if (typeof data.body === 'object' && data.body && typeof data.body.company_name === 'string') return data.body.company_name;
                return "our practice";
            })();
            
            const agentName = (() => {
                if (typeof data.agent_name === 'string') return data.agent_name;
                if (typeof data.body === 'object' && data.body && typeof data.body.agent_name === 'string') return data.body.agent_name;
                return "your assistant";
            })();
            
            const industry = (() => {
                if (typeof data.industry === 'string') return data.industry;
                if (typeof data.body === 'object' && data.body && typeof data.body.industry === 'string') return data.body.industry;
                return "healthcare";
            })();
            
            const category = (() => {
                if (typeof data.category === 'string') return data.category;
                if (typeof data.body === 'object' && data.body && typeof data.body.category === 'string') return data.body.category;
                return "";
            })();
            
            const locations = (() => {
                if (Array.isArray(data.locations)) return data.locations;
                if (typeof data.locations === 'string') {
                    try { return JSON.parse(data.locations); } catch { return []; }
                }
                return [];
            })();
            
            const contactPhone = (() => {
                if (typeof data.contact === 'object' && data.contact && typeof data.contact.phone === 'string') return data.contact.phone;
                if (typeof data.body === 'object' && data.body && typeof data.body.company_phone === 'string') return data.body.company_phone;
                return "";
            })();
            
            const contactEmail = (() => {
                if (typeof data.contact === 'object' && data.contact && typeof data.contact.email === 'string') return data.contact.email;
                if (typeof data.body === 'object' && data.body && typeof data.body.company_email === 'string') return data.body.company_email;
                return "";
            })();

            let agent_response = `Welcome! I'm here to help you with any questions about our ${industry} services.`;
            let suggestedActions = [
                { label: "Book Appointment", value: "I want to book an appointment" },
                { label: "Learn About Services", value: "Tell me about your services" },
                { label: "Contact Information", value: "How do I contact you?" }
            ];

            // Dynamic location and hours questions based on industry
            const locationKeywords = ["location", "where", "address", "hours", "open", "close", "office"];
            const hasLocationIntent = locationKeywords.some(keyword => userMessage.includes(keyword));

            if (hasLocationIntent) {
                const locationInfo = locations.length > 0 ? 
                    `\n\nOur Locations:\n${locations.map((loc: any) => 
                        `${loc.address1}${loc.address2 ? ', ' + loc.address2 : ''}, ${loc.city}, ${loc.state} ${loc.zip}`
                    ).join('\n')}` : 
                    `\n\nPlease contact us for location information.`;

                agent_response = `Here are our office locations and hours:${locationInfo}

Office Hours:
Monday - Friday: 8:00 AM - 5:00 PM
Weekends: Closed

Contact Information:
Phone: ${contactPhone || "our main number"}
Email: ${contactEmail || "our main email"}

We're here to help you find the most convenient location for your needs!`;

                suggestedActions = [
                    { label: "Book Appointment", value: "I want to book an appointment" },
                    { label: "Insurance/Cost Questions", value: "What about insurance and costs?" },
                    { label: "Contact Info", value: "How do I contact you?" }
                ];
            }

            // Dynamic contact information based on industry
            const contactKeywords = ["contact", "phone", "call", "email", "reach", "speak"];
            const hasContactIntent = contactKeywords.some(keyword => userMessage.includes(keyword));

            if (hasContactIntent) {
                agent_response = `I'd be happy to help you get in touch with us!

Main Contact Information:
Phone: ${contactPhone || "our main number"}
Email: ${contactEmail || "our main email"}

Office Hours:
Monday - Friday: 8:00 AM - 5:00 PM
Weekends: Closed

For Urgent Matters:
If you have an urgent ${industry} concern, please call our office directly. For emergencies, please call 911.

Our Team:
We have experienced ${industry} professionals ready to assist you with ${category ? `${category} services` : "your needs"}.

Would you like me to help you schedule an appointment or answer any other questions?`;

                suggestedActions = [
                    { label: "Book Appointment", value: "I want to book an appointment" },
                    { label: "Insurance/Cost Questions", value: "What about insurance and costs?" },
                    { label: "Learn About Services", value: "Tell me about your services" }
                ];
            }

            // Dynamic service questions based on industry and category
            const serviceKeywords = ["service", "specialty", "what do you do", "help with", "treat", "offer"];
            const hasServiceIntent = serviceKeywords.some(keyword => userMessage.includes(keyword));

            if (hasServiceIntent) {
                agent_response = `I'd be happy to tell you about our comprehensive ${industry} services at ${companyName}!

Our Specialties:
• ${industry.charAt(0).toUpperCase() + industry.slice(1)} Services - Expert care and consultation
${category ? `• ${category.charAt(0).toUpperCase() + category.slice(1)} - Specialized expertise in this area` : ""}
• Professional Consultation - Personalized approach to your needs
• Comprehensive Support - End-to-end service delivery

What Makes Us Different:
• Client-centric, individualized approach
• State-of-the-art techniques and technology
• Focus on delivering exceptional results
• Multiple convenient locations

Our Process:
• Initial consultation to understand your needs
• Personalized service plan development
• Expert execution and ongoing support
• Continuous communication and updates

Would you like to learn more about a specific service or schedule a consultation?`;

                suggestedActions = [
                    { label: "Book Consultation", value: "I want to book a consultation" },
                    { label: "Learn About Services", value: "Tell me about specific services" },
                    { label: "Insurance/Cost Questions", value: "What about insurance and costs?" }
                ];
            }

            // Dynamic feedback handling
            const feedbackKeywords = ["feedback", "suggestion", "complaint", "experience", "review"];
            const hasFeedbackIntent = feedbackKeywords.some(keyword => userMessage.includes(keyword));

            if (hasFeedbackIntent) {
                agent_response = `Thank you so much for taking the time to share your feedback! We truly value your input and use it to continuously improve our services and client experience.

Your feedback helps us:
• Enhance our service delivery processes
• Improve our communication and support
• Better understand client needs
• Maintain the highest standards of ${industry} excellence

If you have specific feedback about your experience, I'd be happy to:
• Connect you with our team manager
• Address any concerns immediately
• Ensure your feedback reaches the right team members

We're committed to providing exceptional ${industry} services and appreciate you helping us achieve that goal. Is there anything specific you'd like me to address or any other way I can assist you today?`;

                suggestedActions = [
                    { label: "Speak to Manager", value: "I want to speak to the manager" },
                    { label: "Book Appointment", value: "I want to book an appointment" },
                    { label: "General Questions", value: "I have other questions" }
                ];
            }

            returnData.push({
                json: {
                    ...data,
                    agent: 'HarmonyAgent',
                    agent_response,
                    message: agent_response,
                    suggestedActions
                },
            });
        }

        return [returnData];
    }
} 