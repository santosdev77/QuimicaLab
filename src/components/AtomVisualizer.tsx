interface Props {
  size?: number;
  protons?: number;
  animated?: boolean;
}

export default function AtomVisualizer({ size = 240, protons = 8, animated = true }: Props) {
  const center = size / 2;
  const r1 = size * 0.22;
  const r2 = size * 0.35;
  const r3 = size * 0.45;
  const nucleusR = size * 0.09;
  const electronR = size * 0.032;

  return (
    <div
      className="relative select-none"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0"
      >
        {/* Orbit rings */}
        <ellipse cx={center} cy={center} rx={r1} ry={r1 * 0.38} fill="none" stroke="#bfdbfe" strokeWidth="1.2" />
        <ellipse cx={center} cy={center} rx={r2} ry={r2 * 0.38} fill="none" stroke="#93c5fd" strokeWidth="1" transform={`rotate(60 ${center} ${center})`} />
        <ellipse cx={center} cy={center} rx={r3} ry={r3 * 0.38} fill="none" stroke="#60a5fa" strokeWidth="0.8" transform={`rotate(120 ${center} ${center})`} />
      </svg>

      {/* Nucleus */}
      <div
        className={`absolute rounded-full ${animated ? "nucleus" : ""} bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg`}
        style={{
          width: nucleusR * 2,
          height: nucleusR * 2,
          left: center - nucleusR,
          top: center - nucleusR,
        }}
      >
        <div className="w-full h-full rounded-full flex items-center justify-center">
          <span className="text-white font-bold font-mono" style={{ fontSize: nucleusR * 0.8 }}>
            {protons}
          </span>
        </div>
      </div>

      {/* Orbit 1 — electron */}
      <div
        className={`absolute ${animated ? "orbit-1" : ""}`}
        style={{
          width: r1 * 2,
          height: r1 * 0.76,
          left: center - r1,
          top: center - r1 * 0.38,
          transformOrigin: `${r1}px ${r1 * 0.38}px`,
        }}
      >
        <div
          className="absolute rounded-full bg-blue-400 shadow-sm shadow-blue-300"
          style={{
            width: electronR * 2,
            height: electronR * 2,
            top: -electronR,
            left: r1 - electronR,
          }}
        />
      </div>

      {/* Orbit 2 */}
      <div
        className={`absolute ${animated ? "orbit-2" : ""}`}
        style={{
          width: r2 * 2,
          height: r2 * 0.76,
          left: center - r2,
          top: center - r2 * 0.38,
          transformOrigin: `${r2}px ${r2 * 0.38}px`,
          transform: "rotate(60deg)",
        }}
      >
        <div
          className="absolute rounded-full bg-blue-300 shadow-sm shadow-blue-200"
          style={{
            width: electronR * 2,
            height: electronR * 2,
            top: -electronR,
            left: r2 - electronR,
          }}
        />
      </div>

      {/* Orbit 3 */}
      <div
        className={`absolute ${animated ? "orbit-3" : ""}`}
        style={{
          width: r3 * 2,
          height: r3 * 0.76,
          left: center - r3,
          top: center - r3 * 0.38,
          transformOrigin: `${r3}px ${r3 * 0.38}px`,
          transform: "rotate(120deg)",
        }}
      >
        <div
          className="absolute rounded-full bg-blue-200 shadow-sm"
          style={{
            width: electronR * 2,
            height: electronR * 2,
            top: -electronR,
            left: r3 - electronR,
          }}
        />
      </div>
    </div>
  );
}
