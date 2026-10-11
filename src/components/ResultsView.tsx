import { useMemo, useState } from "react";
import {
  ArrowLeft,
  SlidersHorizontal,
  AlertCircle,
  SearchX,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import type { Filters, SampleFlight, SearchQuery, SortOption } from "../lib/types";
import { EMPTY_FILTERS } from "../lib/types";
import {
  SORT_OPTIONS,
  sortFlights,
  filterFlights,
  activeFilterCount,
  priceBounds,
} from "../lib/search";
import { formatNaira, formatDateShort } from "../lib/format";
import { airportLabel } from "../lib/airports";
import { flightProvider } from "../lib/flightProvider";
import { FlightCard } from "./FlightCard";
import { FlightFilters } from "./FlightFilters";
import { FlightDetails } from "./FlightDetails";
import { BookingDemo } from "./BookingDemo";

interface Props {
  query: SearchQuery;
  outboundFlights: SampleFlight[];
  returnFlights: SampleFlight[] | null;
  loading: boolean;
  error: string | null;
  onModifySearch: () => void;
  onNewSearch: () => void;
}

function SkeletonCard() {
  return (
    <div className="card animate-pulse p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-line" />
        <div className="space-y-2">
          <div className="h-3 w-32 rounded bg-line" />
          <div className="h-2.5 w-20 rounded bg-line" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 items-center gap-4">
        <div className="h-10 rounded bg-line" />
        <div className="h-3 rounded bg-line" />
        <div className="h-10 rounded bg-line" />
      </div>
      <div className="mt-5 flex items-end justify-between">
        <div className="h-8 w-28 rounded bg-line" />
        <div className="h-10 w-36 rounded-lg bg-line" />
      </div>
    </div>
  );
}

export function ResultsView({
  query,
  outboundFlights,
  returnFlights,
  loading,
  error,
  onModifySearch,
  onNewSearch,
}: Props) {
  const [stage, setStage] = useState<"outbound" | "return">("outbound");
  const [selectedOutbound, setSelectedOutbound] = useState<SampleFlight | null>(null);
  const [sort, setSort] = useState<SortOption["id"]>("price");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [detailsFlight, setDetailsFlight] = useState<SampleFlight | null>(null);
  const [booking, setBooking] = useState<{ outbound: SampleFlight; returnFlight?: SampleFlight } | null>(
    null,
  );

  const isRoundTrip = query.tripType === "round-trip";
  const currentLegFlights =
    stage === "outbound" ? outboundFlights : (returnFlights ?? []);

  const filtered = useMemo(
    () => filterFlights(currentLegFlights, filters),
    [currentLegFlights, filters],
  );
  const sorted = useMemo(() => sortFlights(filtered, sort), [filtered, sort]);

  const bounds = priceBounds(currentLegFlights);
  const lowest = sorted.length > 0 ? Math.min(...sorted.map((f) => f.priceNGN)) : null;

  const cheapest = sorted.length ? sorted.reduce((a, b) => (a.priceNGN <= b.priceNGN ? a : b)) : null;
  const earliest = sorted.length
    ? sorted.reduce((a, b) => (a.departISO <= b.departISO ? a : b))
    : null;
  const bestValue = sorted.length
    ? sorted.reduce((a, b) =>
        a.priceNGN / Math.sqrt(a.durationMin) <= b.priceNGN / Math.sqrt(b.durationMin) ? a : b,
      )
    : null;

  const nActive = activeFilterCount(filters);

  const resetFilters = () => setFilters(EMPTY_FILTERS);

  const selectOutbound = (f: SampleFlight) => {
    setSelectedOutbound(f);
    setFilters(EMPTY_FILTERS);
    setSort("price");
    setStage("return");
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  const primaryLabel = !isRoundTrip
    ? "Continue to booking"
    : stage === "outbound"
      ? "Select outbound"
      : "Continue to booking";

  const openBooking = (f: SampleFlight) => {
    if (isRoundTrip && stage === "outbound") {
      selectOutbound(f);
      return;
    }
    if (isRoundTrip && selectedOutbound) {
      setBooking({ outbound: selectedOutbound, returnFlight: f });
    } else {
      setBooking({ outbound: f });
    }
    setDetailsFlight(null);
  };

  const onPrimary = (f: SampleFlight) => openBooking(f);

  const continueFromDetails = () => {
    const f = detailsFlight;
    setDetailsFlight(null);
    if (!f) return;
    if (isRoundTrip && stage === "outbound") {
      selectOutbound(f);
      return;
    }
    openBooking(f);
  };

  const legLabel =
    !isRoundTrip
      ? "One-way journey"
      : stage === "outbound"
        ? "Step 1 of 2 · Outbound flight"
        : "Step 2 of 2 · Return flight";

  return (
    <main className="shell py-8 sm:py-10">
      {/* Search summary */}
      <div className="card p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              {legLabel}
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              {airportLabel(query.origin)}{" "}
              <span className="text-muted" aria-hidden="true">
                →
              </span>{" "}
              {airportLabel(query.destination)}
            </h1>
            <p className="mt-1.5 text-sm text-muted">
              {formatDateShort(query.departDate)}
              {query.returnDate ? ` – ${formatDateShort(query.returnDate)}` : ""} ·{" "}
              {query.tripType === "round-trip" ? "Round-trip" : "One-way"} ·{" "}
              {query.adults} adult{query.adults === 1 ? "" : "s"}
              {query.children ? `, ${query.children} child${query.children === 1 ? "" : "ren"}` : ""}{" "}
              · {query.cabin}
            </p>
          </div>
          <button type="button" onClick={onModifySearch} className="btn-secondary">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Modify search
          </button>
        </div>

        {isRoundTrip && selectedOutbound ? (
          <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-success/25 bg-success/5 p-3">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-ink">
              <strong>Outbound selected:</strong> {selectedOutbound.origin} →{" "}
              {selectedOutbound.destination},{" "}
              {selectedOutbound.departISO.slice(11, 16)}–{selectedOutbound.arriveISO.slice(11, 16)}{" "}
              ({selectedOutbound.airlineCode} {selectedOutbound.flightNumber}) ·{" "}
              {formatNaira(selectedOutbound.priceNGN)} sample fare. Now choose your return flight.
            </p>
          </div>
        ) : null}
      </div>

      {/* Results summary */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <p className="text-sm text-ink">
            {loading ? (
              <span className="inline-flex items-center gap-2 text-muted">
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Searching sample fares…
              </span>
            ) : (
              <>
                <strong>{sorted.length}</strong> of {currentLegFlights.length} sample result
                {currentLegFlights.length === 1 ? "" : "s"}
              </>
            )}
          </p>
          {lowest != null && !loading ? (
            <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              Lowest sample fare {formatNaira(lowest)}
            </span>
          ) : null}
          <span className="rounded-full bg-canvas px-3 py-1 text-xs font-medium text-muted">
            {flightProvider.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMobileFilters((v) => !v)}
            className="btn-secondary lg:hidden"
            aria-expanded={showMobileFilters}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters{nActive > 0 ? ` (${nActive})` : ""}
          </button>
          <label htmlFor="sort-select" className="text-xs font-semibold uppercase tracking-wide text-muted">
            Sort
          </label>
          <select
            id="sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption["id"])}
            className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-medium text-ink shadow-card"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        {/* Filters */}
        <aside
          className={`${showMobileFilters ? "block" : "hidden"} rounded-xl border border-line bg-white p-5 lg:block`}
          aria-label="Flight filters"
        >
          <FlightFilters
            flights={currentLegFlights}
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
          />
          {bounds.max > 0 ? (
            <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted">
              Sample fares in this result set range from {formatNaira(bounds.min)} to{" "}
              {formatNaira(bounds.max)}.
            </p>
          ) : null}
        </aside>

        {/* Results */}
        <section aria-label="Flight results">
          {error ? (
            <div className="card flex flex-col items-center px-6 py-14 text-center">
              <AlertCircle className="h-10 w-10 text-danger" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-bold text-ink">Something went wrong</h2>
              <p className="mt-2 max-w-md text-sm text-muted">{error}</p>
              <button type="button" onClick={onModifySearch} className="btn-primary mt-6">
                Back to search
              </button>
            </div>
          ) : loading ? (
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : sorted.length === 0 ? (
            <div className="card flex flex-col items-center px-6 py-14 text-center">
              <SearchX className="h-10 w-10 text-muted" aria-hidden="true" />
              <h2 className="mt-4 text-lg font-bold text-ink">
                {currentLegFlights.length === 0
                  ? "No sample flights on this route and date"
                  : "No flights match your filters"}
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
                {currentLegFlights.length === 0
                  ? "This demo covers major Nigerian domestic routes — try Lagos ↔ Abuja, Port Harcourt, Kano, or Enugu, on a date within the next few weeks."
                  : "Try widening the price range, clearing airline or time filters, or resetting everything."}
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {currentLegFlights.length > 0 ? (
                  <button type="button" onClick={resetFilters} className="btn-primary">
                    Reset filters
                  </button>
                ) : null}
                <button type="button" onClick={onModifySearch} className="btn-secondary">
                  Modify search
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {sorted.map((f) => (
                <FlightCard
                  key={f.id}
                  flight={f}
                  primaryLabel={primaryLabel}
                  onPrimary={() => onPrimary(f)}
                  onDetails={() => setDetailsFlight(f)}
                  badge={
                    bestValue && f.id === bestValue.id
                      ? "Best value"
                      : cheapest && f.id === cheapest.id
                        ? "Cheapest"
                        : earliest && f.id === earliest.id
                          ? "Earliest"
                          : undefined
                  }
                />
              ))}
              <p className="px-1 pt-2 text-xs leading-relaxed text-muted">
                All fares, times, and flight numbers above are sample data for this demonstration —
                never live prices. In the real FlyBro, you'd continue to the airline's site to see
                the live fare and book.
              </p>
            </div>
          )}
        </section>
      </div>

      {detailsFlight ? (
        <FlightDetails
          flight={detailsFlight}
          query={query}
          legLabel={legLabel}
          onClose={() => setDetailsFlight(null)}
          onContinue={continueFromDetails}
        />
      ) : null}

      {booking ? (
        <BookingDemo
          outbound={booking.outbound}
          returnFlight={booking.returnFlight}
          query={query}
          onClose={() => setBooking(null)}
          onNewSearch={() => {
            setBooking(null);
            onNewSearch();
          }}
        />
      ) : null}

      {nActive > 0 && !loading && sorted.length > 0 ? (
        <button
          type="button"
          onClick={resetFilters}
          className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full border border-line bg-white px-5 py-2.5 text-sm font-semibold text-ink shadow-pop lg:hidden"
        >
          Clear {nActive} filter{nActive === 1 ? "" : "s"}
        </button>
      ) : null}

    </main>
  );
}
