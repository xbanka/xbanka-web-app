const CHART_POINTS = [300, 450, 380, 520, 480, 620, 680, 590];
const CHART_LABELS = ["Jan 1", "Jan 7", "Jan 14", "Jan 21", "Jan 28", "Feb 4", "Feb 11", "Feb 18"];

export function PayoutChart() {
  const W = 600; const H = 120;
  const max = Math.max(...CHART_POINTS);
  const min = Math.min(...CHART_POINTS);
  const pad = { x: 8, y: 10 };
  const innerW = W - pad.x * 2;
  const innerH = H - pad.y * 2;
 
  const pts = CHART_POINTS.map((v, i) => ({
    x: pad.x + (i / (CHART_POINTS.length - 1)) * innerW,
    y: pad.y + innerH - ((v - min) / (max - min)) * innerH,
  }));
 
  // Smooth bezier path
  const path = pts.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = pts[i - 1];
    const cpx = (prev.x + pt.x) / 2;
    return `${acc} C ${cpx} ${prev.y}, ${cpx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, "");
 
  const areaPath = `${path} L ${pts[pts.length - 1].x} ${H} L ${pts[0].x} ${H} Z`;
 
  return (
    <div className="w-full overflow-hidden">
      <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" preserveAspectRatio="none" style={{ height: 140 }}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0C9A8E" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0C9A8E" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#chartGrad)" />
        <path d={path} fill="none" stroke="#0C9A8E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((pt, i) => (
          <circle key={i} cx={pt.x} cy={pt.y} r="3" fill="#0C9A8E" />
        ))}
        {CHART_LABELS.map((label, i) => (
          <text
            key={i}
            x={pts[i].x}
            y={H + 16}
            textAnchor="middle"
            fontSize="9"
            fill="#9CA3AF"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}