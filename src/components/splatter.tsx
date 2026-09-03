/**
 * Ice splatter.
 *
 * Three layers, and the split matters:
 *  - lobes: overlapping circles that the gooey filter fuses into one body
 *  - arms:  ellipses radiating from centre, each capped with a bulb — these
 *           are what make it read as a thrown splash rather than a blob
 *  - spray: small circles OUTSIDE the filter, so they stay crisp (anything
 *           under ~10px is destroyed by the blur/threshold pass)
 *
 * Static. Animate the wrapper's transform, never the filter.
 */

const LOBES: [number, number, number][] = [
  [100, 100, 29],
  [73, 77, 20],
  [130, 74, 21],
  [127, 127, 18],
  [72, 127, 17],
  [101, 138, 14],
];

/** [angle°, length, halfWidth] */
const ARMS: [number, number, number][] = [
  [8, 80, 9],
  [52, 60, 6.5],
  [97, 86, 8],
  [143, 56, 6],
  [188, 74, 9],
  [232, 64, 7],
  [279, 90, 7.5],
  [321, 52, 5.5],
];

/** Thrown spray, drawn crisp. */
const SPRAY: [number, number, number][] = [
  [16, 34, 4.6],
  [186, 44, 3.4],
  [170, 12, 2.4],
  [40, 14, 3],
  [9, 122, 3.8],
  [193, 128, 2.9],
  [82, 190, 3.6],
  [174, 186, 2.5],
  [28, 184, 2.3],
  [128, 8, 2.1],
  [58, 52, 2.4],
  [152, 108, 2.2],
  [196, 92, 1.9],
  [6, 76, 2.1],
];

type Props = {
  scope: string;
  className?: string;
  /** degrees; reuse one shape at different angles rather than authoring more */
  rotate?: number;
  flip?: boolean;
  from?: string;
  to?: string;
};

export function Splatter({
  scope,
  className,
  rotate = 0,
  flip = false,
  from = "#8fd2e8",
  to = "#16688c",
}: Props) {
  const goo = `${scope}-goo`;
  const grad = `${scope}-grad`;

  return (
    /*
      overflow visible, because an SVG root clips to its own viewBox by
      default and the group below is rotated. Rotation carries the outermost
      spray dots past the 200x200 box — four to six of them in every instance
      on the site — and each one was rendering as a half circle sliced on a
      dead-straight line. The shape is authored to bleed; the element it is
      drawn in has to let it.
    */
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={{ overflow: "visible" }}
      aria-hidden
      focusable="false"
    >
      <defs>
        <filter id={goo} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="b" />
          <feColorMatrix
            in="b"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 30 -14"
          />
        </filter>
        <linearGradient id={grad} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>

      <g
        transform={`rotate(${rotate} 100 100)${flip ? " scale(-1 1) translate(-200 0)" : ""}`}
        fill={`url(#${grad})`}
      >
        <g filter={`url(#${goo})`}>
          {LOBES.map(([cx, cy, r], i) => (
            <circle key={`l${i}`} cx={cx} cy={cy} r={r} />
          ))}
          {ARMS.map(([deg, len, w], i) => (
            <g key={`a${i}`} transform={`rotate(${deg} 100 100)`}>
              <ellipse cx="100" cy={100 - len / 2} rx={w} ry={len / 2} />
              <circle cx="100" cy={100 - len} r={w * 0.8} />
            </g>
          ))}
        </g>

        {SPRAY.map(([cx, cy, r], i) => (
          <circle key={`s${i}`} cx={cx} cy={cy} r={r} />
        ))}
      </g>
    </svg>
  );
}

/** Loose spray only — for edges and corners where a full splash is too heavy. */
export function Flecks({
  scope,
  className,
  color = "#2e9dc8",
}: {
  scope: string;
  className?: string;
  color?: string;
}) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      style={{ overflow: "visible" }}
      aria-hidden
      focusable="false"
    >
      <g fill={color}>
        {SPRAY.map(([cx, cy, r], i) => (
          <circle key={`${scope}-${i}`} cx={cx} cy={cy} r={r} />
        ))}
      </g>
    </svg>
  );
}
