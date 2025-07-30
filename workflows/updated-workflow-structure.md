# Updated Workflow Structure - LLMs Only for Value-Add Branches

## **New Workflow Architecture**

### **1. Intent Classification (No LLM)**
- **Purpose:** Route user to appropriate branch
- **Method:** Rule-based classification (already working)
- **Output:** `intent` and `nextAgent`

### **2. Booking Flow (No LLM - Deterministic)**
- **Purpose:** Collect appointment information
- **Method:** State machine with buttons and text input
- **States:** 15-step process from initial to complete
- **Response Time:** < 100ms

### **3. Clinical Q&A (LLM - Value Add)**
- **Purpose:** Answer medical questions, explain procedures
- **Method:** LLM with medical knowledge base
- **Use Cases:** Symptoms, treatments, recovery, etc.

### **4. Insurance/Billing (LLM - Value Add)**
- **Purpose:** Explain coverage, costs, benefits
- **Method:** LLM with insurance knowledge
- **Use Cases:** Copay questions, coverage explanations

### **5. Feedback/Support (LLM - Value Add)**
- **Purpose:** Handle complaints, suggestions, support
- **Method:** LLM with empathetic responses
- **Use Cases:** Reviews, complaints, general support

### **6. General Q&A (LLM - Value Add)**
- **Purpose:** Answer practice-specific questions
- **Method:** LLM with practice knowledge
- **Use Cases:** Hours, locations, policies, etc.

## **Updated Workflow JSON Structure**

