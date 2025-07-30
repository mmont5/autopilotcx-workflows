#!/bin/bash

# AutopilotCX Knowledge Base Generator
# This script creates the complete knowledge base structure

set -e

echo "🚀 Generating AutopilotCX Knowledge Base Structure..."

# Create main knowledge base directories
mkdir -p docs/kb/{getting-started,features,user-guides,troubleshooting,api,best-practices,industry-solutions,security-compliance,pricing-billing,advanced-topics,ai-agent-training}

# Create getting-started subdirectories
mkdir -p docs/kb/getting-started/{account-setup,platform-basics,first-steps,healthcare,real-estate,small-business,technical}

# Create features subdirectories
mkdir -p docs/kb/features/{cx-symphony,social-media,analytics,workflows,design-studio,integrations,white-labeling,nft-marketplace,healthcare,real-estate,small-business,security,compliance,performance,scalability,ux,collaboration}

# Create user-guides subdirectories
mkdir -p docs/kb/user-guides/{dashboard,ai-agents,social-media,workflows,design-studio,analytics,integrations,white-labeling}

# Create troubleshooting subdirectories
mkdir -p docs/kb/troubleshooting/{emergency,account,ai-agents,social-media,workflows,design-studio,analytics,integrations,healthcare,real-estate,small-business,diagnostic,debugging,escalation,support,prevention,best-practices}

# Create api subdirectories
mkdir -p docs/kb/api/{authentication,endpoints,webhooks,rate-limiting,error-handling}

# Create best-practices subdirectories
mkdir -p docs/kb/best-practices/{performance,security,compliance,workflows,content,analytics}

# Create industry-solutions subdirectories
mkdir -p docs/kb/industry-solutions/{healthcare,real-estate,small-business,agency,enterprise}

# Create security-compliance subdirectories
mkdir -p docs/kb/security-compliance/{hipaa,gdpr,ccpa,soc2,iso27001,data-protection}

# Create pricing-billing subdirectories
mkdir -p docs/kb/pricing-billing/{plans,features,billing,account-management,upgrades}

# Create advanced-topics subdirectories
mkdir -p docs/kb/advanced-topics/{custom-integrations,api-development,workflow-automation,ai-training,performance-optimization}

# Create ai-agent-training subdirectories
mkdir -p docs/kb/ai-agent-training/{personality,capabilities,escalation,compliance,performance}

echo "📁 Creating knowledge base structure..."

# Create placeholder files for key articles
echo "📝 Creating placeholder files..."

# Getting Started Articles
cat > docs/kb/getting-started/account-setup/choosing-plan.md << 'EOF'
# Choosing Your AutopilotCX Plan

This guide helps you select the right AutopilotCX plan for your business needs.

## Plan Comparison

| Feature | Launch | Grow | Scale | Agency | Enterprise |
|---------|--------|------|-------|--------|------------|
| Price/Month | $70 | $150 | $3,399 | $7,999 | $19,999 |
| Social Platforms | 5 | 10 | 15 | 15 | 15 |
| AI Agents | 1 | 3 | 10 | Unlimited | Unlimited |
| Storage | 10GB | 50GB | 200GB | 1TB | Unlimited |
| Users | 1 | 5 | 10 | 25 | Unlimited |

## Plan Selection Guide

### Launch Plan ($70/month)
**Best for**: Solo entrepreneurs and small businesses
- Basic AI features
- 5 social media platforms
- 1,000 emails/month
- 10GB storage
- 1 user account

### Grow Plan ($150/month)
**Best for**: Small businesses with growth potential
- Advanced AI features
- 10 social media platforms
- 5,000 emails/month
- 50GB storage
- 5 user accounts

### Scale Plan ($3,399/month)
**Best for**: Growing businesses with complex needs
- Custom AI models
- 15 social media platforms
- 25,000 emails/month
- 200GB storage
- 10 user accounts

### Agency Plan ($7,999/month)
**Best for**: Marketing agencies and consultancies
- White-label features
- Multi-client management
- Advanced analytics
- 1TB storage
- 25 user accounts

### Enterprise Plan ($19,999/month)
**Best for**: Large enterprises with custom requirements
- Custom solutions
- Dedicated support
- SLA guarantees
- Unlimited storage
- Unlimited users

