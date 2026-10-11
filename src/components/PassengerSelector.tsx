import { useEffect, useRef, useState } from "react";
import { Minus, Plus, Users, X } from "lucide-react";

interface Props {
  adults: number;
  children: number;
  onChange: (adults: number, children: number) => void;
  error?: string;
  /** Renders without an outer border (used inside grouped panels). */
  bare?: boolean;
}

function Stepper({
  label,
  hint,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="block text-xs text-muted">{hint}</span>
      </span>
      <span className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-brand-500 hover:text-brand-600 disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span aria-live="polite" className="w-5 text-center text-sm font-bold text-ink">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-brand-500 hover:text-brand-600 disabled:opacity-40"
        >
          <Plus className="h-4 w-4" />
        </button>
      </span>
    </div>
  );
}

export function PassengerSelector({ adults, children, onChange, error, bare }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const total = adults + children;

  return (
    <div ref={rootRef} className="relative">
      <span className="field-label" id="pax-label">
        Passengers
      </span>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-labelledby="pax-label"
        onClick={() => setOpen((v) => !v)}
        className={`mt-1.5 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left transition-colors hover:bg-white ${
          bare ? "border border-transparent bg-canvas" : "border border-line bg-white"
        } ${error ? "!border-danger" : ""}`}
      >
        <Users className="h-[18px] w-[18px] shrink-0 text-muted" aria-hidden="true" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-semibold text-ink">
            {adults} Adult{adults === 1 ? "" : "s"}
            {children > 0 ? `, ${children} Child${children === 1 ? "" : "ren"}` : ""}
          </span>
          <span className="block truncate text-xs text-muted">
            {total} of 9 seats requested
          </span>
        </span>
      </button>
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-label="Passenger selection"
          className="absolute left-0 right-0 top-full z-40 mt-2 rounded-xl border border-line bg-white p-4 shadow-pop"
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-semibold text-ink">Passengers</span>
            <button
              type="button"
              aria-label="Close passenger selection"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-muted hover:bg-canvas hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <Stepper
            label="Adults"
            hint="12 years and above"
            value={adults}
            min={1}
            max={9}
            onChange={(v) => onChange(v, children)}
          />
          <Stepper
            label="Children"
            hint="2–11 years"
            value={children}
            min={0}
            max={6}
            onChange={(v) => onChange(adults, v)}
          />
          <button type="button" onClick={() => setOpen(false)} className="btn-primary mt-3 w-full">
            Done
          </button>
        </div>
      ) : null}
    </div>
  );
}
