# ReValue — current project context

## Current state

We are **Person B**. The working branch is **underdog**. B1 UI/SDK work is implemented. Person A's shared contracts and read/draft/quote endpoints have not arrived on the branch; their integration remains an external B1 dependency and the first B2 task. No teammate agreement or backend implementation is implied by the preview schemas.

The common foundation was pushed as **16d2b2e**. The B1 completion commit follows it. Only this file is published as a planning/status document. The original problem statement, concept, scope and detailed implementation plan remain in the parent workspace outside this checkout. README.md is the repository's existing title file.

## Ownership and boundaries

- **Person B:** Next.js shell, interaction forms, conversation UI, server-side Cline SDK, evidence display and integration with Person A's contracts.
- **Person A:** canonical domain schemas, SQLite/local persistence, demo-session API, uploads/private evidence, validated listing/Wanted drafts, deterministic price quotes/caps, publication, hard-constraint matching, notifications and consent-based connections.
- This prototype runs on localhost, including Next.js route handlers. It needs no separate hosted server. Phone and newspaper are the first categories.
- Preview profiles are UI identities, not authentication. Preview listings and Wanted requests are fictional fixtures, not persisted offers. Buttons explicitly explain when publication or contact is unavailable.

## Stack and local setup

- Node **24 LTS** (SDK requires at least Node 22; this project standardizes on 24), npm.
- Next.js **16.4.0**, App Router, React **19.3.0**, TypeScript, Tailwind CSS **4**.
- **Cline SDK 0.0.92** for AI; Zod **4** for request/completion validation. React state/context only; no extra state manager, hosted database, vector database or provider SDK.
- Lockfile committed. From this directory run **npm ci**, then **npm run dev**. Open **http://127.0.0.1:3000**.
- Checks: **npm test**, **npm run lint**, **npm run typecheck**, **npm run build**. For a production walkthrough run **npm run build**, then **npm start**.
- SDK is externalized on the server through next.config.ts. Keep Cline imports out of client components. Next agentRules generation is disabled so it does not create extra documentation files; use the installed Next docs under node_modules/next/dist/docs/ when changing framework code.

## B1 implemented

1. Responsive overview, navigation, demo-profile selector, persistent preview banner and three entry actions: Sell / Find / Post a need.
2. One reusable assistant layout with conversation, pending/error/manual states, editable fields, review dialog and preview result cards. Explicitly labelled form guidance is not presented as an AI response.
3. Seller draft: condition, age, purchase date, defects, repairs, accessories, pickup area and phone specifications or manually entered newspaper kg. Unknown measured battery health stays unknown. Optional photos and private receipt selection are browser previews only.
4. Buyer search and Wanted drafts: maximum total INR budget, maximum phone age, minimum storage/camera/capacity/measured battery health, or minimum newspaper kg from one seller. Pickup matching is exact city text in B1 fixtures. All entered structured fields are hard requirements. Free-text notes are preferences that are not automatically enforced in B1.
5. Listing and Wanted detail pages, evidence/declaration labels, explicit unknown facts, private receipt availability language, sample price labels and disabled contact/publication controls.
6. Manual preview search rejects an item if a required fact is unknown, does not relax filters, and does not combine quantities from multiple sellers. A no-match result remains a no-match result.
7. Fresh server-side Cline Agent per request, one read-only public preview tool and one structured completion tool; input/output schemas, real eligible-ID validation and human apply/dismiss of suggestions. The model cannot set seller maxPrice, change categories, add verification fields or return invented IDs. It cannot access files, shell, private bills, contacts or publication tools.
8. Honest manual fallback for absent configuration, provider failure, invalid completion or timeout. Requests are bounded, cancellation is supported, and failures never replace existing draft facts. Draft facts are scoped to profile/mode in browser memory and survive internal navigation; refresh resets them. Messages and attachments stay within their assistant-page session.

## Cline setup and smoke test

Copy .env.example to **.env.local** and set the supported provider/model tuple later:

| Variable            | Purpose                                            |
| ------------------- | -------------------------------------------------- |
| REVALUE_AI_PROVIDER | A provider ID supported by the installed Cline SDK |
| REVALUE_AI_MODEL    | A compatible model ID with tool calling            |
| REVALUE_AI_KEY      | That provider's key, server-only                   |
| REVALUE_AI_BASE_URL | Optional endpoint when that provider requires one  |

No vendor is selected by default. An arbitrary key does not identify its provider or model. Providers needing other credential mechanisms are outside this simple key-based prototype. Do not use NEXT_PUBLIC variables for secrets or put keys in this file. Restart the dev process after changing environment configuration.

POST /api/assistant accepts mode, message, draft and up to eight recent conversation messages. See **lib/assistant-contract.ts** for the exact B-owned provisional envelope. It returns either mode=ai with a validated completion, or HTTP 503 with mode=manual. Invalid requests return 400; cross-origin/non-localhost requests 403; wrong media type 415; bodies above 40,000 bytes 413. The server aborts the agent after 20 seconds; the client has a 25-second fallback deadline.

Tools are **read_public_preview** and **submit_assistant_result**. The second tool uses the installed SDK's lifecycle.completesRun interface. The installed Agent accepts provider/model configuration and run/abort; no imagined SDK APIs are used. SDK package exports select a different browser bundle under the react-server Node condition, so run the offline tests with the ordinary Node conditions, as the test script does. The actual Next route imports the SDK through the server external package boundary.