## Plan Selection Checklist

- [ ] Determine your business size and needs
- [ ] Calculate expected usage (social posts, emails, storage)
- [ ] Consider team size and collaboration needs
- [ ] Evaluate compliance requirements
- [ ] Assess budget and ROI expectations
- [ ] Review feature requirements
- [ ] Consider growth projections

## Plan Upgrade/Downgrade

### Upgrading Your Plan
1. Go to **Settings** → **Billing**
2. Click "Change Plan"
3. Select new plan
4. Review changes and pricing
5. Confirm upgrade

### Downgrading Your Plan
1. Go to **Settings** → **Billing**
2. Click "Change Plan"
3. Select new plan
4. Review impact on features
5. Confirm downgrade

## Need Help Choosing?

Contact our sales team for personalized recommendations based on your specific needs and goals.
EOF

cat > docs/kb/getting-started/account-setup/initial-configuration.md << 'EOF'
# Initial Configuration Guide

Complete your AutopilotCX setup with this comprehensive configuration guide.

## Company Profile Setup

### Basic Information
1. **Company Name**: Enter your official business name
2. **Logo**: Upload your company logo (200x50px recommended)
3. **Brand Colors**: Set your primary and secondary brand colors
4. **Description**: Add a brief company description
5. **Website**: Enter your company website URL

### Contact Information
1. **Primary Contact**: Set main contact person
2. **Email**: Business email address
3. **Phone**: Contact phone number
4. **Address**: Business address (optional)
5. **Timezone**: Set your business timezone

## Industry Configuration

### Industry Selection
Choose your primary industry:
- **Healthcare**: Medical practices, clinics, healthcare providers
- **Real Estate**: Real estate agencies, property management
- **Small Business**: General small business needs
- **Agency**: Marketing agencies, consultancies
- **Enterprise**: Large organizations

### Industry-Specific Setup
Based on your industry, configure:
- **Compliance Settings**: HIPAA, GDPR, etc.
- **Workflow Templates**: Industry-specific automation
- **Integration Presets**: Common industry tools
- **Content Templates**: Industry-appropriate content

## Team Setup

### Adding Team Members
1. Go to **Settings** → **Team**
2. Click "Add Team Member"
3. Enter member information:
   - Name
   - Email address
   - Role
   - Permissions
4. Send invitation email

### Role Configuration
Configure team roles:
- **Admin**: Full platform access
- **Manager**: Team and content management
- **Editor**: Content creation and editing
- **Viewer**: Read-only access
- **Custom**: Custom permission sets

### Permission Settings
Set permissions for:
- **Dashboard Access**: What team members can see
- **Content Creation**: Who can create content
- **Workflow Management**: Who can modify workflows
- **Analytics Access**: Who can view reports
- **Billing Access**: Who can manage billing

## Integration Setup

### Social Media Integration
1. **Facebook**: Connect business page
2. **Instagram**: Link Instagram business account
3. **Twitter**: Connect Twitter account
4. **LinkedIn**: Link company page
5. **TikTok**: Connect TikTok business account

### Email Integration
1. **Email Service**: Connect email provider
2. **SMTP Settings**: Configure email sending
3. **Template Setup**: Create email templates
4. **List Management**: Set up email lists

### CRM Integration
1. **CRM Platform**: Connect your CRM
2. **Data Mapping**: Map customer data fields
3. **Sync Settings**: Configure data synchronization
4. **Automation Rules**: Set up CRM automation

## Security Configuration

### Two-Factor Authentication
1. Enable 2FA for all users
2. Choose authentication method:
   - SMS
   - Authenticator app
   - Email
3. Set up backup codes
4. Test authentication

### Password Policies
1. Set minimum password length
2. Require complex passwords
3. Set password expiration
4. Configure failed login limits

### Access Control
1. Set session timeout
2. Configure IP restrictions
3. Set up audit logging
4. Enable activity monitoring

## Workflow Configuration

### Default Workflows
Set up default workflows:
1. **Lead Capture**: Automatic lead collection
2. **Customer Support**: Support ticket management
3. **Content Publishing**: Automated content posting
4. **Analytics Reporting**: Regular report generation

