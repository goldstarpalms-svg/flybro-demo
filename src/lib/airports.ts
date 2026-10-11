import type { Airport } from "./types";

/**
 * Nigerian domestic airports used by the demo.
 * Names are public knowledge; the set is a curated demo subset.
 */
export const AIRPORTS: Airport[] = [
  { code: "LOS", city: "Lagos", name: "Murtala Muhammed International", region: "South West" },
  { code: "ABV", city: "Abuja", name: "Nnamdi Azikiwe International", region: "North Central" },
  { code: "PHC", city: "Port Harcourt", name: "Port Harcourt International", region: "South South" },
  { code: "KAN", city: "Kano", name: "Mallam Aminu Kano International", region: "North West" },
  { code: "ENU", city: "Enugu", name: "Akanu Ibiam International", region: "South East" },
  { code: "CBV", city: "Calabar", name: "Margaret Ekpo International", region: "South South" },
  { code: "QOW", city: "Owerri", name: "Sam Mbakwe Airport", region: "South East" },
  { code: "ABB", city: "Asaba", name: "Asaba International", region: "South South" },
  { code: "BNI", city: "Benin City", name: "Benin Airport", region: "South South" },
  { code: "KAD", city: "Kaduna", name: "Kaduna International", region: "North West" },
  { code: "JOS", city: "Jos", name: "Yakubu Gowon Airport", region: "North Central" },
  { code: "YOL", city: "Yola", name: "Yola Airport", region: "North East" },
];

const BY_CODE = new Map(AIRPORTS.map((a) => [a.code, a]));

export function airportByCode(code: string): Airport | undefined {
  return BY_CODE.get(code);
}

export function airportLabel(code: string): string {
  const a = BY_CODE.get(code);
  return a ? `${a.city} (${a.code})` : code;
}
