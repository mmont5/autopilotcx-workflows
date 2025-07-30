# AutopilotCX Master Guide

**Created:** July 21, 2025  
**Last Updated:** July 21, 2025  
**Status:** Master documentation consolidating all platform information

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Architecture & Data Flow](#architecture--data-flow)
3. [Workflow Engine System](#workflow-engine-system)
4. [Current Implementation Status](#current-implementation-status)
5. [LLM Integration Strategy](#llm-integration-strategy)
6. [Business Model & Revenue](#business-model--revenue)
7. [Development & Testing](#development--testing)
8. [Knowledge Base & Support](#knowledge-base--support)
9. [Critical Issues & Solutions](#critical-issues--solutions)

---

## Platform Overview

### **Multi-Industry, Multi-Language Platform**
AutopilotCX is **NOT** built for single clients (like Dr. Hassan) - it's a **universal platform** for all industries, business sizes, and languages.

#### **Core Principles:**
- ✅ **Dynamic adaptation** based on deep-dive website analysis
- ✅ **No hardcoded data** - everything from authoritative sites and client info
- ✅ **Multi-language foundation** built from ground up
- ✅ **White-label revenue model** for agencies and enterprises
- ✅ **Modular workflow architecture** for quick industry deployment

#### **Platform Components:**
- **Frontend (V0/Vercel):** `www.autopilotcx.app` - Company website
- **Admin Dashboard:** `app.autopilotcx.app` - Owner/Admin access
- **Client Dashboard:** `app.autopilotcx.app` - User access
- **Demo Platform:** `www.clientdemo.me` - Prospective client demos
- **N8N Workflow Engine:** `cx.autopilotcx.app` - Self-hosted community edition
- **LLM Server:** `localhost:8200` - Multi-specialty AI responses
- **Main Database:** Supabase cloud

---

## Architecture & Data Flow

### **Two Critical Data Sources**

#### **Source 1: Demo Creation Data (Admin → Supabase → N8N)**
- **Trigger:** Demo creation in admin (`apps/admin/src/app/dashboard/demos/new/page.tsx`)
- **Payload:** Complete business data (locations, staff, services, etc.)
- **Flow:** Admin Form → Supabase Demo Table → Webhook Trigger → N8N Workflow
- **Purpose:** Establishes complete business context for demo

#### **Source 2: Chat Interaction Data (Demo Page → N8N)**
- **Trigger:** Real-time chat interactions on demo page (`apps/demo/app/demo/[demoId]/page.tsx`)
- **Payload:** User messages, booking state, conversation context
- **Flow:** Demo Chat Interface → Webhook → N8N Workflow
- **Purpose:** Handles actual conversation flow

### **Data Merging Strategy**
The workflow must merge these two data streams:
- **Demo Context:** Business info (locations, services, contact, etc.)
- **Chat Context:** User messages, booking state, conversation flow

### **Fixed Data Structure**
```javascript
// CORRECT: Preserve original_context structure
{
  "intent": "appointment",
  "nextAgent": "BookingAgent",
  "message": "I'd like to schedule an appointment.",
  "bookingState": "",
  "bookingData": "{}",
  
  // CRITICAL: Preserves original_context structure
  "original_context": {
    "demoData": {
      "company_name": "Hassan Spine & Sports Medicine",
      "agent_name": "Olivia",
      "locations": [...],
      "specialists": [...],
      // ... all demo creation data
    },
    "webhookData": {
      "message": "I'd like to schedule an appointment.",
      "bookingState": "",
      "bookingData": "{}"
    },
    "fullContext": {
      "google_place": {...},
      // ... enriched data
    }
  }
}
```

---

## Workflow Engine System

### **Dual-Tier Workflow Architecture**

#### **1. Demo Workflows (Entry Point)**
**Purpose:** Showcase platform capabilities to prospective clients
**Duration:** 3-day expiry for prospects (never expires for owner/admin)

**Structure:**
```
Industry Master Demo Workflow
├── Industry-specific base structure
├── Common patterns and routing
├── Specialty Modules (Demo versions)
└── Basic features only
```

#### **2. Full Client Workflows (Revenue Generation)**
**Purpose:** Complete platform functionality for paying clients
**Features:** All premium features, integrations, and automation

**Structure:**
```
Industry Master Full Workflow
├── Industry-specific base structure
├── Common patterns and routing
├── Specialty Modules (Full versions)
├── Social Media Automation
├── Content Creation & Scheduling
├── Analytics & Business Insights
├── CRM Integrations (200+)
├── Design Studio
├── SEO & Keyword Analysis
├── Social Listening
├── Advanced AI Features
└── Industry-specific integrations (EHR, etc.)
```

### **Modular Architecture**

#### **Industry Master Workflows:**
- **Healthcare Master Workflow**
- **Real Estate Master Workflow**
- **Legal Master Workflow**
- **Financial Services Master Workflow**
- **[Any Industry] Master Workflow**

#### **Specialty Modules (Plug & Play):**
Each industry has specialty modules that can be combined:

**Healthcare Specialty Modules:**
```
├── Pain-Management-Module
├── Sports-Medicine-Module
├── Cardiology-Module
├── Orthopedic-Module
├── Neurology-Module
├── Dermatology-Module
├── Pediatrics-Module
├── Psychiatry-Module
├── Radiology-Module
└── [50+ more specialties]
```

### **Workflow Creation Process**

#### **Step 1:** Requestor Information
- Client details, contact information
- Business requirements and goals

#### **Step 2:** Industry and Categories Selection
- Choose industry (Healthcare, Real Estate, etc.)
- Select 2-3 relevant categories/specialties

#### **Step 3:** Dynamic Workflow Assembly
```
MAIN BASIC WORKFLOW (Industry-based)
+ SELECTED MODULES (Category-based)
= NEW COMBINED WORKFLOW
→ RENAMED: "COMPANY-NAME-DEMO-WORKFLOW"
```

#### **Step 4:** Demo Creation
- Workflow assigned permanently to prospective client
- 3-day expiry for prospects
- Never expires for owner/admin (marketing use)

### **Conversion Process: Demo → Full Client**
```
DEMO WORKFLOW (Dr. Hassan Demo)
    ↓ [Client Signs Up]
FULL WORKFLOW (Dr. Hassan Full)
    ↓ [Add Premium Modules]
+ Social Media Automation
+ Content Creation Engine
+ Analytics Dashboard
+ CRM Integrations
+ Design Studio
+ SEO Tools
+ Advanced AI Features
+ Industry-specific integrations
```

---

## Current Implementation Status

### **✅ Services Running Successfully**
- **NGROK:** `https://6722e9ebb82c.ngrok-free.app` → `localhost:5678`
- **N8N Workflow Engine:** `localhost:5678` (healthy)
- **LLM Server:** `localhost:8200` (healthy)
- **Docker:** All containers running cleanly

### **✅ Platform Architecture Confirmed**
- **Multi-industry, multi-language platform** (not single-client)
- **Dynamic workflow assembly** system
- **Modular specialty modules** design
- **Dual workflow system** (demo + full client)

### **🔴 Critical Issues Identified**

#### **Priority 1: LLM Integration**
**Problem:** LLMs not working as primary response source
**Impact:** Templates being used instead of dynamic AI responses
**Solution Needed:** Fix LLM integration to make it primary, templates only for emergencies

#### **Priority 2: Workflow Assembly**
**Problem:** Manual workflow creation instead of dynamic assembly
**Impact:** Cannot scale to 50+ doctors efficiently
**Solution Needed:** Automated MAIN + MODULES combination system

#### **Priority 3: Data Flow**
**Problem:** Initial context not properly merged with chat interactions
**Impact:** Agents lack full context for accurate responses
**Solution Needed:** Proper data merging strategy throughout workflow

#### **Priority 4: Demo Creation Pipeline**
**Problem:** Admin form → Supabase → N8N webhook not fully functional
**Impact:** Cannot create demos efficiently
**Solution Needed:** Complete pipeline from admin form to workflow creation

#### **Priority 5: Agent Routing**
**Problem:** Specialty-based agent selection not working
**Impact:** Wrong agents responding to specialty-specific queries
**Solution Needed:** Dynamic agent routing based on specialty modules

---

## LLM Integration Strategy

### **Primary Response Strategy**
```
User Query → LLM Server → Dynamic Response → User
     ↓ (if LLM fails)
User Query → Template System → Fallback Response → User
```

### **LLM Server Configuration**
**File:** `services/llm-server/src/main.py`

#### **Key Features:**
- **Multi-specialty enhanced responses**
- **Dynamic practice knowledge integration**
- **OpenAI API integration**
- **Supabase data retrieval**
- **Authoritative sites integration**

#### **API Endpoints:**
- **Health Check:** `GET /health`
- **Chat Completion:** `POST /chat`
- **Specialty Enhancement:** `POST /enhance`
- **Practice Knowledge:** `POST /practice-knowledge`

### **Workflow Integration Points**

#### **1. Agent Response Nodes**
**Current Issue:** Using hardcoded templates
**Solution:** Integrate with LLM server for dynamic responses

```javascript
// Target Implementation
const response = await fetch('http://localhost:8200/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: userQuery,
    specialty: specialty,
    practice: practiceInfo,
    context: conversationHistory
  })
});
```

#### **2. Fallback System**
```javascript
// Fallback Implementation
async function getResponse(userQuery, specialty, practice) {
  try {
    // Try LLM first
    const llmResponse = await fetch('http://localhost:8200/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: userQuery,
        specialty: specialty,
        practice: practice
      })
    });
    
    if (llmResponse.ok) {
      const data = await llmResponse.json();
      return data.response;
    }
  } catch (error) {
    console.log('LLM failed, using template fallback');
  }
  
  // Fallback to template
  return getTemplateResponse(userQuery, specialty);
}
```

---

## Business Model & Revenue

### **User Tiers and Access Levels**

#### **Owner/Super Admin (God-Mode)**
- **Complete access** to all features
- **No restrictions** on any functionality
- **Marketing demos** never expire

#### **AutopilotCX Staff**
- **Super Admins** - Full platform access
- **Admins** - Limited administrative access
- **Support Staff** - Billing, sales, support access

#### **Client Tiers**
- **Launch User Admin** - Single user
- **Grow User Admin** - 5 users, 1 team admin
- **Scale User Admin** - 10 users, 1 team admin
- **Agency** - 10 users + 10 clients
- **Enterprise** - 20 users + unlimited clients

### **Revenue Model**
- **White-label platform** for agencies
- **Per-user pricing** for direct clients
- **Agency partnerships** with revenue sharing
- **Enterprise solutions** with custom pricing

### **Business Impact**

#### **Current State:**
- **1 demo working** (Dr. Hassan)
- **Manual workflow creation** (hours of work)
- **LLM integration broken** (templates only)
- **Cannot scale** to 50+ doctors

#### **Target State:**
- **50+ demos ready** for healthcare providers
- **Automated workflow creation** (minutes)
- **LLM integration working** (dynamic responses)
- **Scalable architecture** for any industry

---

## Development & Testing

### **Immediate Action Plan**

#### **Phase 1: Fix LLM Integration (CRITICAL)**
1. **Examine current LLM server configuration**
2. **Fix API endpoints and authentication**
3. **Test LLM responses in workflow**
4. **Implement fallback to templates only on LLM failure**

#### **Phase 2: Implement Dynamic Workflow Assembly**
1. **Extract Healthcare Master Workflow components**
2. **Create modular specialty modules**
3. **Build automated assembly system**
4. **Test quick demo creation (minutes, not hours)**

#### **Phase 3: Fix Data Flow Architecture**
1. **Implement proper context merging**
2. **Fix initial data + chat data combination**
3. **Ensure context preservation across all agents**
4. **Test end-to-end data flow**

#### **Phase 4: Complete Demo Creation Pipeline**
1. **Fix admin form submission**
2. **Complete Supabase integration**
3. **Fix N8N webhook triggers**
4. **Test full demo creation process**

#### **Phase 5: Implement Agent Routing**
1. **Create specialty-based routing logic**
2. **Implement dynamic agent selection**
3. **Test specialty-specific responses**
4. **Validate agent accuracy**

### **Success Metrics**

#### **Technical Metrics:**
- **LLM response time:** < 3 seconds
- **Workflow assembly time:** < 5 minutes
- **Demo creation time:** < 10 minutes
- **Agent accuracy:** > 95% specialty-specific responses

#### **Business Metrics:**
- **Demo conversion rate:** Target 30%+
- **Time to create demo:** < 15 minutes
- **Client satisfaction:** > 90%
- **Platform scalability:** 50+ concurrent demos

---

## Knowledge Base & Support

### **AI Agent Support Workflow**

#### **1. Issue Identification**
**AI Agent Process:**
1. **Listen to user problem** - Understand the specific issue
2. **Categorize the issue** - Account, feature, technical, billing, etc.
3. **Search knowledge base** - Find relevant troubleshooting articles
4. **Provide immediate solution** - If solution is available
5. **Escalate if needed** - If issue requires human intervention

#### **2. Feature Explanation**
**AI Agent Process:**
1. **Understand user needs** - What are they trying to accomplish?
2. **Identify relevant features** - Which platform capabilities apply?
3. **Explain features clearly** - Provide step-by-step guidance
4. **Offer best practices** - How to use features effectively
5. **Suggest next steps** - What to do after implementation

### **Knowledge Base Content Categories**

#### **User Support Scenarios**
- **Account & Access Issues** - Login problems, permissions, 2FA
- **Feature Usage Questions** - How to create AI agents, workflows, etc.
- **Technical Problems** - System issues, integrations, performance
- **Billing & Subscription** - Payment issues, plan changes, refunds
- **Industry-Specific Support** - Healthcare, real estate, small business

#### **Industry Solutions**
- **Healthcare** - HIPAA compliance, patient communication, EHR integration
- **Real Estate** - Lead capture, property marketing, client nurturing
- **Small Business** - Customer support, lead generation, content marketing
- **Agency/Enterprise** - White-labeling, multi-client management

---

## Critical Issues & Solutions

### **High Priority Issues**

#### **1. LLM Integration Broken**
**Problem:** Templates being used instead of dynamic AI responses
**Solution:** Fix LLM server integration in workflow nodes
**Impact:** Critical for demo quality and conversion

#### **2. Workflow Assembly Manual**
**Problem:** Cannot scale to 50+ doctors efficiently
**Solution:** Implement automated MAIN + MODULES combination
**Impact:** Business scalability depends on this

#### **3. Data Flow Issues**
**Problem:** Context not preserved through workflow
**Solution:** Fix data merging strategy in intent classifier
**Impact:** Agent responses lack proper context

#### **4. Demo Creation Pipeline**
**Problem:** Admin form → Supabase → N8N webhook incomplete
**Solution:** Complete the full pipeline
**Impact:** Cannot create demos efficiently

### **Risk Mitigation**

#### **High Risk Items:**
- **LLM integration failure** → Implement robust fallback system
- **Workflow assembly complexity** → Start with simple modular system
- **Data flow issues** → Implement comprehensive testing
- **Scalability bottlenecks** → Design for horizontal scaling

#### **Contingency Plans:**
- **Template-only mode** if LLM fails completely
- **Manual workflow creation** if automation fails
- **Basic demo functionality** if advanced features fail
- **Industry-specific templates** if dynamic assembly fails

### **Next Steps**

#### **Immediate (This Session):**
1. **Fix LLM integration** in current workflow
2. **Test LLM responses** vs template fallbacks
3. **Verify data flow** from admin to agents
4. **Document current workflow structure**

#### **Short Term (Next Sessions):**
1. **Implement dynamic workflow assembly**
2. **Create modular specialty system**
3. **Build automated demo creation**
4. **Test with multiple healthcare specialties**

#### **Medium Term:**
1. **Scale to 50+ healthcare providers**
2. **Implement full client conversion**
3. **Add EHR integrations**
4. **Expand to other industries**

---

## Success Factors

### **Critical Success Factors**
1. **Modular Architecture** - Enables quick assembly
2. **LLM Integration** - Primary response mechanism
3. **Seamless Conversion** - Demo to full client
4. **Industry-Specific Features** - EHR, CRM integrations
5. **Multi-Language Support** - Global scalability
6. **White-Label Capability** - Agency partnerships
7. **Automated Workflows** - Social media, content, analytics
8. **Real-time Analytics** - Business insights and ROI

### **Scalability Strategy**

#### **For 50+ Healthcare Providers**
- **Healthcare Master Workflow** (reusable)
- **Specialty Module Library** (plug & play)
- **Quick demo creation** (minutes)
- **Instant conversion** to full client
- **EHR integration** for each provider

#### **For Multiple Industries**
- **Industry Master Workflows** (templates)
- **Industry-specific modules** (specialties)
- **Industry integrations** (EHR, CRM, etc.)
- **Scalable architecture** for any business type

This master guide consolidates all critical information about AutopilotCX, providing a comprehensive reference for understanding the platform architecture, current status, and immediate action plan. 