import type { SampleFlight, SearchQuery } from "./types";
import { searchSampleFlights, searchSampleReturnFlights } from "./sampleFlights";

/**
 * Data-provider seam.
 *
 * The demo runs against the deterministic SAMPLE provider below.
 * To integrate a legitimate flight-data provider later:
 *   1. Create e.g. `amadeusProvider.ts` implementing FlightProvider.
 *   2. Map provider results into the SampleFlight shape (rename to Flight when
 *      live data lands — one shared view model keeps the UI untouched).
 *   3. Never ship provider secrets in client-side code; proxy via a server.
 */
export interface FlightProvider {
  readonly id: string;
  readonly label: string;
  /** Resolves one leg: origin → destination on departDate. */
  searchLeg(query: SearchQuery, leg: "outbound" | "return"): Promise<SampleFlight[]>;
}

const SIMULATED_LATENCY_MS = 650;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const sampleProvider: FlightProvider = {
  id: "sample",
  label: "Sample fares (demo data)",
  async searchLeg(query, leg) {
    await delay(SIMULATED_LATENCY_MS);
    return leg === "outbound" ? searchSampleFlights(query) : searchSampleReturnFlights(query);
  },
};

export const flightProvider: FlightProvider = sampleProvider;
