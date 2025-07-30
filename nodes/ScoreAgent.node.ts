import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';

export class ScoreAgent implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ScoreAgent',
		name: 'scoreAgent',
		icon: 'file:score.svg',
		group: ['transform'],
		version: 1,
		description: 'Universal billing, insurance, and financial intelligence with dynamic context awareness.',
		defaults: {
			name: 'ScoreAgent',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'Score Data',
				name: 'scoreData',
				type: 'json',
				default: '{}',
				description: 'Data for scoring and evaluation',
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

			let agent_response = `I'm here to help you with any billing, insurance, or financial questions about our ${industry} services.`;
			let suggestedActions = [
				{ label: "Insurance Verification", value: "I need help with insurance" },
				{ label: "Billing Questions", value: "I have billing questions" },
				{ label: "Cost Information", value: "What are your costs?" }
			];

			// Dynamic insurance questions based on industry
			const insuranceKeywords = ["insurance", "coverage", "policy", "verify", "accept", "plan"];
			const hasInsuranceIntent = insuranceKeywords.some(keyword => userMessage.includes(keyword));

			if (hasInsuranceIntent) {
				// Industry-specific insurance information
				const insuranceInfo = {
					healthcare: {
						providers: ["Aetna", "Blue Cross Blue Shield", "Cigna", "UnitedHealthcare", "Horizon Blue Cross Blue Shield", "AmeriHealth", "Oxford", "Empire BlueCross"],
						note: "Important Note: We are not currently accepting Medicare or Medicaid patients.",
						requirements: ["Your insurance provider name", "Policy holder name", "Date of birth", "Insurance ID number", "Group number (if applicable)"]
					},
					legal: {
						providers: ["Most major insurance plans", "Legal insurance plans", "Employee benefit plans"],
						note: "Note: Coverage varies by plan and case type.",
						requirements: ["Your insurance provider", "Policy details", "Case type", "Coverage limits"]
					},
					real_estate: {
						providers: ["Most major insurance plans", "Title insurance", "Homeowner's insurance"],
						note: "Note: Insurance requirements vary by transaction type.",
						requirements: ["Insurance provider", "Policy details", "Property information", "Transaction type"]
					},
					default: {
						providers: ["Most major insurance plans", "Commercial insurance", "Professional liability"],
						note: "Note: Coverage varies by plan and service type.",
						requirements: ["Insurance provider", "Policy details", "Service type", "Coverage information"]
					}
				};

				const industryInsurance = insuranceInfo[industry as keyof typeof insuranceInfo] || insuranceInfo.default;

				agent_response = `I'd be happy to help you with insurance verification for our ${industry} services${category ? ` in ${category}` : ""}!

Accepted Insurance Providers:
${industryInsurance.providers.map(provider => `• ${provider}`).join('\n')}
• And many more!

${industryInsurance.note}

To verify your coverage, I'll need:
${industryInsurance.requirements.map(req => `• ${req}`).join('\n')}

What we can help with:
• Verify your benefits and coverage
• Check if prior authorization is needed
• Estimate your out-of-pocket costs
• Process insurance claims

Would you like to proceed with insurance verification? I can guide you through the process step by step.`;

				suggestedActions = [
					{ label: "Verify Coverage", value: "I want to verify my insurance coverage" },
					{ label: "Upload Insurance Card", value: "I want to upload my insurance card" },
					{ label: "Call Staff", value: "I want to speak to someone about insurance" },
					{ label: "Cost Estimates", value: "What will this cost me?" }
				];
			}

			// Dynamic billing and cost questions based on industry
			const costKeywords = ["cost", "price", "bill", "payment", "how much", "fee", "rate"];
			const hasCostIntent = costKeywords.some(keyword => userMessage.includes(keyword));

			if (hasCostIntent) {
				const costInfo = {
					healthcare: {
						structure: ["Consultation Fees - Vary based on complexity and time", "Procedure Costs - Depend on the specific treatment needed", "Insurance Coverage - Most procedures are covered by insurance", "Payment Plans - Available for out-of-pocket expenses"],
						factors: ["Your insurance coverage and benefits", "Type of procedure or treatment needed", "Whether prior authorization is required", "Your deductible and copay amounts"]
					},
					legal: {
						structure: ["Consultation Fees - Initial consultation rates", "Case Fees - Vary by case complexity and type", "Hourly Rates - For ongoing representation", "Payment Plans - Available for larger cases"],
						factors: ["Case complexity and type", "Your insurance coverage", "Required legal services", "Payment arrangement preferences"]
					},
					real_estate: {
						structure: ["Service Fees - Based on transaction value", "Commission Rates - Standard industry rates", "Additional Services - Title, inspection, etc.", "Payment Plans - Available for larger transactions"],
						factors: ["Transaction type and value", "Market conditions", "Required services", "Your financial situation"]
					},
					default: {
						structure: ["Service Fees - Based on service complexity", "Consultation Rates - Initial assessment costs", "Package Pricing - For comprehensive services", "Payment Plans - Available for larger projects"],
						factors: ["Service type and complexity", "Your insurance coverage", "Required services", "Payment preferences"]
					}
				};

				const industryCost = costInfo[industry as keyof typeof costInfo] || costInfo.default;

				agent_response = `I understand that cost is an important consideration when seeking ${industry} services. Let me help you understand our billing and payment options.

Cost Structure:
${industryCost.structure.map(item => `• ${item.split(' - ')[0]} - ${item.split(' - ')[1]}`).join('\n')}

What affects your cost:
${industryCost.factors.map(factor => `• ${factor}`).join('\n')}

Payment Options:
• Insurance billing (primary method)
• Payment plans for self-pay clients
• Credit card, check, or cash payments
• Flexible payment arrangements

To get an accurate cost estimate, I'll need:
• Your insurance information
• The specific service or ${industry === 'healthcare' ? 'procedure' : 'service'} needed
• Your current financial situation

Would you like me to help you verify your insurance coverage or get a cost estimate for a specific service?`;

				suggestedActions = [
					{ label: "Get Cost Estimate", value: "I want a cost estimate" },
					{ label: "Verify Insurance", value: "I want to verify my insurance" },
					{ label: "Payment Plans", value: "Tell me about payment plans" },
					{ label: "Speak to Billing", value: "I want to speak to billing" }
				];
			}

			// Dynamic payment and billing questions
			const paymentKeywords = ["pay", "payment", "bill", "statement", "balance", "due"];
			const hasPaymentIntent = paymentKeywords.some(keyword => userMessage.includes(keyword));

			if (hasPaymentIntent) {
				agent_response = `I'm here to help you with any payment or billing questions for our ${industry} services!

Payment Methods We Accept:
• Credit cards (Visa, MasterCard, American Express, Discover)
• Personal checks
• Cash payments
• Online payments through our client portal

Billing Process:
• We bill your insurance first (if applicable)
• You'll receive a statement for any remaining balance
• Payment is typically due within 30 days
• We can set up payment plans for larger balances

Common Billing Questions:
• When will I get my bill? Usually within 2-4 weeks after your service
• Can I pay online? Yes, through our secure client portal
• Do you offer payment plans? Yes, for balances over $100
• What if I can't pay? We can work with you on payment arrangements

Need Help?
• Call our billing department: ${contactPhone || "our main number"}
• Email billing questions: ${contactEmail || "our main email"}
• Access your account online through our client portal

Would you like me to help you with a specific billing question or connect you with our billing team?`;

				suggestedActions = [
					{ label: "Pay Online", value: "I want to pay online" },
					{ label: "Payment Plan", value: "I need a payment plan" },
					{ label: "Speak to Billing", value: "I want to speak to billing" },
					{ label: "Client Portal", value: "How do I access the client portal?" }
				];
			}

			returnData.push({
				json: {
					...data,
					agent: 'ScoreAgent',
					agent_response,
					message: agent_response,
					suggestedActions
				},
			});
		}

		return [returnData];
	}
}