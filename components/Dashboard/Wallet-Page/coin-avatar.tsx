import { getCoinImage } from "@/lib/coin-images";
import Image from "next/image";

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
      <Image
        src={getCoinImage(currency)}
        alt={currency}
        width={size}
        height={size}
        // onError={(e) => {
        //   e.currentTarget.src = "/images/default-coin.png";
        // }}
      />
    </div>
  );
}
