import { airlineByCode } from "../lib/airlines";

interface Props {
  code: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "h-8 w-8 text-[10px] rounded-md",
  md: "h-10 w-10 text-xs rounded-lg",
  lg: "h-12 w-12 text-sm rounded-xl",
};

/**
 * Logo fallback: real airline logo files are proprietary assets and are not
 * bundled in this demo. Each airline gets a clean initials avatar instead.
 */
export function AirlineAvatar({ code, size = "md" }: Props) {
  const airline = airlineByCode(code);
  const initials = airline?.initials ?? code.slice(0, 2);
  const color = airline?.color ?? "#64748B";
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center font-bold text-white ${SIZES[size]}`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </span>
  );
}
