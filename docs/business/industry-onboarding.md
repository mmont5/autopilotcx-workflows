# Onboarding Guide: Adding New Industries to Your Platform

> **Audience:**
> - Product owners, project managers, and non-coders
> - Anyone coordinating backend (AI) and frontend (V0) teams

---

## Purpose
This guide explains, in plain English, how to add a new industry (e.g., Real Estate, Legal, Dental) to your white-label automation platform. Follow these steps to ensure the platform feels personalized and relevant for any professional or business type.

---

## 1. Decide on the New Industry
- Choose the industry you want to add (e.g., Real Estate).
- List the main specialties or roles (e.g., Realtor, Broker, Property Manager).

---

## 2. Update the Demo Request Form (Frontend)
- Add the new industry to the "Industry" dropdown.
- Add relevant specialties to the "Specialty" dropdown (these should change based on the selected industry).
- Adjust field labels if needed (e.g., "Practice Name" → "Business Name").
- Make sure the form collects all info needed for this industry (locations, services, etc.).

---

## 3. Update the Profile Structure (Backend)
- Ensure the profile JSON can store all relevant info for the new industry (e.g., services for real estate, types of law for legal).
- Use generic terms like "businessProfile" or "industryProfile" instead of "practiceProfile" if possible.

---

## 4. Adjust Enrichment & Research Logic
- Make sure the AI/LLM prompt is tailored for the new industry (e.g., "Extract main services, locations, and tone for a real estate agency").
- If possible, provide a few example websites or trusted sources for the new industry.

---

## 5. Create or Update Workflow Templates
- Add a new workflow template for the industry (e.g., "industry-agnostic-real-estate-journey").
- Use variables everywhere (e.g., {{ businessProfile.businessName }}, {{ businessProfile.services }}).
- Make sure the workflow steps match the typical customer journey for that industry (e.g., inquiry → property viewing → offer → closing for real estate).

---

## 6. Personalize Agent Logic & Messaging
- Update agent greetings, FAQs, and nudges to use the new industry's terminology (e.g., "Welcome to Smith Realty! How can we help you buy, sell, or rent a property today?").
- Make sure the agent can answer common questions for the new industry.

---

## 7. Test the Full Flow
- Fill out the demo form as a business in the new industry.
- Check that the profile, workflow, and chat all use the correct industry terms and logic.
- Make sure demo expiry and follow-up still work as expected.

---

## 8. Update Documentation & Team Training
- Add the new industry to your internal docs and onboarding materials.
- Let your team know how to support and test the new industry.

---

## 9. Tips for Success
- Use clear, generic terms in your platform wherever possible.
- Always test the experience as a user in the new industry.
- Get feedback from a real professional in that industry if you can.
- If you get stuck, ask your AI assistant for help with prompts, terminology, or workflow steps.

---

*This guide is designed to help you scale your platform to any industry, with no coding required from you. Just coordinate with your backend and frontend teams (or AI assistant and V0) and follow these steps!* 