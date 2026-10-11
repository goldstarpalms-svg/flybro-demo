import { X, AlertTriangle, ArrowRight, Luggage, Clock, Plane } from "lucide-react";
import type { SampleFlight, SearchQuery } from "../lib/types";
import { formatDuration, formatNaira, formatTime, formatDateLong } from "../lib/format";
import { airlineByCode } from "../lib/airlines";
import { airportByCode } from "../lib/airports";
import { AirlineAvatar } from "./AirlineAvatar";

interface Props {
  flight: SampleFlight;
  query: SearchQuery;
  legLabel: string;
  onClose: () => void;
  onContinue: () => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="text-right text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

export function FlightDetails({ flight, query, legLabel, onClose, onContinue }: Props) {
  const airline = airlineByCode(flight.airlineCode);
  const origin = airportByCode(flight.origin);
  const dest = airportByCode(flight.destination);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Flight details"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-navy/50 p-0 sm:items-center sm:p-6"
    >
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl bg-white shadow-pop sm:rounded-2xl">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{legLabel}</p>
            <h2 className="text-lg font-bold text-ink">Flight details</h2>
          </div>
          <button
            type="button"
            aria-label="Close flight details"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted hover:bg-canvas hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/5 p-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-ink">
              <strong>Sample itinerary — demo data.</strong> Times, fares, and the flight number
              below are simulated for this demonstration and are not verified real-world
              information.
            </p>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <AirlineAvatar code={flight.airlineCode} size="lg" />
            <div>
              <p className="text-base font-semibold text-ink">{airline?.name ?? flight.airlineCode}</p>
              <p className="text-xs text-muted">
                {flight.flightNumber} · {flight.cabin} · {flight.fareName}
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl border border-line p-4">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div>
                <p className="text-2xl font-bold text-ink">{formatTime(flight.departISO)}</p>
                <p className="text-xs font-semibold text-muted">
                  {origin?.city} ({flight.origin})
                </p>
                <p className="mt-0.5 text-xs text-muted">{origin?.name}</p>
                <p className="mt-0.5 text-xs text-muted">{formatDateLong(flight.dateKey)}</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="h-4 w-4 text-muted" aria-hidden="true" />
                <p className="mt-1 text-xs font-medium text-muted">
                  {formatDuration(flight.durationMin)}
                </p>
                <p className="text-[11px] text-muted">
                  {flight.stops === 0 ? "Nonstop" : "1 stop"}
                </p>
                <Plane className="mt-1 h-4 w-4 text-brand-600" aria-hidden="true" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-ink">{formatTime(flight.arriveISO)}</p>
                <p className="text-xs font-semibold text-muted">
                  {dest?.city} ({flight.destination})
                </p>
                <p className="mt-0.5 text-xs text-muted">{dest?.name}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {flight.arriveISO.slice(0, 10) !== flight.dateKey ? "Arrives next day" : "\u00A0"}
                </p>
              </div>
            </div>
          </div>

          <dl className="mt-4 divide-y divide-line rounded-xl border border-line px-4">
            <Row label="Fare name" value={`${flight.cabin} · ${flight.fareName}`} />
            <Row label="Cabin baggage" value={flight.baggageCabin} />
            <Row label="Checked baggage" value={flight.baggageChecked} />
            <Row label="Refundable" value={flight.refundable ? "Yes, per fare rules" : "No, per fare rules"} />
            <Row label="Passengers" value={`${query.adults} adult${query.adults === 1 ? "" : "s"}${query.children ? `, ${query.children} child${query.children === 1 ? "" : "ren"}` : ""}`} />
            <Row label="Sample fare (per adult)" value={formatNaira(flight.priceNGN)} />
          </dl>

          <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-canvas p-3">
            <Luggage className="mt-0.5 h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-muted">
              Baggage allowances and fare rules shown here are sample values. The live product
              shows the conditions as published by the airline; always confirm on the airline's
              site before paying.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-4">
          <button type="button" onClick={onClose} className="btn-secondary">
            Back to results
          </button>
          <button type="button" onClick={onContinue} className="btn-primary">
            Continue
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
