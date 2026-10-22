import Link from "next/link";

export default function NotFound() {
  return (
    <main className="nf wrap">
      <span className="label">Page not found</span>
      <h1 className="display nf__title">This page has moved on.</h1>
      <p className="nf__lead">It may have a new home in the Lishe Journal or Lishe Wellness.</p>
      <div className="nf__links label">
        <Link href="/journal">Lishe Journal →</Link>
        <Link href="/wellness">Lishe Wellness →</Link>
        <Link href="/">Home →</Link>
      </div>
    </main>
  );
}
