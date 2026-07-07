"use client";

import { useSearchParams } from "next/navigation";
import Print3DConfigurator from "@/components/Print3DConfigurator";

export default function Print3DClient() {
  const params = useSearchParams();
  return <Print3DConfigurator initialDesign={params.get("design") || ""} />;
}
