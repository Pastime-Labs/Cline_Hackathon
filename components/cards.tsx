import Link from "next/link";
import { Icon } from "./icons";
import { money, type PreviewListing, previewNeeds } from "@/lib/preview-data";
export function ItemVisual({
  category,
  compact = false,
}: {
  category: string;
  compact?: boolean;
}) {
  return (
    <div
      className={
        "item-visual " +
        (category === "phone" ? "visual-phone" : "visual-paper") +
        (compact ? " compact" : "")
      }
      aria-hidden="true"
    >
      {category === "phone" ? (
        <div className="phone-object">
          <div className="phone-camera">
            <i />
            <i />
          </div>
          <div className="phone-screen">
            <div className="phone-orbit" />
          </div>
          <span />
        </div>
      ) : (
        <div className="paper-stack">
          <div />
          <div />
          <div className="paper-front">
            <b>THE DAILY</b>
            <span className="paper-line" />
            <div className="paper-columns">
              <i />
              <i />
              <i />
            </div>
            <span className="paper-line" />
            <span className="paper-line short" />
          </div>
          <span className="paper-string" />
        </div>
      )}
      <span className="visual-label">ILLUSTRATION · SAMPLE</span>
    </div>
  );
}
export function ListingCard({ item }: { item: PreviewListing }) {
  return (
    <Link href={"/marketplace/" + item.id} className="listing-card">
      <ItemVisual category={item.category} />
      <div className="listing-body">
        <div className="card-meta">
          <span>
            {item.category === "phone" ? "PRE-LOVED PHONE" : "RECYCLABLE"}
          </span>
          <span>{item.location}</span>
        </div>
        <h3>{item.title}</h3>
        <p>
          {item.category === "phone"
            ? item.ageMonths + " months old · " + item.condition
            : item.quantityKg + " kg · dry & sorted"}
        </p>
        <div className="card-price">
          <strong>{money(item.price)}</strong>
          <span>Sample asking price</span>
          <Icon name="arrow" size={18} />
        </div>
        <span className="evidence-tag">Seller-declared · preview</span>
      </div>
    </Link>
  );
}
export function NeedCard({ need }: { need: (typeof previewNeeds)[number] }) {
  return (
    <Link href={"/wanted/" + need.id} className="need-card">
      <div className="need-symbol">
        <Icon name={need.category === "phone" ? "phone" : "paper"} size={25} />
      </div>
      <div className="need-content">
        <div className="card-meta">
          <span>WANTED · SAMPLE REQUEST</span>
          <span>{need.location}</span>
        </div>
        <h3>{need.title}</h3>
        <p>{need.description}</p>
        <div className="need-bottom">
          <span>{need.owner} · Buyer demo</span>
          <strong>Up to {money(need.budget)}</strong>
        </div>
      </div>
      <Icon name="arrow" size={19} />
    </Link>
  );
}
