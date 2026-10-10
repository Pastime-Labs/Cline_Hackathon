import Link from "next/link";
import { NeedCard } from "@/components/cards";
import { previewNeeds } from "@/lib/preview-data";
export default function Wanted() {
  return (
    <>
      <div className="page-heading">
        <div className="eyebrow">THE WANTED BOARD</div>
        <h1>Someone needs what you have.</h1>
        <p>
          Prepare a request so sellers know exactly what would work for you.
        </p>
      </div>
      <div className="toolbar">
        <span>2 sample requests · Preview only</span>
        <Link className="button primary" href="/assistant?mode=wanted">
          Prepare a request →
        </Link>
      </div>
      <div className="needs-grid">
        {previewNeeds.map((need) => (
          <NeedCard key={need.id} need={need} />
        ))}
      </div>
      <div className="info-note">
        <strong>Matching is coming with Person A’s backend.</strong>
        <p>
          The plan checks every hard requirement, then notifies both sides. Each
          person chooses whether to connect; contact details stay private until
          consent.
        </p>
      </div>
    </>
  );
}
