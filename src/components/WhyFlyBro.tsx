import { LayoutList, Route, ReceiptText, MousePointerClick } from "lucide-react";

const BENEFITS = [
  {
    icon: LayoutList,
    title: "Compare in one place",
    body: "One search replaces a row of open airline tabs. Every option sits on a single, scannable list.",
  },
  {
    icon: Route,
    title: "Explore real routes",
    body: "Focus on Nigerian domestic travel — the routes people actually fly, without irrelevant filler.",
  },
  {
    icon: ReceiptText,
    title: "Understand fare differences",
    body: "See how price, timing, baggage, and flexibility change between options before you decide.",
  },
  {
    icon: MousePointerClick,
    title: "A straight-forward search",
    body: "Clear controls, honest labels, and a short path from question to answer — on any screen size.",
  },
];

export function WhyFlyBro() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="shell">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-600">
            Why FlyBro
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Built for the way Nigerians actually search for flights
          </h2>
        </div>
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-xl border border-line bg-canvas p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
