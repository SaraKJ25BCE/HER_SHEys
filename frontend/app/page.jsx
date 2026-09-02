import Link from "next/link";
import { FileUp, LayoutDashboard, Boxes, Compass, Users2, ArrowRight } from "lucide-react";
import Sidebar from "@/components/layout/Sidebar";
import Button from "@/components/ui/Button";

const JOURNEY = [
  {
    icon: FileUp,
    title: "Tell us where you stand",
    body: "Upload a résumé or fill a two-minute form — no need to make old skills sound impressive.",
  },
  {
    icon: LayoutDashboard,
    title: "See the real gap",
    body: "Legacy skills mapped against what your target role actually uses today, side by side.",
  },
  {
    icon: Boxes,
    title: "Close it in 5 days",
    body: "A Micro-Returnship Sandbox bridges your old stack to the current one — with a real deliverable, not a course certificate.",
  },
  {
    icon: Compass,
    title: "Get matched",
    body: "Returnships and government schemes like WISE-KIRAN, scored against the skills you just proved you have.",
  },
  {
    icon: Users2,
    title: "Talk to someone who's done it",
    body: "Book a mentor who returned from a similar break, straight from your match list.",
  },
];

export default function HomePage() {
  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <main className="flex-1 min-w-0">
        {/* Hero */}
        <section className="px-6 md:px-14 pt-16 pb-14 max-w-3xl">
          <p className="text-sm text-accent-dark font-medium mb-4">For women rebuilding a STEM career</p>
          <h1 className="font-display text-4xl md:text-5xl leading-[1.12] text-ink">
            Your career break is a thread that continues —
            <span className="italic"> not a line you start over.</span>
          </h1>
          <p className="mt-6 text-lg text-muted max-w-prose leading-relaxed">
            Reentry turns "you're outdated" into a five-day project you can point to. One guided
            path from a skills check to a matched returnship, a government scheme, and a mentor —
            instead of scattered research across a dozen tabs.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button as={Link} href="/intake" variant="primary" size="lg">
              Start your re-entry <ArrowRight size={16} />
            </Button>
            <Button as={Link} href="/dashboard" variant="ghost" size="lg">
              See a sample dashboard
            </Button>
          </div>
        </section>

        {/* Journey thread — this content is a genuine sequence, so the numbered
            connector line is earned here rather than decorative. */}
        <section className="px-6 md:px-14 pb-16 max-w-3xl">
          <h2 className="font-display text-2xl text-ink mb-8">The path back, in five steps</h2>
          <ol className="thread space-y-8">
            {JOURNEY.map(({ icon: Icon, title, body }, idx) => (
              <li key={title} className="relative pl-11">
                <span className="absolute left-0 top-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                  <Icon size={15} />
                </span>
                <h3 className="font-medium text-ink">{title}</h3>
                <p className="text-sm text-muted mt-1 leading-relaxed max-w-prose">{body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* USP callout */}
        <section className="px-6 md:px-14 pb-20 max-w-3xl">
          <div className="border border-border rounded-lg p-7 bg-sunk/60">
            <p className="text-xs font-medium text-accent-dark mb-2">The Confidence-to-Code Bridge</p>
            <p className="font-display text-xl text-ink leading-snug">
              "You don't know Docker" isn't useful. A five-day project that takes your 2018 SQL +
              Excel stack and rebuilds it on Snowflake with a GenAI API call — that's proof you can
              show, not a gap you have to explain away.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