### Custom Workflows
Create custom workflows:
1. **Business Process**: Map your specific processes
2. **Integration Points**: Connect external tools
3. **Automation Rules**: Set up business logic
4. **Testing**: Test workflow functionality

## Content Setup

### Brand Kit
1. **Logo Variations**: Upload different logo formats
2. **Color Palette**: Define brand colors
3. **Typography**: Set brand fonts
4. **Image Library**: Upload brand images

### Content Templates
1. **Social Media**: Create post templates
2. **Email**: Design email templates
3. **Landing Pages**: Build page templates
4. **Forms**: Create form templates

### Media Library
1. **Image Organization**: Organize by category
2. **Video Content**: Upload and organize videos
3. **Document Storage**: Store business documents
4. **Asset Management**: Manage all media assets

## Testing Configuration

### System Testing
1. **Integration Tests**: Test all connections
2. **Workflow Tests**: Verify automation
3. **Content Tests**: Test publishing
4. **Security Tests**: Verify security settings

### User Testing
1. **Team Training**: Train team members
2. **Process Testing**: Test business processes
3. **Feedback Collection**: Gather user feedback
4. **Optimization**: Improve based on feedback

## Go-Live Checklist

Before going live:
- [ ] All integrations connected and tested
- [ ] Team members added and trained
- [ ] Workflows configured and tested
- [ ] Content templates created
- [ ] Security settings configured
- [ ] Compliance requirements met
- [ ] Backup procedures in place
- [ ] Support contacts established

## Next Steps

After initial configuration:
1. **Create Your First Campaign**: Set up your first marketing campaign
2. **Train Your AI Agents**: Configure AI agents for your business
3. **Set Up Analytics**: Configure reporting and tracking
4. **Optimize Workflows**: Refine automation based on usage
5. **Scale Operations**: Expand as your business grows

## Need Help?

- **Configuration Support**: Contact our setup team
- **Training Resources**: Access our training materials
- **Best Practices**: Review our optimization guides
- **Community**: Join our user community
EOF

# Features Articles
cat > docs/kb/features/cx-symphony/ai-agents.md << 'EOF'
# AI Agent Management

Learn how to create, configure, and manage AI agents in the CX Symphony Suite.

## What are AI Agents?

AI agents are intelligent assistants that handle customer interactions, automate responses, and manage customer journeys. Each agent is trained for specific tasks and can work independently or as part of a team.

## Agent Types

### Conversation Agents
- Handle customer inquiries and support
- Provide information and assistance
- Escalate complex issues to humans
- Maintain conversation context

### Booking Agents
- Manage appointment scheduling
- Handle reservation requests
- Send confirmation messages
- Manage calendar integration

### Support Agents
- Troubleshoot technical issues
- Provide product information
- Handle billing inquiries
- Route issues to appropriate teams

### Sales Agents
- Qualify leads
- Provide product recommendations
- Handle pricing inquiries
- Schedule sales calls

## Creating AI Agents

### Step 1: Agent Setup
1. Go to **CX Symphony** → **AI Agents**
2. Click "Create New Agent"
3. Choose agent type
4. Set agent name and description

### Step 2: Personality Configuration
1. **Tone**: Professional, friendly, casual, formal
2. **Style**: Conversational, technical, sales-oriented
3. **Language**: English, Spanish, French, etc.
4. **Specialization**: Industry-specific knowledge

### Step 3: Capabilities Setup
1. **Allowed Actions**: What the agent can do
2. **Prohibited Actions**: What the agent cannot do
3. **Escalation Rules**: When to hand off to humans
4. **Response Boundaries**: Limits on responses

### Step 4: Knowledge Base
1. **Training Data**: Upload relevant documents
2. **FAQ Integration**: Connect to knowledge base
3. **Product Information**: Add product details
4. **Company Information**: Add company details

## Agent Training

### Training Methods
1. **Supervised Learning**: Human feedback on responses
2. **Reinforcement Learning**: Learn from interactions
3. **Transfer Learning**: Apply knowledge from similar tasks
4. **Continuous Learning**: Improve over time

### Training Data
1. **Conversation Logs**: Real customer interactions
2. **FAQ Documents**: Common questions and answers
3. **Product Manuals**: Product information
4. **Company Policies**: Business rules and procedures

