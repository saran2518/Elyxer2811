import { Wand2 } from "lucide-react";

interface RelevanceOrbProps {
  relevance: number;
  size?: number;
}

export default function RelevanceOrb({ relevance, size = 52 }: RelevanceOrbProps) {
  const clamped = Math.max(0, Math.min(1, relevance));
  const filledCount = Math.max(1, Math.round(clamped * 6));

  const ariaLabel = (() => {
    if (filledCount >= 5) return "Highly relevant";
    if (filledCount >= 3) return "Relevant";
    return "Somewhat relevant";
  })();

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.40625; // ~26px at 64px
  const strokeWidth = size * 0.0625; // 4px at 64px
  const segmentAngle = 48;
  const gapAngle = 12;

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const segments = Array.from({ length: 6 }, (_, i) => {
    const startAngle = -90 + i * (segmentAngle + gapAngle);
    const endAngle = startAngle + segmentAngle;
    const x1 = cx + radius * Math.cos(toRad(startAngle));
    const y1 = cy + radius * Math.sin(toRad(startAngle));
    const x2 = cx + radius * Math.cos(toRad(endAngle));
    const y2 = cy + radius * Math.sin(toRad(endAngle));
    return {
      d: `M ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2}`,
      active: i < filledCount,
    };
  });

  const iconSize = size * 0.375; // ~24px at 64px

  return (
    <div
      className="relative rounded-full flex items-center justify-center"
      style={{
        width: size,
        height: size,
        backgroundColor: "#0A0705",
        border: "1px solid rgba(201,168,76,0.40)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.45)",
      }}
      aria-label={ariaLabel}
      role="img"
    >
      <svg
        width={size}
        height={size}
        className="absolute inset-0"
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        {segments.map((seg, i) => (
          <path
            key={i}
            d={seg.d}
            fill="none"
            stroke={seg.active ? "#C9A84C" : "rgba(242,239,232,0.55)"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        ))}
      </svg>
      <Wand2
        className="relative z-10"
        style={{ width: iconSize, height: iconSize, color: "#C9A84C" }}
        strokeWidth={1.75}
      />
    </div>
  );
}
