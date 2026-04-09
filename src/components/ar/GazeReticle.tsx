interface GazeReticleProps {
  dwellProgress: number;
  gazeLabel: string | null;
  offset: { x: number; y: number };
}

const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const GazeReticle = ({ dwellProgress, gazeLabel, offset }: GazeReticleProps) => {
  return (
    <div
      className="pointer-events-none fixed z-[9999]"
      style={{
        left: `calc(50% + ${offset.x}px)`,
        top: `calc(50% + ${offset.y}px)`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* SVG ring */}
      <svg width="56" height="56" className="block">
        {/* Track */}
        <circle
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke="hsl(var(--foreground) / 0.2)"
          strokeWidth="3"
        />
        {/* Progress */}
        <circle
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - dwellProgress)}
          className="transition-[stroke-dashoffset] duration-75"
          style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
        />
        {/* Center dot */}
        <circle cx="28" cy="28" r="3" fill="hsl(var(--primary))" />
      </svg>

      {/* Label */}
      {gazeLabel && (
        <div className="mt-1 whitespace-nowrap rounded-full bg-background/80 px-2 py-0.5 text-center text-[10px] font-medium text-foreground backdrop-blur-sm">
          {gazeLabel}
        </div>
      )}
    </div>
  );
};

export default GazeReticle;
