"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, FileUp, LayoutDashboard, Boxes, Compass, Users2 } from "lucide-react";
import { cx } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Home", icon: Home },
  { href: "/intake", label: "Intake", icon: FileUp },
  { href: "/dashboard", label: "Skill Dashboard", icon: LayoutDashboard },
  { href: "/sandbox", label: "Sandbox", icon: Boxes },
  { href: "/matches", label: "Matches", icon: Compass },
  { href: "/mentorship", label: "Mentorship", icon: Users2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:flex-col w-60 shrink-0 border-r border-border bg-paper min-h-screen sticky top-0">
      <div className="px-5 pt-6 pb-5">
        <Link href="/" className="flex items-baseline gap-1.5">
          <span className="font-display text-xl text-ink">Reentry</span>
        </Link>
        <p className="text-xs text-muted mt-1 leading-snug">
          Your career break is a thread, not a reset.
        </p>
      </div>
      <nav className="flex-1 px-3 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cx(
                "flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors",
                active ? "bg-primary-light text-primary-dark font-medium" : "text-muted hover:bg-sunk hover:text-ink"
              )}
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="px-5 py-5 border-t border-border">
        <p className="text-xs text-muted leading-relaxed">
          Sample schemes shown include WISE-KIRAN &amp; the Women Scientist Scheme.
        </p>
      </div>
    </aside>
  );
}