### Performance Optimization
1. **Response Quality**: Monitor response accuracy
2. **Response Time**: Track response speed
3. **User Satisfaction**: Measure user feedback
4. **Escalation Rate**: Monitor handoff frequency

## Agent Management

### Monitoring
1. **Real-Time Status**: Check agent availability
2. **Performance Metrics**: Track key indicators
3. **Error Logs**: Review error messages
4. **Usage Statistics**: Monitor agent usage

### Maintenance
1. **Regular Updates**: Update agent knowledge
2. **Performance Reviews**: Assess agent effectiveness
3. **Training Refreshes**: Retrain with new data
4. **Configuration Updates**: Adjust settings as needed

### Scaling
1. **Load Balancing**: Distribute workload
2. **Agent Cloning**: Create multiple instances
3. **Specialization**: Create specialized agents
4. **Team Coordination**: Coordinate multiple agents

## Best Practices

### Agent Design
1. **Clear Purpose**: Define specific use cases
2. **Appropriate Scope**: Don't overload agents
3. **Human Oversight**: Always have human backup
4. **Continuous Improvement**: Regular optimization

### User Experience
1. **Clear Communication**: Transparent about AI nature
2. **Easy Escalation**: Simple handoff to humans
3. **Consistent Responses**: Maintain brand voice
4. **Helpful Interactions**: Focus on user needs

### Security & Compliance
1. **Data Protection**: Secure customer data
2. **Privacy Compliance**: Follow regulations
3. **Access Control**: Limit agent permissions
4. **Audit Trails**: Track all interactions

## Troubleshooting

### Common Issues
1. **Agent Not Responding**: Check status and configuration
2. **Incorrect Responses**: Review training data
3. **Escalation Problems**: Check handoff rules
4. **Performance Issues**: Monitor system resources

### Solutions
1. **Restart Agent**: Simple restart often fixes issues
2. **Update Training**: Improve with better data
3. **Adjust Settings**: Fine-tune configuration
4. **Contact Support**: Get expert assistance

## Advanced Features

### Multi-Agent Coordination
1. **Agent Teams**: Coordinate multiple agents
2. **Workflow Integration**: Connect to business processes
3. **Data Sharing**: Share information between agents
4. **Load Distribution**: Balance workload

### Custom Development
1. **Custom Skills**: Add specialized capabilities
2. **API Integration**: Connect to external systems
3. **Custom Logic**: Implement business rules
4. **Third-Party Tools**: Integrate with other platforms

## Support Resources

- **Agent Training Guide**: Detailed training instructions
- **Best Practices**: Optimization recommendations
- **Troubleshooting Guide**: Common issues and solutions
- **API Documentation**: Technical integration details
- **Community Forum**: User discussions and tips
EOF

# Troubleshooting Articles
cat > docs/kb/troubleshooting/account/cant-login.md << 'EOF'
# Can't Log In - Troubleshooting Guide

This guide helps you resolve login issues with your AutopilotCX account.

## Quick Fixes

### 1. Check Your Credentials
- Verify email address is correct
- Ensure password is entered properly
- Check for caps lock or num lock
- Try copying and pasting credentials

### 2. Clear Browser Cache
1. Open browser settings
2. Clear browsing data
3. Clear cookies and cache
4. Restart browser
5. Try logging in again

### 3. Try Different Browser
- Use Chrome, Firefox, Safari, or Edge
- Disable browser extensions
- Try incognito/private mode
- Check browser compatibility

## Common Issues

### Wrong Email Address
**Symptoms**: "Account not found" error
**Solution**:
1. Check email spelling
2. Verify email domain
3. Try alternative email addresses
4. Contact support if needed

### Incorrect Password
**Symptoms**: "Invalid password" error
**Solution**:
1. Reset password using "Forgot Password"
2. Check password requirements
3. Ensure no extra spaces
4. Try password reset

### Account Locked
**Symptoms**: "Account locked" message
**Solution**:
1. Wait 15 minutes for auto-unlock
2. Check email for unlock instructions
3. Contact support for manual unlock
4. Verify account status

### Two-Factor Authentication Issues
**Symptoms**: Can't complete 2FA
**Solution**:
1. Check authenticator app time sync
2. Use backup codes if available
3. Request new backup codes
4. Contact support for 2FA reset

