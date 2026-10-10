import Link from "next/link";
import { ListingCard } from "@/components/cards";
import { previewListings } from "@/lib/preview-data";
export default function Marketplace() {
  return (
    <>
      <div className="page-heading">
        <div className="eyebrow">EXPLORE THE PREVIEW</div>
        <h1>Good finds, honest details.</h1>
        <p>
          Sample inventory for the B1 walkthrough. These are illustrations and
          fictional offers.
        </p>
      </div>
      <div className="toolbar">
        <span>3 preview items · Phones & newspaper</span>
        <Link className="button primary" href="/assistant?mode=find">
          Find with your requirements →
        </Link>
      </div>
      <div className="listings-grid">
        {previewListings.map((item) => (
          <ListingCard key={item.id} item={item} />
        ))}
      </div>
    </>
  );
}
