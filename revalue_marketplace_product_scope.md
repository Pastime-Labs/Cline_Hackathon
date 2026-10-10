# ReValue — product scope for the buyer-backed local marketplace

**Document type:** Product scope / build brief  
**Version:** 1.0, 10 October 2026  
**Status:** Proposed build scope for the Cline AI Builder Hackathon  
**Companion document:** [Original ReValue concept](./revalue_ai_product_concept.md)  
**Primary decision:** Build a local marketplace where participating buyers publish what they are prepared to pay, sellers receive an explainable provisional ceiling, and eligible buyers can request a purchase or pickup.

## 1. Executive decision

### Product in one sentence

**ReValue lets a person photograph recyclable material or an unused item, see a transparent price based on participating local buyers' rates, list it at that price or lower, and receive a buyer request for collection.**

The first release is a **mobile-first web app** for one pilot locality. It covers **newspaper, cardboard, and a working microwave**: two recyclables sold by measured weight and one reusable appliance sold by item and declared condition. A buyer dashboard holds category-specific rates and pickup terms. A seller flow goes from photo to explained quote to listing. An eligible buyer can request that listing, and the seller can accept. The quote and request are **provisional until the buyer verifies the item and, for weight-based materials, weighs it**.

The app's distinctive claim is narrower and more defensible than “AI knows the value of everything.” It makes **participating buyers' own price rules visible and actionable**. AI helps understand a photo, asks for missing facts, and explains a deterministic calculation. It never invents a rate or chooses a rupee amount by intuition.

### Decision on scope

The initial concept considered a broad “sell, repair, donate, scrap” decision companion. The current product direction is a **marketplace transaction flow**. Repair and donation can reappear later; they are not part of the hackathon release. Likewise, municipal collection routing and a platform-owned vehicle fleet are outside this product.

## 2. Source brief and research

The [hackathon problem statement](./Cline_AI_Builder_Hackathon_PS.pdf) calls for an AI-powered product addressing an Indian problem, built in eight hours using Cline as the coding partner. Required deliverables are a public GitHub repository and README, a PPT, and a demo video that shows Cline during the build. Using Cline inside the product can earn bonus credit. The product must be demonstrable as software, not only a concept.

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

## 3. Problem, target users, and job to be done

### Problem statement

A seller may have recyclable material or a usable item but lack a credible answer to two questions: **“What will a nearby buyer pay for this specific quantity and condition?”** and **“Who will actually collect or purchase it?”** Published rates may not reflect local coverage, minimum quantities, contamination, pickup charges, or the difference between a usable item and scrap. A seller can waste time asking around or accept a poor offer. Buyers, in turn, need enough structured details to decide whether a pickup is worth making.

### First users

- **Seller:** A resident, student, renter, or small shop owner in the pilot area with an item to clear. For the demo, one seller can create and manage a listing without advanced seller verification.
- **Participating buyer:** A local kabadiwala, recycling collector, or second-hand appliance buyer who declares categories, rates, service area, minimum quantity, and pickup terms. For the demo, buyer accounts and rates are seeded or entered through a buyer screen.
- **Admin/operator:** The team member who approves pilot buyers, checks their stated service area and category, handles inaccurate rates, and reviews exceptions.

### Jobs to be done

- Seller: “Show me a price that someone nearby actually supports, explain it, and let me post without bargaining blindly.”
- Buyer: “Show me eligible nearby items with enough information to decide whether I can collect them profitably.”
- Operator: “Know which rate produced a quote, prevent stale or fake offers, and see where transactions stall.”

### Scope assumptions

1. **Pilot geography:** one configurable locality that the team can reach for buyer recruitment. The app must display the exact locality name; the team should set it before the demo. No national coverage claim.
2. **Three categories:** newspaper, cardboard, and a **working microwave**. This reflects the team's choice of two recyclables plus one reusable item. A microwave is a test of per-item condition pricing; no other appliance is implicitly supported.
3. **Buyer data:** at least one active buyer rate per demo category. A rate is “buyer-backed” only if a real buyer supplied it and agreed to its display and terms. Seeded fictional rates must be visibly labelled **demo data** throughout the UI and video.
4. **Transaction point:** the hackathon flow ends at a buyer request accepted by the seller. Physical inspection, final weighing, payment, and collection are recorded as future operational steps; the app must not imply that those happened.
5. **Currency and units:** INR; weight in kg for paper and cardboard; one unit for a microwave. Any decimal weight is seller-entered and provisional.

