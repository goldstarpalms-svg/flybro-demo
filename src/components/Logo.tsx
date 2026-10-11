export function Logo({ className = "h-8" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`} aria-label="FlyBro">
      <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#0B1220" />
        <path
          d="M7 17.5 25 9l-4.2 7.2 3.2 5.3-2.6 1.2-3.6-4.3-4.2 3.1-.2 3.2-2.1.9-.8-3.6-3.4-1.6L7 17.5Z"
          fill="#3B82F6"
        />
        <path d="M12.2 18.3 22.2 12" stroke="#EFF6FF" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
      <span className="text-lg font-bold tracking-tight text-navy">
        Fly<span className="text-brand-600">Bro</span>
      </span>
    </span>
  );
}
