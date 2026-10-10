import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { previewNeeds, money } from "@/lib/preview-data";
export default async function NeedDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const need = previewNeeds.find((request) => request.id === id);
  if (!need) notFound();
  return (
    <>
      <Link className="text-link back-link" href="/wanted">
        ← Back to wanted board
      </Link>
      <section className="wanted-detail">
        <span className="need-symbol">
          <Icon
            name={need.category === "phone" ? "phone" : "paper"}
            size={32}
          />
        </span>
        <div className="eyebrow">
          SAMPLE WANTED REQUEST · {need.location.toUpperCase()}
        </div>
        <h1>{need.title}</h1>
        <p>{need.description}</p>
        <div className="detail-price">
          <strong>Up to {money(need.budget)}</strong>
          <span>Total budget · buyer-declared</span>
        </div>
        <h2>What must fit</h2>
        <ul className="requirements">
          {need.requirements.map((requirement) => (
            <li key={requirement}>
              <Icon name="check" size={17} />
              {requirement}
            </li>
          ))}
        </ul>
        <div className="seller-row">
          <span className="avatar">{need.owner.slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>{need.owner}</strong>
            <p>Buyer demo · {need.location}</p>
          </div>
        </div>
        <div className="info-note">
          <strong>Both sides choose whether to connect.</strong>
          <p>
            Proactive match notifications and seller responses are pending
            Person A’s backend. No connection, reservation or disclosure happens
            in this preview.
          </p>
        </div>
        <button className="button primary" disabled>
          Respond unavailable in preview
        </button>
      </section>
    </>
  );
}
