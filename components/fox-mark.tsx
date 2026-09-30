export function FoxMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path fill="#BE5205" d="M14 30 26 6l8 16L14 30Z" />
      <path fill="#F59E0B" d="M50 30 38 6l-8 16 20 8Z" />
      <path fill="#BE5205" d="M8 34c2 16 12 26 24 26s22-10 24-26c-8 8-16 6-24 6s-16 2-24-6Z" />
      <circle cx="26" cy="40" r="2.2" fill="#1C1C1C" />
      <circle cx="38" cy="40" r="2.2" fill="#1C1C1C" />
      <circle cx="32" cy="32" r="1.7" fill="#FFFDE1" />
      <path d="M26 40 32 32l6 8" fill="none" stroke="#FFFDE1" strokeWidth="1.2" />
      <path d="M32 46v6" stroke="#1C1C1C" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
