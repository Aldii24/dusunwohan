const WORDS = [
  "Guyub Rukun",
  "Gotong Royong",
  "Sawah & Ladang",
  "Merti Dusun",
  "Kabar Warga",
  "UMKM Tumbuh",
];

/** Strip teks berjalan pemisah section — sentuhan editorial. */
export function Ticker() {
  const row = [...WORDS, ...WORDS];
  return (
    <div className="overflow-hidden border-y border-forest-deep/10 bg-terracotta py-3">
      <div className="animate-marquee flex w-max items-center gap-8">
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center gap-8" aria-hidden={half === 1}>
            {row.map((word, i) => (
              <span
                key={`${half}-${i}`}
                className="flex items-center gap-8 whitespace-nowrap font-display text-lg font-medium italic text-cream"
              >
                {word}
                <svg viewBox="0 0 24 24" className="size-3 text-gold" aria-hidden="true">
                  <path d="M12 0 L14.6 9.4 L24 12 L14.6 14.6 L12 24 L9.4 14.6 L0 12 L9.4 9.4 Z" fill="currentColor" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
