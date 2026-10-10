# ReValue — current project context

## Team and branch
- Working branch: underdog. This checkout is Person B (UI and Cline SDK).
- Person A owns persistence, public inventory APIs, draft/quote/publication validation, deterministic pricing, matching and notifications.
- Localhost prototype; no cloud deployment. Phone and newspaper are the first two categories.
- B1 is in progress. No Person A contracts or endpoints are present at the foundation commit; assistant shapes are provisional, never an agreed backend contract.

## Foundation
Next.js 16.4.0, React 19.3.0, TypeScript, Tailwind CSS 4, Cline SDK 0.0.92, Zod 4. Node 24 LTS required. Use npm install, then npm run dev (127.0.0.1:3000). Package lock committed for both developers.

## AI configuration
Copy .env.example to .env.local. Choose a Cline-supported provider and model later; set REVALUE_AI_PROVIDER, REVALUE_AI_MODEL and REVALUE_AI_KEY, with REVALUE_AI_BASE_URL only when required. Keys stay server-only. A random key cannot identify its provider or model. No provider or live key has been supplied; the assistant must expose honest manual mode.

## Product rules
Seller declares condition/age/repairs/accessories and may supply photos and a private receipt. Evidence never means verified ownership. Newspaper needs a seller-entered weight; AI must not estimate weight from an image. AI suggests editable facts/questions and explains backend quotes; it never invents a market price or publishes. Sellers may ask below the server cap, never above it. Buyers search public inventory with hard constraints; unknown hard facts fail. Wanted posts capture demand and trigger consent-based matching in both publication orders. No automatic contact sharing, deal, reservation, payments, shipping or multi-seller fulfilment.

## Next step
Complete B1 shell, editable Sell/Find/Post a need, preview detail views, read-only Cline tools, validated completion and manual fallback. B2 connects Person A's actual contracts/read/draft/quote endpoints and publication controls. Detailed local planning documents are retained outside the checkout; context.md is the only published planning/status document.
