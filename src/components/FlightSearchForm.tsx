import { useEffect, useState } from "react";
import { ArrowLeftRight, Loader2, Search, AlertCircle } from "lucide-react";
import type { CabinClass, SearchErrors, SearchQuery, TripType } from "../lib/types";
import { validateSearch, hasErrors } from "../lib/search";
import { todayKey } from "../lib/format";
import { LocationSelector } from "./LocationSelector";
import { DateSelector } from "./DateSelector";
import { PassengerSelector } from "./PassengerSelector";

interface Props {
  initialQuery: SearchQuery;
  onSearch: (query: SearchQuery) => void;
  loading: boolean;
}

export function FlightSearchForm({ initialQuery, onSearch, loading }: Props) {
  const [query, setQuery] = useState<SearchQuery>(initialQuery);
  const [errors, setErrors] = useState<SearchErrors>({});

  // Keep the form in sync when a destination card prepopulates a route.
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const today = todayKey();

  const set = <K extends keyof SearchQuery>(key: K, value: SearchQuery[K]) => {
    setQuery((q) => {
      const next = { ...q, [key]: value };
      if (key === "tripType" && value === "one-way") {
        next.returnDate = undefined;
      }
      if (key === "departDate" && typeof value === "string" && next.returnDate && next.returnDate < value) {
        next.returnDate = value;
      }
      return next;
    });
    setErrors((e) => ({ ...e, [key]: undefined, form: undefined }));
  };

  const swap = () => {
    setQuery((q) => ({ ...q, origin: q.destination, destination: q.origin }));
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateSearch(query);
    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    onSearch({
      ...query,
      returnDate: query.tripType === "round-trip" ? query.returnDate : undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label="Flight search"
      className="rounded-2xl border border-line bg-white p-4 shadow-panel sm:p-6"
    >
      {/* Trip type */}
      <div
        role="radiogroup"
        aria-label="Journey type"
        className="inline-flex rounded-lg border border-line bg-canvas p-1"
      >
        {(["one-way", "round-trip"] as TripType[]).map((t) => (
          <button
            key={t}
            type="button"
            role="radio"
            aria-checked={query.tripType === t}
            onClick={() => set("tripType", t)}
            className={`rounded-md px-4 py-1.5 text-sm font-semibold transition-colors ${
              query.tripType === t
                ? "bg-white text-ink shadow-card"
                : "text-muted hover:text-ink"
            }`}
          >
            {t === "one-way" ? "One-way" : "Round-trip"}
          </button>
        ))}
      </div>

      {/* Route + swap */}
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_auto_1fr]">
        <LocationSelector
          id="search-from"
          label="From"
          icon="from"
          value={query.origin}
          onChange={(code) => set("origin", code)}
          error={errors.origin}
          placeholder="Where from?"
        />
        <div className="flex items-end justify-center pb-1 max-lg:order-3">
          <button
            type="button"
            onClick={swap}
            aria-label="Swap origin and destination"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-muted shadow-card transition-colors hover:border-brand-500 hover:text-brand-600"
          >
            <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <LocationSelector
          id="search-to"
          label="To"
          icon="to"
          value={query.destination}
          onChange={(code) => set("destination", code)}
          error={errors.destination}
          placeholder="Where to?"
        />
      </div>

      {/* Dates + passengers + cabin */}
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <DateSelector
          id="search-depart"
          label="Depart"
          value={query.departDate}
          onChange={(v) => set("departDate", v)}
          min={today}
          error={errors.departDate}
        />
        <DateSelector
          id="search-return"
          label="Return"
          value={query.returnDate ?? ""}
          onChange={(v) => set("returnDate", v)}
          min={query.departDate || today}
          error={errors.returnDate}
          disabled={query.tripType === "one-way"}
          hint={query.tripType === "one-way" ? "One-way journey" : undefined}
        />
        <PassengerSelector
          adults={query.adults}
          children={query.children}
          onChange={(adults, children) => {
            setQuery((q) => ({ ...q, adults, children }));
            setErrors((e) => ({ ...e, passengers: undefined }));
          }}
          error={errors.passengers}
        />
        <div>
          <label htmlFor="search-cabin" className="field-label">
            Cabin
          </label>
          <select
            id="search-cabin"
            value={query.cabin}
            onChange={(e) => set("cabin", e.target.value as CabinClass)}
            className="mt-1.5 w-full rounded-lg border border-line bg-white px-3.5 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand-500"
          >
            <option value="Economy">Economy</option>
            <option value="Business">Business</option>
          </select>
        </div>
      </div>

      {/* Errors + submit */}
      {errors.form ? (
        <p role="alert" className="mt-3 flex items-center gap-2 text-sm font-medium text-danger">
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          {errors.form}
        </p>
      ) : null}

      <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          Sample fares for demonstration · not live prices · no booking is completed here
        </p>
        <button type="submit" disabled={loading} className="btn-primary px-8 py-3 text-base">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Searching sample fares…
            </>
          ) : (
            <>
              <Search className="h-4 w-4" aria-hidden="true" />
              Search flights
            </>
          )}
        </button>
      </div>
    </form>
  );
}
