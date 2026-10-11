import { Compass, Globe2, ShieldCheck } from "lucide-react";
import { FlightSearchForm } from "./FlightSearchForm";
import type { SearchQuery } from "../lib/types";

interface Props {
  query: SearchQuery;
  onSearch: (q: SearchQuery) => void;
  loading: boolean;
  onExplore: () => void;
}

export function Hero({ query, onSearch, loading, onExplore }: Props) {
  return (
    <section className="relative overflow-hidden bg-navy">
      <img
        src="images/hero-flight.jpg"
        alt=""
        aria-hidden="true"
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover object-right opacity-40"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/30"
      />

      <div className="shell relative pb-10 pt-9 sm:pb-12 sm:pt-12">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-500">
            Nigerian domestic flights · One search
          </p>
          <h1 className="mt-3 text-[2rem] font-bold leading-[1.12] tracking-tight text-white sm:text-5xl">
            Your Next Flight,
            <br />
            Without the Stress.
          </h1>
          <p className="mt-3.5 max-w-xl text-[15px] leading-relaxed text-slate-300 sm:text-lg">
            Compare flight options, explore destinations, and find a journey that fits your
            budget — all in one place. Then book direct with the airline.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <a href="#search" className="btn-primary px-5 py-2.5 text-[15px]">
              Find flights
            </a>
            <button type="button" onClick={onExplore} className="btn-secondary px-5 py-2.5 text-[15px]">
              <Compass className="h-4 w-4" aria-hidden="true" />
              Explore destinations
            </button>
          </div>
          <dl className="mt-6 flex flex-wrap gap-x-7 gap-y-2.5">
            {[
              { icon: ShieldCheck, term: "No favourites", desc: "Airlines can't pay to rank higher" },
              { icon: Globe2, term: "Book direct", desc: "Pay on the airline's own site" },
            ].map(({ icon: Icon, term, desc }) => (
              <div key={term} className="flex items-start gap-2">
                <Icon className="mt-0.5 h-4 w-4 text-brand-500" aria-hidden="true" />
                <div>
                  <dt className="text-sm font-semibold text-white">{term}</dt>
                  <dd className="text-xs text-slate-400">{desc}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* Search panel is the focal point */}
        <div id="search" className="mt-8 scroll-mt-[88px] sm:mt-9">
          <FlightSearchForm initialQuery={query} onSearch={onSearch} loading={loading} />
        </div>
      </div>
    </section>
  );
}
