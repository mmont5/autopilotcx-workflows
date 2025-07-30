# Call LLM for BookingAgent Node

## **Current Configuration**
Your Call LLM for BookingAgent node should already be configured correctly.

## **Settings to Verify**

**HTTP Request Settings:**
- **Method:** POST
- **URL:** `http://llm-server-llm-server-1:8200/v1/completions`
- **Headers:** `Content-Type: application/json`
- **Body:** JSON

**Body JSON:**
```json
{
  "prompt": "{{ $json.prompt }}",
  "max_tokens": 512,
  "temperature": 0.7,
  "demo_id": "{{ $json.demoId }}",
  "industry": "healthcare",
  "specialty": "pain_management",
  "system_prompt": "You are a caring healthcare assistant."
}
```

## **Expected Behavior**

1. **Receives prompt** from Build Booking Prompt node
2. **Calls LLM API** with the prompt
3. **Returns response** to Format Booking Response node

## **Troubleshooting**

If the LLM call fails:
1. Check if the LLM server is running
2. Verify the URL is correct
3. Check the prompt format in the Build Booking Prompt node

## **Integration**

This node works with the simplified Build Booking Prompt node to ensure all responses go through the LLM. 