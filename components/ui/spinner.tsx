import { Link } from "lucide-react";

export function Spinner({ size = 40 }: { size?: number }) {
  const r = (size / 2) * 0.8;
  const circumference = 2 * Math.PI * r;
  return (
    <div className="relative">
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="animate-spin"
      style={{ animationDuration: "0.9s" }}
    >
      {/* Track */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={size * 0.04}
        className="text-text"
      />
      {/* Arc */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="currentColor"
        strokeWidth={size * 0.04}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * 0.75}
        className="text-Green"
        style={{ transformOrigin: "50% 50%", transform: "rotate(-90deg)" }}
        />
    </svg>
    {/* <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">loading...</p> */}
    <Link className="absolute w-6 h-6 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-Green" />
    </div>
  );
}
