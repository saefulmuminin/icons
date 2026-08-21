import Image from "next/image";

export type Badge = { name: string; logo: string | null };

/**
 * Supporting institutions on an endless belt. The list is laid twice, each
 * copy carrying its own trailing gap, so shifting the track by exactly half
 * its width lands the seam invisibly. Hovering holds it; a stated preference
 * for less motion parks it outright and lets the row scroll by hand.
 *
 * Sits inside a white card, so its edges fade to paper rather than the page.
 */
export function SupporterMarquee({ items }: { items: Badge[] }) {
  return (
    <div className="group relative overflow-hidden">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        <Belt items={items} />
        <Belt items={items} aria-hidden />
      </div>

      {/* The belt fades out at both edges rather than being cut off. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-paper to-transparent sm:w-16"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-paper to-transparent sm:w-16"
      />
    </div>
  );
}

function Belt({
  items,
  ...rest
}: { items: Badge[] } & { "aria-hidden"?: true }) {
  return (
    <ul className="flex shrink-0 items-center" {...rest}>
      {items.map((item) => (
        <li
          key={item.name}
          className="flex flex-none items-center gap-3 border-l border-ink/8 px-6"
        >
          {item.logo ? (
            <Image
              src={item.logo}
              alt=""
              width={96}
              height={96}
              className="h-9 w-9 flex-none object-contain"
            />
          ) : (
            // No mark on file yet — the initials stand in for it.
            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-brand/10 font-display text-[0.625rem] font-bold text-brand">
              {initials(item.name)}
            </span>
          )}
          <span className="font-sans text-sm leading-none font-medium whitespace-nowrap text-body">
            {item.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Up to three capitals, preferring a parenthesised acronym when there is one. */
function initials(name: string) {
  const acronym = name.match(/\(([A-Z]{2,6})\)/);
  if (acronym) return acronym[1].slice(0, 4);

  return name
    .split(/\s+/)
    .filter((word) => /^[A-Z]/.test(word))
    .map((word) => word[0])
    .join("")
    .slice(0, 3);
}
