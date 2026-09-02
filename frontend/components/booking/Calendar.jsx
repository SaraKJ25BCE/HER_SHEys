"use client";

import { useMemo, useState } from "react";
import { CalendarDays, Clock } from "lucide-react";
import { cx, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";

/**
 * Lightweight slot-picking "calendar" — groups a mentor's availability by
 * date so it reads like a schedule grid rather than a plain dropdown list.
 */
export default function Calendar({ mentor, onBook, booking }) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  const byDate = useMemo(() => {
    const map = {};
    for (const slot of mentor.availability) {
      map[slot.date] = map[slot.date] || [];
      map[slot.date].push(slot);
    }
    return map;
  }, [mentor]);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4 text-sm text-muted">
        <CalendarDays size={16} />
        <span>Pick a slot with {mentor.name.split(" ")[0]}</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {Object.entries(byDate).map(([date, slots]) => (
          <div key={date} className="border border-border rounded p-3">
            <p className="text-xs font-medium text-ink mb-2">{formatDate(date)}</p>
            <div className="flex flex-wrap gap-2">
              {slots.map((slot) => (
                <button
                  key={slot.slotId}
                  onClick={() => setSelectedSlot(slot)}
                  className={cx(
                    "text-xs px-2.5 py-1.5 rounded border flex items-center gap-1 transition-colors",
                    selectedSlot?.slotId === slot.slotId
                      ? "bg-primary text-white border-primary"
                      : "border-border text-ink hover:border-primary/50"
                  )}
                >
                  <Clock size={12} /> {slot.time}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Button
        className="mt-4"
        variant="accent"
        disabled={!selectedSlot || booking}
        onClick={() => selectedSlot && onBook(selectedSlot)}
      >
        {booking ? "Booking…" : selectedSlot ? `Book ${formatDate(selectedSlot.date)}, ${selectedSlot.time}` : "Select a slot"}
      </Button>
    </div>
  );
}
