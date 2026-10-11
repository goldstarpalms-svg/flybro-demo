import type { SampleFlight, SearchQuery, CabinClass } from "./types";
import { AIRLINES } from "./airlines";
import { AIRPORTS } from "./airports";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SAMPLE DATA LAYER — clearly identified demo dataset.
 *
 * Every fare, time and flight number produced here is SIMULATED for the
 * demonstration. Nothing is a live price or a verified real-world schedule.
 *
 * The generator is deterministic per (route, date) so the same search always
 * returns the same sample flights — like a real cached search.
 *
 * To integrate a legitimate provider later, implement the FlightProvider
 * interface in flightProvider.ts and swap the implementation. Keep this module
 * as a fallback for offline demos.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/* ---------- deterministic PRNG ---------- */

function hashStr(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- route table (sample) ---------- */

interface RouteSpec {
  /** Typical block time in minutes. */
  duration: number;
  /** Baseline one-way economy fare in NGN. */
  baseFare: number;
  /** Airline codes that operate the route in the demo. */
  operators: string[];
}

const ROUTES: Record<string, RouteSpec> = {
  "LOS-ABV": { duration: 70, baseFare: 128000, operators: ["P4", "QI", "Q9", "W3", "NG", "UN", "VK", "2N", "OF", "VM", "BN", "UZ"] },
  "ABV-LOS": { duration: 70, baseFare: 128000, operators: ["P4", "QI", "Q9", "W3", "NG", "UN", "VK", "2N", "OF", "VM", "BN", "UZ"] },
  "LOS-PHC": { duration: 60, baseFare: 118000, operators: ["P4", "QI", "UN", "W3", "NG", "VK", "2N", "EN"] },
  "PHC-LOS": { duration: 60, baseFare: 118000, operators: ["P4", "QI", "UN", "W3", "NG", "VK", "2N", "EN"] },
  "LOS-KAN": { duration: 95, baseFare: 142000, operators: ["P4", "Q9", "VM", "R5", "2N", "UZ"] },
  "KAN-LOS": { duration: 95, baseFare: 142000, operators: ["P4", "Q9", "VM", "R5", "2N", "UZ"] },
  "LOS-ENU": { duration: 65, baseFare: 112000, operators: ["P4", "QI", "UN", "EN", "2N"] },
  "ENU-LOS": { duration: 65, baseFare: 112000, operators: ["P4", "QI", "UN", "EN", "2N"] },
  "ABV-PHC": { duration: 75, baseFare: 122000, operators: ["P4", "QI", "UN", "W3"] },
  "PHC-ABV": { duration: 75, baseFare: 122000, operators: ["P4", "QI", "UN", "W3"] },
  "ABV-KAN": { duration: 70, baseFare: 118000, operators: ["P4", "Q9", "VM", "R5", "UZ"] },
  "KAN-ABV": { duration: 70, baseFare: 118000, operators: ["P4", "Q9", "VM", "R5", "UZ"] },
  "LOS-CBV": { duration: 65, baseFare: 112000, operators: ["P4", "QI", "UN", "EN"] },
  "CBV-LOS": { duration: 65, baseFare: 112000, operators: ["P4", "QI", "UN", "EN"] },
  "LOS-QOW": { duration: 60, baseFare: 110000, operators: ["P4", "UN", "EN", "2N"] },
  "QOW-LOS": { duration: 60, baseFare: 110000, operators: ["P4", "UN", "EN", "2N"] },
  "LOS-ABB": { duration: 60, baseFare: 108000, operators: ["P4", "UN", "EN"] },
  "ABB-LOS": { duration: 60, baseFare: 108000, operators: ["P4", "UN", "EN"] },
  "LOS-BNI": { duration: 55, baseFare: 98000, operators: ["P4", "NG", "UN", "2N"] },
  "BNI-LOS": { duration: 55, baseFare: 98000, operators: ["P4", "NG", "UN", "2N"] },
  "ABV-ENU": { duration: 70, baseFare: 118000, operators: ["P4", "UN", "EN"] },
  "ENU-ABV": { duration: 70, baseFare: 118000, operators: ["P4", "UN", "EN"] },
  "ABV-KAD": { duration: 55, baseFare: 96000, operators: ["R5", "VM", "UZ", "P4"] },
  "KAD-ABV": { duration: 55, baseFare: 96000, operators: ["R5", "VM", "UZ", "P4"] },
  "ABV-JOS": { duration: 50, baseFare: 92000, operators: ["OF", "P4"] },
  "JOS-ABV": { duration: 50, baseFare: 92000, operators: ["OF", "P4"] },
  "KAN-YOL": { duration: 60, baseFare: 98000, operators: ["R5", "VM", "UZ"] },
  "YOL-KAN": { duration: 60, baseFare: 98000, operators: ["R5", "VM", "UZ"] },
};

export const SUPPORTED_ROUTE_KEYS = Object.keys(ROUTES);

/* ---------- schedule slots (sample) ---------- */

const SLOT_POOL = [
  "06:30", "07:45", "09:15", "10:40", "11:55", "13:30", "14:50", "16:15",
  "17:40", "18:55", "20:10", "21:35",
];

const FARE_NAMES: Record<CabinClass, string[]> = {
  Economy: ["Saver", "Basic", "Classic", "Flexi"],
  Business: ["Business Saver", "Business Flex"],
};

const BAGGAGE: Record<CabinClass, { cabin: string; checked: string }[]> = {
  Economy: [
    { cabin: "7 kg cabin bag", checked: "20 kg checked" },
    { cabin: "7 kg cabin bag", checked: "15 kg checked" },
    { cabin: "7 kg cabin bag", checked: "23 kg checked" },
    { cabin: "10 kg cabin bag", checked: "25 kg checked" },
  ],
  Business: [
    { cabin: "10 kg cabin bag", checked: "30 kg checked" },
    { cabin: "12 kg cabin bag", checked: "35 kg checked" },
  ],
};

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function slotISO(dateKey: string, timeHHMM: string): string {
  return `${dateKey}T${timeHHMM}:00`;
}

function addMinutesISO(iso: string, minutes: number): string {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + minutes);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
}

