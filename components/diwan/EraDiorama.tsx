/**
 * A painterly, layered horizon for an era scene — built entirely from inline SVG
 * so it stays crisp, lightweight, and themeable by the era palette. Not a photo:
 * an evocative silhouette diorama (dunes, a lone tree, tents, a caravan on the
 * ridge for the desert night; domes/arches for the cities). Decorative only.
 *
 * `variant` selects the motif; colors come from the era's CSS custom props
 * (--era-a / --era-b / --era-accent) already set on the scene, with a warm
 * horizon glow so the land sits under its own sky.
 */
type DioramaVariant = 'desert-night' | 'duel' | 'golden-court' | 'garden' | 'nahda';

type EraDioramaProps = {
  variant: DioramaVariant;
};

export function EraDiorama({ variant }: EraDioramaProps) {
  return (
    <div className={`era-diorama era-diorama--${variant}`} aria-hidden="true">
      <svg
        className="era-diorama__svg"
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMax slice"
        role="presentation"
      >
        <defs>
          <linearGradient id="dio-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--era-b)" />
            <stop offset="60%" stopColor="var(--era-a)" />
            <stop offset="100%" stopColor="#06080f" />
          </linearGradient>
          <radialGradient id="dio-horizon" cx="50%" cy="100%" r="75%">
            <stop offset="0%" stopColor="var(--era-accent)" stopOpacity="0.5" />
            <stop offset="45%" stopColor="var(--era-accent)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--era-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky + a warm glow rising off the horizon. */}
        <rect x="0" y="0" width="1440" height="600" fill="url(#dio-sky)" />
        <rect x="0" y="180" width="1440" height="420" fill="url(#dio-horizon)" />

        {variant === 'desert-night' && <DesertNight />}
        {variant === 'duel' && <DuelGround />}
        {variant === 'golden-court' && <GoldenCourt />}
        {variant === 'garden' && <Garden />}
        {variant === 'nahda' && <Nahda />}
      </svg>
    </div>
  );
}

/* The pre-Islamic desert at night: layered dunes, a caravan on the far ridge,
   scattered tents, and a lone tree — the world the Muʿallaqāt were sung in. */
function DesertNight() {
  const ink = '#06080f';
  return (
    <g>
      {/* far ridge with a tiny caravan */}
      <path d="M0,300 Q360,250 720,290 T1440,280 V600 H0 Z" fill={ink} opacity="0.45" />
      <g fill={ink} opacity="0.65" transform="translate(980,272)">
        <Camel x={0} /> <Camel x={34} /> <Camel x={68} />
      </g>
      {/* mid dune */}
      <path d="M0,380 Q300,330 640,372 Q980,410 1440,360 V600 H0 Z" fill={ink} opacity="0.7" />
      {/* tents on the mid dune */}
      <g fill={ink} opacity="0.92" transform="translate(190,372)">
        <Tent x={0} /> <Tent x={70} s={0.8} />
      </g>
      {/* lone tree, right of centre */}
      <g transform="translate(1080,300)" fill={ink} opacity="0.95">
        <rect x="-4" y="0" width="8" height="80" rx="2" />
        <path d="M0,10 q-60,-34 -96,-6 q44,-6 96,18 q52,-24 96,-18 q-36,-28 -96,6 Z" />
      </g>
      {/* near dune (darkest) */}
      <path d="M0,470 Q380,420 760,468 Q1100,510 1440,455 V600 H0 Z" fill={ink} opacity="0.95" />
    </g>
  );
}

function DuelGround() {
  const ink = '#06080f';
  return (
    <g>
      <path d="M0,330 Q360,300 720,330 T1440,320 V600 H0 Z" fill={ink} opacity="0.55" />
      {/* two facing tents / banners of rival camps */}
      <g fill={ink} opacity="0.9" transform="translate(260,330)">
        <Tent x={0} s={1.2} />
      </g>
      <g fill={ink} opacity="0.9" transform="translate(1080,330)">
        <Tent x={0} s={1.2} />
      </g>
      <path d="M0,440 Q380,400 760,442 Q1100,486 1440,430 V600 H0 Z" fill={ink} opacity="0.95" />
    </g>
  );
}

/* The Abbasid city: a skyline of domes and minarets. */
function GoldenCourt() {
  const ink = '#06080f';
  return (
    <g fill={ink}>
      <rect x="0" y="430" width="1440" height="170" opacity="0.95" />
      <g opacity="0.8" transform="translate(0,200)">
        <Minaret x={180} h={230} />
        <Dome x={420} r={70} />
        <Minaret x={620} h={200} />
        <Dome x={820} r={95} />
        <Minaret x={1040} h={250} />
        <Dome x={1230} r={64} />
      </g>
    </g>
  );
}

/* Al-Andalus: horseshoe arches and a cypress. */
function Garden() {
  const ink = '#06080f';
  return (
    <g fill={ink}>
      <rect x="0" y="460" width="1440" height="140" opacity="0.95" />
      <g opacity="0.82" transform="translate(0,300)">
        <Arch x={300} /> <Arch x={560} /> <Arch x={820} /> <Arch x={1080} />
        {/* cypress trees */}
        <path d="M210,160 q14,-120 28,0 Z" />
        <path d="M1190,160 q14,-110 28,0 Z" />
      </g>
    </g>
  );
}

/* The Nahda / Mahjar: a coastal city skyline (Beirut), where the father stands. */
function Nahda() {
  const ink = '#1a130a';
  return (
    <g fill={ink}>
      <rect x="0" y="470" width="1440" height="130" opacity="0.9" />
      <g opacity="0.55">
        {Array.from({ length: 22 }).map((_, i) => {
          const x = 60 + i * 62;
          const h = 60 + ((i * 53) % 130);
          return <rect key={i} x={x} y={470 - h} width="34" height={h} />;
        })}
      </g>
    </g>
  );
}

/* ---- tiny silhouette primitives ---- */
function Camel({ x }: { x: number }) {
  return (
    <path
      transform={`translate(${x},0) scale(0.6)`}
      d="M2,20 l4,-10 l3,0 l2,6 q4,-10 10,-6 q3,2 2,6 l3,0 l3,10 l-3,0 l-2,-6 l-10,0 l-2,6 Z"
    />
  );
}
function Tent({ x, s = 1 }: { x: number; s?: number }) {
  return <path transform={`translate(${x},0) scale(${s})`} d="M0,0 L26,-30 L52,0 Z" />;
}
function Minaret({ x, h }: { x: number; h: number }) {
  return (
    <g transform={`translate(${x},0)`}>
      <rect x="-9" y={230 - h} width="18" height={h} />
      <path d={`M-9,${230 - h} L0,${230 - h - 22} L9,${230 - h} Z`} />
    </g>
  );
}
function Dome({ x, r }: { x: number; r: number }) {
  return (
    <g transform={`translate(${x},0)`}>
      <path d={`M${-r},230 A${r},${r} 0 0 1 ${r},230 Z`} />
      <rect x="-3" y={230 - r - 26} width="6" height="26" />
    </g>
  );
}
function Arch({ x }: { x: number }) {
  return (
    <path
      transform={`translate(${x},0)`}
      d="M-40,160 L-40,40 A40,40 0 0 1 40,40 L40,160 L24,160 L24,46 A24,24 0 0 0 -24,46 L-24,160 Z"
    />
  );
}
