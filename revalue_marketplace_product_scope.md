# ReValue - product scope for the conversational marketplace

**Document type:** Product scope / build brief  
**Version:** 1.1, 10 October 2026  
**Status:** Current product direction; implementation plan written, product not implemented  
**Implementation:** [Four-hour localhost plan](./IMPLEMENTATION_PLAN.md) - authoritative prototype stack, two-person phases, and time-box overrides.  
**Hackathon requirements:** [Problem statement](./PROBLEM_STATEMENT.md)  
**Background:** [Earlier decision-companion concept](<./revalue_ai_product_concept (1).md>)

## 1. Current product decision

ReValue helps people sell unwanted items, find suitable second-hand items, and post what they want to buy. A chatbot collects structured details, prepares transparent listings or buyer requests, explains evidence-based prices, searches available inventory, and highlights compatible buyers and sellers.

The latest user direction includes three entry points: **Sell an item**, **Find an item**, and **Post what I need**. The central new feature is proactive matching: a seller and buyer need not discover each other manually. When either side publishes suitable supply or demand, the application finds compatible records and notifies both sides inside the app with an explanation and a contact action.

Automatic connection means a match card and an in-app introduction opportunity. It does not mean automatic purchase, publication without review, sharing private contact information, negotiation, reservation, or acceptance. Users control these actions.

The broader intended categories include phones, accessories, decorations, recyclables, tyres, and nonworking items. The proposed hackathon slice is **phones and newspaper in one locality**; this replaces the earlier newspaper/cardboard/microwave proposal. It is a planning default, not a user-confirmed category restriction. Additional categories need their own fields, pricing sources, units, and buyer acceptance rules.

Repair, donation, transport routing, and a platform-owned fleet remain outside the first build. The older concept is background; this document takes precedence for current product behavior.

## 2. Source brief and research

The [hackathon problem statement](./PROBLEM_STATEMENT.md) calls for an AI-powered product addressing an Indian problem, built in eight hours using Cline as the coding partner. Required deliverables are a public GitHub repository and README, a PPT, and a demo video that shows Cline during the build. Using Cline inside the product can earn bonus credit. The product must be demonstrable as software, not only a concept.

### Findings that shape the scope

