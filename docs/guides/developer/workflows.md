# Patient Journey Symphony Workflow

## Overview
The **Patient Journey Symphony** workflow orchestrates the complete lifecycle of a patient in a medical practice using the AutopilotCX platform. It leverages the CX Symphony Suite of musical-themed AI agents to automate onboarding, journey orchestration, billing, telehealth, and communication, ensuring a seamless and delightful experience for both patients and staff.

This workflow is implemented in n8n and integrates with AutopilotCX microservices for LLM, billing, scheduling, and more.

---

## Workflow Structure
- **File:** `services/workflow-engine/workflows/patient_journey.json`
- **Trigger:** Webhook (POST to `/patient-journey`)
- **Nodes/Agents:**
  1. **OvertureAgent** – Greets and triages the patient (entry point)
  2. **PreludeNode** – Patient onboarding (if new patient)
  3. **ScoreNode** – Billing automation (if billing need)
  4. **VirtuNode** – Telehealth coordination (if telehealth need)
  5. **ComposerAgent** – Communication and summary (final step)

---

## Node/Agent Descriptions

### 1. OvertureAgent
- **Role:** The opening movement and triage of patient care.
- **Responsibilities:**
  - Greets the patient/customer
  - Converses to determine their needs (e.g., appointment, billing, medical question, new/existing patient, etc.)
  - Routes them to the appropriate next step (onboarding, scheduling, billing, etc.)
- **Inputs:** Initial chat message and context
- **Outputs:** `greeting`, `needs`, `route`

### 2. PreludeNode
- **Role:** The opening act of patient care (onboarding).
- **Responsibilities:**
  - Sends a personalized welcome message (via LLM and connector-gateway)
  - Collects intake form data (via LLM and journey-builder)
  - Syncs patient data with EHR (via ehr-integration)
- **Inputs:** `patient_data`, `practice_id`, `channel`
- **Outputs:** `onboarding_status`, `patient_id`, `welcome_message_id`, `intake_form_id`

### 3. ScoreNode
- **Role:** The financial composition of patient care.
- **Responsibilities:**
  - Generates invoices (via billing-webhook)
  - Sends payment reminders (via LLM)
  - Verifies insurance (via billing-webhook)
- **Inputs:** `patient_id`, `practice_id`, `billing_data`
- **Outputs:** `billing_status`, `invoice_id`, `reminder_id`, `insurance_verified`

### 4. VirtuNode
- **Role:** The virtual performance of patient care.
- **Responsibilities:**
  - Schedules telehealth consultations (via scheduler-worker)
  - Sends Zoom links (via scheduler-worker)
  - Schedules follow-up care (via scheduler-worker)
  - Sends telehealth instructions (via LLM)
- **Inputs:** `patient_id`, `practice_id`, `telehealth_data`
- **Outputs:** `telehealth_status`, `consultation_id`, `zoom_link_sent`, `followup_scheduled`, `instructions_sent`

### 5. ComposerAgent
- **Role:** The communication and summary agent.
- **Responsibilities:**
  - Generates and formats final communications for the patient (via llm-server)
  - Summarizes the journey and next steps
- **Inputs:** `patient_id`, `practice_id`, `journey_data`
- **Outputs:** `composer_status`, `journey_complete`

---

## Data Flow
```
[Webhook]
   |
[OvertureAgent] (Greeting & Triage)
   |
[Switch]
  |-- onboarding --> [PreludeNode] (Onboarding)
  |-- billing    --> [ScoreNode] (Billing)
  |-- telehealth --> [VirtuNode] (Telehealth)
  |-- other      --> [ComposerAgent] (Summary/Other)
   |
[ComposerAgent] (Final Communication)
```
- Each node passes relevant data to the next, and errors are propagated for workflow-level handling.

---

## Integration Points
- **LLM Server:** Message generation, intake form processing, reminders, telehealth instructions
- **Billing Webhook:** Invoice generation, insurance verification, payment processing
- **Scheduler Worker:** Telehealth scheduling, Zoom link generation, follow-up
- **EHR Integration:** Patient data sync (planned)
- **Connector Gateway:** Message delivery (planned)

---

## Example Payload
```json
{
  "patient_data": {
    "name": "John Doe",
    "phone": "+1234567890",
    "email": "john@example.com"
  },
  "practice_id": "practice_123",
  "channel": "whatsapp",
  "billing_data": {
    "amount": 150.00,
    "service_type": "consultation",
    "insurance_info": {
      "provider": "Blue Cross",
      "policy_number": "BC123456"
    }
  },
  "telehealth_data": {
    "consultation_type": "follow-up",
    "preferred_time": "2025-05-01T14:00:00Z",
    "duration": 30
  }
}
```

---

## Testing Instructions
- **Unit Tests:**
  - Located in `services/workflow-engine/tests/nodes/` and `services/workflow-engine/tests/workflows/`
  - Run with: `pytest services/workflow-engine/tests/`
- **Workflow Test:**
  - See `test_patient_journey.py` for integration tests
  - Mocks all service clients for isolated testing
- **Manual Test:**
  - Start all required microservices (llm-server, billing-webhook, scheduler-worker, etc.)
  - POST to `/patient-journey` endpoint with the example payload
  - Inspect workflow execution in n8n UI or logs

---

## Extending the Workflow
- Add new agents by creating new nodes in `src/nodes/` and updating the workflow JSON
- Integrate additional services by extending the service clients in `src/clients/`
- Update the client portal for analytics and controls as needed

---

## References
- [AutopilotCX CX Symphony Agent Specification](../../AutopilotCX_CX_Symphony_Agent_Spec_v1.txt)
- [n8n Documentation](https://docs.n8n.io/) 