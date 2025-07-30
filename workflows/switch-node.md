# Switch Node Configuration

## **Problem**
Complex routing logic causing duplicate responses.

## **Solution**
**Remove Switch Node Entirely** - simplify the flow.

## **Option A: Remove Switch Node (Recommended)**

1. **Delete the Switch node** from your workflow
2. **Connect nodes directly:**
   - Connect "Build Booking Prompt" directly to "Call LLM for BookingAgent"
   - Connect "Call LLM for BookingAgent" to "Format Booking Response"

## **Option B: Keep Switch Node (If you prefer)**

If you want to keep the Switch node, configure it like this:

**Switch Node Settings:**
- **Data Type:** Boolean
- **Value 1:** `{{ $json.skipLLM === true }}`
- **Output 1:** Connect to **Format Booking Response** (this path will never be used)
- **Output 2:** Connect to **Call LLM for BookingAgent** (this path will always be used)

## **Expected Flow**

```
User Message → Build Booking Prompt → Call LLM → Format Response → User
```

**No more complex routing logic!**

## **Benefits**

✅ **No Duplicate Responses:** Simple, predictable flow
✅ **LLM is Primary:** All responses go through LLM
✅ **Easy to Debug:** No complex routing logic
✅ **Reliable:** Always the same path

## **Recommendation**

**Use Option A** - remove the Switch node entirely. This eliminates all routing complexity and ensures every message goes through the LLM. 