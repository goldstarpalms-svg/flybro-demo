import { Search, Scale, ExternalLink } from "lucide-react";

const STEPS = [
  {
    n: "01",
    icon: Search,
    title: "Search your route",
    body: "Pick your cities, dates, and passengers. Nigerian domestic routes only — no foreign filler.",
  },
  {
    n: "02",
    icon: Scale,
    title: "Compare the options",
    body: "See sample fares side by side, sorted and filtered the way you want. No favourites — no airline can pay to rank higher.",
  },
  {
    n: "03",
    icon: ExternalLink,
    title: "Continue to the airline",
    body: "FlyBro doesn't sell tickets. Pick a fare and continue to the airline's own site to book and pay — exactly as if you'd found it yourself.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-[88px] bg-navy py-12 sm:py-16">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-500">
            / How it works
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Your friend who always finds the flight.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-slate-300">
            We find the fare and send you straight to the airline — the same thing you'd do if you
            had time to check ten sites yourself.
          </p>
        </div>

        <ol className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map(({ n, icon: Icon, title, body }) => (
            <li
              key={n}
              className="rounded-xl border border-white/10 bg-navy-700/60 p-5 transition-colors hover:border-brand-500/40"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-600/15 text-brand-500">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xl font-bold text-white/25">{n}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
