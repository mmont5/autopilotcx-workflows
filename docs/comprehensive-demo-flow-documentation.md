# Comprehensive Demo Flow Documentation

## Overview
This document outlines the complete flow of demo creation, from the initial form submission to the final execution in the N8N workflow system. The demo creation process is a 10-step form that creates hyper-personalized AI agents for businesses across various industries.

## Demo Creation Process

### **Who Can Create Demos:**
- **Owner/Admin Users** via `apps/admin` dashboard
- **Agency and Enterprise Level Users** with appropriate permissions

### **10-Step Form Process:**

#### **Step 1: Requestor Information** 📝
*Purpose: Internal tracking of who requested the demo*

**Fields:**
- **First Name** (Required) - Requestor's first name
- **Last Name** (Required) - Requestor's last name  
- **Email Address** (Required) - Requestor's email for internal communication
- **Phone** (Required) - Requestor's phone number with country code

**Validation:**
- All fields are required
- Email must be valid format
- Phone number includes country code selection

---

#### **Step 2: Company Information** 🏢
*Purpose: Core business details for AI agent personalization*

**Fields:**
- **Industry Dropdown** (Required) - Select from predefined industries (Healthcare, Legal, Real Estate, E-commerce, etc.)
- **Category(s) Dropdown** (Required) - Multi-select categories based on chosen industry
- **Company Name** (Required) - Official business name
- **Company Website** (Required) - Business website URL
- **Company Email** (Required) - Primary business email
- **Company Phone** (Required) - Business phone with country code
- **Company Tagline** (Required) - Business slogan or description
- **Logo URL** (Required) - Company logo URL (auto-fetched from Clearbit API)

**Features:**
- Dynamic category loading based on industry selection
- Automatic logo fetching from Clearbit API
- Industry-specific validation rules

---

#### **Step 3: Workflow Selection** ⚙️
*Purpose: Choose the AI agent's behavior and capabilities*

**Fields:**
- **Workflow Template** (Required) - Select from available N8N workflow templates
- **Manual Workflow Option** - Toggle for custom workflow configuration
- **Industry-Specific Workflows** - Filtered based on selected industry

**Features:**
- Dynamic workflow filtering by industry
- Preview of workflow capabilities
- Integration with N8N workflow system

---

#### **Step 4: Owner Information** 👤
*Purpose: Personalize AI agent with business owner details*

**Fields:**
- **First Name** (Required) - Owner's first name
- **Last Name** (Required) - Owner's last name
- **Title** (Required) - Owner's professional title (CEO, Medical Director, etc.)
- **Owner Email** (Optional) - Owner's email address
- **Professional Headline** (Required) - Professional title/description
- **Professional Bio** (Required) - Detailed professional background
- **Profile Image URL** (Required) - Owner's professional headshot

**Features:**
- Professional bio used for AI agent personalization
- Image URL validation
- Professional credential integration

---

#### **Step 5: Location Details** 📍
*Purpose: Configure business locations for AI agent*

**Fields:**
- **Multiple Location Support** - Add unlimited business locations
- **Street Address** (Required) - Complete street address
- **Suite/Unit** (Optional) - Suite number or unit information
- **City** (Required) - City name
- **State/Province** (Required) - State or province
- **ZIP/Postal Code** (Required) - Postal code
- **Country** (Required) - Country (defaults to United States)
- **Main Location Flag** - Mark primary business location

**Features:**
- Dynamic location addition/removal
- Main location designation
- Address validation
- Google Places integration for business hours

---

#### **Step 6: Social Media** 📱
*Purpose: Connect social media accounts for AI agent knowledge*

**Fields:**
- **Social Media Networks** - Add multiple social platforms
- **Network Type** - Facebook, Instagram, LinkedIn, Twitter, etc.
- **Profile URL** - Social media profile links
- **Content Integration** - Social media content for AI training

**Features:**
- Multiple social media platform support
- Content scraping capabilities
- Brand voice integration

---

#### **Step 7: Specialists** 👨‍⚕️
*Purpose: Add professional specialists for AI agent knowledge*

**Fields:**
- **First Name** (Required) - Specialist's first name
- **Last Name** (Required) - Specialist's last name
- **Title** (Required) - Professional title
- **Specialty** (Required) - Area of expertise
- **Bio** (Required) - Professional background
- **Image URL** (Required) - Professional photo
- **Email** (Optional) - Contact email

**Features:**
- Multiple specialist support
- Professional credential integration
- AI agent personalization

---

#### **Step 8: Team Members** 👥
*Purpose: Add team members for comprehensive business representation*

**Fields:**
- **First Name** (Required) - Team member's first name
- **Last Name** (Required) - Team member's last name
- **Role** (Required) - Job title/position
- **Bio** (Optional) - Professional background
- **Profile Image URL** (Optional) - Professional photo
- **Email** (Optional) - Contact email

**Features:**
- Unlimited team member addition
- Role-based information organization
- Team structure integration

---

#### **Step 9: Knowledge Sources** 📚
*Purpose: Configure authoritative sources for AI agent knowledge*

**Fields:**
- **Authoritative Sites** - Official business websites
- **Custom Sites** - Additional knowledge sources
- **Site Name** - Descriptive name for each site
- **Site URL** - Website address
- **Content Integration** - Site content for AI training

**Features:**
- Multiple knowledge source support
- Content scraping capabilities
- Knowledge base integration

---

#### **Step 10: Additional Information** ℹ️
*Purpose: Final configuration and settings*

