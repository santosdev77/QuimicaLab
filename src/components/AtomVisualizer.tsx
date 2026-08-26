interface Props {
  size?: number;
  protons?: number;
  electrons?: number;
  animated?: boolean;
}

const SHELL_CAPACITIES = [2, 8, 18, 32, 50, 50, 40];
const ORBIT_TILTS = [0, 58, 118, 28, 88, 148, 42];
const ORBIT_SQUASHES = [0.5, 0.38, 0.48, 0.34, 0.43, 0.36, 0.46];

export default function AtomVisualizer({
  size = 240,
  protons = 8,
  electrons = protons,
  animated = true,
}: Props) {
  const center = size / 2;
  const safeElectronCount = Math.max(0, Math.min(200, Math.round(electrons)));
  const nucleusR = size * 0.09;
  const electronR = Math.max(
    2.5,
    Math.min(size * 0.032, size / (Math.sqrt(Math.max(safeElectronCount, 1)) * 7)),
  );

  let remaining = safeElectronCount;
  const shells = SHELL_CAPACITIES.map((capacity) => {
    const count = Math.min(remaining, capacity);
    remaining -= count;
    return count;
  }).filter((count) => count > 0);

  return (
    <div
      className="relative select-none"
      style={{ width: size, height: size }}
      aria-label={`Átomo com ${protons} prótons e ${safeElectronCount} elétrons`}
      role="img"
    >
      <style>{`
        @keyframes atomElectronOrbit {
          from { transform: rotate(var(--orbit-tilt)) scaleY(var(--orbit-squash)) rotate(var(--electron-phase)); }
          to { transform: rotate(var(--orbit-tilt)) scaleY(var(--orbit-squash)) rotate(calc(var(--electron-phase) + 360deg)); }
        }
        @keyframes atomNucleusPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
        .atom-electron-orbit {
          animation: atomElectronOrbit var(--orbit-duration) linear infinite var(--orbit-direction);
          animation-delay: var(--orbit-delay);
          animation-play-state: var(--atom-play-state);
        }
        .atom-nucleus { animation: atomNucleusPulse 2.2s ease-in-out infinite; animation-play-state: var(--atom-play-state); }
        @media (prefers-reduced-motion: reduce) { .atom-electron-orbit, .atom-nucleus { animation: none; } }
      `}</style>

      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="absolute inset-0">
        {shells.map((_, shellIndex) => {
          const radius = size * (0.16 + shellIndex * 0.045);
          return (
            <ellipse
              key={shellIndex}
              cx={center}
              cy={center}
              rx={radius}
              ry={radius * ORBIT_SQUASHES[shellIndex]}
              fill="none"
              stroke="#93c5fd"
              strokeWidth={shellIndex === 0 ? 1.5 : 1.15}
              opacity={0.82}
              transform={`rotate(${ORBIT_TILTS[shellIndex]} ${center} ${center})`}
            />
          );
        })}
      </svg>

      {shells.flatMap((count, shellIndex) => {
        const radius = size * (0.16 + shellIndex * 0.045);
        const duration = 3.1 + shellIndex * 0.7;
        const direction = shellIndex % 2 === 0 ? "normal" : "reverse";

        return Array.from({ length: count }, (_, electronIndex) => {
          const phase = (electronIndex / count) * 360;
          return (
            <div
              key={`${shellIndex}-${electronIndex}`}
              className="atom-electron-orbit absolute"
              style={{
                width: radius * 2,
                height: radius * 2,
                left: center - radius,
                top: center - radius,
                transformOrigin: "center",
                zIndex: 5,
                "--orbit-tilt": `${ORBIT_TILTS[shellIndex]}deg`,
                "--orbit-squash": String(ORBIT_SQUASHES[shellIndex]),
                "--electron-phase": `${phase}deg`,
                "--orbit-duration": `${duration}s`,
                "--orbit-delay": `${-(electronIndex / count) * duration}s`,
                "--orbit-direction": direction,
                "--atom-play-state": animated ? "running" : "paused",
              } as React.CSSProperties}
            >
              <div
                style={{
                  position: "absolute",
                  width: electronR * 2,
                  height: electronR * 2,
                  left: radius * 2 - electronR,
                  top: radius - electronR,
                  borderRadius: "9999px",
                  background: "radial-gradient(circle at 35% 30%, #eff6ff, #60a5fa 52%, #2563eb)",
                  boxShadow: "0 0 7px rgba(147, 197, 253, 1), 0 0 15px rgba(59, 130, 246, 0.65)",
                }}
              />
            </div>
          );
        });
      })}

      <div
        className="atom-nucleus absolute flex items-center justify-center rounded-full"
        style={{
          width: nucleusR * 2,
          height: nucleusR * 2,
          left: center - nucleusR,
          top: center - nucleusR,
          zIndex: 10,
          "--atom-play-state": animated ? "running" : "paused",
          background: "radial-gradient(circle at 35% 30%, #60a5fa, #2563eb 55%, #1d4ed8)",
          boxShadow: "0 0 22px rgba(37, 99, 235, 0.45)",
        } as React.CSSProperties}
      >
        <span style={{ color: "white", fontWeight: 800, fontFamily: "monospace", fontSize: nucleusR * 0.8, textShadow: "0 1px 3px rgba(0,0,0,0.25)" }}>
          {protons}
        </span>
      </div>
    </div>
  );
}
