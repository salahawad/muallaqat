/**
 * A seated, robed reciter — turban with a falling drape, shoulders wrapped in a
 * cloak, and (in two of three poses) a raised hand mid-recitation. An evocative
 * silhouette, not a portrait: it gives each master presence and dignity without
 * inventing an inaccurate face. Three poses keep a gathering from looking cloned.
 */
type RobedFigureProps = {
  /** 0 | 1 | 2 — chosen deterministically per poet so the row varies. */
  pose?: number;
  className?: string;
};

export function RobedFigure({ pose = 0, className = '' }: RobedFigureProps) {
  return (
    <svg
      className={`robed-figure ${className}`}
      viewBox="0 0 160 180"
      preserveAspectRatio="xMidYMax meet"
      role="presentation"
      aria-hidden="true"
    >
      {pose === 0 && <PoseListening />}
      {pose === 1 && <PoseReciting />}
      {pose === 2 && <PoseHandToHeart />}
    </svg>
  );
}

/* Hands resting — a listener at the majlis. */
function PoseListening() {
  return (
    <g>
      <Turban />
      <Head />
      {/* cloak: broad seated base, arms folded in the lap */}
      <path d="M80 60 q-18 0 -28 12 q-20 22 -26 64 q-3 22 -3 38 h114 q0 -16 -3 -38 q-6 -42 -26 -64 q-10 -12 -28 -12 Z" />
      {/* folded hands suggested by a lighter notch */}
      <path d="M62 150 q18 10 36 0 q-6 12 -18 12 q-12 0 -18 -12 Z" opacity="0.55" />
      <Drape />
    </g>
  );
}

/* One hand raised, palm open — declaiming a verse. */
function PoseReciting() {
  return (
    <g>
      <Turban />
      <Head />
      <path d="M80 60 q-18 0 -28 12 q-20 22 -26 64 q-3 22 -3 38 h114 q0 -16 -3 -38 q-6 -42 -26 -64 q-10 -12 -28 -12 Z" />
      {/* raised right arm + open hand */}
      <path d="M104 78 q22 -10 30 -34 q3 -8 9 -6 q5 2 3 9 q-8 30 -34 44 q-10 5 -8 -13 Z" />
      <circle cx="142" cy="34" r="7" />
      <Drape />
    </g>
  );
}

/* Hand to heart — the human, intimate register (love, lament). */
function PoseHandToHeart() {
  return (
    <g>
      <Turban />
      <Head />
      <path d="M80 60 q-18 0 -28 12 q-20 22 -26 64 q-3 22 -3 38 h114 q0 -16 -3 -38 q-6 -42 -26 -64 q-10 -12 -28 -12 Z" />
      {/* forearm crossing to the chest */}
      <path d="M96 92 q-18 6 -34 -2 q-7 -3 -10 3 q-3 6 4 10 q22 12 46 4 q12 -4 -6 -15 Z" opacity="0.85" />
      <Drape />
    </g>
  );
}

/* shared primitives */
function Head() {
  return <circle cx="80" cy="40" r="15" />;
}
function Turban() {
  // a wound turban sitting above the head
  return (
    <path d="M62 36 q2 -20 18 -22 q16 2 18 22 q-4 -10 -18 -10 q-14 0 -18 10 Z" />
  );
}
function Drape() {
  // the headdress cloth falling to one shoulder
  return <path d="M64 30 q-10 26 -6 60 q-8 -2 -10 -18 q-3 -28 16 -42 Z" opacity="0.7" />;
}
