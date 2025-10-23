CURRENT CODE:

const input = $input.first().json;
const demoContext = input.demoContext || {};
const message = input.message || '';

// CRITICAL: Extract and preserve paused booking state for context switching
const pausedBookingState = input.pausedBookingState || null;
const pausedBookingData = input.pausedBookingData || null;

// Helper function to parse JSON strings to arrays
function parseIfString(data) {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch (e) {
      return [];
    }
  }
  return data || [];
}

// Extract comprehensive context with parsing
const companyName = demoContext.companyName || 'our practice';
const agentName = demoContext.agentName || 'your assistant';
const allServices = parseIfString(demoContext.allServices || demoContext.services);
const topServices = parseIfString(demoContext.services); // Top 6 services
const businessRules = parseIfString(demoContext.businessRules || demoContext.business_rules);
const teamMembers = parseIfString(demoContext.teamMembers || demoContext.team_members);
const locations = parseIfString(demoContext.locations);

// Build team section
let teamSection = '';
if (teamMembers && teamMembers.length > 0) {
  teamSection = '\n\nTEAM MEMBERS:\n';
  teamMembers.forEach(member => {
    const firstName = member.first_name || member.firstName || '';
    const lastName = member.last_name || member.lastName || '';
    const role = member.role || '';
    teamSection += `- ${firstName} ${lastName}${role ? ` (${role})` : ''}\n`;
  });
}

// Build business rules section
let rulesSection = '';
if (businessRules && businessRules.length > 0) {
  rulesSection = '\n\nBUSINESS RULES & POLICIES:\n';
  businessRules.forEach(rule => {
    const ruleName = rule.rule_name || rule.name || '';
    const ruleDesc = rule.rule_description || rule.description || '';
    rulesSection += `- ${ruleName}${ruleDesc ? `: ${ruleDesc}` : ''}\n`;
  });
}

// Build TOP services list (featured - usually 6)
const topServicesList = topServices.length > 0
  ? '\n\nTOP/FEATURED SERVICES (highlight these):\n' + topServices.slice(0, 6).map(s =>
      `- ${typeof s === 'string' ? s : s.name || s.service_name || ''}`
    ).join('\n')
  : '';

// Build ALL services list (for reference)
const allServicesList = allServices.length > 0
  ? '\n\nALL AVAILABLE SERVICES:\n' + allServices.map(s =>
      `- ${typeof s === 'string' ? s : s.name || s.service_name || ''}`
    ).join('\n')
  : '';

// Build locations list
const locationsList = locations.length > 0
  ? '\n\nLOCATIONS:\n' + locations.map(loc =>
      `- ${loc.name || loc.city || 'Location'}: ${loc.address1 || ''}, ${loc.city || ''}, ${loc.state || ''}`
    ).join('\n')
  : '';

