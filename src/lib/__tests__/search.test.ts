import { describe, it, expect } from "vitest";
import {
  validateSearch,
  hasErrors,
  sortFlights,
  filterFlights,
  activeFilterCount,
  priceBounds,
  timeBucketOf,
} from "../search";
import { searchSampleFlights, isRouteSupported } from "../sampleFlights";
import type { SampleFlight, SearchQuery } from "../types";
import { EMPTY_FILTERS } from "../types";

const baseQuery: SearchQuery = {
  tripType: "one-way",
  origin: "LOS",
  destination: "ABV",
  departDate: "2026-11-01",
  adults: 1,
  children: 0,
  cabin: "Economy",
};

function makeFlight(over: Partial<SampleFlight>): SampleFlight {
  return {
    id: "f1",
    airlineCode: "P4",
    flightNumber: "P4 100",
    origin: "LOS",
    destination: "ABV",
    departISO: "2026-11-01T08:00:00",
    arriveISO: "2026-11-01T09:10:00",
    durationMin: 70,
    stops: 0,
    priceNGN: 100000,
    cabin: "Economy",
    fareName: "Saver",
    baggageCabin: "7 kg cabin bag",
    baggageChecked: "20 kg checked",
    refundable: false,
    dateKey: "2026-11-01",
    ...over,
  };
}

describe("validateSearch", () => {
  it("accepts a valid one-way search", () => {
    expect(hasErrors(validateSearch(baseQuery))).toBe(false);
  });

  it("requires origin and destination", () => {
    const e = validateSearch({ ...baseQuery, origin: "", destination: "" });
    expect(e.origin).toBeTruthy();
    expect(e.destination).toBeTruthy();
  });

  it("rejects identical origin and destination", () => {
    const e = validateSearch({ ...baseQuery, destination: "LOS" });
    expect(e.destination).toMatch(/different/i);
  });

  it("rejects past departure dates", () => {
    const e = validateSearch({ ...baseQuery, departDate: "2020-01-01" });
    expect(e.departDate).toBeTruthy();
  });

  it("requires returnDate for round-trip and checks order", () => {
    const missing = validateSearch({ ...baseQuery, tripType: "round-trip" });
    expect(missing.returnDate).toBeTruthy();
    const bad = validateSearch({
      ...baseQuery,
      tripType: "round-trip",
      returnDate: "2026-10-01",
    });
    expect(bad.returnDate).toBeTruthy();
    const ok = validateSearch({
      ...baseQuery,
      tripType: "round-trip",
      returnDate: "2026-11-05",
    });
    expect(hasErrors(ok)).toBe(false);
  });

  it("validates passenger bounds", () => {
    expect(validateSearch({ ...baseQuery, adults: 0 }).passengers).toBeTruthy();
    expect(validateSearch({ ...baseQuery, adults: 10 }).passengers).toBeTruthy();
    expect(validateSearch({ ...baseQuery, adults: 5, children: 5 }).passengers).toBeTruthy();
    expect(validateSearch({ ...baseQuery, adults: 2, children: 2 }).passengers).toBeUndefined();
  });
});

describe("sample dataset", () => {
  it("returns deterministic results for the same search", () => {
    const a = searchSampleFlights(baseQuery);
    const b = searchSampleFlights(baseQuery);
    expect(a.length).toBeGreaterThan(3);
    expect(a).toEqual(b);
  });

  it("never returns origin === destination flights", () => {
    const flights = searchSampleFlights(baseQuery);
    expect(flights.every((f) => f.origin === "LOS" && f.destination === "ABV")).toBe(true);
  });

  it("returns empty for unsupported routes", () => {
    expect(isRouteSupported("LOS", "XXX")).toBe(false);
    expect(searchSampleFlights({ ...baseQuery, destination: "XXX" })).toEqual([]);
  });
});

describe("sortFlights", () => {
  const flights = [
    makeFlight({ id: "a", priceNGN: 200000, departISO: "2026-11-01T14:00:00", durationMin: 90 }),
    makeFlight({ id: "b", priceNGN: 100000, departISO: "2026-11-01T10:00:00", durationMin: 120 }),
    makeFlight({ id: "c", priceNGN: 150000, departISO: "2026-11-01T06:00:00", durationMin: 70 }),
  ];

  it("sorts by price", () => {
    expect(sortFlights(flights, "price").map((f) => f.id)).toEqual(["b", "c", "a"]);
  });

  it("sorts by departure", () => {
    expect(sortFlights(flights, "departure").map((f) => f.id)).toEqual(["c", "b", "a"]);
  });

  it("sorts by duration", () => {
    expect(sortFlights(flights, "duration").map((f) => f.id)).toEqual(["c", "a", "b"]);
  });
});

describe("filterFlights", () => {
  const flights = [
    makeFlight({ id: "a", airlineCode: "P4", priceNGN: 100000, departISO: "2026-11-01T08:00:00", stops: 0, durationMin: 70 }),
    makeFlight({ id: "b", airlineCode: "QI", priceNGN: 180000, departISO: "2026-11-01T15:00:00", stops: 1, durationMin: 160 }),
    makeFlight({ id: "c", airlineCode: "Q9", priceNGN: 250000, departISO: "2026-11-01T19:00:00", stops: 0, durationMin: 75 }),
  ];

  it("filters by airline", () => {
    expect(filterFlights(flights, { ...EMPTY_FILTERS, airlines: ["P4"] }).map((f) => f.id)).toEqual(["a"]);
  });

  it("filters by max price", () => {
    expect(filterFlights(flights, { ...EMPTY_FILTERS, maxPrice: 180000 }).map((f) => f.id)).toEqual(["a", "b"]);
  });

  it("filters by departure time buckets", () => {
    const r = filterFlights(flights, { ...EMPTY_FILTERS, timeBuckets: ["afternoon"] });
    expect(r.map((f) => f.id)).toEqual(["b"]);
    expect(timeBucketOf(flights[0])).toBe("morning");
    expect(timeBucketOf(flights[1])).toBe("afternoon");
    expect(timeBucketOf(flights[2])).toBe("evening");
  });

  it("filters by stops", () => {
    expect(filterFlights(flights, { ...EMPTY_FILTERS, stops: "nonstop" }).map((f) => f.id)).toEqual(["a", "c"]);
    expect(filterFlights(flights, { ...EMPTY_FILTERS, stops: "one-stop" }).map((f) => f.id)).toEqual(["b"]);
  });

  it("filters by max duration", () => {
    expect(filterFlights(flights, { ...EMPTY_FILTERS, maxDurationMin: 80 }).map((f) => f.id)).toEqual(["a", "c"]);
  });

  it("combines filters", () => {
    const r = filterFlights(flights, {
      ...EMPTY_FILTERS,
      airlines: ["P4", "Q9"],
      maxPrice: 200000,
      stops: "nonstop",
    });
    expect(r.map((f) => f.id)).toEqual(["a"]);
  });

  it("counts active filters and computes bounds", () => {
    expect(activeFilterCount(EMPTY_FILTERS)).toBe(0);
    expect(activeFilterCount({ ...EMPTY_FILTERS, airlines: ["P4"], stops: "nonstop" })).toBe(2);
    expect(priceBounds(flights)).toEqual({ min: 100000, max: 250000 });
    expect(priceBounds([])).toEqual({ min: 0, max: 0 });
  });
});
