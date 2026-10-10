"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  completionSchema,
  draftSchema,
  reviewIssues,
  type Completion,
  type Draft,
  type Mode,
} from "@/lib/assistant-contract";
import { categoryQuestions, eligiblePreviewListings } from "@/lib/preview-data";
import { ListingCard } from "./cards";
import { Icon } from "./icons";
import { useWorkspace } from "./workspace";
const modeInfo = {
  sell: {
    label: "Sell an item",
    title: "Let’s give it a second life.",
    intro:
      "Describe your item and its condition. Every suggestion stays editable.",
    start:
      "What are you selling? Mention its age, defects and what is included.",
    placeholder: "I have a working phone, bought 18 months ago…",
  },
  find: {
    label: "Find an item",
    title: "A good find starts with you.",
    intro: "Set your requirements, then explore matching preview items.",
    start:
      "What are you looking for? Set a budget, pickup area and the specifications that matter.",
    placeholder: "A working phone under ₹8,000, less than 2 years old…",
  },
  wanted: {
    label: "Post a need",
    title: "Tell us what would work.",
    intro: "Prepare a clear request so the right seller can find you.",
    start:
      "What do you need? Tell us your budget, quantity or phone specifications, and pickup area.",
    placeholder: "I need 10 kg of dry newspaper in Pune, up to ₹150…",
  },
};
type ChatMessage = {
  role: "user" | "assistant";
  text: string;
  source?: "ai" | "manual";
};
const fieldLabels: Record<keyof Draft, string> = {
  category: "Category",
  title: "Title",
  description: "Description",
  location: "Pickup area",
  condition: "Condition",
  ageMonths: "Age in months",
  purchaseDate: "Purchase date",
  repairs: "Repairs",
  accessories: "Accessories",
  quantityKg: "Weight in kg",
  storageGb: "Storage in GB",
  cameraMp: "Camera in MP",
  batteryMah: "Battery capacity in mAh",
  batteryHealthPercent: "Battery health in %",
  maxPrice: "Maximum total budget",
};
function AssistantSession({ mode }: { mode: Mode }) {
  const { profile, getDraft, setDraft } = useWorkspace();
  const draft = getDraft(mode);
  const info = modeInfo[mode];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiState, setAiState] = useState<"idle" | "ai" | "manual">("idle");
  const [suggestion, setSuggestion] = useState<Completion | null>(null);
  const [notice, setNotice] = useState("");
  const [searched, setSearched] = useState(false);
  const [resultIds, setResultIds] = useState<string[] | null>(null);
  const [photos, setPhotos] = useState<{ name: string; url: string }[]>([]);
  const [receipt, setReceipt] = useState("");
  const controller = useRef<AbortController | null>(null);
  const photoUrls = useRef<string[]>([]);
  const dialog = useRef<HTMLDialogElement>(null);
  const conversation = useRef<HTMLDivElement>(null);
  useEffect(
    () => () => {
      controller.current?.abort();
      photoUrls.current.forEach((url) => URL.revokeObjectURL(url));
    },
    [],
  );
  useEffect(() => {
    if (conversation.current)
      conversation.current.scrollTop = conversation.current.scrollHeight;
  }, [messages.length, busy]);
  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft(mode, { ...draft, [key]: value });
    setSuggestion(null);
    setSearched(false);
    setNotice("");
  }
  function switchCategory(category: Draft["category"]) {
    setDraft(mode, {
      ...draft,
      category,
      condition: "unknown",
      ageMonths: null,
      quantityKg: null,
      storageGb: null,
      cameraMp: null,
      batteryMah: null,
      batteryHealthPercent: null,
    });
    setSuggestion(null);
    setSearched(false);
  }
  async function send(event: React.FormEvent) {
    event.preventDefault();
    const text = message.trim();
    if (!text || busy) return;
    const parsed = draftSchema.safeParse(draft);
    if (!parsed.success) {
      setNotice("Check the form fields before asking the assistant.");
      return;
    }
    const history = messages
      .slice(-8)
      .map(({ role, text }) => ({ role, text }));
    setMessages((previous) => [...previous, { role: "user", text }]);
    setMessage("");
    setBusy(true);
    setSuggestion(null);
    setNotice("");
    const abortController = new AbortController();
    controller.current = abortController;
    const timer = setTimeout(() => abortController.abort(), 25000);
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          draft: parsed.data,
          message: text,
          history,
        }),
        signal: abortController.signal,
      });
      const data = await response.json();
      if (response.ok && data.mode === "ai") {
        const completion = completionSchema.parse(data.completion);
        if (mode === "find") {
          setResultIds(completion.resultIds);
          setSearched(true);
        }
        setSuggestion(completion);
        setAiState("ai");
        setMessages((previous) => [
          ...previous,
          { role: "assistant", text: completion.message, source: "ai" },
        ]);
      } else {
        setAiState("manual");
        setMessages((previous) => [
          ...previous,
          {
            role: "assistant",
            text:
              data.message ??
              data.error ??
              "AI is unavailable. Continue with the editable form; your facts are preserved.",
            source: "manual",
          },
        ]);
      }
    } catch {
      if (
        !abortController.signal.aborted ||
        controller.current === abortController
      ) {
        setAiState("manual");
        setMessages((previous) => [
          ...previous,
          {
            role: "assistant",
            text: "AI is unavailable or timed out. Continue with the form; your draft is preserved.",
            source: "manual",
          },
        ]);
      }
    } finally {
      clearTimeout(timer);
      setBusy(false);
    }
  }
  function applySuggestion() {
    if (!suggestion) return;
    const next = draftSchema.safeParse({ ...draft, ...suggestion.patch });
    if (!next.success) {
      setNotice("The suggestion was invalid. Your draft has not changed.");
      return;
    }
    setDraft(mode, next.data);
    setSuggestion(null);
    setSearched(false);
    setNotice("Suggestion applied to your editable draft. Review every fact.");
  }
  function review() {
    const parsed = draftSchema.safeParse(draft);
    if (!parsed.success) {
      setNotice("Check the number ranges and date format in your draft.");
      return;
    }
    const issues = reviewIssues(mode, parsed.data);
    if (issues.length) {
      setNotice(issues.join(" "));
      return;
    }
    dialog.current?.showModal();
  }
  function previewSearch() {
    if (!draftSchema.safeParse(draft).success) {
      setNotice("Check the form fields before searching.");
      return;
    }
    setResultIds(null);
    setSearched(true);
    setNotice("");
  }
  function choosePhotos(files: FileList | null) {
    if (!files) return;
    const list = [...files];
    if (
      list.length > 3 ||
      list.some(
        (file) =>
          !["image/jpeg", "image/png"].includes(file.type) ||
          file.size > 5 * 1024 * 1024,
      )
    ) {
      setNotice("Choose up to 3 JPEG/PNG photos, each no larger than 5 MB.");
      return;
    }
    photoUrls.current.forEach((url) => URL.revokeObjectURL(url));
    const next = list.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    photoUrls.current = next.map((item) => item.url);
    setPhotos(next);
    setNotice("");
  }
  function numberField(
    key:
      | "ageMonths"
      | "quantityKg"
      | "storageGb"
      | "cameraMp"
      | "batteryMah"
      | "batteryHealthPercent"
      | "maxPrice",
    label: string,
    help?: string,
  ) {
    return (
      <label className="field" key={key}>
        <span>{label}</span>
        <input
          type="number"
          min={
            key === "quantityKg" ||
            key === "storageGb" ||
            key === "cameraMp" ||
            key === "batteryMah"
              ? "0.01"
              : "0"
          }
          max={key === "batteryHealthPercent" ? "100" : undefined}
          step={key === "ageMonths" ? "1" : "any"}
          value={draft[key] ?? ""}
          placeholder="Unknown / not set"
          onChange={(event) =>
            update(
              key,
              event.target.value === "" ? null : Number(event.target.value),
            )
          }
        />
        {help && <small>{help}</small>}
      </label>
    );
  }
  const results = searched
    ? eligiblePreviewListings(draft).filter(
        (item) => resultIds === null || resultIds.includes(item.id),
      )
    : [];
  return (
    <>
      <div className="page-heading assistant-heading">
        <div className="eyebrow">YOUR REVALUE ASSISTANT</div>
        <h1>{info.title}</h1>
        <p>{info.intro}</p>
      </div>
      <div className="mode-tabs" aria-label="Assistant mode">
        {(Object.keys(modeInfo) as Mode[]).map((value) => (
          <Link
            key={value}
            href={"/assistant?mode=" + value}
            className={mode === value ? "mode-tab selected" : "mode-tab"}
            aria-current={mode === value ? "page" : undefined}
          >
            {modeInfo[value].label}
          </Link>
        ))}
      </div>
      <div className="assistant-grid">
        <section className="chat-panel" aria-label="Conversation">
          <div className="panel-heading">
            <span className="assistant-avatar">
              <Icon name="spark" size={22} />
            </span>
            <div>
              <h2>Your thoughtful assistant</h2>
              <p>
                {busy
                  ? "Checking with Cline SDK…"
                  : aiState === "ai"
                    ? "Cline SDK · last response live"
                    : aiState === "manual"
                      ? "Manual mode · AI unavailable"
                      : "Form ready · AI checked when you send"}
              </p>
            </div>
            <span className={"ai-status " + (aiState === "ai" ? "ready" : "")}>
              {busy ? "Working" : aiState === "ai" ? "AI" : "Manual"}
            </span>
          </div>
          <div
            className="conversation"
            ref={conversation}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            <div className="chat-bubble guide">
              <span className="bubble-label">GETTING STARTED · FORM GUIDE</span>
              <p>{info.start}</p>
              <small>
                Use the form anytime. Photos and receipts stay in this browser
                preview; they are not sent to AI.
              </small>
            </div>
            {messages.map((item, index) => (
              <div className={"chat-bubble " + item.role} key={index}>
                <span className="bubble-label">
                  {item.role === "user"
                    ? profile.name
                    : item.source === "ai"
                      ? "CLINE SDK RESPONSE"
                      : "MANUAL MODE"}
                </span>
                <p>{item.text}</p>
              </div>
            ))}
            {busy && (
              <div className="working" role="status">
                <span className="status-dot" />
                Working on your message…
              </div>
            )}
            {suggestion && Object.keys(suggestion.patch).length > 0 && (
              <div className="suggestion">
                <strong>Review suggested changes</strong>
                <dl>
                  {Object.entries(suggestion.patch).map(([key, value]) => (
                    <div key={key}>
                      <dt>{fieldLabels[key as keyof Draft]}</dt>
                      <dd>
                        {value === null || value === ""
                          ? "Unknown / clear"
                          : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="button-row">
                  <button
                    className="button primary small"
                    onClick={applySuggestion}
                  >
                    Apply to draft
                  </button>
                  <button
                    className="button secondary small"
                    onClick={() => setSuggestion(null)}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
          <form className="chat-composer" onSubmit={send}>
            <label className="sr-only" htmlFor="message">
              Message the assistant
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              maxLength={2000}
              rows={3}
              placeholder={info.placeholder}
              disabled={busy}
            />
            <div className="composer-footer">
              <small>
                {message.length}/2000 · Suggestions need your review
              </small>
              <button
                type="submit"
                className="button primary small"
                disabled={busy || !message.trim()}
              >
                <Icon name="arrow" size={17} />
                <span className="sr-only">Send message</span>
              </button>
            </div>
          </form>
        </section>
        <section className="draft-panel" aria-label="Editable draft">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">YOU’RE IN CONTROL</span>
              <h2>
                {mode === "sell"
                  ? "Your item draft"
                  : mode === "find"
                    ? "Your search requirements"
                    : "Your wanted draft"}
              </h2>
            </div>
            <span className="evidence-tag">Editable</span>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (mode === "find") previewSearch();
              else review();
            }}
          >
            <fieldset disabled={busy} className="draft-fields">
              <label className="field">
                <span>Category</span>
                <select
                  value={draft.category}
                  onChange={(event) =>
                    switchCategory(event.target.value as Draft["category"])
                  }
                >
                  <option value="phone">Phone</option>
                  <option value="newspaper">Newspaper</option>
                </select>
              </label>
              {mode !== "find" && (
                <label className="field">
                  <span>
                    {mode === "sell" ? "Listing title" : "Request title"}
                  </span>
                  <input
                    maxLength={120}
                    value={draft.title}
                    placeholder={
                      draft.category === "phone"
                        ? "e.g. Working phone, 128 GB"
                        : "e.g. 10 kg of clean newspaper"
                    }
                    onChange={(event) => update("title", event.target.value)}
                  />
                </label>
              )}
              <label className="field">
                <span>General pickup area</span>
                <input
                  maxLength={100}
                  value={draft.location}
                  placeholder="e.g. Pune"
                  onChange={(event) => update("location", event.target.value)}
                />
                <small>
                  Use a city or neighbourhood, without a private address.
                </small>
              </label>
              <label className="field">
                <span>
                  {mode === "sell"
                    ? "Declared condition"
                    : "Required condition"}
                </span>
                <select
                  value={draft.condition}
                  onChange={(event) =>
                    update(
                      "condition",
                      event.target.value as Draft["condition"],
                    )
                  }
                >
                  <option value="unknown">
                    {mode === "sell"
                      ? "Unknown — tell us more"
                      : "No condition requirement"}
                  </option>
                  {draft.category === "phone" ? (
                    <>
                      <option value="working">Working</option>
                      <option value="nonworking">Non-working</option>
                    </>
                  ) : (
                    <option value="recyclable">
                      Recyclable — describe dryness & sorting
                    </option>
                  )}
                </select>
              </label>
              {draft.category === "newspaper" ? (
                numberField(
                  "quantityKg",
                  mode === "sell"
                    ? "Measured weight (kg)"
                    : "Minimum weight from one seller (kg)",
                  "Enter weight yourself. A photo cannot establish kg.",
                )
              ) : (
                <div className="field-grid">
                  {numberField(
                    "ageMonths",
                    mode === "sell" ? "Age (months)" : "Maximum age (months)",
                  )}
                  {numberField(
                    "storageGb",
                    mode === "sell" ? "Storage (GB)" : "Minimum storage (GB)",
                  )}
                  {numberField(
                    "cameraMp",
                    mode === "sell" ? "Camera (MP)" : "Minimum camera (MP)",
                  )}
                  {numberField(
                    "batteryMah",
                    mode === "sell"
                      ? "Capacity (mAh)"
                      : "Minimum capacity (mAh)",
                    "Capacity does not establish runtime.",
                  )}
                  {numberField(
                    "batteryHealthPercent",
                    mode === "sell"
                      ? "Measured health (%)"
                      : "Minimum measured health (%)",
                    "Leave blank when unmeasured.",
                  )}
                </div>
              )}
              {mode !== "sell" &&
                numberField(
                  "maxPrice",
                  "Maximum total budget (₹)",
                  "All entered numeric requirements are hard filters. Unknown facts cannot pass them.",
                )}
              {mode === "sell" && (
                <>
                  <div className="field-grid">
                    <label className="field">
                      <span>Purchase date (optional)</span>
                      <input
                        type="date"
                        value={draft.purchaseDate}
                        onChange={(event) =>
                          update("purchaseDate", event.target.value)
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Included accessories</span>
                      <input
                        maxLength={500}
                        value={draft.accessories}
                        placeholder="Charger, box, or none"
                        onChange={(event) =>
                          update("accessories", event.target.value)
                        }
                      />
                    </label>
                  </div>
                  <label className="field">
                    <span>Repair history (include unknowns)</span>
                    <input
                      maxLength={1000}
                      value={draft.repairs}
                      placeholder="What was repaired, and when?"
                      onChange={(event) =>
                        update("repairs", event.target.value)
                      }
                    />
                  </label>
                </>
              )}
              <label className="field">
                <span>
                  {mode === "sell"
                    ? "Condition details & defects"
                    : "Other preferences / notes"}
                </span>
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={draft.description}
                  placeholder={
                    mode === "sell"
                      ? "Be clear about scratches, faults, repairs, or mixed material…"
                      : "Preferences can be discussed. Unstructured notes are not enforced as filters in B1."
                  }
                  onChange={(event) =>
                    update("description", event.target.value)
                  }
                />
              </label>
              {mode === "sell" && (
                <>
                  <div className="attachments">
                    <label className="field">
                      <span>
                        Item photos <small>Optional · local preview</small>
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png"
                        multiple
                        onChange={(event) => choosePhotos(event.target.files)}
                      />
                      <small>
                        Up to 3 JPEG/PNG images, 5 MB each. No AI vision or
                        upload in B1.
                      </small>
                    </label>
                    {photos.length > 0 && (
                      <div className="photo-previews">
                        {photos.map((photo) => (
                          <Image
                            src={photo.url}
                            alt={"Local preview: " + photo.name}
                            key={photo.url}
                            width={90}
                            height={90}
                            unoptimized
                          />
                        ))}
                        <button
                          type="button"
                          className="text-link"
                          onClick={() => {
                            photoUrls.current.forEach((url) =>
                              URL.revokeObjectURL(url),
                            );
                            photoUrls.current = [];
                            setPhotos([]);
                          }}
                        >
                          Remove photos
                        </button>
                      </div>
                    )}
                    <label className="field">
                      <span>
                        Private bill / receipt <small>Optional</small>
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (
                            file &&
                            (![
                              "image/jpeg",
                              "image/png",
                              "application/pdf",
                            ].includes(file.type) ||
                              file.size > 5 * 1024 * 1024)
                          ) {
                            setReceipt("");
                            event.target.value = "";
                            setNotice(
                              "Receipt must be JPEG, PNG or PDF, no larger than 5 MB.",
                            );
                            return;
                          }
                          setReceipt(file?.name ?? "");
                        }}
                      />
                      <small>
                        {receipt
                          ? "Selected locally: " +
                            receipt +
                            ". File contents are not uploaded or shared."
                          : "Never publish a bill with your address or personal information."}
                      </small>
                    </label>
                  </div>
                  <div className="price-placeholder">
                    <Icon name="spark" size={18} />
                    <div>
                      <strong>Price review comes next</strong>
                      <p>
                        Person A’s quote API will calculate the cap. No AI or
                        sample market price is used for this draft.
                      </p>
                    </div>
                  </div>
                </>
              )}
              <details className="question-guide">
                <summary>Useful details to include</summary>
                <ul>
                  {categoryQuestions[draft.category].map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
              </details>
              {notice && (
                <div className="form-notice" role="status">
                  {notice}
                </div>
              )}
              <button
                type="submit"
                className="button primary full"
                disabled={busy}
              >
                {mode === "find" ? "Search preview inventory" : "Review draft"}
                <Icon name="arrow" size={17} />
              </button>
              <small className="form-footnote">
                {mode === "find"
                  ? "Searches fictional B1 fixtures only."
                  : "Review is available. Publication awaits the backend."}{" "}
                Drafts stay in memory for this demo profile until refresh.
              </small>
            </fieldset>
          </form>
        </section>
      </div>
      {searched && (
        <section className="section">
          <div className="section-heading">
            <div>
              <div className="eyebrow">PREVIEW SEARCH RESULTS</div>
              <h2>
                {results.length
                  ? results.length +
                    " sample " +
                    (results.length === 1 ? "item fits" : "items fit")
                  : "No sample items meet every filter"}
              </h2>
              <p>
                Results use your current form. Apply suggested changes, then
                search again. Notes and real-world condition need confirmation.
              </p>
            </div>
          </div>
          {results.length ? (
            <div className="listings-grid">
              {results.map((item) => (
                <ListingCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Icon name="grid" size={30} />
              <p>
                Try adjusting your form, or prepare a wanted request. We keep
                every hard requirement you entered.
              </p>
              <Link className="text-link" href="/assistant?mode=wanted">
                Prepare a wanted request →
              </Link>
            </div>
          )}
        </section>
      )}
      <dialog
        className="review-dialog"
        ref={dialog}
        aria-labelledby="review-title"
      >
        <div className="eyebrow">HUMAN REVIEW</div>
        <h2 id="review-title">
          {mode === "sell"
            ? "Review your item draft"
            : "Review your wanted request"}
        </h2>
        <p>
          These facts are declarations. Nothing has been independently verified
          or published.
        </p>
        <dl className="review-facts">
          {Object.entries(draft)
            .filter(
              ([key, value]) =>
                (key !== "maxPrice" || mode !== "sell") &&
                value !== "" &&
                value !== null,
            )
            .map(([key, value]) => (
              <div key={key}>
                <dt>{fieldLabels[key as keyof Draft]}</dt>
                <dd>{String(value)}</dd>
              </div>
            ))}
        </dl>
        {mode === "sell" && (
          <p className="info-note">
            {photos.length} local photo preview(s).{" "}
            {receipt
              ? "Private receipt selected locally."
              : "No receipt selected."}{" "}
            No validated price cap yet.
          </p>
        )}
        <div className="info-note">
          <strong>Publication is not available in B1.</strong>
          <p>
            Person A’s validated draft and{" "}
            {mode === "sell" ? "quote/publish" : "wanted publish"} endpoints
            must be connected first. No contact details will be shared
            automatically.
          </p>
        </div>
        <div className="button-row">
          <button
            className="button secondary"
            onClick={() => dialog.current?.close()}
          >
            Keep editing
          </button>
          <button
            className="button primary"
            disabled
            title="Waiting for Person A’s publication API"
          >
            Publish unavailable
          </button>
        </div>
      </dialog>
    </>
  );
}
export function Assistant({ mode }: { mode: Mode }) {
  const { profile } = useWorkspace();
  return <AssistantSession key={profile.id + ":" + mode} mode={mode} />;
}