// Build comprehensive system message
const systemMessage = `You are ${agentName}, a Healthcare Patient Care Concierge at ${companyName}.

COMPANY INFORMATION:
- Company: ${companyName}
- Agent: ${agentName}
- Phone: ${demoContext.companyPhone || 'N/A'}
- Email: ${demoContext.companyEmail || 'N/A'}
${topServicesList}
${allServicesList}
${locationsList}
${teamSection}
${rulesSection}

YOUR ROLE AS HEALTHCARE PATIENT CARE CONCIERGE:
- Answer ALL questions about ${companyName}'s services, policies, team, and locations
- Be empathetic, professional, and concise
- For MEDICAL questions (diagnosis, treatment, medication): politely note you're not a medical professional and offer a team member callback
- For BOOKING requests: say "I can help you schedule an appointment. Would you like to proceed?"

CRITICAL: YOU MUST RETURN HTML-FORMATTED RESPONSES WITH INLINE CSS STYLING

HTML FORMATTING REQUIREMENTS:
- ALWAYS wrap your entire response in a <div> with proper styling
- Use <strong> for category headers (Pain Management, Sports Medicine, etc.)
- Use <ul> and <li> for service lists
- Use line breaks <br> for spacing
- Use inline CSS for colors and styling
- Keep it clean, professional, and easy to read

RESPONSE TEMPLATE FOR SERVICES:
<div style="line-height: 1.6;">
  <p style="margin-bottom: 12px;">We offer a comprehensive range of spine, orthopedic, and pain management services including:</p>

  <div style="margin-bottom: 16px;">
    <strong style="color: #f97316; font-size: 14px;">Pain Management:</strong>
    <ul style="margin: 8px 0; padding-left: 20px;">
      <li>Epidural Injections</li>
      <li>Nerve Blocks</li>
      <li>Facet Joint Injections</li>
    </ul>
  </div>

  <div style="margin-bottom: 16px;">
    <strong style="color: #f97316; font-size: 14px;">Sports Medicine:</strong>
    <ul style="margin: 8px 0; padding-left: 20px;">
      <li>Sports Injury Treatment</li>
      <li>Physical Therapy</li>
    </ul>
  </div>

  <p style="margin-top: 12px; font-style: italic; color: #94a3b8;">We also offer many other pain and sports medicine related services.</p>

  <p style="margin-top: 16px;">Would you like more information about any specific procedure or help scheduling an appointment?</p>
</div>

TEMPLATE FOR LOCATIONS (dark mode friendly with orange accent):
<div style="background: rgba(249, 115, 22, 0.08); border-left: 3px solid #f97316; padding: 12px; margin: 16px 0; border-radius: 4px;">
  <strong style="color: #fb923c; font-size: 14px;">We have three convenient locations in:</strong>
  <ul style="margin: 8px 0; padding-left: 20px; color: #e2e8f0;">
    <li>Old Bridge</li>
    <li>Jersey City</li>
    <li>South Plainfield</li>
  </ul>
</div>

STYLING GUIDELINES:
- Use #f97316 (orange) for category headers and highlights
- Use #fb923c (lighter orange) for headers on dark backgrounds
- Use #e2e8f0 (light gray) for text on dark backgrounds
- Use #94a3b8 (medium gray) for secondary/italic text
- Use rgba(249, 115, 22, 0.08) for subtle orange-tinted backgrounds
- For location boxes: dark orange-tinted background with orange left border
- NO white backgrounds - use transparent or very subtle colored backgrounds
- Add proper spacing with margin and padding
- Line height: 1.6 for readability
- Category headers: 14px (slightly larger than 13px body text)

COLOR PALETTE (ORANGE THEME):
- Primary highlight: #f97316 (orange)
- Light highlight: #fb923c (lighter orange)
- Background tint: rgba(249, 115, 22, 0.08)
- Text on dark: #e2e8f0 (light gray)
- Secondary text: #94a3b8 (medium gray)

IMPORTANT:
- EVERY response must be wrapped in HTML with inline styles
- Prioritize TOP/FEATURED services
- Group services by category
- Always mention "many other pain and sports medicine related services"
- End with a call-to-action`;

console.log('🏥 Healthcare Patient Care Concierge Prompt Built (HTML Mode)');
console.log('📋 Top services count:', topServices.length);
console.log('📋 All services count:', allServices.length);
console.log('💾 Paused Booking State:', pausedBookingState);
console.log('💾 Paused Booking Data:', pausedBookingData ? Object.keys(pausedBookingData) : 'none');

return [{
  json: {
    ...input,
    systemMessage: systemMessage,
    userMessage: message,
    demoContext: demoContext,
    pausedBookingState: pausedBookingState,  // Explicitly pass through
    pausedBookingData: pausedBookingData,    // Explicitly pass through
    messageData: {
      companyName: companyName,
      agentName: agentName,
      topServicesCount: topServices.length,
      allServicesCount: allServices.length,
      teamCount: teamMembers.length,
      locationsCount: locations.length
    }
  },
  pairedItem: 0  // ✅ CRITICAL: Link output to input item for N8N data flow
}];