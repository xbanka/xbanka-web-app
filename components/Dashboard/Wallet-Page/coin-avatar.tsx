export function CoinAvatar({ symbol, size = 40 }: { symbol: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center border border-input justify-center text-white font-bold shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {symbol[0]}
    </div>
  );
}