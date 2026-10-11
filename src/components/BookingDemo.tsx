import { X, ExternalLink, ShieldCheck, Info, ArrowRight } from "lucide-react";
import type { SampleFlight, SearchQuery } from "../lib/types";
import { formatNaira, formatTime, formatDateShort } from "../lib/format";
import { airlineByCode } from "../lib/airlines";
import { AirlineAvatar } from "./AirlineAvatar";

interface Props {
  outbound: SampleFlight;
  returnFlight?: SampleFlight;
  query: SearchQuery;
  onClose: () => void;
  onNewSearch: () => void;
}

function LegRow({ flight, label }: { flight: SampleFlight; label: string }) {
  const airline = airlineByCode(flight.airlineCode);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line p-3.5">
      <AirlineAvatar code={flight.airlineCode} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{label}</p>
        <p className="truncate text-sm font-semibold text-ink">
          {flight.origin} → {flight.destination} · {formatDateShort(flight.dateKey)}
        </p>
        <p className="truncate text-xs text-muted">
          {formatTime(flight.departISO)} – {formatTime(flight.arriveISO)} ·{" "}
          {airline?.name ?? flight.airlineCode} · {flight.flightNumber}
        </p>
      </div>
      <p className="text-sm font-bold text-ink">{formatNaira(flight.priceNGN)}</p>
    </div>
  );
}

export function BookingDemo({ outbound, returnFlight, query, onClose, onNewSearch }: Props) {
  const total = outbound.priceNGN + (returnFlight?.priceNGN ?? 0);
  const pax = query.adults + query.children;
  const airline = airlineByCode(outbound.airlineCode);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Booking demonstration"
      className="fixed inset-0 z-[70] flex items-end justify-center bg-navy/50 p-0 sm:items-center sm:p-6"
    >
      <div className="flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-pop sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">
              Demonstration step
            </p>
            <h2 className="text-lg font-bold text-ink">How you'd continue to book</h2>
          </div>
          <button
            type="button"
            aria-label="Close booking demonstration"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted hover:bg-canvas hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex items-start gap-3 rounded-xl border border-brand-600/20 bg-brand-50 p-3.5">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-ink">FlyBro doesn't sell tickets</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                In the live product you'd now be handed to {airline?.name ?? "the airline"}'s own
                website to choose your fare, pay, and receive your ticket directly from them. This
                demo never charges money, stores payment details, or claims a reservation exists.
              </p>
            </div>
          </div>

          <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-muted">
            Sample itinerary summary
          </p>
          <div className="mt-2.5 space-y-2.5">
            <LegRow flight={outbound} label="Outbound" />
            {returnFlight ? <LegRow flight={returnFlight} label="Return" /> : null}
          </div>

          <dl className="mt-4 divide-y divide-line rounded-xl border border-line px-4">
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-sm text-muted">Passengers</dt>
              <dd className="text-sm font-medium text-ink">
                {query.adults} adult{query.adults === 1 ? "" : "s"}
                {query.children ? `, ${query.children} child${query.children === 1 ? "" : "ren"}` : ""}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-sm text-muted">Journey</dt>
              <dd className="text-sm font-medium text-ink">
                {query.tripType === "round-trip" ? "Round-trip" : "One-way"} · {query.cabin}
              </dd>
            </div>
            <div className="flex items-center justify-between py-2.5">
              <dt className="text-sm text-muted">
                Sample total ({pax} × per-adult fares)
              </dt>
              <dd className="text-base font-bold text-ink">{formatNaira(total)}</dd>
            </div>
          </dl>

          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-canvas p-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-muted">
              The figures above are <strong>sample values</strong> shown to demonstrate the
              journey. Real totals depend on the airline's live pricing, taxes, and fare rules at
              the moment of booking. No confirmation number is issued by this demo.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line px-5 py-4">
          <button type="button" onClick={onNewSearch} className="btn-secondary">
            Start a new search
          </button>
          <button type="button" onClick={onClose} className="btn-primary">
            Back to results
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {airline?.website ? (
          <div className="border-t border-line px-5 py-3">
            <a
              href={airline.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-600 hover:text-brand-700"
            >
              Visit {airline.name}'s public website (opens in a new tab — demo does not transfer
              your search)
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
}
