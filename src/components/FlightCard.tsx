import { ArrowRight, Luggage, PlaneTakeoff, RotateCcw, Info } from "lucide-react";
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
  /** Highlights the cheapest / best-value card in the current list. */
  badge?: "Best value" | "Cheapest" | "Earliest";
}

export function FlightCard({ flight, primaryLabel, onPrimary, onDetails, badge }: Props) {
  const airline = airlineByCode(flight.airlineCode);
  const origin = airportByCode(flight.origin);
  const dest = airportByCode(flight.destination);

  return (
    <article className="card p-4 transition-shadow hover:shadow-panel sm:p-5">
      <div className="flex flex-wrap items-center gap-3">
        <AirlineAvatar code={flight.airlineCode} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-ink">
            {airline?.name ?? flight.airlineCode}
          </p>
          <p className="text-xs text-muted">
            {flight.flightNumber} · Sample flight number
          </p>
        </div>
        {badge ? (
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
              badge === "Cheapest"
                ? "bg-success/10 text-success"
                : badge === "Earliest"
                  ? "bg-warning/10 text-warning"
                  : "bg-brand-50 text-brand-700"
            }`}
          >
            {badge}
          </span>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <div>
          <p className="text-2xl font-bold tracking-tight text-ink">{formatTime(flight.departISO)}</p>
          <p className="mt-0.5 text-xs font-medium text-muted">{flight.origin}</p>
          <p className="truncate text-xs text-muted">{origin?.city ?? ""}</p>
        </div>

        <div className="flex min-w-[96px] flex-col items-center">
          <p className="text-xs font-medium text-muted">{formatDuration(flight.durationMin)}</p>
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

        <div className="text-right">
          <p className="text-2xl font-bold tracking-tight text-ink">{formatTime(flight.arriveISO)}</p>
          <p className="mt-0.5 text-xs font-medium text-muted">{flight.destination}</p>
          <p className="truncate text-xs text-muted">{dest?.city ?? ""}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-canvas px-2.5 py-1 text-[11px] font-medium text-muted">
          <Luggage className="h-3.5 w-3.5" aria-hidden="true" />
          {flight.baggageCabin} · {flight.baggageChecked}
        </span>
        <span className="rounded-md bg-canvas px-2.5 py-1 text-[11px] font-medium text-muted">
          {flight.cabin} · {flight.fareName}
        </span>
        <span
          className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
            flight.refundable ? "bg-success/10 text-success" : "bg-canvas text-muted"
          }`}
        >
          <RotateCcw className="mr-1 inline h-3 w-3" aria-hidden="true" />
          {flight.refundable ? "Refundable" : "Non-refundable"}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-muted">
            Sample fare per adult · one way
          </p>
          <p className="text-3xl font-bold tracking-tight text-ink">{formatNaira(flight.priceNGN)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={onDetails} className="btn-secondary">
            <Info className="h-4 w-4" aria-hidden="true" />
            Details
          </button>
          <button type="button" onClick={onPrimary} className="btn-primary">
            {primaryLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
