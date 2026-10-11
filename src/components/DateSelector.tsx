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
}

export function DateSelector({ id, label, value, onChange, min, error, disabled, hint }: Props) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div
        className={`mt-1.5 flex items-center gap-2.5 rounded-lg border bg-white px-3.5 py-3 transition-colors ${
          error ? "border-danger" : "border-line"
        } ${disabled ? "opacity-50" : "hover:border-brand-500"}`}
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
          className="w-full border-0 bg-transparent text-sm font-medium text-ink outline-none disabled:cursor-not-allowed"
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