## Advanced Troubleshooting

### Check Account Status
1. Visit [autopilotcx.app/status](https://autopilotcx.app/status)
2. Check if platform is operational
3. Look for maintenance notices
4. Monitor social media for updates

### Network Issues
1. Check internet connection
2. Try different network (mobile hotspot)
3. Disable VPN if using one
4. Check firewall settings

### Browser Issues
1. Update browser to latest version
2. Disable browser extensions
3. Clear browser data completely
4. Try different browser

### Device Issues
1. Restart your device
2. Clear device cache
3. Update operating system
4. Try different device

## Account Recovery

### Password Reset
1. Go to login page
2. Click "Forgot Password"
3. Enter your email address
4. Check email for reset link
5. Create new password
6. Log in with new password

### Account Recovery
1. Contact support with account details
2. Provide proof of identity
3. Verify account ownership
4. Follow recovery instructions

### Email Change
1. Contact support team
2. Provide old and new email
3. Verify identity
4. Update email address

## Security Considerations

### Suspicious Activity
If you notice suspicious activity:
1. Change password immediately
2. Enable two-factor authentication
3. Review account activity
4. Contact support

### Compromised Account
If account is compromised:
1. Contact support immediately
2. Provide incident details
3. Follow security procedures
4. Monitor for further issues

## Prevention Tips

### Strong Passwords
- Use unique passwords
- Include numbers and symbols
- Avoid common words
- Change passwords regularly

### Two-Factor Authentication
- Enable 2FA on all accounts
- Use authenticator apps
- Keep backup codes safe
- Test 2FA regularly

### Account Security
- Monitor account activity
- Review login locations
- Keep contact info updated
- Report suspicious activity

## Getting Help

### Support Channels
- **Email**: support@autopilotcx.app
- **Live Chat**: Available on website
- **Phone**: 1-800-AUTOPILOT (Scale+)
- **Status Page**: status.autopilotcx.app

### Information to Provide
When contacting support:
- Email address
- Error messages
- Steps to reproduce
- Browser and device info
- Screenshots if possible

### Response Times
- **Email**: Within 24 hours
- **Live Chat**: Immediate
- **Phone**: Within 4 hours (Scale+)
- **Emergency**: Within 1 hour (Enterprise)

## Account Management

### Regular Maintenance
1. Update contact information
2. Review security settings
3. Check account activity
4. Update passwords regularly

### Account Settings
1. Review privacy settings
2. Check notification preferences
3. Update billing information
4. Manage team permissions

## Related Articles

- [Account Setup Guide](../../getting-started/account-setup/creating-account.md)
- [Two-Factor Authentication Setup](../../getting-started/account-setup/initial-configuration.md)
- [Password Security Best Practices](../../best-practices/security/password-security.md)
- [Account Security Guide](../../security-compliance/data-protection/account-security.md)
EOF

echo "✅ Knowledge base structure generated successfully!"
echo ""
echo "📁 Created directories:"
echo "  - docs/kb/getting-started/ (with subdirectories)"
echo "  - docs/kb/features/ (with subdirectories)"
echo "  - docs/kb/user-guides/ (with subdirectories)"
echo "  - docs/kb/troubleshooting/ (with subdirectories)"
echo "  - docs/kb/api/ (with subdirectories)"
echo "  - docs/kb/best-practices/ (with subdirectories)"
echo "  - docs/kb/industry-solutions/ (with subdirectories)"
echo "  - docs/kb/security-compliance/ (with subdirectories)"
echo "  - docs/kb/pricing-billing/ (with subdirectories)"
echo "  - docs/kb/advanced-topics/ (with subdirectories)"
echo "  - docs/kb/ai-agent-training/ (with subdirectories)"
echo ""
echo "📝 Created sample articles:"
echo "  - Account creation guide"
echo "  - Plan selection guide"
echo "  - Initial configuration guide"
echo "  - AI agent management guide"
echo "  - Login troubleshooting guide"
echo ""
echo "🎯 Next steps:"
echo "  1. Review the generated structure"
echo "  2. Add more specific articles as needed"
echo "  3. Customize content for your specific needs"
echo "  4. Test the knowledge base with your AI agents"
echo "  5. Set up the knowledge base API for agent access" 