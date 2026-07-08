import { Suspense } from "react";
import SuccessClient from "./SuccessClient";

export const metadata = { title: "Payment Successful", robots: { index: false } };

export default function PaySuccessPage() {
  return (
    <Suspense fallback={<p className="py-24 text-center text-zinc-500">Confirming payment…</p>}>
      <SuccessClient />
    </Suspense>
  );
}
