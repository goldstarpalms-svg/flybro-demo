import { RotateCcw } from "lucide-react";
import type { Filters, SampleFlight } from "../lib/types";
import { priceBounds, timeBucketOf } from "../lib/search";
import { formatNaira, formatDuration } from "../lib/format";
import { airlineByCode } from "../lib/airlines";

interface Props {
  flights: SampleFlight[];
  filters: Filters;
  onChange: (filters: Filters) => void;
  onReset: () => void;
}

const TIME_BUCKETS = [
  { id: "morning", label: "Morning", hint: "before 12:00" },
  { id: "afternoon", label: "Afternoon", hint: "12:00 – 17:00" },
  { id: "evening", label: "Evening", hint: "after 17:00" },
];

export function FlightFilters({ flights, filters, onChange, onReset }: Props) {
  const bounds = priceBounds(flights);
  const airlineCodes = Array.from(new Set(flights.map((f) => f.airlineCode))).sort();
  const maxDur = flights.reduce((m, f) => Math.max(m, f.durationMin), 0);

  const toggleAirline = (code: string) => {
    const has = filters.airlines.includes(code);
    onChange({
      ...filters,
      airlines: has ? filters.airlines.filter((c) => c !== code) : [...filters.airlines, code],
    });
  };

  const toggleTime = (id: string) => {
    const has = filters.timeBuckets.includes(id);
    onChange({
      ...filters,
      timeBuckets: has ? filters.timeBuckets.filter((t) => t !== id) : [...filters.timeBuckets, id],
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-ink">Filters</h3>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          Reset all
        </button>
      </div>

      {/* Price */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted">
          Max price (sample)
        </legend>
        <input
          type="range"
          min={bounds.min}
          max={bounds.max}
          step={500}
          value={filters.maxPrice ?? bounds.max}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChange({ ...filters, maxPrice: v >= bounds.max ? null : v });
          }}
          aria-label="Maximum price"
          className="mt-3 w-full accent-brand-600"
        />
        <div className="mt-1 flex justify-between text-xs text-muted">
          <span>{formatNaira(bounds.min)}</span>
          <span className="font-semibold text-ink">
            {filters.maxPrice == null ? "Any price" : `Up to ${formatNaira(filters.maxPrice)}`}
          </span>
        </div>
      </fieldset>

      {/* Airlines */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted">Airline</legend>
        <div className="mt-2.5 space-y-1.5">
          {airlineCodes.map((code) => (
            <label key={code} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={filters.airlines.includes(code)}
                onChange={() => toggleAirline(code)}
                className="h-4 w-4 rounded border-line accent-brand-600"
              />
              <span className="text-ink">{airlineByCode(code)?.name ?? code}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Departure time */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted">
          Departure time
        </legend>
        <div className="mt-2.5 space-y-1.5">
          {TIME_BUCKETS.map((b) => {
            const count = flights.filter((f) => timeBucketOf(f) === b.id).length;
            return (
              <label key={b.id} className="flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={filters.timeBuckets.includes(b.id)}
                  onChange={() => toggleTime(b.id)}
                  className="h-4 w-4 rounded border-line accent-brand-600"
                />
                <span className="flex-1 text-ink">{b.label}</span>
                <span className="text-xs text-muted">
                  {b.hint} · {count}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Stops */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted">Stops</legend>
        <div className="mt-2.5 space-y-1.5">
          {(
            [
              ["any", "Any"],
              ["nonstop", "Nonstop only"],
              ["one-stop", "1 stop only"],
            ] as const
          ).map(([id, label]) => (
            <label key={id} className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="radio"
                name="stops-filter"
                checked={filters.stops === id}
                onChange={() => onChange({ ...filters, stops: id })}
                className="h-4 w-4 border-line accent-brand-600"
              />
              <span className="text-ink">{label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Duration */}
      <fieldset>
        <legend className="text-xs font-semibold uppercase tracking-wide text-muted">
          Max duration
        </legend>
        <input
          type="range"
          min={30}
          max={Math.max(maxDur, 120)}
          step={15}
          value={filters.maxDurationMin ?? Math.max(maxDur, 120)}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChange({ ...filters, maxDurationMin: v >= Math.max(maxDur, 120) ? null : v });
          }}
          aria-label="Maximum duration in minutes"
          className="mt-3 w-full accent-brand-600"
        />
        <div className="mt-1 text-xs text-muted">
          <span className="font-semibold text-ink">
            {filters.maxDurationMin == null
              ? "Any duration"
              : `Up to ${formatDuration(filters.maxDurationMin)}`}
          </span>
        </div>
      </fieldset>
    </div>
  );
}
