import { Logo } from "./Logo";
import { scrollToId } from "../lib/format";

interface Props {
  onHome: () => void;
  isHome: boolean;
}

export function Footer({ onHome, isHome }: Props) {
  const go = (id: string) => {
    if (!isHome) {
      onHome();
      requestAnimationFrame(() => scrollToId(id));
    } else {
      scrollToId(id);
    }
  };

  return (
    <footer className="border-t border-line bg-white">
      <div className="shell py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              Compare Nigerian domestic flight options in one search, then book direct with the
              airline.
            </p>
          </div>
          <nav aria-label="Product links">
            <p className="text-sm font-semibold text-ink">Product</p>
            <ul className="mt-3 space-y-2">
              {[
                { label: "Search flights", id: "search" },
                { label: "Destinations", id: "destinations" },
                { label: "Airlines", id: "airlines" },
                { label: "How it works", id: "how-it-works" },
              ].map((l) => (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => go(l.id)}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Support links">
            <p className="text-sm font-semibold text-ink">Support</p>
            <ul className="mt-3 space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => go("faq")}
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go("faq")}
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  How comparison works
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => go("faq")}
                  className="text-sm text-muted transition-colors hover:text-ink"
                >
                  Booking &amp; payments
                </button>
              </li>
            </ul>
          </nav>
          <div>
            <p className="text-sm font-semibold text-ink">About this build</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Independent demonstration prepared for the FlyBro team. All fares and schedules are
              sample data. The original service at flybro.app is not modified by this project.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <p className="text-xs leading-relaxed text-muted">
            FlyBro has no accounts or payments in this demo. Sample fares only — never live prices.
            Airlines shown are listed for comparison purposes; no partnership or endorsement is
            implied. This demo does not issue tickets, collect payment credentials, or complete
            bookings.
          </p>
          <p className="mt-3 text-xs text-muted">
            © {new Date().getFullYear()} FlyBro demonstration build. All rights with their respective
            owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
