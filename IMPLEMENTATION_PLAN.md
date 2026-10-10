# ReValue - four-hour localhost implementation plan

**Status:** Implementation-ready plan; application not built or tested yet.  
**Team:** Two developers working in parallel, three phases each.  
**Time limit:** Four hours of wall-clock time, including integration, checks, and demo preparation.  
**Required choices:** Next.js and Cline SDK. AI provider/model/key will be chosen later.  
**Sources:** [Current product scope](./revalue_marketplace_product_scope.md) and [hackathon requirements](./PROBLEM_STATEMENT.md).

## 1. Goal, authority, and completion boundary

Build a mobile-friendly marketplace demonstrated at localhost. A person can describe an item to a chatbot, review a transparent priced listing, and publish it. A buyer can describe requirements, find real available listings, or publish a Wanted request. New compatible supply or demand automatically creates matching explanations and notifications for both people. Either side can initiate an offer; the other confirms before reservation and contact sharing.

This plan takes precedence over the broader scope for prototype infrastructure, identity, categories, notification delivery, and schedule. The product scope remains the reference for intended behavior. The older decision-companion concept is historical background. Four hours replaces the earlier eight-hour engineering schedule; the hackathon's repository, presentation, and video requirements still apply.

Localhost still runs a local Next.js process: its route handlers keep keys private and execute data operations. Bind startup to the loopback interface (127.0.0.1), keep demo-profile switching local-only, and reject unexpected origins on write requests. There is no separately deployed backend, cloud database, hosting account, or external notification service. AI requests require internet when using a hosted model. This is not a static export or an offline AI promise.

Completion means reviewed listings and Wanted requests, conversational search, automatic matching in both publication orders, two users' persisted alerts, and a mutually agreed reservation. Payment, physical pickup, final weighing, inspected price revision, and verified completed sales are outside the prototype.

## 2. Concrete technology stack

| Layer | Choice | Why and implementation boundary |
| --- | --- | --- |
| App | Next.js App Router, React, TypeScript | One repository and one local app for pages and API routes. Use the stable release installed at kickoff; commit its exact lockfile. |
| Runtime | Node.js 24 LTS on both machines, npm | Use the same Node major and npm lockfile. Check the installed Cline SDK engine requirement before continuing. |
| Styling | Tailwind CSS from the Next.js scaffold | Small reusable cards, forms, tabs, badges, and chat bubbles. Native accessible controls; no extra component framework. |
| AI | @cline/sdk, lightweight Agent and custom tools | Sole AI integration. One configured provider/model, selected later; no separate provider SDK or agent framework. |
| Validation | Zod | Shared API inputs, category facts, requirement filters, and SDK tool results; validate at server boundaries. |
| Database | Local file-backed SQLite through Node's built-in node:sqlite DatabaseSync API for the chosen Node 24 runtime | Data survives reloads/restarts. No separate database process, native npm database addon, or ORM. Verify this API on the installed Node release in Phase 1. |
| Files | Local .data/uploads directory, Node filesystem, attachment-serving route | Store image files outside public. Access is determined from database ownership and visibility, not a supplied path. |
| Identity | Seeded demo profiles selected through a localhost-only demo session | Signed HttpOnly same-site cookie, allowlisted profiles, server-side ownership checks. Simulated identity, not production authentication. |
| UI state | React state and native fetch | Editable chat drafts and cards; server records are authoritative. No Redux, Zustand, React Query, or separate state service. |
| Notifications | SQLite records and five-second polling while the notification screen is visible | Both users receive stored alerts; refresh on focus and after actions. Offline browser users see alerts when they return. |
| Checks | Node's test runner and assertions for pure rules/data integration; TypeScript, ESLint, Next.js build; manual two-session walkthrough | Use Node 24's TypeScript support for erasable TypeScript test modules with relative imports. No new browser-test framework setup within four hours. |
| Source control | One Git repository, two branches/checkouts | Merge at the timed checkpoints. Do not share a live SQLite file between developers or commit uploads, keys, or runtime database files. |