## 4. Goals, non-goals, and success

### Goals for the hackathon product

1. A seller can complete photo → details → provisional quote → explanation → listing in a short mobile flow.
2. The maximum permitted listing price is backed by at least one currently eligible participating buyer rate and shown with its terms.
3. A buyer can see only listings they are eligible to buy, request purchase/pickup, and have the seller accept or decline.
4. The AI contribution is visible but bounded: image understanding and a Cline SDK explanation based on stored facts.
5. Anyone reviewing a quote can trace its buyer rate, unit, condition, quantity, fees, validity, and inspection caveat.

### Non-goals for the eight-hour release

- The platform does not own vehicles, guarantee pickups, process payments, or promise completion.
- It does not price every type of scrap, tyres, nonworking electronics, or arbitrary used goods.
- It does not scrape live prices from third-party marketplaces or treat asking prices as confirmed transactions.
- It does not automatically diagnose electronics, certify condition, or promise an appliance works.
- It does not support auctions, live bidding, chat, automated negotiation, repair booking, donations, or loyalty points.
- It does not optimise routes or coordinate municipal waste collection.

### Success criteria

**Demo success:** all three category flows can reach a listing; at least one buyer can request a listing; the seller can accept; the price explanation matches the stored calculation exactly; the UI makes provisional status and demo data visible.

**Pilot success measures, after the hackathon:** quote-to-listing conversion, listing-to-qualified-request rate, request-to-accepted rate, final paid amount versus provisional quote, pickup completion, rate freshness, buyer response time, and complaints about price changes. These are measures to collect, not fabricated targets.

## 5. Key product definitions

| Term | Exact meaning |
| --- | --- |
| Buyer rate | A participating buyer's current maximum unit rate for a specific category, condition tier, and locality, plus quantity limits, fees, and expiry. |
| Eligible buyer | A buyer whose active rate matches the item category, condition, quantity, service area, and current time, and who is currently accepting requests. |
| Gross quote | Quantity × buyer unit rate. |
| Net provisional quote | Gross quote less any disclosed fixed pickup/handling fee, floored at zero. This is what the seller may receive before inspection. |
| Buyer-backed ceiling | The highest net provisional quote among eligible buyers at the time the quote is created. It is a **listing cap**, not a universal market valuation or guaranteed payout. |
| Listing ask | The amount the seller chooses to display, from ₹0 up to the current buyer-backed ceiling. |
| Request | An eligible buyer's stated interest in buying/picking up the listing at its displayed ask, subject to inspection and weighing terms. |
| Final price | A later amount agreed after inspection/weighing. It is outside the eight-hour transaction flow. |

Do not use “fair market price,” “guaranteed price,” or “AI valuation” as labels for the buyer-backed ceiling.

## 6. Marketplace rules and pricing contract

### Buyer rate fields

Each rate records: buyer ID, category/subcategory, unit (kg or item), condition tier, maximum unit amount, minimum and maximum accepted quantity, pilot service area, fixed pickup fee (including zero), active status, valid-from and valid-until timestamps, inspection/weighing note, and who last changed the rate. The buyer can edit or pause a rate. The app records versions so existing quote explanations remain understandable.

For newspaper and cardboard, condition tiers are **clean/dry** and **mixed/damp or uncertain**. For the microwave, the demo accepts only **seller-declared working** with a known model or model tier. The buyer's microwave rate is per item and must be specific enough to avoid treating all microwaves as equal; where model/condition cannot match a rate, the app shows **no supported quote**. “Uncertain” inputs may be handled only by a buyer rate that explicitly accepts that tier.

### Deterministic quote sequence

1. Normalize seller input: supported category, positive measured/estimated quantity, condition tier, and pilot area. Reject impossible or inconsistent values.
2. Find active buyer rates matching the category, condition, unit, service area, quantity bounds, and current validity window.
3. For each eligible rate, compute gross = quantity × rate; net = max(0, gross − fee). Store money in paise, apply an explicit rounding rule to weight multiplication, and **round the displayed ceiling down to whole rupees** so a displayed ask can never exceed the underlying net. Retain the unrounded inputs and rule for audit.
4. Exclude rates whose net is zero or whose terms cannot be met. Sort eligible net quotes descending.
5. Show the highest net as the **buyer-backed ceiling** and let the seller inspect the buyer, calculation, and other eligible quotes. If only one buyer exists, say so.
6. The seller may set the ask **at or below** that ceiling. The system must reject a higher amount on both client and server.
7. At buyer request time, recheck that the buyer is still active and has an applicable rate that supports the current ask. A buyer whose net maximum is below the ask cannot request it.