Installed SDK types include image message parts with type=image, image payload and optional mediaType. **Vision is not implemented or tested in B1.** No model/capability has been selected; photos and receipts are never sent to AI. Add validated public item-image input only after a supported vision model is confirmed and Person A's upload contract is available. Keep private bills out of vision inputs.

User will add the API key at the end. Leave .env.local/provider configuration unset for now; manual mode is the current setup. No live credentials have been supplied. Offline smoke testing exercises the actual Cline Agent/tool loop with a deterministic test model. It is not evidence of live-provider quality or image support. AI prose is advisory; numeric quotes/caps must still come from Person A's deterministic service.

## Source map for the next implementer

| Location                                 | Responsibility                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------- |
| app/layout.tsx, components/app-shell.tsx | Shared shell and preview identity controls                                                   |
| components/workspace.tsx                 | Per-profile/per-mode in-memory draft state                                                   |
| components/assistant.tsx                 | Sell/Find/Wanted conversation, editable form, suggestion review, attachments, draft review   |
| app/marketplace and app/wanted           | Preview boards and detail pages; missing IDs return 404                                      |
| lib/assistant-contract.ts                | Provisional B-owned assistant input/output schemas and draft validation                      |
| lib/preview-data.ts                      | Explicit fictional fixtures and deterministic preview filtering                              |
| lib/assistant-request.ts                 | Localhost/origin/content-type/body/schema request boundary                                   |
| lib/ai-configuration.ts                  | Pure provider/model/key resolution with no vendor default                                    |
| lib/cline-assistant.ts                   | Server-only SDK run, timeout/cancellation and completion handling                            |
| lib/assistant-tools.ts                   | Read-only preview tool and validated completion tool                                         |
| tests/assistant.test.ts                  | Filters, invalid inputs/outputs, request boundary, configuration and actual offline SDK loop |

## Integration handoff to Person A

No canonical domain schema is present. **Do not treat lib/assistant-contract.ts or lib/preview-data.ts as the backend contract.** Once A commits shared schemas, import those shapes and explicitly map the small assistant drafts where necessary; do not create a competing canonical type system.

Needed next: demo-session identities and ownership; public listing/Wanted read/search/detail responses; validated draft create/update; authoritative quote response with monetary units, cap and provenance; confirm/publish flows; upload/evidence privacy metadata; notifications, seller responses and connection consent. Names, payloads, status codes and version/revision handling must follow A's actual implementation, rather than invented routes.

Until those arrive, the UI deliberately does not send draft writes, claim publication, quote a price cap, create a match, notify a user, reserve inventory or reveal contact data. A seller can review a draft; publish remains visibly disabled. The fixture read tool must be replaced by A's safe public reads in B2, with eligible-ID checks retained.

## Product rules to preserve

- Collect declarations transparently. Photos can support visible condition; they cannot prove ownership, function, hidden damage or material weight. Receipt availability is not a verified badge. Original bills remain private.
- Newspaper/recyclables use entered kg and a labelled rate/quote source. Phones use declared attributes and deterministic price rules. AI explains the server quote; it never invents a market rate or numerical cap. Sellers may ask below a valid cap, never above it. Quotes must be revalidated on publish.
- Camera MP is a specification, not guaranteed photo quality. Battery capacity is not runtime; battery health must be measured or unknown.
- Buyer constraints are distinct from preferences. Unknown hard facts fail matching. Notify both sides for eligible matches in either publication order; show why the match qualifies. Notifications suggest a connection. Each person consents; no automatic private contact sharing, deal or reservation.
- No payments, shipping, cloud deployment, full authentication, automatic evidence verification, partial/multiple-seller fulfilment, live recycler network or broad category rollout in this four-hour prototype.

## Verification and remaining checks

- Seven focused tests cover hard filters/unknown facts/full quantity, request and completion rejection, review requirements, real HTTP input boundaries, configurable AI setup, the actual offline Cline read/completion loop and provider failure.
- **Passed:** npm test (7/7), npm run lint (no warnings), npm run typecheck and npm run build. Client production bundles contain no Cline SDK/server module or REVALUE_AI_KEY references.
- Direct HTTP smoke checks cover the overview, all three assistant modes, both boards and both detail routes; unknown listing returns 404. The running Next API returns explicit manual-mode HTTP 503 without a key, plus 403/400/413/415 for boundary failures.
- **Visual/click-through verification is unavailable:** the computer-use browser inventory has no enabled browsers. Responsive styles and semantic labels are implemented, but desktop/mobile appearance, keyboard focus, file-picker interaction, profile switching and live suggestion application still need a browser walkthrough.
- **Live AI smoke test and A integration are pending external configuration/contracts.** No publication, pricing or connection end-to-end success is claimed.

## B2 and B3 next

- **B2:** align A's schemas; connect reads, session ownership, draft/quote/upload APIs; build authoritative quote explanations and confirmed publication; replace preview data with real records; preserve honest loading/error/no-match states and private evidence boundaries.
- **B3:** integrate notifications and both-sided consent, exercise phone and newspaper flows in both publication orders, verify cap/unknown-data cases, then polish and record the demo with A.

## Demo/deck starting outline

1. Problem: waste and unused items, unclear prices and hidden demand.
2. B1 walkthrough: prepare a transparent phone listing; find by explicit requirements; draft a 10 kg newspaper request; inspect evidence labels and manual fallback.
3. Full prototype story once integrated: authoritative quote, confirmed publish, proactive notification and consent-based connection in both listing-first and request-first orders.
4. Cline evidence: server-only custom read tool, validated completion, apply/dismiss suggestions, offline smoke tests and a clearly labelled live demo only when configured.
