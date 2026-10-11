import { useEffect, useRef, useState } from "react";
import { MapPin, Plane, PlaneTakeoff, Search, X } from "lucide-react";
import { AIRPORTS } from "../lib/airports";

interface Props {
  id: string;
  label: string;
  icon: "from" | "to";
  value: string;
  onChange: (code: string) => void;
  error?: string;
  placeholder: string;
}

export function LocationSelector({ id, label, icon, value, onChange, error, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (open) {
      setQuery("");
      inputRef.current?.focus();
    }
  }, [open]);

  const filtered = AIRPORTS.filter((a) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      a.city.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q)
    );
  });

  const selected = AIRPORTS.find((a) => a.code === value);
  const Icon = icon === "from" ? PlaneTakeoff : Plane;

  return (
    <div ref={rootRef} className="relative">
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-invalid={error ? true : undefined}
        aria-label={
          selected ? `${label}: ${selected.city}, ${selected.code}` : `${label}: ${placeholder}`
        }
        onClick={() => setOpen((v) => !v)}
        className={`mt-1.5 flex w-full items-center gap-2.5 rounded-lg border bg-white px-3.5 py-3 text-left transition-colors hover:border-brand-500 ${
          error ? "border-danger" : "border-line"
        }`}
      >
        <Icon className="h-4.5 w-4.5 shrink-0 text-muted" aria-hidden="true" style={{ height: 18, width: 18 }} />
        <span className="min-w-0 flex-1">
          {selected ? (
            <>
              <span className="block truncate text-sm font-semibold text-ink">{selected.city}</span>
              <span className="block truncate text-xs text-muted">
                {selected.code} · {selected.name}
              </span>
            </>
          ) : (
            <span className="block truncate text-sm text-muted">{placeholder}</span>
          )}
        </span>
        <MapPin className="h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      </button>
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}

      {open ? (
        <div className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-line bg-white shadow-pop">
          <div className="flex items-center gap-2 border-b border-line px-3 py-2.5">
            <Search className="h-4 w-4 text-muted" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded="true"
              aria-controls={`${id}-list`}
              aria-autocomplete="list"
              placeholder="City or airport code…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full border-0 bg-transparent text-sm outline-none placeholder:text-muted"
            />
            <button
              type="button"
              aria-label="Close airport list"
              onClick={() => setOpen(false)}
              className="rounded-md p-1 text-muted hover:bg-canvas hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul id={`${id}-list`} role="listbox" aria-label={label} className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-6 text-center text-sm text-muted">
                No airports match “{query}”. Try Lagos, Abuja, or a code like LOS.
              </li>
            ) : (
              filtered.map((a) => (
                <li key={a.code} role="option" aria-selected={a.code === value}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(a.code);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors hover:bg-brand-50 ${
                      a.code === value ? "bg-brand-50" : ""
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-medium text-ink">{a.city}</span>
                      <span className="block text-xs text-muted">{a.name}</span>
                    </span>
                    <span className="rounded-md bg-canvas px-2 py-0.5 text-xs font-semibold text-muted">
                      {a.code}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
