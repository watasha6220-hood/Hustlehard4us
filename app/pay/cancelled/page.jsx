import Link from "next/link";
import { site } from "@/data/site";

export const metadata = { title: "Payment Cancelled", robots: { index: false } };

export default function PayCancelledPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="card w-full max-w-xl p-10 text-center">
        <h1 className="heading-lg mb-3">No Worries</h1>
        <p className="mb-8 text-zinc-400">
          Your payment was cancelled — nothing was charged and your order request is still saved.
          Pay whenever you&apos;re ready, or call{" "}
          <a href={site.phoneHref} className="font-bold text-gold-400 hover:underline">{site.phone}</a>{" "}
          if you have questions about the price.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/" className="btn-primary">Back Home</Link>
          <Link href="/contact" className="btn-secondary">Contact Us</Link>
        </div>
      </div>
    </section>
  );
}
