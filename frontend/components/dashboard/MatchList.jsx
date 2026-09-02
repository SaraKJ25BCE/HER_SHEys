"use client";

import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { MapPin, Clock, ExternalLink } from "lucide-react";

export function ReturnshipCard({ item }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-ink">{item.title}</h3>
          <p className="text-sm text-muted">{item.company}</p>
        </div>
        <Badge tone={item.matchScore >= 80 ? "sage" : item.matchScore >= 65 ? "accent" : "neutral"}>
          {item.matchScore}% match
        </Badge>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-muted">
        <span className="flex items-center gap-1"><MapPin size={13} /> {item.location}</span>
        <span className="flex items-center gap-1"><Clock size={13} /> {item.duration}</span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {item.stack.map((s) => (
          <Badge key={s} tone="primary">{s}</Badge>
        ))}
      </div>
      <p className="text-sm text-ink/80 border-t border-border pt-3 mt-1">{item.matchReason}</p>
    </Card>
  );
}

export function SchemeCard({ item }) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg text-ink">{item.name}</h3>
          <p className="text-sm text-muted">{item.provider}</p>
        </div>
        <Badge tone={item.matchScore >= 80 ? "sage" : "accent"}>{item.matchScore}% match</Badge>
      </div>
      <div className="text-sm text-ink/80 space-y-1">
        <p><span className="text-muted">Eligibility: </span>{item.eligibility}</p>
        <p><span className="text-muted">Benefit: </span>{item.benefit}</p>
      </div>
      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-primary hover:underline flex items-center gap-1 w-fit"
        >
          Scheme details <ExternalLink size={13} />
        </a>
      )}
    </Card>
  );
}
