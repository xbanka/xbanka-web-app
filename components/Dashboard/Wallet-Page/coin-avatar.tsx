export function CoinAvatar({ color, symbol, size = 40 }: { color: string; symbol: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.32 }}
    >
      {symbol[0]}
    </div>
  );
}