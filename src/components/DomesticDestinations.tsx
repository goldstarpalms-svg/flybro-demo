import { DestinationCard } from "./DestinationCard";
import { indicativeFare } from "../lib/sampleFlights";
import { scrollToId, todayKey, addDays } from "../lib/format";
import type { SearchQuery } from "../lib/types";

interface Props {
  onSearchRoute: (query: Partial<SearchQuery>) => void;
}

const CARDS = [
  {
    city: "Abuja",
    code: "ABV",
    tagline: "Capital run",
    description: "The federal capital — government, business, and the fastest hop out of Lagos.",
    image: "images/dest-abuja.jpg",
  },
  {
    city: "Kano",
    code: "KAN",
    tagline: "Up north",
    description: "Commercial heart of the north — markets, history, and warm hospitality.",
    image: "images/dest-kano.jpg",
  },
  {
    city: "Port Harcourt",
    code: "PHC",
    tagline: "Garden city",
    description: "Oil city energy with riverside calm — the South-South's busiest gateway.",
    image: "images/dest-phc.jpg",
  },
  {
    city: "Enugu",
    code: "ENU",
    tagline: "Coal & hills",
    description: "Green hills, quiet charm, and the easiest way into the South East.",
    image: "images/dest-enugu.jpg",
  },
];

const MORE_ROUTES = [
  ["LOS", "CBV"],
  ["LOS", "QOW"],
  ["LOS", "ABB"],
  ["LOS", "BNI"],
  ["ABV", "PHC"],
  ["ABV", "KAN"],
];

export function DomesticDestinations({ onSearchRoute }: Props) {
  const handleCard = (code: string) => {
    const depart = addDays(todayKey(), 3);
    onSearchRoute({
      origin: "LOS",
      destination: code,
      departDate: depart,
      tripType: "one-way",
      returnDate: undefined,
    });
    scrollToId("search");
  };

  return (
    <section id="destinations" className="scroll-mt-20 py-16 sm:py-20">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
              Domestic destinations
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Trending from Lagos
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted">
              Sample routes for the demonstration — a feel for how quickly travellers can jump to
              Nigeria's key cities. Tap any card to prefill the search.
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map((c) => (
            <DestinationCard
              key={c.code}
              city={c.city}
              routeLabel={`LOS → ${c.code}`}
              tagline={c.tagline}
              description={c.description}
              image={c.image}
              fare={indicativeFare("LOS", c.code)}
              onSearch={() => handleCard(c.code)}
            />
          ))}
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold text-ink">More sample routes</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {MORE_ROUTES.map(([from, to]) => (
              <button
                key={`${from}-${to}`}
                type="button"
                onClick={() => {
                  const depart = addDays(todayKey(), 3);
                  onSearchRoute({
                    origin: from,
                    destination: to,
                    departDate: depart,
                    tripType: "one-way",
                    returnDate: undefined,
                  });
                  scrollToId("search");
                }}
                className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink shadow-card transition-colors hover:border-brand-500 hover:text-brand-600"
              >
                {from} → {to}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
