/**
 * An eight-pointed star lattice — two squares, one turned forty-five degrees,
 * joined tile to tile so the field runs unbroken. Draws in `currentColor`, so
 * the caller sets both hue and opacity with plain text utilities.
 */
export function StarLattice({
  id = "star-lattice",
  className = "",
}: {
  id?: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <pattern id={id} width="72" height="72" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="19" y="19" width="34" height="34" />
            <path d="M36 12 60 36 36 60 12 36Z" />
            {/* Reaches into the neighbouring tiles so the lattice joins up. */}
            <path d="M0 36h12M60 36h12M36 0v12M36 60v12" />
            <circle cx="36" cy="36" r="3.5" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