Example with **hypothetical demo data only**: a buyer rates clean, dry newspaper at ₹12/kg for this locality, with no pickup fee. For a seller-entered 10 kg, the provisional ceiling is ₹120. The UI says: “10 kg × ₹12/kg = ₹120 from Buyer A. Final amount depends on weighing and condition check.” If a ₹20 pickup fee applies, the net ceiling is ₹100. Rates must never be silently sourced from the AI model.

### Freshness, changes, and exceptions

- Every quote shows when the underlying rate expires. A listing cannot be newly published against an expired rate.
- If a rate expires or the item details change before a buyer request, mark the listing **re-quote required**. Do not silently raise or lower the seller's ask.
- A request stores the listing ask and rate version seen at request time. Later rate edits do not rewrite the historical request. The buyer may decline after inspection, but the platform must show the reason; any revised amount requires a separate seller decision in a later phase.
- No eligible buyer means no numerical price and no priced marketplace listing. Offer a clear “no participating buyer in this area/category yet” state; do not substitute an unrelated online rate and call it buyer-backed.
- If the image, category, and seller answer conflict, ask for confirmation before quoting.
- A rate may be entered by an admin on a buyer's behalf only with buyer approval and attribution. Fictional seed data must remain labelled demo data.

## 7. End-to-end user experience

### Seller flow

1. **Landing:** short promise, pilot locality coverage, supported categories, “Sell an item” action. No claim of nationwide service.
2. **Upload:** camera/gallery image. Explain that the photo assists identification; weight and functionality must be supplied by the seller.
3. **Review AI suggestion:** show suggested category and visible observations, each editable. Low-confidence or unsupported results route to manual category choice.
4. **Details:** category-specific questions. Newspaper/cardboard ask measured or estimated kg, dry/mixed condition, pickup area. Microwave asks model/tier, working status, visible damage, age if known, and one simple self-check statement. The UI labels these facts seller-declared.
5. **Quote:** show highest eligible net quote, other eligible buyers if any, exact equation, fee, expiry, and inspection caveat. The Cline explanation expands “why this amount?” using only the stored quote.
6. **Listing editor:** prefilled title/description/photos, editable details and asking amount with the hard cap. Include a preview of what buyers see. The seller publishes.
7. **Listing status:** shareable listing link, request inbox, accept/decline actions. Only after accepting a request does the seller share the exact pickup address or contact details with that buyer.

### Buyer flow

1. Sign in as an approved participating buyer.
2. View/edit own rates and pickup conditions; pause a category or mark unavailable.
3. See listings in the pilot area only where the buyer's current rate supports the ask.
4. Open listing details, photos, seller-declared condition, provisional weight, and quote basis.
5. Request the purchase/pickup with a proposed time window and message. The request states that final price depends on inspection/weighing.
6. See whether the seller accepted or declined. For an accepted request, view the agreed contact/meeting details.

### Admin flow

The admin can add/approve pilot buyers, seed rates, set the pilot locality and supported categories, suspend false or stale buyer rates, and inspect quote/request history. For the hackathon, this can be a protected internal screen or seed/configuration path rather than a full operations console, but buyer rates must be editable through the product by the buyer.

### Screen inventory

| Screen | Audience | Required content |
| --- | --- | --- |
| Home / coverage | All | Value proposition, locality, supported categories, demo-data marker if applicable |
| Upload and category review | Seller | Photo, AI suggestion, manual correction, unsupported-category state |
| Details | Seller | Category-specific inputs, validation, declaration labels |
| Quote and explanation | Seller | Buyer-backed ceiling, equation, buyer terms, alternatives, expiry, caveat |
| Listing editor and published view | Seller/buyer | Photos, details, seller ask, price basis, status, share link |
| Buyer dashboard / rate editor | Buyer | Own rates, quantities, fees, validity, active switch |
| Eligible listings and request form | Buyer | Matched listings, request action, pickup window |
| Requests / status | Seller/buyer | Pending, accepted, declined, cancelled; contact reveal after acceptance |

