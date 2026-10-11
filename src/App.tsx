import { useCallback, useState } from "react";
import type { SearchQuery } from "./lib/types";
import { flightProvider } from "./lib/flightProvider";
import { addDays, scrollToId, todayKey } from "./lib/format";
import type { SampleFlight } from "./lib/types";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { DomesticDestinations } from "./components/DomesticDestinations";
import { HowItWorks } from "./components/HowItWorks";
import { AirlineDirectory } from "./components/AirlineDirectory";
import { WhyFlyBro } from "./components/WhyFlyBro";
import { Faq } from "./components/Faq";
import { Footer } from "./components/Footer";
import { ResultsView } from "./components/ResultsView";

type View = "home" | "results";

interface ResultsState {
  outbound: SampleFlight[];
  returnFlights: SampleFlight[] | null;
  loading: boolean;
  error: string | null;
}

const INITIAL_QUERY: SearchQuery = {
  tripType: "one-way",
  origin: "LOS",
  destination: "ABV",
  departDate: addDays(todayKey(), 3),
  returnDate: undefined,
  adults: 1,
  children: 0,
  cabin: "Economy",
};

const IDLE_RESULTS: ResultsState = {
  outbound: [],
  returnFlights: null,
  loading: false,
  error: null,
};

export default function App() {
  const [view, setView] = useState<View>("home");
  const [query, setQuery] = useState<SearchQuery>(INITIAL_QUERY);
  const [results, setResults] = useState<ResultsState>(IDLE_RESULTS);

  const isHome = view === "home";

  const runSearch = useCallback(async (q: SearchQuery) => {
    setQuery(q);
    setView("results");
    setResults({ outbound: [], returnFlights: null, loading: true, error: null });
    window.scrollTo({ top: 0, behavior: "auto" });
    try {
      const [outbound, returnFlights] = await Promise.all([
        flightProvider.searchLeg(q, "outbound"),
        q.tripType === "round-trip" ? flightProvider.searchLeg(q, "return") : Promise.resolve(null),
      ]);
      setResults({ outbound, returnFlights, loading: false, error: null });
    } catch {
      setResults({
        outbound: [],
        returnFlights: null,
        loading: false,
        error: "We couldn't gather sample fares for that search. Please try again.",
      });
    }
  }, []);

  const handleFindFlights = useCallback(() => {
    if (!isHome) {
      setView("home");
      requestAnimationFrame(() => scrollToId("search"));
    } else {
      scrollToId("search");
    }
  }, [isHome]);

  const handleExplore = useCallback(() => {
    scrollToId("destinations");
  }, []);

  const handleSearchRoute = useCallback((partial: Partial<SearchQuery>) => {
    setQuery((q) => ({ ...q, ...partial }));
    requestAnimationFrame(() => scrollToId("search"));
  }, []);

  const handleModifySearch = useCallback(() => {
    setView("home");
    requestAnimationFrame(() => scrollToId("search"));
  }, []);

  const handleNewSearch = useCallback(() => {
    setResults(IDLE_RESULTS);
    setView("home");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-pop"
      >
        Skip to content
      </a>

      <Navigation onFindFlights={handleFindFlights} onHome={handleNewSearch} isHome={isHome} />

      {isHome ? (
        <main id="main-content" className="flex-1">
          <Hero query={query} onSearch={runSearch} loading={results.loading} onExplore={handleExplore} />
          <DomesticDestinations onSearchRoute={handleSearchRoute} />
          <HowItWorks />
          <AirlineDirectory />
          <WhyFlyBro />
          <Faq />
        </main>
      ) : (
        <div id="main-content" className="flex-1">
          <ResultsView
            query={query}
            outboundFlights={results.outbound}
            returnFlights={results.returnFlights}
            loading={results.loading}
            error={results.error}
            onModifySearch={handleModifySearch}
            onNewSearch={handleNewSearch}
          />
        </div>
      )}

      <Footer onHome={handleNewSearch} isHome={isHome} />
    </div>
  );
}
