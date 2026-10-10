import Link from "next/link";
import { notFound } from "next/navigation";
import { ItemVisual } from "@/components/cards";
import { previewListings, money } from "@/lib/preview-data";
export default async function ListingDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = previewListings.find((listing) => listing.id === id);
  if (!item) notFound();
  const facts =
    item.category === "phone"
      ? [
          ["Condition", item.condition],
          ["Age", item.ageMonths + " months"],
          ["Storage", item.storageGb + " GB"],
          ["Camera", item.cameraMp + " MP"],
          ["Battery capacity", item.batteryMah + " mAh — runtime unknown"],
          ["Battery health", "Unknown / unmeasured"],
          ["Repair history", item.repairs],
          ["Accessories", item.accessories],
        ]
      : [
          ["Measured weight", item.quantityKg + " kg — seller-declared"],
          ["Material condition", "Dry and sorted — seller-declared"],
          ["Fulfilment", "One seller; no partial matching in prototype"],
        ];
  return (
    <>
      <Link className="text-link back-link" href="/marketplace">
        ← Back to marketplace
      </Link>
      <div className="detail-grid">
        <ItemVisual category={item.category} />
        <section className="detail-copy">
          <div className="eyebrow">
            SAMPLE LISTING · {item.location.toUpperCase()}
          </div>
          <h1>{item.title}</h1>
          <span className="evidence-tag">Seller-declared · unverified</span>
          <p className="detail-description">{item.description}</p>
          <div className="detail-price">
            <strong>{money(item.price)}</strong>
            <span>Fictional asking price · no validated market cap</span>
          </div>
          <div className="seller-row">
            <span className="avatar">
              {item.owner.slice(0, 2).toUpperCase()}
            </span>
            <div>
              <strong>{item.owner}</strong>
              <p>Demo profile · pickup in {item.location}</p>
            </div>
          </div>
          <button className="button primary full" disabled>
            Contact unavailable in preview
          </button>
          <small className="form-footnote">
            Matching and consent-based contact come with the backend.
          </small>
        </section>
      </div>
      <section className="section detail-section">
        <div className="section-heading">
          <h2>The details behind the item</h2>
          <span className="evidence-tag">Declaration, not verification</span>
        </div>
        <dl className="facts-grid">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        <div className="info-note">
          <strong>
            {item.receipt
              ? "Sample receipt availability declared"
              : "No receipt declared"}
          </strong>
          <p>
            {item.receipt
              ? "No actual bill exists in this fixture. In the finished flow, original bills stay private; availability alone does not prove authenticity or ownership."
              : "The seller’s description is a declaration. Ask for clarification before deciding."}{" "}
            Illustrations are not evidence of the item’s actual condition.
          </p>
        </div>
      </section>
    </>
  );
}