**Fields:**
- **Consent** (Required) - Data usage consent checkbox
- **Contact Client Directly** (Optional) - Direct contact preferences
- **Show Branding** (Optional) - Brand display settings
- **Additional Notes** (Optional) - Special instructions or requirements
- **Test Data Options** - Save as test data for development

**Features:**
- Legal compliance settings
- Privacy configuration
- Development/testing options

---

## **Form Submission Process**

### **Immediate Actions Upon Form Submission:**

#### **1. Database Insertion** 💾
- **Table:** `demo` in Supabase
- **Status:** Set to `'draft'` initially
- **Metadata Storage:** All form data stored in structured format
- **Relationships:** Links to industry, category, and workflow tables

#### **2. Supabase Webhook Trigger** 🔗
- **Trigger:** `demo_created_webhook` (PostgreSQL trigger)
- **Function:** `notify_demo_created()`
- **Payload:** Complete demo data in JSON format
- **Destination:** N8N webhook endpoint

#### **3. N8N Workflow Activation** ⚡
- **Webhook URL:** `https://[ngrok-url]/webhook/0a274e64-8902-4f73-ac54-7f37206c7a31`
- **Payload Structure:**
  ```json
  {
    "event": "demo.created",
    "demo_id": "uuid",
    "company_name": "Business Name",
    "industry_id": "industry-uuid",
    "workflow_template_id": "workflow-uuid",
    "created_at": "timestamp",
    "data": { /* complete demo object */ }
  }
  ```

#### **4. Workflow Assembly Process** 🔧
- **API Endpoint:** `/api/n8n/assemble-workflow`
- **Process:** 
  1. Retrieve workflow template
  2. Apply industry-specific customizations
  3. Integrate business data
  4. Generate personalized N8N workflow
  5. Deploy to N8N instance

#### **5. Manual Trigger Options** 🎯
- **Backend API:** `/api/trigger-webhook`
- **Database Function:** `trigger_demo_webhook(demo_id)`
- **Purpose:** Re-trigger webhook for existing demos

---

## **Post-Creation Flow**

### **1. Demo Status Management** 📊
- **Draft** → Initial creation state
- **Active** → Ready for use
- **Inactive** → Temporarily disabled
- **Archived** → Long-term storage

### **2. AI Agent Generation** 🤖
- **Personalization:** Business-specific responses
- **Knowledge Integration:** Website, social media, specialist info
- **Workflow Customization:** Industry-specific behaviors
- **Brand Voice:** Company-specific communication style

### **3. Demo Deployment** 🚀
- **N8N Workflow:** Personalized workflow deployment
- **Webhook Activation:** Live webhook endpoint creation
- **Frontend Integration:** Demo chat interface
- **Analytics Setup:** View and conversion tracking

### **4. Testing and Validation** ✅
- **Automated Testing:** Workflow functionality verification
- **Manual Testing:** User experience validation
- **Performance Testing:** Response time optimization
- **Security Validation:** Data protection verification

---

## **Technical Architecture**

### **Frontend (apps/admin)**
- **Framework:** Next.js with TypeScript
- **Form Management:** React Hook Form
- **UI Components:** Custom component library
- **Validation:** Real-time form validation

### **Backend (API Routes)**
- **Framework:** Next.js API routes
- **Database:** Supabase (PostgreSQL)
- **Authentication:** NextAuth.js
- **File Storage:** Supabase Storage

### **Database (Supabase)**
- **Tables:** demo, industry, category, workflow_templates
- **Triggers:** Webhook notifications
- **RLS:** Row Level Security
- **Functions:** Custom PostgreSQL functions

### **Workflow Engine (N8N)**
- **Custom Nodes:** BookingAgent, MaestroAgent, etc.
- **Webhooks:** HTTP endpoints for data flow
- **Templates:** Reusable workflow templates
- **Integration:** Supabase, external APIs

### **Demo Interface (apps/demo)**
- **Framework:** Next.js with TypeScript
- **Chat Interface:** Real-time messaging
- **API Integration:** N8N webhook communication
- **Analytics:** View and conversion tracking

---

## **Data Flow Summary**

```
1. User fills 10-step form → apps/admin
2. Form submission → API route validation
3. Database insertion → Supabase demo table
4. Webhook trigger → PostgreSQL trigger function
5. N8N notification → Workflow assembly API
6. Workflow deployment → Personalized N8N workflow
7. Demo activation → Live chat interface
8. User interaction → Real-time AI responses
```

---

## **Key Features**

### **Multi-Industry Support** 🌐
- Healthcare, Legal, Real Estate, E-commerce
- Industry-specific workflows and behaviors
- Customizable categories and specialties

### **Hyper-Personalization** 🎯
- Business-specific AI agent names
- Company branding integration
- Professional credential inclusion
- Location-based services

### **Scalable Architecture** 📈
- Microservices-based design
- N8N workflow orchestration
- Supabase real-time capabilities
- Cloud-native deployment

### **Security & Compliance** 🔒
- Row Level Security (RLS)
- Data encryption
- Privacy compliance
- Audit logging

---

## **Development & Testing**

### **Test Data Generation** 🧪
- Automated test data creation
- Industry-specific sample data
- Workflow testing capabilities
- Performance benchmarking

### **Manual Trigger System** 🎮
- Backend API for webhook triggering
- Database functions for testing
- Development environment support
- Debugging capabilities

### **Monitoring & Analytics** 📊
- Demo performance tracking
- User interaction analytics
- Workflow execution monitoring
- Error logging and alerting

---

This comprehensive flow ensures that every demo creation results in a fully functional, personalized AI agent that can effectively represent the business and provide excellent customer service across all industries and use cases. 