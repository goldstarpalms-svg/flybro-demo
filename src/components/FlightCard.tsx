import { ArrowRight, Luggage, PlaneTakeoff, RotateCcw, Info, Clock3 } from "lucide-react";
import type { SampleFlight } from "../lib/types";
import { formatDuration, formatNaira, formatTime } from "../lib/format";
import { airlineByCode } from "../lib/airlines";
import { airportByCode } from "../lib/airports";
import { AirlineAvatar } from "./AirlineAvatar";

interface Props {
  flight: SampleFlight;
  primaryLabel: string;
  onPrimary: () => void;
  onDetails: () => void;
  badge?: "Best value" | "Cheapest" | "Earliest";
}

const BADGE_STYLES: Record<string, string> = {
  Cheapest: "bg-success/10 text-success",
  "Best value": "bg-brand-50 text-brand-700",
  Earliest: "bg-warning/10 text-warning",
};

export function FlightCard({ flight, primaryLabel, onPrimary, onDetails, badge }: Props) {
  const airline = airlineByCode(flight.airlineCode);
  const origin = airportByCode(flight.origin);
  const dest = airportByCode(flight.destination);
  const isCheapest = badge === "Cheapest";

  return (
    <article
      className={`card p-4 transition-shadow hover:shadow-panel sm:p-5 ${
        isCheapest ? "border-success/40 ring-1 ring-success/20" : ""
      }`}
    >
      {/* Row 1 — airline identity */}
      <div className="flex items-center gap-3">
        <AirlineAvatar code={flight.airlineCode} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">
            {airline?.name ?? flight.airlineCode}
          </p>
          <p className="truncate text-xs text-muted">
            {flight.flightNumber} · Sample flight number
          </p>
        </div>
        {badge ? (
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${BADGE_STYLES[badge]}`}
          >
            {badge}
          </span>
        ) : null}
      </div>

      {/* Row 2 — timeline: the scannable core */}
      <div className="mt-3.5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-5">
        <div className="min-w-0">
          <p className="text-xl font-bold tabular-nums tracking-tight text-ink sm:text-2xl">
            {formatTime(flight.departISO)}
          </p>
          <p className="mt-0.5 truncate text-xs font-semibold text-ink">
            {origin?.city ?? flight.origin}{" "}
            <span className="font-medium text-muted">({flight.origin})</span>
          </p>
        </div>

        <div className="flex min-w-[84px] flex-col items-center">
          <p className="inline-flex items-center gap-1 text-xs font-medium text-muted">
            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
            {formatDuration(flight.durationMin)}
          </p>
          <div className="relative my-1.5 w-full">
            <span className="block h-px w-full bg-line" aria-hidden="true" />
            <span
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-1"
              aria-hidden="true"
            >
              {flight.stops === 0 ? (
                <PlaneTakeoff className="h-3.5 w-3.5 text-brand-600" />
              ) : (
                <ArrowRight className="h-3.5 w-3.5 text-warning" />
              )}
            </span>
          </div>
          <p className="text-[11px] font-medium text-muted">
            {flight.stops === 0 ? "Nonstop" : "1 stop"}
          </p>
        </div>

        <div className="min-w-0 text-right">
          <p className="text-xl font-bold tabular-nums tracking-tight text-ink sm:text-2xl">
            {formatTime(flight.arriveISO)}
          </p>
          <p className="mt-0.5 truncate text-xs font-semibold text-ink">
            {dest?.city ?? flight.destination}{" "}
            <span className="font-medium text-muted">({flight.destination})</span>
          </p>
        </div>
      </div>

      {/* Row 3 — fare conditions */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-line pt-3">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-canvas px-2 py-1 text-[11px] font-medium text-muted">
          <Luggage className="h-3 w-3" aria-hidden="true" />
          {flight.baggageCabin} · {flight.baggageChecked}
        </span>
        <span className="rounded-md bg-canvas px-2 py-1 text-[11px] font-medium text-muted">
          {flight.cabin} · {flight.fareName}
        </span>
        <span
          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium ${
            flight.refundable ? "bg-success/10 text-success" : "bg-canvas text-muted"
          }`}
        >
          <RotateCcw className="h-3 w-3" aria-hidden="true" />
          {flight.refundable ? "Refundable" : "Non-refundable"}
        </span>
      </div>

      {/* Row 4 — price + actions */}
      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
            Sample fare per adult · one way
          </p>
          <p className="text-2xl font-bold tabular-nums tracking-tight text-ink sm:text-3xl">
            {formatNaira(flight.priceNGN)}
          </p>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
          <button type="button" onClick={onDetails} className="btn-secondary flex-1 sm:flex-none">
            <Info className="h-4 w-4" aria-hidden="true" />
            Details
          </button>
          <button type="button" onClick={onPrimary} className="btn-primary flex-[2] sm:flex-none">
            {primaryLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