/* ---------- generator ---------- */

function generateForLeg(
  origin: string,
  destination: string,
  dateKey: string,
  cabin: CabinClass,
): SampleFlight[] {
  const routeKey = `${origin}-${destination}`;
  const spec = ROUTES[routeKey];
  if (!spec) return [];

  const rand = mulberry32(hashStr(`${routeKey}|${dateKey}`));
  const flights: SampleFlight[] = [];

  // Deterministic slot selection: 7–10 departures spread across the day.
  const slotCount = 7 + Math.floor(rand() * 4);
  const slots = [...SLOT_POOL].sort(() => rand() - 0.5).slice(0, slotCount).sort();

  for (const time of slots) {
    // 2–4 operators per departure slot, deterministic.
    const opCount = 2 + Math.floor(rand() * 3);
    const ops = [...spec.operators].sort(() => rand() - 0.5).slice(0, opCount);

    for (const code of ops) {
      const airline = AIRLINES.find((a) => a.code === code);
      if (!airline) continue;

      // Occasional 1-stop itinerary for realism (filter demo).
      const stops = rand() > 0.9 ? 1 : 0;
      const duration = spec.duration + (stops ? 95 : 0) + Math.round(rand() * 15 - 5);

      const hour = parseInt(time.slice(0, 2), 10);
      let timeFactor = 1;
      if (hour < 9) timeFactor = 0.97;
      else if (hour >= 17 && hour < 20) timeFactor = 1.08;
      else if (hour >= 20) timeFactor = 0.94;

      const jitter = 0.9 + rand() * 0.24;
      const cabinFactor = cabin === "Business" ? 2.4 : 1;
      const price = Math.round(
        (spec.baseFare * airline.fareFactor * timeFactor * jitter * cabinFactor) / 500
      ) * 500;

      const departISO = slotISO(dateKey, time);
      const arriveISO = addMinutesISO(departISO, duration);
      const fareName = FARE_NAMES[cabin][Math.floor(rand() * FARE_NAMES[cabin].length)];
      const bag = BAGGAGE[cabin][Math.floor(rand() * BAGGAGE[cabin].length)];
      const flightNumber = `${code} ${100 + Math.floor(rand() * 899)}`;

      flights.push({
        id: `sample-${routeKey}-${dateKey}-${flightNumber.replace(" ", "")}-${time}`,
        airlineCode: code,
        flightNumber,
        origin,
        destination,
        departISO,
        arriveISO,
        durationMin: duration,
        stops,
        priceNGN: price,
        cabin,
        fareName,
        baggageCabin: bag.cabin,
        baggageChecked: bag.checked,
        refundable: fareName.includes("Flex") || cabin === "Business",
        dateKey,
      });
    }
  }

  return flights.sort((a, b) => a.departISO.localeCompare(b.departISO) || a.priceNGN - b.priceNGN);
}

/**
 * Public entry point used by the sample flight provider.
 * Returns simulated flights for one leg (origin → destination on a date).
 */
export function searchSampleFlights(query: SearchQuery): SampleFlight[] {
  return generateForLeg(query.origin, query.destination, query.departDate, query.cabin);
}

export function searchSampleReturnFlights(query: SearchQuery): SampleFlight[] {
  if (!query.returnDate) return [];
  return generateForLeg(query.destination, query.origin, query.returnDate, query.cabin);
}

/** Lowest sample fare across the whole demo dataset for a route (for promo cards). */
export function indicativeFare(origin: string, destination: string): number | null {
  const routeKey = `${origin}-${destination}`;
  const spec = ROUTES[routeKey];
  if (!spec) return null;
  // Deterministic "cheapest seen" style figure — sample, not live.
  const rand = mulberry32(hashStr(routeKey));
  return Math.round((spec.baseFare * 0.82 * (0.95 + rand() * 0.1)) / 500) * 500;
}

export function isRouteSupported(origin: string, destination: string): boolean {
  return Boolean(ROUTES[`${origin}-${destination}`]);
}

export function airportsInUse() {
  return AIRPORTS;
}
