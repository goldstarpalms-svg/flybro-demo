import { useEffect, useState } from "react";
import { Menu, X, Plane } from "lucide-react";
import { Logo } from "./Logo";
import { scrollToId } from "../lib/format";

interface Props {
  onFindFlights: () => void;
  onHome: () => void;
  isHome: boolean;
}

const LINKS = [
  { id: "search", label: "Search flights" },
  { id: "destinations", label: "Destinations" },
  { id: "airlines", label: "Airlines" },
  { id: "how-it-works", label: "How it works" },
  { id: "faq", label: "FAQ" },
];

export function Navigation({ onFindFlights, onHome, isHome }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goSection = (id: string) => {
    setMenuOpen(false);
    if (!isHome) {
      onHome();
      // Allow home to render before scrolling.
      requestAnimationFrame(() => scrollToId(id));
    } else {
      scrollToId(id);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors ${
        scrolled ? "border-line bg-white/95 backdrop-blur" : "border-transparent bg-white"
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-4">
        <button type="button" onClick={onHome} aria-label="FlyBro home" className="shrink-0">
          <Logo />
        </button>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => goSection(l.id)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-canvas hover:text-ink"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" onClick={onFindFlights} className="btn-primary hidden sm:inline-flex">
            <Plane className="h-4 w-4" aria-hidden="true" />
            Find flights
          </button>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-ink lg:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="border-t border-line bg-white lg:hidden">
          <nav aria-label="Mobile navigation" className="shell flex flex-col gap-1 py-3">
            {LINKS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => goSection(l.id)}
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-ink hover:bg-canvas"
              >
                {l.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onFindFlights();
              }}
              className="btn-primary mt-1"
            >
              <Plane className="h-4 w-4" aria-hidden="true" />
              Find flights
            </button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
