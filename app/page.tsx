import Link from "next/link";
import { Icon } from "@/components/icons";
import { ListingCard, NeedCard } from "@/components/cards";
import { previewListings, previewNeeds } from "@/lib/preview-data";
export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="eyebrow">
          <span className="status-dot" />A SECOND LIFE STARTS HERE
        </div>
        <h1>
          Make room.
          <br />
          <span>Make a difference.</span>
        </h1>
        <p>
          Turn things you no longer use into something
          <br className="desktop-break" /> someone else is looking for.
        </p>
        <div className="hero-illustration" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="hero-leaf">
            <Icon name="leaf" size={70} />
          </div>
          <span className="floating-chip chip-one">
            <Icon name="check" size={16} />
            Less waste
          </span>
          <span className="floating-chip chip-two">
            <Icon name="heart" size={16} />
            More value
          </span>
          <span className="hero-caption">PASS IT ON.</span>
        </div>
      </section>
      <section className="actions-grid" aria-label="Get started">
        <Link href="/assistant?mode=sell" className="action-card action-sell">
          <span className="action-icon">
            <Icon name="plus" size={24} />
          </span>
          <h2>I have something to sell</h2>
          <p>
            Describe it, share its condition,
            <br />
            and prepare an honest listing.
          </p>
          <span className="action-link">
            Start a seller draft
            <Icon name="arrow" size={18} />
          </span>
        </Link>
        <Link href="/assistant?mode=find" className="action-card">
          <span className="action-icon">
            <Icon name="grid" size={23} />
          </span>
          <h2>I’m looking for something</h2>
          <p>
            Tell us what matters to you.
            <br />
            Explore items that fit.
          </p>
          <span className="action-link">
            Find an item
            <Icon name="arrow" size={18} />
          </span>
        </Link>
        <Link href="/assistant?mode=wanted" className="action-card">
          <span className="action-icon">
            <Icon name="heart" size={23} />
          </span>
          <h2>Let sellers find me</h2>
          <p>
            Post what you need, from a phone
            <br />
            to a bundle of newspaper.
          </p>
          <span className="action-link">
            Prepare a request
            <Icon name="arrow" size={18} />
          </span>
        </Link>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">A LITTLE INSPIRATION</div>
            <h2>Ready for a second chapter</h2>
          </div>
          <Link href="/marketplace" className="text-link">
            Browse preview
            <Icon name="arrow" size={17} />
          </Link>
        </div>
        <div className="listings-grid">
          {previewListings.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}
        </div>
      </section>
      <section className="section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">SOMEONE IS ALREADY LOOKING</div>
            <h2>Small requests. Real possibilities.</h2>
          </div>
          <Link href="/wanted" className="text-link">
            See wanted board
            <Icon name="arrow" size={17} />
          </Link>
        </div>
        <div className="needs-grid">
          {previewNeeds.map((need) => (
            <NeedCard key={need.id} need={need} />
          ))}
        </div>
      </section>
      <div className="trust-strip">
        <Icon name="check" size={22} />
        <div>
          <strong>Every detail helps someone decide.</strong>
          <p>
            Declared condition, clear defects, optional evidence. AI suggestions
            always come back to you for review.
          </p>
        </div>
      </div>
    </>
  );
}
