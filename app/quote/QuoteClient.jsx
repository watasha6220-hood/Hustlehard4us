"use client";

import { useSearchParams } from "next/navigation";
import QuoteWizard from "@/components/QuoteWizard";

export default function QuoteClient() {
  const params = useSearchParams();
  const initialProduct = params.get("product") || "";
  return <QuoteWizard initialProduct={initialProduct} />;
}
