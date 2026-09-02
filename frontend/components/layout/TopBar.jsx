"use client";

import Link from "next/link";
import { Menu } from "lucide-react";

export default function TopBar({ title, subtitle }) {
  return (
    <header className="border-b border-border bg-paper/90 backdrop-blur sticky top-0 z-10 md:static">
      <div className="flex items-center justify-between px-5 py-4 md:px-8 md:py-6">
        <div className="flex items-center gap-3 md:hidden">
          <Menu size={20} />
          <Link href="/" className="font-display text-lg">Reentry</Link>
        </div>
        <div className="hidden md:block">
          {title && <h1 className="font-display text-2xl text-ink">{title}</h1>}
          {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
        </div>
      </div>
      {title && (
        <div className="px-5 pb-3 md:hidden">
          <h1 className="font-display text-xl text-ink">{title}</h1>
          {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
        </div>
      )}
    </header>
  );
}
