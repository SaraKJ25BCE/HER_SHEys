"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { initials } from "@/lib/utils";

export default function MentorCard({ mentor, selected, onSelect }) {
  return (
    <Card className={selected ? "border-primary ring-1 ring-primary" : ""}>
      <div className="flex items-start gap-3">
        <div className="w-11 h-11 rounded-full bg-primary-light text-primary-dark flex items-center justify-center font-medium shrink-0">
          {initials(mentor.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-lg text-ink leading-tight">{mentor.name}</h3>
              <p className="text-sm text-muted">{mentor.role} at {mentor.company}</p>
            </div>
            <Badge tone={mentor.matchScore >= 80 ? "sage" : "accent"}>{mentor.matchScore}%</Badge>
          </div>
          <p className="text-sm text-ink/80 mt-2 leading-relaxed">{mentor.bio}</p>
          <div className="flex flex-wrap gap-1.5 mt-3">
            {mentor.expertiseTags.map((t) => (
              <Badge key={t} tone="primary">{t}</Badge>
            ))}
          </div>
          <Button
            variant={selected ? "primary" : "ghost"}
            size="sm"
            className="mt-4"
            onClick={() => onSelect(mentor)}
          >
            {selected ? "Viewing slots" : "View available slots"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
