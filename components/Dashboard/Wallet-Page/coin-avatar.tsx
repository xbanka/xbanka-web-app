import { CoinIcon } from "@/components/ui/coin-icon";

export function CoinAvatar({
  className,
  currency,
  size = 40,
}: {
  className?: string;
  currency: string;
  size?: number;
}) {
  return (
    <div
      className={`${className} rounded-full flex items-center mx-auto h-auto justify-center font-bold shrink-0`}
      style={{ width: size, height: size}}
    >
      <CoinIcon currency={currency} size={size} />
    </div>
  );
}
