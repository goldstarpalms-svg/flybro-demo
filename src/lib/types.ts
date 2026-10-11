export type TripType = "one-way" | "round-trip";

export type CabinClass = "Economy" | "Business";

export interface Airport {
  code: string;
  city: string;
  name: string;
  region: string;
}

export interface Airline {
  code: string;
  name: string;
  /** Public website, where one is known. No partnership is implied. */
  website: string;
  initials: string;
  /** Brand-ish colour used only for the fallback avatar. */
  color: string;
  /** Relative sample fare multiplier (1 = baseline). */
  fareFactor: number;
  /** Style note shown in the directory. */
  note: string;
}

export interface SearchQuery {
  tripType: TripType;
  origin: string;
  destination: string;
  departDate: string; // YYYY-MM-DD
  returnDate?: string; // YYYY-MM-DD, round-trip only
  adults: number;
  children: number;
  cabin: CabinClass;
}

export interface SearchErrors {
  origin?: string;
  destination?: string;
  departDate?: string;
  returnDate?: string;
  passengers?: string;
  form?: string;
}

export interface SampleFlight {
  id: string;
  airlineCode: string;
  /** Sample flight number — not a verified real-world schedule. */
  flightNumber: string;
  origin: string;
  destination: string;
  /** ISO datetime, West Africa Time (UTC+1) wall-clock preserved as provided. */
  departISO: string;
  arriveISO: string;
  durationMin: number;
  stops: number;
  /** Sample fare in NGN for one adult, one way. */
  priceNGN: number;
  cabin: CabinClass;
  fareName: string;
  baggageCabin: string;
  baggageChecked: string;
  refundable: boolean;
  dateKey: string;
}

export interface SortOption {
  id: "price" | "departure" | "duration";
  label: string;
}

export interface Filters {
  airlines: string[]; // empty = all
  maxPrice: number | null;
  timeBuckets: string[]; // "morning" | "afternoon" | "evening"
  stops: "any" | "nonstop" | "one-stop";
  maxDurationMin: number | null;
}

export const EMPTY_FILTERS: Filters = {
  airlines: [],
  maxPrice: null,
  timeBuckets: [],
  stops: "any",
  maxDurationMin: null,
};
