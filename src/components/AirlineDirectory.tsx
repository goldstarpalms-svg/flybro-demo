import { AIRLINES } from "../lib/airlines";
import { AirlineAvatar } from "./AirlineAvatar";

export function AirlineDirectory() {
  return (
    <section id="airlines" className="scroll-mt-20 py-16 sm:py-20">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            Domestic airlines we cover
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Nigerian carriers, one directory
          </h2>
          <p className="mt-3 text-base leading-relaxed text-muted">
            The demo compares sample fares across these operators. Listing an airline here is
            informational only — no partnership or endorsement is implied, and logo assets are
            intentionally replaced with initials.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AIRLINES.map((a) => (
            <li key={a.code} className="card flex items-center gap-4 p-4">
              <AirlineAvatar code={a.code} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{a.name}</p>
                <p className="truncate text-xs text-muted">{a.note}</p>
              </div>
              <span className="rounded-md bg-brand-50 px-2 py-1 text-[11px] font-semibold text-brand-700">
                {a.code}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
