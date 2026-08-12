/**
 * The freezable core — a translucent gel disc that seats in the lid.
 * Drawn with fracture facets rather than a smooth gradient so it reads
 * as frozen rather than as a blue button.
 */

const FACETS = [
  "M200 52 L268 96 L246 168 L200 186 L158 160 L142 96 Z",
  "M268 96 L336 148 L318 226 L246 168 Z",
  "M336 148 L326 244 L268 306 L246 232 L318 226 Z",
  "M268 306 L200 348 L172 282 L216 236 L246 232 Z",
  "M200 348 L124 312 L102 240 L164 228 L172 282 Z",
  "M124 312 L68 240 L86 158 L140 206 L102 240 Z",
  "M68 240 L64 146 L142 96 L158 160 L140 206 Z",
  "M64 146 L132 66 L200 52 L142 96 Z",
];

export function IceCore({
  scope,
  className,
}: {
  scope: string;
  className?: string;
}) {
  const id = (n: string) => `${scope}-${n}`;

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="Freezable cooling core"
    >
      <defs>
        <radialGradient id={id("body")} cx="0.38" cy="0.32" r="0.78">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
          <stop offset="38%" stopColor="#a5dcee" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#1d7ba1" stopOpacity="0.98" />
        </radialGradient>
        <linearGradient id={id("rim")} x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.6" />
        </linearGradient>
        <radialGradient id={id("chill")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="58%" stopColor="#2e9dc8" stopOpacity="0" />
          <stop offset="100%" stopColor="#2e9dc8" stopOpacity="0.3" />
        </radialGradient>
        <clipPath id={id("disc")}>
          <circle cx="200" cy="200" r="150" />
        </clipPath>
      </defs>

      {/* cold bloom */}
      <circle cx="200" cy="200" r="184" fill={`url(#${id("chill")})`} opacity="0.5" />

      <circle cx="200" cy="200" r="150" fill={`url(#${id("body")})`} />

      <g clipPath={`url(#${id("disc")})`}>
        {/* internal fracture planes */}
        <g fill="#f2f9fc" opacity="0.14">
          {FACETS.filter((_, i) => i % 2 === 0).map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        <g stroke="#f2f9fc" strokeWidth="1.1" fill="none" opacity="0.45">
          {FACETS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>

        {/* frost bloom crawling in from the edge */}
        <g stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" opacity="0.5" fill="none">
          {Array.from({ length: 18 }, (_, i) => i * 20).map((deg) => (
            <g key={deg} transform={`rotate(${deg} 200 200)`}>
              <path d="M200 348 L200 316" />
              <path d="M200 330 l-9 -9 M200 330 l9 -9" />
            </g>
          ))}
        </g>

        {/* specular sweep */}
        <path
          d="M-20 150 L150 -40 L232 34 L62 224 Z"
          fill="#ffffff"
          opacity="0.16"
        />
      </g>

      {/* embossed mark, frozen into the gel */}
      <g
        stroke="#f2f9fc"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
        opacity="0.5"
      >
        {[0, 60, 120].map((deg) => (
          <line
            key={deg}
            x1="200"
            y1="164"
            x2="200"
            y2="236"
            transform={`rotate(${deg} 200 200)`}
          />
        ))}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 200 200)`}>
            <line x1="200" y1="172" x2="191" y2="181" />
            <line x1="200" y1="172" x2="209" y2="181" />
          </g>
        ))}
      </g>

      {/* thumb scoop at the rim, so it lifts out of the chamber */}
      <path
        d="M312 152 A 30 30 0 0 1 312 200 Z"
        fill="#10203a"
        opacity="0.16"
      />
      <path
        d="M312 152 A 30 30 0 0 1 312 200"
        fill="none"
        stroke="#f2f9fc"
        strokeWidth="1.4"
        opacity="0.6"
      />

      <circle
        cx="200"
        cy="200"
        r="150"
        fill="none"
        stroke={`url(#${id("rim")})`}
        strokeWidth="3"
      />
      <circle
        cx="200"
        cy="200"
        r="151"
        fill="none"
        stroke="#10203a"
        strokeOpacity="0.18"
        strokeWidth="1.2"
      />
    </svg>
  );
}
