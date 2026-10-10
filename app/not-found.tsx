import Link from "next/link";
export default function NotFound() {
  return (
    <div className="empty-state">
      <h1>This item isn’t in the preview.</h1>
      <p>Explore the sample inventory or prepare your own draft.</p>
      <Link className="button primary" href="/">
        Back to overview
      </Link>
    </div>
  );
}