## 8. Functional requirements and acceptance

Priority **P0** means needed for the hackathon end-to-end demo. **P1** is useful if time remains after P0 works. **Later** is explicitly excluded from this build.

| ID | Priority | Requirement | Acceptance condition |
| --- | --- | --- | --- |
| FR-01 | P0 | Show one pilot locality and three supported categories. | Unsupported locations/categories cannot receive a buyer-backed quote. |
| FR-02 | P0 | Upload one item photo, with camera use on mobile and a file fallback. | Seller can preview/remove the image; invalid type/size is rejected. |
| FR-03 | P0 | AI proposes category and visible attributes; seller can correct them. | A model error never locks the user into a wrong category. |
| FR-04 | P0 | Collect category-specific quantity, condition, and locality. | Weight is entered by the seller; no photo-derived weight is shown. Microwave requires working declaration and model tier. |
| FR-05 | P0 | Buyer can maintain active, expiring rates and pickup terms. | An authenticated buyer changes only their own rates; inactive/expired rates cannot quote. |
| FR-06 | P0 | Server computes eligible buyer quotes and ceiling. | Quote uses matching rate version, quantity and fee; no LLM-generated number enters the calculation. |
| FR-07 | P0 | Cline SDK explains the quote from stored rate and calculation. | Explanation states category, quantity, unit rate, fee, buyer, provisional status, and inspection caveat; any invalid output falls back to a safe generated template. |
| FR-08 | P0 | Seller lists at or below the ceiling. | Both UI and server reject ask greater than ceiling; published listing stores the rate/quote snapshot. |
| FR-09 | P0 | Buyer sees eligible listings and submits a request. | A buyer below the ask, outside service area, or with an expired rate cannot request. |
| FR-10 | P0 | Seller accepts or declines a request. | Status changes are visible to both sides; address/contact is not exposed before acceptance. |
| FR-11 | P0 | Show quote provenance and demo-data labels. | Every price has source buyer, rate version/time, equation, and validity; fictional buyers/rates are visibly marked. |
| FR-12 | P0 | Handle failure and empty states. | Upload/AI failure allows manual entry; no rates gives no numeric quote; SDK failure does not block listing if the deterministic quote is valid. |
| FR-13 | P1 | Let seller compare multiple eligible buyer offers. | Sort by net amount and show fee/terms, not only nominal unit rate. |
| FR-14 | P1 | Generate an editable bilingual listing description. | AI copy cannot add unconfirmed claims about function or condition. |
| FR-15 | P1 | Record final inspected weight, revised offer, and seller acceptance. | Historical quote and final price are separate; neither is overwritten. |
| FR-16 | Later | Payments, verified pickup completion, ratings, dispute resolution, and routing. | Requires operational design and real partners. |

## 9. AI and Cline SDK scope

### Division of responsibility

**Image model:** Given a photo, return structured suggestions: supported category, visible attributes, possible model text, uncertainty, and follow-up questions. It may say “unknown.” It must not estimate kg, assert internal working condition, or produce a sale price.

**Application quote engine:** Validates inputs, retrieves buyer rates, calculates eligibility and net amounts, applies the cap, stores an immutable quote snapshot, and controls listing publication/request eligibility.

