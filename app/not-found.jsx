import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="eyebrow">404</p>
      <h1 className="heading-lg mb-4">This Page Went Missing</h1>
      <p className="mb-8 max-w-md text-zinc-400">
        Looks like this page got misprinted. Head back home or start a quote — we&apos;ll take care of the rest.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="btn-primary">Back Home</Link>
        <Link href="/quote" className="btn-secondary">Get a Quote</Link>
      </div>
    </section>
  );
}