```json
{
  "name": "Hassan-Spine-Sports-Medicine-Workflow-Deterministic",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "0a274e64-8902-4f73-ac54-7f37206c7a31",
        "responseMode": "responseNode"
      }
    },
    {
      "name": "Initial Processing",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Process demo data and context"
      }
    },
    {
      "name": "Intent Classifier",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Rule-based intent classification (no LLM)"
      }
    },
    {
      "name": "Switch",
      "type": "n8n-nodes-base.switch",
      "parameters": {
        "rules": {
          "values": [
            {
              "conditions": {
                "conditions": [
                  {
                    "leftValue": "intent",
                    "rightValue": "appointment",
                    "operator": { "type": "string", "operation": "equals" }
                  }
                ]
              },
              "outputKey": "Deterministic Booking Agent"
            },
            {
              "conditions": {
                "conditions": [
                  {
                    "leftValue": "intent",
                    "rightValue": "clinical",
                    "operator": { "type": "string", "operation": "equals" }
                  }
                ]
              },
              "outputKey": "Clinical Q&A Agent"
            },
            {
              "conditions": {
                "conditions": [
                  {
                    "leftValue": "intent",
                    "rightValue": "billing",
                    "operator": { "type": "string", "operation": "equals" }
                  }
                ]
              },
              "outputKey": "Insurance/Billing Agent"
            },
            {
              "conditions": {
                "conditions": [
                  {
                    "leftValue": "intent",
                    "rightValue": "feedback",
                    "operator": { "type": "string", "operation": "equals" }
                  }
                ]
              },
              "outputKey": "Feedback/Support Agent"
            },
            {
              "conditions": {
                "conditions": [
                  {
                    "leftValue": "intent",
                    "rightValue": "general",
                    "operator": { "type": "string", "operation": "equals" }
                  }
                ]
              },
              "outputKey": "General Q&A Agent"
            },
            {
              "conditions": {
                "conditions": [
                  {
                    "leftValue": "intent",
                    "rightValue": "escalate",
                    "operator": { "type": "string", "operation": "equals" }
                  }
                ]
              },
              "outputKey": "Human Agent"
            }
          ]
        }
      }
    },
    {
      "name": "Deterministic Booking Agent",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// State machine for booking (no LLM)"
      }
    },
    {
      "name": "Clinical Q&A Agent",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.openai.com/v1/chat/completions",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer {{ $env.OPENAI_API_KEY }}",
          "Content-Type": "application/json"
        },
        "body": {
          "model": "gpt-4",
          "messages": [
            {
              "role": "system",
              "content": "You are a medical assistant at Hassan Spine & Sports Medicine. Answer clinical questions with empathy and accuracy. Do not provide medical advice, only general information."
            },
            {
              "role": "user",
              "content": "={{ $json.message }}"
            }
          ],
          "max_tokens": 500,
          "temperature": 0.7
        }
      }
    },
    {
      "name": "Insurance/Billing Agent",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.openai.com/v1/chat/completions",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer {{ $env.OPENAI_API_KEY }}",
          "Content-Type": "application/json"
        },
        "body": {
          "model": "gpt-4",
          "messages": [
            {
              "role": "system",
              "content": "You are a billing specialist at Hassan Spine & Sports Medicine. Help with insurance questions, costs, and coverage. Be clear about what we accept and don't accept."
            },
            {
              "role": "user",
              "content": "={{ $json.message }}"
            }
          ],
          "max_tokens": 500,
          "temperature": 0.7
        }
      }
    },
    {
      "name": "Feedback/Support Agent",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.openai.com/v1/chat/completions",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer {{ $env.OPENAI_API_KEY }}",
          "Content-Type": "application/json"
        },
        "body": {
          "model": "gpt-4",
          "messages": [
            {
              "role": "system",
              "content": "You are a patient care coordinator at Hassan Spine & Sports Medicine. Handle feedback, complaints, and support requests with empathy and professionalism."
            },
            {
              "role": "user",
              "content": "={{ $json.message }}"
            }
          ],
          "max_tokens": 500,
          "temperature": 0.7
        }
      }
    },
    {
      "name": "General Q&A Agent",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.openai.com/v1/chat/completions",
        "method": "POST",
        "headers": {
          "Authorization": "Bearer {{ $env.OPENAI_API_KEY }}",
          "Content-Type": "application/json"
        },
        "body": {
          "model": "gpt-4",
          "messages": [
            {
              "role": "system",
              "content": "You are an assistant at Hassan Spine & Sports Medicine. Answer questions about our practice, hours, locations, policies, and general information."
            },
            {
              "role": "user",
              "content": "={{ $json.message }}"
            }
          ],
          "max_tokens": 500,
          "temperature": 0.7
        }
      }
    },
    {
      "name": "Human Agent",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Route to human agent for emergencies"
      }
    },
    {
      "name": "Format Response",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// Format final response for frontend"
      }
    }
  ],
  "connections": {
    "Webhook": {
      "main": [[{"node": "Initial Processing", "type": "main", "index": 0}]]
    },
    "Initial Processing": {
      "main": [[{"node": "Intent Classifier", "type": "main", "index": 0}]]
    },
    "Intent Classifier": {
      "main": [[{"node": "Switch", "type": "main", "index": 0}]]
    },
    "Switch": {
      "main": [
        [{"node": "Deterministic Booking Agent", "type": "main", "index": 0}],
        [{"node": "Clinical Q&A Agent", "type": "main", "index": 0}],
        [{"node": "Insurance/Billing Agent", "type": "main", "index": 0}],
        [{"node": "Feedback/Support Agent", "type": "main", "index": 0}],
        [{"node": "General Q&A Agent", "type": "main", "index": 0}],
        [{"node": "Human Agent", "type": "main", "index": 0}]
      ]
    },
    "Deterministic Booking Agent": {
      "main": [[{"node": "Format Response", "type": "main", "index": 0}]]
    },
    "Clinical Q&A Agent": {
      "main": [[{"node": "Format Response", "type": "main", "index": 0}]]
    },
    "Insurance/Billing Agent": {
      "main": [[{"node": "Format Response", "type": "main", "index": 0}]]
    },
    "Feedback/Support Agent": {
      "main": [[{"node": "Format Response", "type": "main", "index": 0}]]
    },
    "General Q&A Agent": {
      "main": [[{"node": "Format Response", "type": "main", "index": 0}]]
    },
    "Human Agent": {
      "main": [[{"node": "Format Response", "type": "main", "index": 0}]]
    }
  }
}
```

## **Key Changes**

### **1. Removed LLMs from Booking Flow**
- No more "Build Booking Prompt" → "Call LLM" → "Format Response"
- Direct state machine with instant responses
- Buttons and text input handled deterministically

### **2. Kept LLMs for Value-Add Branches**
- **Clinical Q&A:** Medical knowledge and empathy
- **Insurance/Billing:** Complex coverage explanations
- **Feedback/Support:** Handling complaints and requests
- **General Q&A:** Practice-specific information

### **3. Simplified Routing**
- Intent Classifier routes to appropriate branch
- Each branch handles its own response formatting
- No complex state management across branches

### **4. Performance Benefits**
- **Booking Flow:** < 100ms response time
- **LLM Branches:** 2-3 second response time (acceptable for Q&A)
- **Reliability:** Deterministic booking, LLM for complex queries

## **Implementation Steps**

1. **Replace "Build Booking Prompt" with "Deterministic Booking Agent"**
2. **Update Intent Classifier to route to new agent names**
3. **Create separate LLM nodes for each value-add branch**
4. **Test booking flow end-to-end**
5. **Test each LLM branch independently**
6. **Deploy and monitor performance**

This structure gives you the best of both worlds: fast, reliable booking and intelligent Q&A where it adds value! 