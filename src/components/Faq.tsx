import { useState } from "react";
import { ChevronDown } from "lucide-react";

const ITEMS = [
  {
    q: "How does flight comparison work on FlyBro?",
    a: "You enter your route and dates once. FlyBro gathers the available options in one list so you can compare fare, time, duration, and baggage side by side, instead of visiting airline websites one by one. In this demonstration build the options come from a clearly labelled sample dataset.",
  },
  {
    q: "Are the displayed fares live?",
    a: "Not in this demonstration. Every fare, time, and flight number shown here is simulated sample data created for the demo. In the live product, fares are gathered from the airlines and shown as seen — always check the final price on the airline's own site.",
  },
  {
    q: "Does FlyBro issue tickets?",
    a: "No. FlyBro is not an airline or a travel agency. When you choose a fare, the real product sends you to the airline's website, where you book and pay directly. This demo shows that handoff as a labelled simulation — no booking is ever completed here.",
  },
  {
    q: "How can I continue to book?",
    a: "In the live product, tapping a fare opens the airline's booking page with your route selected. In this demo, the 'Continue to booking' step explains exactly what would happen next, without charging money, collecting payment details, or pretending a reservation exists.",
  },
  {
    q: "What happens when no results are found?",
    a: "We say so clearly and suggest what to try next — a different date, a nearby airport, or removing filters. A quiet empty state beats a confusing page of nothing. Try a search and then over-filter the results to see how it behaves.",
  },
  {
    q: "Do airlines pay to appear higher in the list?",
    a: "No. The ordering is driven by your sort choice — price, departure time, or duration. Sponsored placement is deliberately excluded from the product, and it is excluded from this demonstration too.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-20 py-16 sm:py-20">
      <div className="shell max-w-3xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">FAQ</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Questions, answered honestly
          </h2>
        </div>

        <div className="mt-8 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
          {ITEMS.map((item, i) => {
            const expanded = open === i;
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`faq-panel-${i}`}
                    onClick={() => setOpen(expanded ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-canvas"
                  >
                    <span className="text-sm font-semibold text-ink sm:text-base">{item.q}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-muted transition-transform ${
                        expanded ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                {expanded ? (
                  <div id={`faq-panel-${i}`} className="px-5 pb-5 text-sm leading-relaxed text-muted">
                    {item.a}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