[Next.js installation documentation](https://nextjs.org/docs/app/getting-started/installation) supports the local App Router setup. [Next.js route handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route) provide the integrated API surface. The Node 24 [SQLite documentation](https://nodejs.org/download/release/v24.10.0/docs/api/sqlite.html) documents the local synchronous database API.

### Provider configuration, without choosing a vendor

Use one server-only configuration location holding provider ID, model ID, API key, and optional base URL. Application environment names may be REVALUE_AI_PROVIDER, REVALUE_AI_MODEL, REVALUE_AI_KEY, and REVALUE_AI_BASE_URL; map them to the installed SDK's documented configuration. Keep the key in .env.local and never prefix it with NEXT_PUBLIC. The sample environment file contains placeholders only.

A supported provider/model combination can be changed through configuration without changing marketplace rules or UI. A bare arbitrary key cannot identify its provider, endpoint, or model. Not every model supports tools or images. No vendor, model, or separate vision integration is selected in this plan. [Cline Agent configuration](https://docs.cline.bot/sdk/reference/agent), [Cline provider configuration](https://docs.cline.bot/sdk/model-providers).

The Node 24 SQLite API is documented as actively developing; pin the tested runtime and do not switch Node majors during the build. This is a prototype dependency choice, not a production stability claim.

At kickoff, test a text/tool call and, if a vision-capable model is configured, an image request using the installed SDK's actual message types. Until credentials are supplied, use explicitly labelled manual/demo mode. The prototype may still demonstrate listings and matching, but must not claim that live Cline inference worked. Credentials are the only external dependency needed to demonstrate the live chatbot.

## 3. Four-hour product slice

### Must work

- Three home actions: Sell an item, Find an item, Post what I need.
- Seller chat plus an editable facts form, photo upload, optional private receipt, quote explanation, and publication review.
- Buyer chat plus editable hard requirements/preferences and inventory result cards.
- Public Wanted board and review-before-publish buying requests.
- Deterministic price ceiling, source labels, fees, units, and no-price state.
- Automatic matching on publication by either side, with reasons and stored alerts for both users.
- Seller response to a Wanted request and buyer interest in a listing, using one shared offer flow.
- Accept/decline, one-counterparty reservation, stale-match protection, and voluntary contact reveal after agreement.
- No false matches for unknown required facts, no duplicate alerts, and no fabricated inventory.

### Fixed prototype defaults

| Decision | Prototype default |
| --- | --- |
| Categories | Phone and newspaper. These demonstrate per-item and weight-based behavior. Other categories show unsupported-for-demo rather than invented prices. |
| Locality | One labelled Demo Locality code. All matching uses this exact code, not geolocation or distance APIs. |
| Currency/weight | INR as integer paise; paper weight as integer grams, entered in kg with up to three decimal places. Phone quantity is exactly one. |
| Accounts | Seed seller, buyer, second buyer, and dealer/operator profiles with fictional contacts. Each member can buy and sell. |
| Pricing evidence | Clearly fictional, dated dealer rates for clean/dry versus mixed newspaper and two defined phone model/storage/condition tiers. |
| Phone specs | Curated fictional model fixture or seller declaration; retain evidence label. Camera MP, capacity in mAh, battery health percent, and runtime hours are separate. |
| Expiry | New records/rates default to 24 hours from creation/seed time, stored as UTC timestamps. No fixed historical expiry in fixtures. |
| Notifications | In-app only; match alerts explicitly enabled on posting and editable per demo profile. |
| Image limits | Up to three JPEG/PNG item photos and one optional JPEG/PNG receipt; each at most 5 MB. Reject other formats with clear text. |
| Language | English. |

Accessories, decorations, tyres, and nonworking items remain part of the intended product. They need category-specific questions and pricing/acceptance rules before being enabled. Do not add guessed support during this four-hour build.

## 4. User journeys to implement

### Seller

Start Sell → add photo and description → review AI category/visible observations → answer category questions → edit facts → receive sourced provisional quote and explanation → choose ask at or below the cap → preview public listing → confirm publication → see matching buyer needs and alerts → send offer or review incoming interest.

Phone fields: model tier, storage, purchase date or declared age, working status, condition, visible damage, repair history, accessories, optional receipt, camera MP/capacity when known, optional battery health or runtime with evidence. Do not equate capacity with current battery health or runtime. Missing age remains unknown; a bill is optional and does not prove present functionality.

Paper fields: newspaper category, positive weight, measured/estimated marker, dry/mixed condition, locality. Photos do not determine weight. Allow only the condition tiers supported by seeded rates.

Chat asks no more than two relevant questions in one turn. All fields can be corrected directly. The seller confirms publication through a button, not an agent tool. Editing price-relevant facts requires a refreshed quote and preview.

### Buyer search and Wanted posting

Start Find or Post a need → describe requirements → chatbot proposes filters → buyer edits/confirms mandatory constraints and preferences → application searches available listings → show actual cards with match reasons and missing facts → buyer can request an item or publish the confirmed requirements to Wanted.

Phone requirements can include total budget, maximum age, minimum storage/camera MP, minimum battery capacity, required battery-health/runtime evidence, working condition, and accessories. Do not translate vague battery-life requirements into a made-up threshold: ask whether the buyer means capacity, reported health, or demonstrated runtime.

Paper requirements include exact or ranged kg, dry/mixed acceptance, budget per kg or total, locality, and required-by date. Show the budget unit explicitly; never compare total listing ask with a per-kg budget directly.

Seller browses Wanted → selects their own available listing → sees compatibility → sends a short in-app offer. No unlimited direct messaging system is required.

### Matching and agreement

Buyer request before listing and listing before request must both work. Publication saves data and deterministic match/notification records before returning success. AI wording is optional enrichment and must not hold a database transaction open.

Match card → initiate offer → counterpart accepts → atomic reservation → both see agreed ask and provisional inspection terms → each can explicitly choose to share fictional demo contact. Notification is an introduction, not consent to a transaction. Accepted reservations do not display Sold or Paid.

## 5. Repository ownership and parallel-work rules

Person A owns data and marketplace rules. Person B owns experience and AI. The two people are human development tracks; this plan does not require extra agent workers.

| Area | Owner | Files/areas expected |
| --- | --- | --- |
| Scaffold, package versions, lockfile, global layout/styles | B | package.json, package-lock.json, Next.js config, app layout, styles |
| Shared inputs, output contracts, category definitions | A; agree together before implementation | lib/contracts.ts and lib/categories.ts |
| Database, seed data, demo identity, file access | A | lib/server/db.ts, demo-session.ts, attachments.ts; scripts/seed.ts; .data |
| Quote, search/match predicates, notification persistence, offers | A | lib/server/pricing.ts, matching.ts, marketplace.ts; corresponding API routes |
| Chat runtime, prompts, tools, structured completion | B | lib/server/assistant.ts and app/api/assistant/route.ts |
| Pages and reusable UI | B | app pages and components for assistant, item cards, request cards, evidence, notifications, offer inbox |
| Rule/database tests | A | tests/pricing.test.ts, matching.test.ts, marketplace.test.ts |
| Assistant fallback checks and manual UX walkthrough | B | tests/assistant.test.ts when needed; demo checklist |
| README, PPT outline, demo script | B drafts; A supplies technical limits | README.md and concise demo notes |

A creates shared contracts once; B consumes them and does not create alternate types. B owns package/lockfile edits for both people. A requests any needed package change rather than editing the lockfile concurrently. Keep all server modules out of client imports. Use the Node runtime for database, file, and SDK routes.

If using separate machines, both run their own seeded local database. At integration, use one checkout and one Next.js process as the demo instance, with two isolated browser sessions. Two checkouts with different databases cannot automatically share each other's alerts.

## 6. Person A workflow - three phases

### A1. Local foundation and rule contract - 0:00 to 1:00

**Goal:** B can build against real, agreed data shapes while A proves pricing and storage.

1. First 15 minutes together: agree categories, fields, response envelope, demo profiles, locality, pricing fixtures, and ownership. Publish the shared schemas/types and endpoint table. B creates the scaffold in parallel.
2. Initialize file-backed SQLite, foreign keys, bounded busy timeout, and a reuse-safe development connection. Create the minimal tables below and local data directory; exclude them from Git. Use bound SQL parameters.
3. Implement allowlisted signed demo-profile selection and server-side current-user checks. Define ownership rules before public/private serializers.
4. Seed fictional users, rates, and fixtures. Seeding inserts missing fixtures; normal restart must not overwrite user-created records. A destructive reset is a separate explicit demo command with a warning.
5. Implement exact money/unit conversion, category eligibility, quote calculation and immutable snapshots. Test fee subtraction, whole-rupee cap, unsupported tier, and invalid weight.
6. Expose profile selection, read listings/Wanted, create/save drafts, and quote endpoints from the contract.

**Deliverable at 1:00:** A real draft survives restart; seeded cards are readable; quote cap and unit checks pass. B receives real endpoint URLs and example field values, not only a promise.

**Dependency on B:** Scaffold and package install are available within the first 15 minutes. No frontend or AI completion is needed for rule tests.

### A2. Marketplace, automatic matches, and offers - 1:00 to 3:00

**Goal:** Complete the useful transaction path before cosmetic work.

1. Finish ownership-aware item photo/private receipt upload and reads; validate file signatures, type, size, and generated filenames. Never trust a client path.
2. Publish listing and publish Wanted services: validate inputs, cap/expiry, versions and permissions, then find opposite-side candidates using the same matching predicate.
3. Store matching reasons and two users' notifications transactionally. Add uniqueness constraints and retry-safe publication behavior. Wire edit/pause/withdraw and expiry invalidation.
4. Reuse the matcher for buyer search so search and proactive alerts cannot disagree on hard constraints.
5. Implement notification reads/mark-read and the shared offer/accept/decline service. Use an atomic conditional update/transaction to reserve both the listing and, when present, its linked Wanted request for one transaction.
6. Implement contact/proof access only for the owner or expressly permitted counterparty; recheck current record states on every action. B connects pages as each endpoint becomes ready.
7. Add the focused integration checks, including both publication orders, retry deduplication, stale matches, forbidden record edits, and competing accepts.

**Checkpoint at 2:00:** Publication in both directions creates correct stored matches and alerts. If this is absent, stop any optional feature work.

**Deliverable at 3:00:** Real UI/API flow reaches one accepted reservation with private data protected; matching and transaction checks pass.

### A3. Integration and proof - 3:00 to 4:00

**Goal:** Make the demo repeatable and protect the central claims.

1. Merge completed backend work into the demo checkout by 3:10. Run shared-schema type checks and the focused tests.
2. Resolve cross-track contract errors first; verify no in-memory-only records or hidden fake-success paths remain.
3. With B, execute the two-session demo and negative cases. Check alert persistence after refresh/restart, expired records, and one-winner reservation.
4. Supply setup/reset instructions, data limits, and architecture facts for the README/deck. Help B prepare the clean demo state without deleting work unintentionally.
5. Run the production build locally once for compilation assurance. If it fails, fix the actual issue; keep localhost dev mode as the agreed presentation environment.

**Deliverable at 4:00:** Tested local data/rules, known limitations, reproducible demo fixtures, and a working handoff to B's presentation flow.

## 7. Person B workflow - three phases

### B1. Scaffold, interaction shell, and SDK spike - 0:00 to 1:00

**Goal:** Remove the AI/runtime risk early and let A work in parallel.

1. Scaffold the Next.js TypeScript/Tailwind app in the existing project, preserving the Markdown files. Own package/config changes. Commit the common foundation and lockfile for A immediately.
2. Agree shared contracts with A in the first 15 minutes. Create one shell with navigation, demo-profile selector, demo-data banner, and the three entry actions.
3. Implement the reusable assistant layout: conversation, loading/error state, editable draft/filter panel, review/publish control, result cards. Use the agreed fixture shapes only until real endpoints arrive; label temporary fixtures.
4. Add the server-only Cline Agent configuration and one small custom read tool plus structured completion tool. Test a real run when a supported provider/model/key is supplied. Confirm image message support against installed SDK types rather than inventing an API.
5. Implement manual mode for absent key/provider failure, preserving entered facts. It must visibly state that AI is unavailable; fixture replies must never masquerade as a live response.
6. Create listing/Wanted detail views and evidence badges. Start README/deck outline and capture Cline usage during the build.

**Deliverable at 1:00:** Navigable shell and editable drafts; real SDK smoke run if configured, otherwise honest manual-mode path; exact schemas wired to A's first read endpoints.

**Dependency on A:** Shared types in the first 15 minutes, read/draft/quote endpoints by 1:00. B may use matching fixtures while waiting, but cannot redefine the contract.

### B2. Live chat workflows and matching experience - 1:00 to 3:00

**Goal:** Demonstrate every requested interaction through real local data.

1. Complete seller and buyer intent prompts using one Agent implementation with mode-specific instructions. Preserve unknown facts; ask the next relevant question; never assume the user approved publication.
2. Wire photo/category suggestions when the configured model supports images; otherwise allow photo storage and direct category/fact entry. Implement optional private receipt selection and clear visibility preview.
3. Connect quote cards, price-cap input feedback, source equations, seller review, and actual publication. Show API field errors inline without losing chat state.
4. Connect inventory search, editable hard filters/preferences, no-match results, and Post this need. Render only record IDs/cards returned by the server.
5. Build Wanted board, matched-needs/listings cards, notification badge/inbox, Send offer/Request item, and counterpart accept/decline. Poll notifications only while relevant UI is visible; refresh on focus/actions.
6. Add price/match explanations using the stored facts and reason codes. Render exact numbers and evidence labels from application data. If generation fails, show the deterministic explanation.
7. Use two isolated browser profiles to verify that both users see the appropriate cards/alerts and only the permitted counterpart sees shared contact.

**Checkpoint at 2:00:** Seller can publish; buyer can publish a need or search; UI can display real match notifications. Do not spend this checkpoint on animation or extra pages.

**Deliverable at 3:00:** Seller chat, buyer chat, Wanted posting, proactive alerts, and reviewed introduction run against A's real endpoints with no hardcoded success.

### B3. Integration, usability, and demo artifacts - 3:00 to 4:00

**Goal:** Deliver a understandable, repeatable localhost demonstration.

1. By 3:10, integrate both tracks and eliminate temporary UI fixtures that obscure actual data.
2. Fix the mobile layout, labels, keyboard controls, loading/error/no-match states, and stale notification messages. Keep final styling small and consistent.
3. Run the full two-session walkthrough with A; verify one required mismatch and one missing-evidence case are excluded. Verify manual-mode fallback independently of the live run.
4. Finish README setup/provider configuration, limitations, demo credentials, reset procedure, and Cline contribution. Complete a short PPT and prepare the mandatory video walkthrough with Cline footage.
5. Rehearse the exact demo state and record the working sequence; do not rely on live improvisation or unseeded data.

**Deliverable at 4:00:** Localhost demo, clear documented startup, presentation/video materials, honest provider/demo labels, and no critical integration failure.

## 8. Joint timeline and integration gates

| Wall clock | Person A | Person B | Joint evidence |
| --- | --- | --- | --- |
| 0:00-0:15 | Shared contract/category/rate decisions | Scaffold and package lock | Both consume one agreed schema; no overlapping ownership |
| 0:15-1:00 | SQLite, session, seed, drafts, quote | UI shell and SDK/manual spike | Persisted draft and validated quote; SDK status known |
| 1:00-2:00 | Publish, matcher, notifications | Seller/buyer flows and real endpoint wiring | Both publication orders create a match and alerts |
| 2:00-3:00 | Offers, reservation, privacy, rule tests | Wanted/inbox, explanations, offer UI | Two people can reach one reviewed reservation |
| 3:00-3:30 | Merge/checks and backend corrections | Merge/checks and UX corrections | Passing critical checks and complete demo rehearsal |
| 3:30-4:00 | Setup/reset documentation and clean demo data | PPT, README completion, recording | Repeatable localhost presentation with required artifacts |

These are three phases per person, not six sequential phases. Both tracks run at the same time. The final hour is reserved; it is not extra feature capacity.

## 9. Shared contracts - agree before either track expands

### Canonical facts and units

Use shared schemas and explicit null for unknown data. Keep public item facts separate from private contact/evidence. The assistant supplies proposed patches to an editable draft; application validation and the human confirm the final values.

| Shared object | Fields and rules |
| --- | --- |
| Phone facts | Category phone; one item; modelTier; storageGB; working declaration; condition enum; purchaseDate or declaredAgeMonths with ageBasis; repairs/defects; accessories; cameraMP; batteryCapacityMAh; batteryHealthPercent; testedRuntimeHours and test description; evidence labels. Unknown optional fields are null. |
| Paper facts | Category newspaper; weightGrams; weightBasis measured/estimated; condition cleanDry/mixed; localityCode. All units validated. |
| Buyer requirements | Category/locality, budgetMinPaise/budgetMaxPaise, budgetBasis total/perKg, quantityMin/Max and unit, expiry, hardConstraints, preferences, evidence requirements, alertsEnabled. For phone quantity is one. |
| Quote result | Quote ID, input/version fingerprint, eligible source rates, quantity/unit, rate/fee, gross/net paise, whole-rupee ceiling, calculation time, validity, reason codes, demo marker, inspection caveat. |
| Match result | Listing/request IDs and versions, matched hard facts and evidence labels, preference reasons, current eligibility, rejected/unknown requirement reasons when appropriate. |
| Assistant turn | Intent sell/find/wanted, conversation ID, bounded recent messages, current confirmed draft and allowed attachment IDs. Response includes assistant text, validated draft/filter patch, missing fields, actual result IDs/cards, and live/manual status. |

Buying requests and purchase requests must use different names in data and UI: a Wanted request is demand; an offer is interest in a specific listing. Model-generated text must never become the source of truth for record availability, a price, or a verified fact.

Success responses contain the canonical saved data and current statuses. Error responses contain a stable code, understandable message, and field errors when relevant. Invalid inputs return validation errors; unavailable/reserved/stale records return conflict errors; prohibited ownership returns forbidden. The UI keeps its draft after failure. Return AI unavailability separately from failed publication; do not show Saved after a failed database mutation.

### Minimal API surface

Person A owns every endpoint below except assistant. Use Next.js Route Handlers, server-side schema validation, and Node runtime. Use one service per business operation shared by route and SDK read tool; do not make internal agents call their own HTTP API.

| Endpoint / operation | Inputs | Output / responsibility |
| --- | --- | --- |
| /api/demo/session - select/read profile | Allowlisted demo profile selection | Signed cookie and current fictional profile; no arbitrary actor IDs on other writes |
| /api/attachments - upload; /api/attachments/[id] - read | Image plus item-photo/receipt intent | Owned attachment ID; controlled bytes on read, never a filesystem path |
| /api/listings - list/create draft; /api/listings/[id] - read/edit | Shared item facts, owned attachments, locality | Sanitized listing; owner-only edits, increment relevant version |
| /api/quotes - calculate | Owned draft listing ID/current version | Stored quote snapshot or explicit unsupported/no-rate result |
| /api/listings/[id]/publish | Quote ID and approved ask | Published listing plus match/notification summary; revalidate on server |
| /api/wanted - list/create draft; /api/wanted/[id] - read/edit | Shared buying requirements | Sanitized Wanted record; owner-only edits/pause/withdraw |
| /api/wanted/[id]/publish | Confirmed current request | Active request plus match/notification summary |
| /api/search - search | Confirmed requirement filters | Available listing cards satisfying hard filters; reasons and explicit no-match |
| /api/matches - inbox; /api/matches/[id] - detail | Current session; optional owned listing/request context | Current user's match cards; fresh eligibility checked |
| /api/notifications - read; /api/notifications/[id] - mark read | Current session and owned notification | Unread count/list and updated read state |
| /api/offers - create/read inbox; /api/offers/[id] - accept/decline/cancel | Listing, optional Wanted ID, short message, stable operation ID; explicit action | Counterparty response and reservation status; idempotent and authorization-aware |
| /api/contact/[offerId] - share/read | Explicit share preference of current party | Only permitted contact for accepted counterpart; fictional demo values |
| /api/assistant - turn (B owns) | Assistant turn plus owned attachment IDs | Validated draft/result envelope using Cline SDK or labelled manual fallback |

Receipt reads stay owner-only until explicit evidence permission for the accepted counterpart. They never appear in public listing serialization. Item photos may be shared on published listings. Avoid arbitrary image URLs sent to the server or agent; use owned local attachments and bounded data.

Prototype rates and category coverage are seeded configuration, not a full dealer onboarding/rate-management console. If time remains, a minimal owned rate editor is optional; it must not delay the requested buyer-request/matching journey.

## 10. Local data model and persistence

| Table | Minimum purpose and constraints |
| --- | --- |
| users | Seeded identities, display names, fictional private contact, alert preference, demo marker |
| buyer_rates | Dealer/source, category/model/storage/condition tier, amount and unit, min/max quantity, fee, locality, active flag, validity, version; all fictional unless actual evidence is supplied |
| listings | Seller, validated facts JSON, public description, locality, askPaise, current quote reference, status, relevant version, timestamps |
| quotes | Immutable facts/rate snapshots, rational calculation inputs and rounded amounts, cap, validity and demo marker; listing/owner reference |
| wanted_requests | Buyer, validated constraints/preferences JSON, budget/unit, locality, expiry, status, relevant version |
| attachments | Generated ID, owner, file type/size, stored relative filename, purpose/visibility; reference from owned listing |
| matches | Listing/Wanted IDs, their relevant versions, reason codes, eligibility/status; one current pair record |
| notifications | User, match reference, relevant versions, message/reason codes, read state; unique event/recipient key |
| offers | Listing, optional Wanted reference, buyer/seller, initiator, ask/quote/input snapshots, message, pending/accepted/declined/cancelled status, stable operation ID |

Use category-specific validated JSON for flexible facts, while indexing category, locality, status, owner, and expiry in ordinary columns where searched. Candidate sets are small in the pilot; fetch relevant active records then run the same pure predicate in TypeScript. Do not implement vector search.

Keep schema initialization and seed scripts straightforward. Reuse a safe connection during development reloads, configure a short busy timeout, and close temporary test connections. Transactions stay short and contain no awaited model/file/network calls. Treat write failure as failure; rollback rather than returning partial success.

Store files under a resolved .data/uploads root with generated filenames. Validate the resolved path stays inside that directory; queries accept attachment IDs, not raw paths. Write/validate the file before referencing it in a committed listing; failed uploads cannot leave a published broken attachment reference. Public pages use permitted image responses rather than unrestricted /public receipt URLs.

Development data must persist across page refreshes and process restarts. Each person has their own local data until integration. Test databases use temporary directories and never reset the presentation database. Do not store marketplace state only in memory or browser localStorage.

## 11. Exact rules for price, matching, and reservation

### Pricing

Convert seller kg to integer grams once. Reject zero, negative, excessive, or inconsistent quantity, unsafe integer values, and unsupported category/tier. Filter rates by active flag, category, model/storage/condition, locality, quantity bounds, and time validity.

For weight-based quotes, compute the rational grams × paise-per-kg amount, round down to paise with the explicit denominator 1,000, then subtract fixed fees. For one phone, use its matched per-item rate less fee. Exclude nonpositive results. Select the highest eligible net, round the displayed ceiling down to whole rupees, and store the inputs/rate versions. Validate safe arithmetic bounds before multiplication.

Reject publication above the cap on the server even if the browser was bypassed. Below-cap sale is the seller's choice. Unknown phone model/condition cannot silently use a generic expensive-phone rate. No qualifying rate means a saved draft and no numeric price, not a guessed amount. Fictional rate labels remain visible in listing, quote, explanation, README, PPT, and video.

A stale quote requires a new quote and seller confirmation at publication and acceptance. Keep an earlier offer snapshot for history; it does not override current approval. Changing a buyer's budget never silently changes the seller's ask.

### Shared exact-match predicate

Check availability/active state, expiry, same locality, same category, different owners, quantity range/unit, and budget. Per-kg budgets are normalized against the full listing quantity; show the full net ask and equivalent per-kg basis without introducing another pickup deduction.

For phones, evaluate required age, storage, working/condition, accessories, camera MP, capacity, health/runtime, and evidence as separately defined constraints. Compute known purchase-date age against today's date; keep declared age labelled. If the requirement demands document support, a declaration alone fails it. Unknown mandatory facts fail exact matching. Preferences influence order only after all required checks pass. Do not equate megapixels to camera quality.

Match one whole listing to one whole buying request. An exact 10 kg need excludes 7 kg and 12 kg. A deliberate 10-12 kg range can include 12 kg. No partial lots, aggregation across sellers, automatic budget relaxation, or automatic purchases. Near-match explanations may be shown explicitly, but never produce exact-match alerts.

Use this same predicate for manual search, listing-to-Wanted matching, Wanted-to-listing matching, offer creation, and acceptance revalidation. Do not implement separate logic with subtly different eligibility.

### Match trigger and deduplication

On successful publication or relevant edit, find compatible opposite-side records. Write/update the pair's match record and eligible recipients' notification rows within the database transaction. Enforce unique listing/Wanted pair records and unique notification event/recipient keys. Retried publication must not increment a relevant version or re-alert users if the underlying match facts did not change.

Relevant versions change for price, facts, hard constraints, locality, availability, or expiry; cosmetic wording alone does not create a fresh alert. Store reason codes from the predicate, then render deterministic notification text. Cline can expand reasons on the match screen; automatic discovery and notification never depend on a model approving a money/availability rule.

Withdraw, pause, expiry, reservation, or relevant edits deactivate incompatible matches. Historical notifications remain with a stale/unavailable label on opening. Check expiry on reads/actions; no scheduler is required for this small local prototype. Both users' alerts are persisted whether or not either browser is open.

### Offers and one-winner reservation

Seller responding to Wanted initiates an offer at their approved listing ask; the buyer accepts or declines. Buyer interest in a listing initiates an offer; the seller accepts or declines. Initiating confirms that party's intent; acceptance supplies the counterpart's agreement. Never allow the initiator to accept their own offer.

An acceptance transaction rechecks owners, versions, cap/rate validity, demand constraints, and listing availability. Conditionally reserve only an available listing. When tied to a Wanted request, also reserve/pause that demand so a second listing cannot satisfy it again concurrently. Commit the accepted offer and deactivate competing matches atomically. On a race, the losing acceptance returns conflict, not success.

Duplicate operation IDs/repeated accept clicks return the existing result without duplicating offers/reservations. Declining one offer does not withdraw an otherwise available listing. Cancellation by an authorized participant releases the reservation and restores matching only after current quote/request validation. Use Published, Reserved, Declined, or Cancelled labels; not Sold or Paid.

## 12. Cline SDK implementation behavior

One server-side module creates the SDK Agent for each isolated turn/run using the configured provider/model. Do not share a mutable Agent conversation between users or across Sell and Find contexts. Keep the last bounded conversation turns plus the canonical confirmed draft; private context comes from the authenticated demo session, never from model-chosen actor IDs.

[Custom tool documentation](https://docs.cline.bot/sdk/guides/creating-custom-tools) supports typed input schemas and a completion tool. Use one structured completion tool to return validated UI output; it ends the run and changes no database records.

| Tool | Responsibility and restriction |
| --- | --- |
| get_category_questions | Returns fixed relevant fields and missing requirements for phone/newspaper |
| search_listings | Calls the shared matcher/search service with validated filters; returns real permitted records only |
| get_quote_breakdown | Reads an owned/permitted quote snapshot, fees, rate source, cap and caveats |
| get_match_details | Returns stored/fresh match facts and reason codes for a permitted pair |
| submit_assistant_result | Ends the run with assistant text, proposed draft/filter patch, missing fields and permitted result IDs; request-local output only |

Seller mode gathers honest category details and proposes listing text. Find mode translates requirements into explicit filters and explains returned candidates. Wanted mode prepares a buying-request draft. Price/match mode explains the exact provided basis. Human buttons, not tools, publish and accept.

Validate tool inputs with shared Zod schemas. Bind private reads to the session. Check returned record IDs against the actual search/tool results. Ignore invented fields, undeclared condition upgrades, and claims of inspection. Required questions can be chosen by the fixed category schema if AI fails. Render exact numerical price/match facts from server data; reserve AI wording for short bounded explanations grounded in approved reason codes.

Use a visible busy state, one in-flight turn per conversation, a finite run/tool budget supported by the installed SDK, and an application timeout of about 20 seconds. Abort a timed-out run through the documented API and preserve the draft. Avoid automatic retry loops; let the user retry. Missing/bad key, unsupported tool/model, or failed structured result goes to labelled manual mode and deterministic explanation.

Before adding image behavior, confirm the configured model supports images and the installed SDK exposes the needed message representation. Use only permitted bounded attachments. A photo suggestion does not certify working condition or establish weight. If vision is unavailable, keep upload useful for listing evidence and let the seller enter facts. This is a fallback, not a claim that visual AI ran.

## 13. Usability and private evidence

Use one desktop split view for conversation and draft/results, stacking naturally on phone-sized screens. Provide visible mode/title, progress, editable requirements, and a review preview. Never force a seller to repeat the entire conversation to correct one field.

Evidence badges distinguish seller-declared, document-supported, unknown, and demo fixture; no professional certification badge. Show age source, defects, repairs, accessories, optional receipt availability, and pricing basis on item cards/details. Do not replace missing fields with optimistic values.

Original receipts stay private; the four-hour prototype supports uploading them as private evidence, not automated redaction/OCR of personal details. Seller may explicitly grant an accepted counterpart access. Public proof can use a deliberately pre-redacted demo image only after seller preview/confirmation. Do not publish an unredacted original through a convenience URL.

Seeded contact values are fictional. Before acceptance there is an in-app offer/contact action, not a public phone number. Each person can opt in to sharing their contact after acceptance; agreement alone must not silently disclose it.

Every input has a label, understandable validation, and keyboard access. Loading, no-match, unsupported-category, expired-rate, reserved-item, and AI-unavailable states are part of the prototype. Keep entered data through transient failures. Prevent double submissions in the UI and enforce idempotency on the server too.

## 14. Focused checks and acceptance evidence

These are proposed checks to run during implementation; they have not been executed by writing this plan. A owns rule/database checks and B owns assistant/manual UI checks. Prefer a few meaningful tests with multiple cases over extensive framework setup.

| Check | Evidence required |
| --- | --- |
| Price correctness | Grams/kg and paise/rupee conversion, fees, rounding down, zero/invalid weight, unsupported/expired rate, and above-cap publication rejection |
| Matching | Both publication orders; budget basis; exact versus ranged quantity; wrong locality; required spec/accessory/age/evidence mismatch; unknown required fact; self-match excluded |
| Notifications | Two opted-in owners receive persisted alerts; a muted owner does not; retry creates no duplicate; stale record cannot be accepted |
| Reservation | Two competing accept requests produce one winner; same accept retried is harmless; one linked Wanted demand cannot reserve two listings |
| Privacy/ownership | Another profile cannot edit your record, read your private bill, accept their own offer, or obtain contact without consent |
| AI boundaries | Unsupported/malformed structured output rejected; fabricated result IDs ignored; provider failure preserves draft and shows manual mode |
| Persistence | Published data and unread alerts survive refresh and local process restart without reseeding them away |
| Build/usability | Type check, ESLint, local Next.js build; two browser sessions; narrow screen; labels; complete state/error feedback |

The two-session walkthrough uses one normal browser profile and one private profile; cookies are not shared. Creating a seller listing in one window and a buyer need in the other must show both alerts through the actual database. Capture one successful Cline tool run if credentials are available, and identify a fallback visibly if not.

## 15. Demo fixtures and presentation sequence

Keep all numbers visibly simulated. Seed two phone listings with different known specs, one phone with an unknown required fact, a 10 kg paper listing, and a mismatched paper quantity. Seed corresponding pricing tiers. Set dates/expiry relative to runtime so fixtures do not immediately expire next week.

For the main demonstration, create the buyer's 10 kg newspaper request first, then publish the seller's matching listing. Show sourced demo quote, ask cap, both notifications, match reasons, seller offer, counterpart acceptance, and optional fictional-contact reveal.

For the phone demonstration, start from an existing listing, use the buyer chatbot to set a budget/age/camera/battery/accessory need, and show matching results plus one excluded item. Publish a suitable new Wanted request to prove the reverse trigger. Show the seller's declared details and optional evidence without exposing a raw bill.

Use a fresh labelled demo dataset or explicit reset before recording. The README documents startup, local data paths, demo profiles, SDK configuration, unsupported categories, notification polling, and how to reset safely. The PPT/video explain the problem, full workflow, architecture, AI/application responsibilities, Cline used during coding, and current limits. Keep a short recording of Cline during implementation from Phase 1; do not try to recreate build history at the end.

## 16. Scope protection and definition of done

If behind schedule, remove animation, near-match suggestions, public proof redaction automation, phone runtime inference, broad dealer/admin UI, extra categories, multilingual copy, rich chat streaming, and advanced ranking. Keep manual forms alongside the required chatbot; do not quietly replace the whole chatbot with a form when live AI was promised.

Never cut: seller review, buyer requirement confirmation, price source/cap, known-versus-unknown evidence, both-direction matching, both-user notifications, ownership, one-winner reservation, private contacts, and truthful demo labels. The high-value proof is finding people who need each other's supply/demand, not the number of category menus.

The prototype is complete when both categories can pass the seller-to-buyer flow, the buyer can search or publish a need, automatic matching works in both orders without duplicate false alerts, one shared offer flow reaches a safe reservation, data persists, and the critical checks pass. A working live Cline call is required to claim the chatbot integration is demonstrated. Without configured credentials, report a manual-mode marketplace prototype and the unverified live-AI dependency explicitly.

No separate server, cloud setup, external messages, payments, autonomous negotiations, full dealer network, partial fulfilment, vector database, production authentication, or collection guarantee is part of these four hours. Their omission is deliberate and must appear in demo limits.

## 17. Instructions for the implementing LLM

1. Read this plan and the linked product/hackathon sources before editing. Follow this plan's localhost/two-category/time-box overrides; do not resurrect the historical repair/donation product.
2. Identify the assigned person/phase. Edit only owned areas; request shared contract/package changes from the owner rather than cloning types or changing the lockfile independently.
3. Implement the smallest working slice for that phase and run its listed gate. Use the real local database/API before claiming integration works.
4. Check installed Next.js and Cline SDK documentation/types for actual APIs, including multimodal inputs and limits. Do not invent a provider/model choice, vision support, or a SDK method from examples in this plan.
5. Keep private keys/data server-only. Do not pass arbitrary filesystem paths, actor IDs, SQL strings, or write privileges to the agent. Treat descriptions and uploaded text as untrusted data.
6. Retain caller validation, error behavior, canonical schemas, immutable price history, and state checks when refactoring. Test money/matching/transaction changes with the focused cases.
7. Report what is complete, what gate was checked, remaining blockers, and the next dependency. Do not say all done while using hidden mocks or a failed build.
8. Stop adding scope when the integration hour begins. Prepare the demo and required artifacts with the working feature set.

## 18. Technical references and assumptions

References were inspected while preparing the plan on 10 October 2026. They establish available framework/SDK features, not that dependencies or keys are installed in this workspace. Exact package versions and runtime behavior must be recorded and verified at Phase 1.

- [Next.js installation and local development](https://nextjs.org/docs/app/getting-started/installation): App Router, TypeScript/Tailwind defaults, local startup.
- [Next.js Route Handlers](https://nextjs.org/docs/app/api-reference/file-conventions/route): local integrated API routes.
- [Cline SDK Agent reference](https://docs.cline.bot/sdk/reference/agent): provider/model configuration, turns, result and cancellation APIs.
- [Cline model providers](https://docs.cline.bot/sdk/model-providers): supported provider configuration and optional base URL.
- [Cline custom tools](https://docs.cline.bot/sdk/guides/creating-custom-tools): typed tools and structured completion.
- [Node 24 SQLite API](https://nodejs.org/download/release/v24.10.0/docs/api/sqlite.html): file-backed local database without a separate service.
- [Node TypeScript support](https://nodejs.org/api/typescript.html): native type stripping; verify the chosen Node 24 release and keep test modules to supported syntax.

No provider has been selected; no API key, model/image capability, live pricing evidence, implementation, or machine runtime has been verified. These are explicit kickoff checks, not hidden assumptions that the localhost presentation automatically satisfies.
