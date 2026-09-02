"use client";

import { useApp } from "@/context/AppContext";
import { InfoIcon } from "lucide-react";

export default function DataSourceNotice() {
  const { dataSourceNotice } = useApp();
  if (!dataSourceNotice) return null;

  return (
    <div className="flex items-start gap-2 text-sm bg-accent-light text-accent-dark border border-accent/30 rounded px-3 py-2 mb-5">
      <InfoIcon size={16} className="shrink-0 mt-0.5" />
      <span>{dataSourceNotice}</span>
    </div>
  );
}
