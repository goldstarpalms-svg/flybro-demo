import { AIRLINES } from "../lib/airlines";
import { AirlineAvatar } from "./AirlineAvatar";

export function AirlineDirectory() {
  return (
    <section id="airlines" className="section-pad scroll-mt-[88px]">
      <div className="shell">
        <div className="max-w-xl">
          <p className="section-kicker">Domestic airlines we cover</p>
          <h2 className="section-title">Nigerian carriers, one directory</h2>
          <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
            Sample fares across these operators. Listing is informational only — no partnership or
            endorsement is implied, and logo assets are replaced with initials.
          </p>
        </div>

        <ul className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {AIRLINES.map((a) => (
            <li
              key={a.code}
              className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-3 py-2.5 transition-colors hover:border-brand-500"
            >
              <AirlineAvatar code={a.code} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-ink">{a.name}</p>
                <p className="truncate text-[11px] text-muted">Domestic · Nigeria</p>
              </div>
              <span className="shrink-0 text-[11px] font-semibold text-muted">{a.code}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
