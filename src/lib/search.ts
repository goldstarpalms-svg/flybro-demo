import type {
  Filters,
  SampleFlight,
  SearchErrors,
  SearchQuery,
  SortOption,
  TripType,
  CabinClass,
} from "./types";
import { todayKey } from "./format";

/* ---------- validation ---------- */

export function validateSearch(q: Partial<SearchQuery>): SearchErrors {
  const errors: SearchErrors = {};

  const origin = q.origin?.trim() ?? "";
  const destination = q.destination?.trim() ?? "";

  if (!origin) {
    errors.origin = "Choose where you're flying from.";
  }
  if (!destination) {
    errors.destination = "Choose where you're flying to.";
  }
  if (origin && destination && origin === destination) {
    errors.destination = "Origin and destination must be different.";
  }

  const today = todayKey();
  if (!q.departDate) {
    errors.departDate = "Choose a departure date.";
  } else if (q.departDate < today) {
    errors.departDate = "Departure date can't be in the past.";
  }

  if (q.tripType === "round-trip") {
    if (!q.returnDate) {
      errors.returnDate = "Choose a return date.";
    } else if (q.departDate && q.returnDate < q.departDate) {
      errors.returnDate = "Return date can't be before departure.";
    }
  }

  const adults = q.adults ?? 0;
  const children = q.children ?? 0;
  if (!Number.isInteger(adults) || adults < 1 || adults > 9) {
    errors.passengers = "At least 1 adult is required (up to 9).";
  } else if (!Number.isInteger(children) || children < 0 || children > 6) {
    errors.passengers = "Children must be between 0 and 6.";
  } else if (adults + children > 9) {
    errors.passengers = "A maximum of 9 passengers can be searched at once.";
  }

  return errors;
}

export function hasErrors(errors: SearchErrors): boolean {
  return Object.keys(errors).length > 0;
}

/* ---------- sorting ---------- */

export const SORT_OPTIONS: SortOption[] = [
  { id: "price", label: "Lowest price" },
  { id: "departure", label: "Earliest departure" },
  { id: "duration", label: "Shortest duration" },
];

export function sortFlights(flights: SampleFlight[], sort: SortOption["id"]): SampleFlight[] {
  const list = [...flights];
  switch (sort) {
    case "price":
      return list.sort((a, b) => a.priceNGN - b.priceNGN || a.departISO.localeCompare(b.departISO));
    case "departure":
      return list.sort((a, b) => a.departISO.localeCompare(b.departISO) || a.priceNGN - b.priceNGN);
    case "duration":
      return list.sort((a, b) => a.durationMin - b.durationMin || a.priceNGN - b.priceNGN);
    default:
      return list;
  }
}

/* ---------- filtering ---------- */

export function timeBucketOf(flight: SampleFlight): "morning" | "afternoon" | "evening" {
  const hour = parseInt(flight.departISO.slice(11, 13), 10);
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export function filterFlights(flights: SampleFlight[], filters: Filters): SampleFlight[] {
  return flights.filter((f) => {
    if (filters.airlines.length > 0 && !filters.airlines.includes(f.airlineCode)) return false;
    if (filters.maxPrice != null && f.priceNGN > filters.maxPrice) return false;
    if (filters.timeBuckets.length > 0 && !filters.timeBuckets.includes(timeBucketOf(f))) return false;
    if (filters.stops === "nonstop" && f.stops !== 0) return false;
    if (filters.stops === "one-stop" && f.stops !== 1) return false;
    if (filters.maxDurationMin != null && f.durationMin > filters.maxDurationMin) return false;
    return true;
  });
}

export function activeFilterCount(filters: Filters): number {
  let n = 0;
  if (filters.airlines.length > 0) n += 1;
  if (filters.maxPrice != null) n += 1;
  if (filters.timeBuckets.length > 0) n += 1;
  if (filters.stops !== "any") n += 1;
  if (filters.maxDurationMin != null) n += 1;
  return n;
}

export function priceBounds(flights: SampleFlight[]): { min: number; max: number } {
  if (flights.length === 0) return { min: 0, max: 0 };
  let min = Infinity;
  let max = 0;
  for (const f of flights) {
    if (f.priceNGN < min) min = f.priceNGN;
    if (f.priceNGN > max) max = f.priceNGN;
  }
  return { min, max };
}

export function summarizeQuery(q: SearchQuery): string {
  const pax = q.adults + (q.children ?? 0);
  const paxLabel = `${pax} passenger${pax === 1 ? "" : "s"}`;
  return `${q.origin} → ${q.destination} · ${q.tripType === "round-trip" ? "Round-trip" : "One-way"} · ${paxLabel} · ${q.cabin}`;
}

export function isTripType(v: string): v is TripType {
  return v === "one-way" || v === "round-trip";
}

export function isCabin(v: string): v is CabinClass {
  return v === "Economy" || v === "Business";
}