| Research finding | Source | Product implication |
| --- | --- | --- |
| Scrap pickup services already publish category and city rates and arrange collection. | [ScrapUncle rates](https://scrapuncle.com/rates); [The Kabadiwala rates](https://www.thekabadiwala.com/scrap-rates) | A single generic rate card and pickup form would be weak differentiation. ReValue should show *which participating buyer* supports a quote and how their terms affect it. |
| General used-goods platforms already provide listings and direct negotiation. | [OLX seller flow](https://www.olx.in/en-in/sell) | Listing alone is not the invention. The buyer-backed cap, eligibility, and explanation must be the useful part. |
| Device specialists already ask condition questions, quote a price, and offer pickup. | [Cashify phone sell flow](https://www.cashify.in/sell-old-mobile-phone) | Do not claim that AI-assisted condition questions or pickup are new. Start with mixed household categories that require different pricing units. |
| Cline SDK provides a lightweight Agent and custom tools. | [Cline SDK README](https://github.com/cline/cline/blob/main/sdk/README.md); [custom tools documentation](https://github.com/cline/cline/blob/main/docs/sdk/tools.mdx) | The explanation agent can read the exact stored quote and rate terms through read-only tools. Arithmetic stays in application code. |
| Waste tyre and e-waste have distinct handling regimes. | [CPCB waste-tyre FAQ](https://cpcb.nic.in/uploads/Projects/Waste-Tyre/FAQ_Waste_Tyre.pdf); [MoEFCC e-waste rules listing](https://moef.gov.in/rules-regulations-3) | Exclude waste tyres and nonworking electronics from the demo's transaction categories. Add them only with category rules and checked downstream partners. |
| India's data protection rules have a phased commencement, and a real service will process names, photos, location, and contact data. | [MeitY rules page](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025); [official commencement notification](https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf) | Collect the minimum location/contact information, obtain clear permission to share it, and review current obligations before a real public rollout. |

**Research interpretation:** ReValue's opportunity is not proved by these pages. They show a crowded adjacent market and a plausible unserved workflow: compare actual local buyers' eligibility and rate terms, then immediately hand a priced listing to an eligible buyer. This is a hypothesis to validate with users and buyers.

## 3. Users and responsibilities

- **Marketplace member:** Can sell, search, post a buying request, and respond to others. One account can both buy and sell; ordinary buyers do not need to maintain a dealer rate card.
- **Participating collector/dealer:** A member approved for the pilot who can additionally publish category-specific buying rates, quantity limits, fees, expiry, and service area.
- **Operator:** Approves pilot dealers, maintains supported categories/locality, checks rate evidence, and handles exceptions. Seed/configuration is sufficient for the demo; a full admin console is not required.

No claim of actual buyer participation or collection coverage is permitted for fictional seed accounts. Label simulated buyers, rates, and requests as demo data throughout the app and submission.

## 4. Seller chatbot and transparent listing

1. Seller starts a sale conversation and uploads photos; manual entry remains available.
2. AI proposes category and visible observations. Seller corrects or confirms them.
3. Chatbot asks only category-relevant questions, a few at a time. Unknown answers remain unknown.
4. The application computes a provisional quote from a supported pricing source and displays the maximum allowed ask, calculation, fees, validity, and uncertainty.
5. Chatbot prepares an editable listing draft. Seller reviews facts, public evidence, and price before publishing.
6. Publication triggers matching against active buying requests. Seller sees interested needs, match reasons, and a **Send offer** action linking their listing.

### Category-specific facts

| Category | Required or useful facts | Pricing unit |
| --- | --- | --- |
| Phone | Model/tier, storage, purchase date or age if known, function, visible damage, repair history, accessories, optional battery-health evidence and receipt | One item |
| Decoration/accessory | Type, material, size, quantity, condition, damage, missing parts, brand where relevant | Item, set, or explicit category unit |
| Newspaper/cardboard | Material, positive weight, measured versus estimated label, dry/mixed condition, approximate locality | kg |
| Tyre | Size, quantity, declared condition, reuse versus recycling route, relevant buyer acceptance terms | Buyer-defined item or weight unit |
| Nonworking item | Model/material, symptoms, missing parts, repairable/parts/recycling intent | Buyer-defined unit; not automatically kg |

For phones, camera specification and battery capacity may be recorded from seller evidence or a curated model reference. Battery capacity, current battery health, and claimed runtime are separate fields. Do not infer actual runtime from a photo or capacity alone. Runtime evidence needs the stated test/use conditions; otherwise show unknown.

Label facts as seller-declared, document-supported, or independently checked. A receipt can support purchase details, not today's working condition. Bills are optional; missing bills and unknown age must be visible. Original bills, exact address, phone numbers, and full device identifiers stay private. Seller previews the redacted evidence before sharing it publicly.

## 5. Buyer search chatbot and buying-request board

### Find existing items

Buyer describes category, price range, locality, acceptable age/condition, required accessories, and relevant specifications. Chatbot separates **must-have constraints** from **preferences**, displays editable filters, and searches only actual available listings.

Results are item cards with photos, asking price, declared facts, evidence labels, match reasons, missing details, and a link to the listing. If there is no exact match, explain which constraints fail. Ask before relaxing a must-have. Unknown data must not satisfy a required condition.

### Post what I need

Buyer can publish a request even when no suitable listing exists. Examples:

- Newspaper: 10 kg, clean/dry, one locality, budget stated per kg or total, required-by date, and whether quantity is exact or a range.
- Phone: price range, maximum age, model/storage preferences, minimum camera specification if relevant, acceptable battery evidence, accessories, and locality.

Chatbot converts the conversation into a structured draft; buyer reviews it before publication. Record category, quantity/unit, budget basis, location, required conditions/specs, preferences, deadline/expiry, permitted quantity range, and match-alert preference.

The public **Wanted** board lets sellers browse active requests and send an in-app offer using a published listing they own. A buying request is an expression of demand, not a guaranteed purchase or a replacement for a dealer's standing price rate.

## 6. Pricing contract retained from the original marketplace

For the first supported categories, a quoted ceiling must be backed by a matching current participating-buyer rate; fictional rates must be labelled demo data. Phones require a specific model/storage/condition tier, not one generic phone price. If no dependable pricing source exists, retain a draft and show no supported quote; do not manufacture a price. The implementation plan must explicitly resolve the pricing source before enabling a new category.

For each eligible rate, calculate gross = quantity × rate, and net = max(0, gross − disclosed fee). Eligible rates match category, unit, condition/model tier, quantity limits, locality, active status, and validity. Exclude nonpositive net quotes. The ceiling is the highest eligible net amount, not a universal market valuation or guaranteed payment.

Store INR as integer paise with explicit weight precision and rounding. Round the displayed maximum down to whole rupees. Seller can list at that maximum or lower; client and server reject an ask above it. Record the exact inputs, buyer rate/version, calculation, validity, and evidence in the quote snapshot. AI explains that calculation without selecting the amount.

At publication and transaction acceptance, revalidate the current quote and seller-approved ask. If rate or item changes invalidate the ask, require a new quote and explicit seller review; never silently change the price. A buying request's budget does not automatically change a listing price. Inspection/weighing can lead to a later revised offer only with fresh agreement.

Ordinary consumer matching uses the listed ask and request budget. Dealer matching additionally respects the dealer's current rates and pickup terms. Third-party advertised asking prices are not confirmed transactions or participating-buyer offers.

## 7. Automatic matching and notifications

### Match in both directions

Run matching when a listing is published or its relevant facts change, and when a buying request is published or its constraints change. Match against existing opposite-side records, including records whose owners are currently offline. Expired/paused/closed requests and unavailable listings are excluded immediately.

Use application rules to check hard requirements first: category, locality, price, quantity/unit, age, condition, accessories, specs, availability, and expiry. Never match a member to their own request. Separate supported facts from seller declarations and unknowns. AI may order qualifying results by preferences and explain them, but cannot override a failed hard requirement.

The pilot matches **one whole listing to one whole buying request**. No automatic splitting of inventory, combining several sellers to reach 10 kg, or partial fulfilment. Explicit quantity ranges may permit a larger listing; an exact 10 kg request does not silently match 7 kg or 12 kg.

A phone advertised within budget but missing required battery evidence is not an exact match. It may appear only as a clearly labelled near-match for manual review, without an exact-match alert. Camera megapixels alone must not be described as evidence of camera quality.

### Notification behavior

Store a match record referencing the listing and buying request, their versions, satisfied requirements, unknowns, and a short explanation. Send a private in-app notification to both owners who enabled match alerts. Alerts open the match card; unread alerts remain available when the user returns.

Example: “A seller in your area listed 10 kg of clean newspaper within your budget. Review the details.” Seller counterpart: “A buyer requested the quantity and condition you listed. Send them an offer.” Example phone alerts cite the actual matched price/age/accessory facts and their evidence status.

Deduplicate per listing/request pair and relevant version. Retried saves, refreshes, and repeated scans must not generate duplicate alerts. Recheck availability and constraints when opening a match or responding, since an earlier notification can become stale. Editing, withdrawing, reserving, fulfilling, or expiring an item/request invalidates incompatible matches. Users can mute alerts and dismiss matches; hidden contacts remain hidden.

The first version uses event-triggered database queries and persisted in-app notifications. It needs no always-running autonomous agent, vector database, separate queue, email, SMS, WhatsApp, or push integration.

## 8. Contact, offers, and reservation

Distinguish **BuyingRequest** (wanted advertisement) from **PurchaseRequest** (interest in a particular listing). A match or notification creates neither a sale nor a reservation.

A seller can respond to a buying request with their listing and a short message. A buyer can initiate interest from a listing or accept interest in a seller's offer. The counterpart confirms through the same transaction flow. For the demo, agree to the existing seller-approved listing ask; automated counteroffers and negotiation are later scope.

Reserve a listing for only one counterparty, enforced atomically in the database. Repeated acceptance must be harmless. Competing offers cannot also reserve the item. Declining one offer leaves an unreserved listing available. Only after mutual agreement do users choose to share direct contact and pickup details with that counterparty.

At acceptance, recheck current availability, quote validity, request constraints, and price. If facts/terms changed, require refreshed confirmation. Physical inspection, final weighing, payment, and completed collection are later operational steps; an accepted introduction is not a completed sale.

## 9. AI and Cline SDK responsibilities

- **Vision:** Category and visible observations, label text where possible; no invented weight, age, internal function, battery health, or price.
- **Seller assistant:** Category-specific questions and editable listing draft from confirmed facts.
- **Buyer assistant:** Extract structured requirements, expose hard filters versus preferences, and search actual listings.
- **Cline SDK agent:** Read stored quote breakdowns, listing facts, buying requests, and candidate matches through bounded custom tools. Explain price and matching; help prepare drafts. It must not publish, disclose contact, send unsolicited external messages, change prices, reserve items, or accept deals autonomously.
- **Application:** Authentication/authorization, arithmetic, hard filters, input validation, publication, match persistence/deduplication, notifications, and atomic reservation.

Use one narrow server-side agent with only the needed tools; validate its proposed structured values before saving. Render price equations and hard-match facts from stored data directly. Keep explanation claims bounded to approved facts/reason codes and use a deterministic template if generation fails or is unsupported. Raw uploads and user descriptions are data, not instructions authorizing extra agent actions.

Provider keys stay server-side. Confirm current SDK/provider behavior through a small live prototype before building the full flow. Manual entry, direct filter controls, and template explanations keep core actions usable during AI failure.

## 10. Minimum data and screens

| Entity | Essential contents |
| --- | --- |
| User | Member/admin identity, optional dealer capability, private contact and alert preference |
| BuyerRate | Dealer, category/tier, unit, quantity limits, amount, fee, locality, validity, version |
| Listing | Owner, structured item facts/evidence, photos, quote snapshot, approved ask, locality, status/version |
| BuyingRequest | Owner, structured hard constraints/preferences, quantity/unit, budget basis, locality, expiry, status/version |
| Match | Listing/request IDs and versions, verified constraint results, explanation, active/dismissed status |
| Notification | Recipient, match/event reference, unread state, deduplication key |
| PurchaseRequest | Listing, optional buying-request reference, initiator/counterparty, agreed ask, message, status |

Screens: home with Sell/Find/Post a request; assistant with editable draft; transparent listing; wanted board/request detail; search results; matches/notifications; offer/request inbox; dealer rate editor. Reuse forms and cards rather than building separate applications for each role. Approximate locality is public; original bills and exact contact are private.

Listings: draft → published → reserved, with withdrawn/expired alternatives. A cancelled reservation can return to published after fresh validation. Buying requests: draft → active → fulfilled, or paused/withdrawn/expired. Purchase requests: pending → accepted/declined/cancelled; acceptance reserves the listing. Match status is separate from transaction status. Fulfilment is confirmed by the buyer, not inferred from an alert.

## 11. First-build acceptance criteria

P0 includes seller chatbot/draft, buyer conversational search, buying-request board, transparent listing/quote and price cap, automatic matching in both publication orders, persisted notifications, seller offer/buyer interest, and one-counterparty reservation. English, one locality, phones and newspaper are proposed defaults. Private evidence must not be accidentally published.

Small focused checks must prove:

1. Listing first/request second and request first/listing second both produce the expected match and two eligible recipients' alerts.
2. Budget/age/quantity/spec mismatches and unknown required facts do not produce exact-match alerts; no-match responses do not invent inventory.
3. Repeated matching produces no duplicate notifications; closing/expiring/reserving records prevents stale acceptance.
4. A purchase request cannot exceed the seller's cap or use an invalid rate; rupee/paise and kg/item units remain consistent.
5. Two concurrent accept attempts reserve the listing for only one counterparty.
6. Users cannot edit others' rates/listings/requests or access private bills/contact without permission.
7. Unsupported AI claims and provider failures use safe fallbacks without blocking valid manual actions.

## 12. Implementation planning readiness

The product flow is sufficiently defined to write an implementation plan. There is no application code yet, and this scope does not establish working providers, real buyers, pricing datasets, or hosting.

Planning defaults: one mobile-first TypeScript web app with server routes; one relational database/auth/storage service if available; one vision provider; one server-side Cline SDK agent; synchronous match queries after successful publication; persisted in-app alerts. Reuse existing team access rather than introducing extra services.

The plan must choose the exact locality, validate phone and newspaper price sources or labelled fixtures, select available provider/hosting credentials, define phone spec evidence and expiry defaults, and establish the publication/quote validation path. These are planning tasks, not reasons to postpone the plan or claim national coverage.

Start with a tiny SDK/provider prototype and one seller/request pair. Build the full publication → automatic match → both alerts → reviewed introduction before adding categories. Prepare README/deck/video outline and capture Cline during development from the start. Reserve submission time inside the eight-hour limit; narrow categories and optional features before cutting the requested matching flow or trust checks.

## 13. Demo and required artifacts

Show a buyer posting a 10 kg newspaper need while no listing matches. Publish a matching seller listing and show alerts to both accounts, the match explanation, seller's offer, and reviewed introduction/reservation. Repeat the publication order with a phone listing and a new buyer request; show one required-spec mismatch excluded and a matching candidate found. Display demo-data labels where needed, the price equation/cap, optional redacted evidence, and private contact controls.

Submit a public GitHub repository and README covering problem, solution, architecture, stack, setup, Cline usage, and limits; a PPT covering problem, solution, architecture, AI/tools, Cline use, challenges, and future scope; and a mandatory working demo video showing Cline during the build. A social post tagging Cline is optional brownie-point scope. The full requirements remain in [PROBLEM_STATEMENT.md](./PROBLEM_STATEMENT.md).

## 14. Later work and unresolved evidence

Later: additional categories and category-specific collectors, partial/multi-seller fulfilment, automated bargaining, full messaging, email/push delivery, payments, collection routing, verified completion, ratings/disputes, repair/donation, and more languages. Tyres and nonworking electronics need an appropriate category and downstream partner design before real transactions.

Public competitor pages are market context, not ReValue offers. A buyer posting a need does not prove they will buy; a match does not verify seller condition. Phone model specifications do not prove the particular device's current performance. Real buyer willingness, valuation accuracy, response rates, and collection outcomes need pilot validation. No completed-sale, environmental-impact, national-service, or compliance claim follows from this specification.
