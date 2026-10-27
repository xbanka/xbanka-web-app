"use client";

import { useId, type AnimationEvent, type CSSProperties } from "react";

type Props = {
  /** First name appended to the welcome line. */
  name?: string;
  /** Shown beneath the logo; omit the line entirely with welcome={false}. */
  welcomeText?: string;
  welcome?: boolean;
  /** Set true to fade the splash out (250 ms, 150 ms under reduced motion). */
  exiting?: boolean;
  /** Fires once the exit fade has finished. */
  onExited?: () => void;
  className?: string;
  style?: CSSProperties;
};

// Colours follow the page's data-theme attribute (set by the theme store on
// <html>) so the splash is right on the very first paint, before any JS runs.
const CSS = `
.xb-root{display:flex;flex-direction:column;align-items:flex-start;gap:.75rem;width:100%;
  --xb-ink:#171717;--xb-muted:#4B5563;--xb-teal:#0C9A8E;--xb-teal-d:#0A8578;--xb-hi:#2DD4BF;--xb-mid:#1CC2AE;--xb-glint:rgba(255,255,255,.55)}
[data-theme="dark"] .xb-root{--xb-ink:#F9F9F9;--xb-muted:#A4AAB4;--xb-teal:#00B39F;--xb-teal-d:#009C8A;--xb-glint:rgba(255,255,255,.42)}
.xb-logo{display:block;width:100%;height:auto;overflow:visible}
.xb-rib{fill:none;stroke-width:24;stroke-linejoin:miter;stroke-dasharray:100;stroke-dashoffset:100;
  animation:xb-draw .5s cubic-bezier(.22,.61,.36,1) forwards}
.xb-rib-b{animation-delay:.05s}
.xb-mask{fill:none;stroke:#fff;stroke-width:24}
.xb-mark{transform-origin:50px 50px;animation:xb-breathe 2s ease-in-out 1.4s infinite}
.xb-sweep{transform:translateX(-110px);animation:xb-sweep .3s cubic-bezier(.4,0,.2,1) .9s forwards}
.xb-l{fill:var(--xb-ink);font:600 100px/1 Nunito,Quicksand,"Varela Round",ui-rounded,system-ui,sans-serif;
  opacity:0;transform:translateX(-18px);animation:xb-in .35s cubic-bezier(.22,.61,.36,1) forwards}
.xb-l:nth-of-type(1){animation-delay:.4s}.xb-l:nth-of-type(2){animation-delay:.44s}
.xb-l:nth-of-type(3){animation-delay:.48s}.xb-l:nth-of-type(4){animation-delay:.52s}.xb-l:nth-of-type(5){animation-delay:.56s}
.xb-welcome{margin:0;font-family:inherit;font-size:13px;font-weight:500;line-height:1.3;color:var(--xb-muted);
  opacity:0;transform:translateY(4px);animation:xb-in .3s ease-out 1s forwards}
.xb-root.xb-exit{animation:xb-out .25s ease-in forwards}
.xb-a0{stop-color:var(--xb-mid)}.xb-a1{stop-color:var(--xb-teal)}.xb-a2{stop-color:var(--xb-teal-d)}
.xb-b0{stop-color:var(--xb-hi)}.xb-b1{stop-color:var(--xb-mid)}.xb-b2{stop-color:var(--xb-teal)}
.xb-g0{stop-color:var(--xb-glint);stop-opacity:0}.xb-g1{stop-color:var(--xb-glint)}
@keyframes xb-draw{to{stroke-dashoffset:0}}
@keyframes xb-in{to{opacity:1;transform:none}}
@keyframes xb-sweep{to{transform:translateX(110px)}}
@keyframes xb-breathe{50%{opacity:.85}}
@keyframes xb-out{to{opacity:0}}
@media (prefers-reduced-motion:reduce){
  .xb-rib,.xb-mark,.xb-sweep,.xb-l,.xb-welcome{animation:none}
  .xb-rib{stroke-dashoffset:0}.xb-l,.xb-welcome{opacity:1;transform:none}.xb-sweep{opacity:0}
  .xb-root.xb-exit{animation:xb-out .15s ease forwards}
}`;

export function XbankaSplash({
  name,
  welcomeText = "Welcome back",
  welcome = true,
  exiting = false,
  onExited,
  className,
  style,
}: Props) {
  // Gradient and mask ids must be unique per instance and safe inside url(#…).
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const ga = `xb-ga-${id}`,
    gb = `xb-gb-${id}`,
    gs = `xb-gs-${id}`,
    m = `xb-m-${id}`;

  const handleAnimationEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && e.animationName === "xb-out") onExited?.();
  };

  return (
    <div
      className={`xb-root${exiting ? " xb-exit" : ""}${className ? " " + className : ""}`}
      style={style}
      role="status"
      aria-label="Xbanka is loading"
      onAnimationEnd={handleAnimationEnd}
    >
      <style href="xb-splash" precedence="default">{CSS}</style>
      <svg className="xb-logo" viewBox="0 0 420 100" aria-hidden="true">
        <defs>
          <linearGradient id={ga} gradientUnits="userSpaceOnUse" x1="12" y1="14" x2="86" y2="88">
            <stop offset="0" className="xb-a0" /><stop offset=".49" className="xb-a1" /><stop offset=".51" className="xb-a2" /><stop offset="1" className="xb-a2" />
          </linearGradient>
          <linearGradient id={gb} gradientUnits="userSpaceOnUse" x1="86" y1="12" x2="14" y2="88">
            <stop offset="0" className="xb-b0" /><stop offset=".49" className="xb-b0" /><stop offset=".51" className="xb-b1" /><stop offset="1" className="xb-b2" />
          </linearGradient>
          <linearGradient id={gs} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" className="xb-g0" /><stop offset=".5" className="xb-g1" /><stop offset="1" className="xb-g0" />
          </linearGradient>
          <mask id={m} maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100">
            <path className="xb-mask" d="M12 14 50 50 86 88" /><path className="xb-mask" d="M86 12 50 50 14 88" />
          </mask>
        </defs>
        <g className="xb-mark">
          <path className="xb-rib xb-rib-a" pathLength="100" stroke={`url(#${ga})`} d="M12 14 50 50 86 88" />
          <path className="xb-rib xb-rib-b" pathLength="100" stroke={`url(#${gb})`} d="M86 12 50 50 14 88" />
          <g mask={`url(#${m})`}>
            <g className="xb-sweep">
              <g transform="rotate(32 50 50)"><rect x="30" y="-50" width="40" height="200" fill={`url(#${gs})`} /></g>
            </g>
          </g>
        </g>
        <g>
          <text className="xb-l" x="118" y="86">b</text>
          <text className="xb-l" x="179" y="86">a</text>
          <text className="xb-l" x="233" y="86">n</text>
          <text className="xb-l" x="293" y="86">k</text>
          <text className="xb-l" x="347" y="86">a</text>
        </g>
      </svg>
      {welcome && (
        <p className="xb-welcome">
          {welcomeText}
          {name ? `, ${name}` : ""}
        </p>
      )}
    </div>
  );
}

export default XbankaSplash;
