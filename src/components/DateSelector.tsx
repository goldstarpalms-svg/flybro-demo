import { CalendarDays } from "lucide-react";

interface Props {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  min: string;
  error?: string;
  disabled?: boolean;
  hint?: string;
  /** Renders without an outer border (used inside grouped panels). */
  bare?: boolean;
}

export function DateSelector({ id, label, value, onChange, min, error, disabled, hint, bare }: Props) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div
        className={`mt-1.5 flex items-center gap-2.5 rounded-lg px-2.5 py-2.5 transition-colors ${
          bare ? "border border-transparent bg-canvas" : "border border-line bg-white"
        } ${error ? "!border-danger" : ""} ${disabled ? "opacity-50" : "hover:bg-white"}`}
      >
        <CalendarDays className="h-[18px] w-[18px] shrink-0 text-muted" aria-hidden="true" />
        <input
          id={id}
          type="date"
          value={value}
          min={min}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-w-0 border-0 bg-transparent text-sm font-medium text-ink outline-none disabled:cursor-not-allowed"
        />
      </div>
      {error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