**Cline SDK explanation agent:** Receives a quote ID and uses read-only custom tools such as “get quote breakdown,” “get buyer rate terms,” and “get seller-declared facts.” It explains the calculated amount in plain English or Hindi and explicitly says what will be checked at pickup. It cannot write prices, change rates, accept requests, or call shell/file/network tools. The official [SDK tools guide](https://github.com/cline/cline/blob/main/docs/sdk/tools.mdx) supports custom tools; the lightweight [Agent API](https://docs.cline.bot/cline-sdk/sessions) is a better fit than a full coding-agent runtime for this narrow task.

**Output validation:** The server checks that any numbers, units, buyer names, and conditions in the explanation match the quote snapshot. If the agent times out, fails, or adds unsupported facts, display a deterministic explanation template instead. The product should still work without the agent, while the hackathon demo should show the Cline SDK path working.

### Why AI is material

AI reduces entry work for mixed, messy photos and explains a category-specific buyer quote in ordinary language. The value is not a free-form “AI price”; it is a usable transaction with clear evidence. The demo should show a photo misclassification being corrected, or a question being asked for missing weight/condition, to demonstrate that the AI is an assistant rather than an oracle.

### SDK integration risk

Cline SDK APIs and provider requirements may change. Confirm the installed version and the [current official SDK documentation](https://github.com/cline/cline/blob/main/sdk/README.md) before implementation. Run the SDK on the server with a configured provider key; never expose credentials to the browser. Keep agent tools read-only and bounded in runtime/cost. No integration should be described as complete until it runs in the demo environment.

## 10. Data model and state changes

| Entity | Essential fields |
| --- | --- |
| User | ID, role (seller/buyer/admin), authentication identity, consent/contact preferences |
| BuyerProfile | User ID, display name, verified pilot status, coverage area, pickup availability |
| BuyerRate | Buyer ID, category, condition/model tier, unit, max unit price, min/max quantity, fee, validity, active status, version |
| Item | Seller ID, category, photos, locality, quantity/unit, condition, model, seller declarations, AI suggestion metadata |
| Quote | Item snapshot, calculation timestamp, eligible buyer rate versions, gross/net per buyer, ceiling, expiry, demo-data flag |
| Listing | Item ID, quote ID, seller ask, public description, status, created/updated timestamps |
| PurchaseRequest | Listing ID, buyer ID, ask snapshot, rate version, proposed time, status, timestamp |
| AuditEvent | Actor, action, entity/version, timestamp, reason where relevant |

**Listing states:** draft → quoted → published → request pending → accepted / declined. Published can also become **re-quote required**, withdrawn, or expired. An accepted request is not automatically marked sold or picked up.  
**Request states:** submitted → accepted / declined / cancelled. A later production version can add inspected, revised, paid, and completed states.

The app must retain quote and rate snapshots so an explanation still describes the original terms after a buyer edits a rate. Public item pages expose approximate area only; exact pickup address and direct contact remain private until a request is accepted.

## 11. Proposed technical shape

This is a build recommendation, not a claim that a stack has already been selected or configured.

| Component | Responsibility | Practical hackathon choice |
| --- | --- | --- |
| Responsive web client | Seller and buyer flows | A TypeScript web app with mobile-first forms and image upload |
| Server/API | Auth, rate checks, quote calculation, state changes | Server-side routes in the same TypeScript app; Node runtime for SDK |
| Database | Buyers, rates, items, quotes, listings, requests | Hosted relational database with migrations and role checks |
| Image storage | Item photos | Private object storage; signed or controlled public URLs for listings |
| Vision provider | Structured photo suggestion | One image-capable API, called server-side |
| Cline SDK worker/route | Read-only explanation agent | Server-only Agent with quote tools and timeout |
| Hosting | Accessible demo | One deployable web service plus managed database/storage |

**Suggested API boundaries:** create/upload item; analyse photo; save details; compute quote; explain quote; create/publish listing; list buyer-eligible listings; create request; accept/decline request; manage own buyer rates. All money calculations and eligibility checks run server-side. The browser never receives a provider secret or authority to modify another buyer's rates.

**Authentication recommendation:** use a proven hosted auth service if available to the team; seed a small number of buyer accounts for the demo. Sellers should also have a stable authenticated session before publishing. For a local-only demonstration, clearly label demo accounts and do not expose real phone numbers. Production launch requires stronger buyer vetting, spam controls, and recovery flows.

## 12. Non-functional requirements

| Area | Scope requirement |
| --- | --- |
| Usability | Usable on a basic phone-sized viewport; clear progress through upload/details/quote/listing; simple language; English first, Hindi explanation as P1. |
| Performance | Show a loading state for image and explanation calls; do not block deterministic quoting on AI generation. Target responsive form interactions and bounded AI requests; measure actual latency in the demo. |
| Resilience | Manual category entry after AI failure; template explanation after SDK failure; retryable uploads; no silent data loss on an interrupted form. |
| Security | Server-side authorization on rate/listing/request mutations; image type/size limits; private secrets; no public exact address; rate limiting for upload and AI endpoints. |
| Privacy | Show what data is shared with buyers and when; store only needed location/contact data; let a seller withdraw a listing and request deletion through the operator in the pilot. Review current Indian privacy rules before public launch. |
| Price integrity | INR and unit labels everywhere; integer-paise arithmetic with an explicit weight-precision and rounding rule; quote/rate snapshots; visible fee and expiry; no unsupported AI assertions. |
| Accessibility | Labels and validation text for inputs, keyboard-usable controls, sufficient contrast, non-colour status cues, and text alternatives for meaningful images. |
| Observability | Log quote creation and rate version, failed AI calls, request transitions, and errors without logging sensitive photo content or full address. |

## 13. Eight-hour implementation plan and scope control

The time blocks below are a **planning budget**, not a promise. Work can overlap between team members, but each slice must end in a demonstrable increment.

| Time budget | Output |
| --- | --- |
| 0:00–0:45 | Confirm locality, categories, buyer/rate evidence, stack, and seeded accounts; create repository and Cline build log. |
| 0:45–2:00 | Data schema, rate seed/admin path, quote engine, eligibility rules, and a basic buyer rate editor. |
| 2:00–3:30 | Seller upload/manual details and three category forms; image suggestion API with correction path. |
| 3:30–4:45 | Quote view, seller price cap, listing creation, and public listing page. |
| 4:45–6:00 | Buyer eligible-list view, pickup request, seller accept/decline, and private contact handoff. |
| 6:00–7:00 | Cline SDK explanation tools and validated output with fallback. |
| 7:00–8:00 | End-to-end review, deployment, README, PPT, demo recording with Cline shown in action. |

The final hour is crowded because the hackathon also requires a presentation and demo video. Prepare the deck outline, repository README skeleton, demo accounts, and sample photos early. If behind schedule, drop P1 features first; **do not drop the quote provenance, seller cap, or request flow**, because those are the product's central proof.

### Demo sequence

1. Open the site and show the exact pilot locality and three supported categories.
2. As seller, upload newspaper. AI suggests category; seller supplies 10 kg and clean/dry condition.
3. Show two participating buyer rates if available, the chosen net ceiling, fee, expiry, and Cline SDK explanation. Use “demo rate” labelling if buyers are fictional.
4. Attempt an ask above the ceiling and show the server rejects it; then publish at or below the ceiling.
5. Sign in as an eligible buyer; request pickup. Show an ineligible buyer cannot request.
6. Accept as seller and show contact details become visible only then.
7. Briefly show cardboard as a second weight category and microwave as a per-item condition category, including a no-quote case when its model/condition does not match a buyer rate.
8. Show Cline's role in the build in the mandatory video, then the SDK explanation running in the product.

### Required hackathon artifacts

- Public repository with README: problem, product, architecture, stack, setup, demo credentials/data, how Cline was used, limits of buyer rates, and deployment link.
- PPT: problem, evidence, product flow, architecture and AI division of responsibility, Cline use, challenges, future scope.
- Short video: working seller-to-buyer scenario **and** Cline visible during the build.
- Optional social post, as listed in the brief.

## 14. Definition of done

The hackathon product is ready for submission when:

1. A fresh user can create a quote and listing for newspaper, cardboard, and the specified working microwave tier without developer intervention.
2. Every displayed rupee figure comes from a stored buyer rate and deterministic calculation; all fees and validity are visible.
3. The seller can set the listing ask at or below the ceiling, and server validation blocks any higher value.
4. A matching buyer can request the listing; a nonmatching buyer cannot; the seller can accept/decline.
5. No exact address or direct contact is exposed before acceptance.
6. The Cline SDK explanation is demonstrably fed by stored quote data, and a fallback exists if it fails.
7. The UI states that weight/condition are seller-declared and final payment depends on physical checks.
8. Any fictional buyer/rate is marked demo data in the app, README, deck, and video.
9. The app is deployed or runs reliably from documented setup steps, and the required submission artifacts are complete.

This is a product acceptance checklist, not a claim that implementation or tests have already been run.

## 15. Risks, dependencies, and mitigation

| Risk | Why it matters | Scope response |
| --- | --- | --- |
| No real participating buyers | Without them “buyer-backed” is false. | Recruit at least one real buyer per category if possible; otherwise label the entire rate/request flow as a simulation. Do not claim live pickup coverage. |
| Buyer rates are broad or stale | Category price may not match actual material or appliance. | Require condition/model tiers, min quantity, locality, expiry, and visible inspection condition. |
| Sellers understate damage or overstate weight | Buyer may reduce the final amount or abandon pickup. | Show self-declared status, retain photo, make quote provisional, and design a later revision/acceptance flow. |
| Low-value pickups may be uneconomic | A buyer may have a minimum quantity or charge a fee. | Model min quantity and fee before producing the ceiling. No quote if thresholds are not met. |
| Sparse supply and buyer liquidity | A marketplace can feel empty. | Limit to one pilot area, seed only genuinely participating buyers, and measure requests. Do not claim broad coverage. |
| AI invents price reasons | This would destroy trust. | Read-only SDK tools, stored quote snapshot, numeric/term validation, and deterministic fallback. |
| Scope overruns eight hours | Three categories, two roles, AI, and SDK are still substantial. | Reuse one seller flow and one quote engine; category-specific forms/rules only. Stop P1 work when P0 is at risk. |
| Regulation or handling varies by material | Waste tyre and e-waste have additional rules. | Keep them out of the transactional demo until proper partner and compliance review. |
| Public listing abuse and contact leakage | Fake buyers or spam can harm users. | Buyer approval, server permissions, limited contact reveal, and pilot-only operation. |

## 16. Later product roadmap

1. **Real pilot operations:** recruit buyers, verify rates and service areas, record physical weights/final prices, handle cancellations and disputes, and add quality feedback.
2. **More categories:** metals, plastics, books, furniture, and unused appliances only after each category has a clear unit, condition taxonomy, buyer rate rules, and safe handoff. Tyres and e-waste need dedicated eligibility and downstream handling checks.
3. **Market mechanisms:** multiple buyer requests, counteroffers or bids, buyer reputation, seller history, negotiated final price, and possibly a platform fee.
4. **Fulfilment:** pickup scheduling and routing if density supports it. No owned fleet is assumed.
5. **Reuse/repair paths:** item passports, repair quotes, refurbished product transparency, and donation options from the earlier concept once the primary marketplace works.
6. **Language and access:** Hindi and relevant local-language support, low-bandwidth flow, and assisted/WhatsApp entry after user research.

## 17. Decisions to make before coding

| Decision | Recommended default for the hackathon | Owner/evidence needed |
| --- | --- | --- |
| Pilot locality | One neighbourhood/campus the team can realistically serve | Team chooses exact name and coverage boundary |
| Buyer authenticity | Prefer real buyer permission and rates; else labelled demo buyers | At least one buyer conversation per category |
| Microwave tier | One named model or tightly defined class, seller-declared working | Buyer confirms a per-item maximum for that tier |
| Rate expiry | Buyer enters an expiry; no indefinite active rates | Buyer/admin |
| Pickup fee and minimum | Required fields, including explicit zero | Buyer |
| Auth and hosting | Managed auth/database/storage if already available | Team credentials and deployment access |
| Vision provider | One provider with image input and structured response | Team API access and cost |
| Cline SDK provider | Server-side configured provider and current supported SDK version | Team API access; verify docs at build time |
| Real-world transaction claim | No completed-sale claim until actual pickup/payment recorded | Product/demo copy review |

## 18. Source register and evidence standards

**Primary project sources:** [hackathon brief](./Cline_AI_Builder_Hackathon_PS.pdf), [earlier municipal concept](./municipal_waste_management_concept.md), [original ReValue concept](./revalue_ai_product_concept.md), and the team's latest product direction: photo and details → buyer-rate quote → Cline SDK explanation → capped listing → buyer request.

**External sources checked 10 October 2026:** [ScrapUncle](https://scrapuncle.com/rates), [The Kabadiwala](https://www.thekabadiwala.com/scrap-rates), [OLX](https://www.olx.in/en-in/sell), [Cashify](https://www.cashify.in/sell-old-mobile-phone), [Cline SDK README](https://github.com/cline/cline/blob/main/sdk/README.md), [Cline SDK tools](https://github.com/cline/cline/blob/main/docs/sdk/tools.mdx), [CPCB waste-tyre FAQ](https://cpcb.nic.in/uploads/Projects/Waste-Tyre/FAQ_Waste_Tyre.pdf), [MoEFCC rules list](https://moef.gov.in/rules-regulations-3), and [MeitY DPDP rules page](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025).

Public competitor rate pages are **market context**, not ReValue buyer rates. The ₹12/kg example is hypothetical. Any price shown in the actual product must be traced to a participating buyer's current rate or explicitly marked as simulated. The document does not establish commercial partnerships, live service coverage, or legal compliance.
