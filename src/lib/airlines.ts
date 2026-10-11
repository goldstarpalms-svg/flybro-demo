import type { Airline } from "./types";

/**
 * Nigerian domestic airlines featured in the demo directory.
 * The directory is informational only — no partnership or endorsement is implied.
 * `website` values are public, well-known domains where applicable; blanks mean
 * the demo does not verify a public booking site and never fabricates one.
 */
export const AIRLINES: Airline[] = [
  { code: "P4", name: "Air Peace", website: "https://www.flyairpeace.com", initials: "AP", color: "#15803D", fareFactor: 1.0, note: "Largest domestic network" },
  { code: "QI", name: "Ibom Air", website: "https://www.ibomair.com", initials: "IA", color: "#2563EB", fareFactor: 1.06, note: "South-South hub carrier" },
  { code: "Q9", name: "Green Africa", website: "https://www.greenafrica.com", initials: "GA", color: "#16A34A", fareFactor: 0.86, note: "Value fares" },
  { code: "W3", name: "Arik Air", website: "https://www.arikair.com", initials: "AR", color: "#DC2626", fareFactor: 1.02, note: "Legacy domestic operator" },
  { code: "NG", name: "Aero Contractors", website: "https://www.flyaero.com", initials: "AC", color: "#0E7490", fareFactor: 0.98, note: "Long-standing operator" },
  { code: "VM", name: "Max Air", website: "", initials: "MA", color: "#B45309", fareFactor: 0.97, note: "Northern routes" },
  { code: "UN", name: "United Nigeria", website: "https://www.flyunitednigeria.com", initials: "UN", color: "#1D4ED8", fareFactor: 0.95, note: "Growing regional network" },
  { code: "OF", name: "Overland Airways", website: "https://www.overlandairways.com", initials: "OV", color: "#7C3AED", fareFactor: 1.0, note: "Domestic & regional" },
  { code: "VK", name: "ValueJet", website: "", initials: "VJ", color: "#EA580C", fareFactor: 0.92, note: "Value fares" },
  { code: "2N", name: "NG Eagle", website: "", initials: "NE", color: "#0369A1", fareFactor: 0.94, note: "Domestic operator" },
  { code: "R5", name: "Rano Air", website: "", initials: "RA", color: "#9333EA", fareFactor: 0.9, note: "Northern routes" },
  { code: "UZ", name: "Umza Air", website: "", initials: "UZ", color: "#0F766E", fareFactor: 0.88, note: "Domestic operator" },
  { code: "XE", name: "XE Jet", website: "", initials: "XE", color: "#334155", fareFactor: 1.35, note: "Premium cabin focus" },
  { code: "EN", name: "Enugu Air", website: "", initials: "EA", color: "#166534", fareFactor: 0.96, note: "South East routes" },
  { code: "BN", name: "Binani Air", website: "", initials: "BA", color: "#A16207", fareFactor: 0.93, note: "Domestic operator" },
];

const BY_CODE = new Map(AIRLINES.map((a) => [a.code, a]));

export function airlineByCode(code: string): Airline | undefined {
  return BY_CODE.get(code);
}
