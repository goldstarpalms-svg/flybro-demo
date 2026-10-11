import { ArrowRight } from "lucide-react";
import { formatNaira } from "../lib/format";

interface Props {
  city: string;
  routeLabel: string;
  tagline: string;
  description: string;
  image: string;
  fare: number | null;
  onSearch: () => void;
}

export function DestinationCard({
  city,
  routeLabel,
  tagline,
  description,
  image,
  fare,
  onSearch,
}: Props) {
  return (
    <article className="card group flex flex-col overflow-hidden transition-shadow hover:shadow-pop">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={`${city} destination`}
          loading="lazy"
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-ink shadow-card">
          {routeLabel}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-base font-bold text-ink">{city}</h3>
          {fare != null ? (
            <p className="text-right">
              <span className="mr-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                Sample from
              </span>
              <span className="text-base font-bold tabular-nums text-ink">{formatNaira(fare)}</span>
            </p>
          ) : null}
        </div>
        <p className="text-xs font-medium text-brand-600">{tagline}</p>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted">{description}</p>
        <button
          type="button"
          onClick={onSearch}
          className="mt-3 inline-flex items-center gap-1.5 self-start rounded-lg text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
        >
          Search this route
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
