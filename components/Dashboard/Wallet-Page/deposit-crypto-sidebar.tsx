import { Button } from "@/components/ui/button";
import { CloseBtn } from "@/components/ui/close-btn";
import { ErrorField } from "@/components/ui/field-error";
import { SelectFieldWithValue } from "@/components/ui/select-with-value";
import { useGenerateAddress } from "@/lib/services/wallet.service";
import { AlertTriangle, Copy } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import QRCode from "react-qr-code";

const CRYPTO_NETWORKS = {
  USDT: ["TRX", "ETH", "BSC", "SOL", "MATIC"],
  BTC: ["BTC"],
  ETH: ["ETH", "BSC"],
};

const CURRENCY_OPTIONS = [
  { label: "USDT", value: "USDT" },
  { label: "BTC", value: "BTC" },
  { label: "ETH", value: "ETH" },
];

const QUICK_COINS = ["USDT", "BTC", "ETH", "SOL"];

export const DepositSidebar = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [currency, setCurrency] = useState("");
  const [network, setNetwork] = useState("");
  // const [addressData, setAddressData] = useState<WalletAccount | null>(null);

  // const { mutate, isPending, error } = useGenerateAddress();
  const {
    data: addressData,
    isLoading,
    error,
  } = useGenerateAddress(currency, network);
  console.log("addressData", addressData?.data?.address || "none address");

  const networkOptions =
    currency && CRYPTO_NETWORKS[currency as keyof typeof CRYPTO_NETWORKS]
      ? CRYPTO_NETWORKS[currency as keyof typeof CRYPTO_NETWORKS].map((n) => ({
          label: n,
          value: n,
        }))
      : [];

  const handleCopy = () => {
    if (!addressData?.address) return;

    navigator.clipboard.writeText(addressData.address);
  };

  // useEffect(() => {
  //   if (!currency || !network) return;

  //   mutate(
  //     { currency, network },
  //     {
  //       onSuccess: (data) => {
  //         setAddressData(data);
  //       },
  //     },
  //   );
  // }, [currency, network]);
  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "visible" : "invisible"
      }`}
    >
      {/* overlay */}
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* sidebar */}
      <div
        className={`absolute right-0 top-0 h-full w-full md:max-w-150 bg-card-background px-10 pb-10 border-8 border-border rounded-[20px] shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-sm:border-0 max-sm:rounded-none max-sm:px-0 max-sm:pb-0 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* your content */}
        <div className="flex h-full flex-col space-y-8 overflow-y-auto max-sm:space-y-6 max-sm:px-6 max-sm:py-8">
          <div className="py-6 px-10 flex items-start justify-between border-b border-input max-sm:border-0 max-sm:p-0">
            <div className="">
              <h1 className="font-semibold leading-8 text-2xl text-card-text max-sm:text-[24px] max-sm:leading-8">
                Deposit Crypto
              </h1>
              <p className="text-[16px] font-normal text-text max-sm:leading-7">
                Transfer assets to external wallets or XBanka users.
              </p>
            </div>
            <CloseBtn
              onClose={onClose}
              className="max-sm:h-14 max-sm:w-14 max-sm:border-input max-sm:bg-input-background"
            />
          </div>

          <div className="px-10 space-y-6 max-sm:px-0">
            {/* Currency */}
            <div>
              <SelectFieldWithValue
                label="Select a coin"
                placeholder="Select Currency"
                options={CURRENCY_OPTIONS}
                value={currency}
                onChange={(value) => {
                  setCurrency(value);
                  setNetwork(""); // reset network
                }}
              />
              <div className="-mx-6 flex gap-3 mt-3 overflow-x-auto px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:px-0">
                {QUICK_COINS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      setCurrency(item);
                      setNetwork("");
                    }}
                    className="flex shrink-0 items-center gap-2 rounded-lg py-2.5 px-5 bg-input-background text-card-text"
                  >
                    <Image
                      src={"/tether.svg"}
                      alt="tether"
                      width={16}
                      height={16}
                    />
                    <span className="text-[12px] font-normal leading-4.5 text-card-text">
                      {item}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {/* Network */}
            <div>
              <SelectFieldWithValue
                label="Select Network"
                placeholder="Select Network"
                options={networkOptions}
                value={network}
                onChange={(value) => {
                  setNetwork(value);
                }}
              />
              <div className="bg-background text-text py-3 px-4 rounded-lg flex items-center gap-4 mt-3 max-sm:items-start">
                <AlertTriangle className="w-4 h-4 shrink-0 text-text max-sm:mt-1" />
                <p className="font-normal text-[12px] leading-4.5 max-sm:text-[16px] max-sm:leading-7">
                  Only send {currency || "USDT"} via the selected network.
                  Sending via the wrong network may result in permanent loss of
                  funds.
                </p>
              </div>
            </div>
            {error && <ErrorField message={error.message} />}
          </div>

          <div className="px-8 space-y-4 max-sm:px-0">
            <h1 className="font-medium text-[12px] leading-5 text-card-text max-sm:text-[16px] max-sm:leading-6">
              Deposit address
            </h1>
            <div className="flex items-start gap-4 max-sm:flex-col">
              <div className="rounded-lg bg-white p-1">
                {addressData?.address ? (
                  <QRCode
                    value={addressData.data.address}
                    size={160}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                  />
                ) : (
                  <div className="w-25 h-25 bg-border animate-pulse rounded" />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-medium text-[12px] leading-5 text-card-text max-sm:text-[16px] max-sm:leading-6">
                  Wallet address
                </p>
                <div className="flex items-center gap-2 max-sm:gap-3">
                  <div className="w-full flex min-w-0 items-center h-10 truncate py-2.5 px-4 bg-input-background border border-input rounded-lg text-[14px] font-normal leading-6 text-text max-sm:h-14 max-sm:text-[16px]">
                    {isLoading
                      ? "Generating address..."
                      : addressData?.address || "No address available"}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex h-10 shrink-0 items-center gap-1 px-4 py-2.5 bg-[#0F766E] border border-Green rounded-lg max-sm:h-14 max-sm:w-16 max-sm:justify-center"
                  >
                    <Copy className="w-4 h-4 text-Green max-sm:h-6 max-sm:w-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-10 space-y-4 max-sm:px-0">
            <div className="rounded-lg bg-background p-4 space-y-2 max-sm:bg-transparent max-sm:px-6">
              <div className="flex items-start justify-between">
                <p className="font-medium text-[12px] leading-5 text-text max-sm:text-[16px] max-sm:leading-6">
                  Minimum amount
                </p>
                <p className="font-normal text-[14px] leading-6 text-card-text max-sm:text-[16px]">
                  10 {currency || "USDT"}
                </p>
              </div>
              <div className="flex items-start justify-between">
                <p className="font-medium text-[12px] leading-5 text-text max-sm:text-[16px] max-sm:leading-6">
                  Confirmation required
                </p>
                <p className="text-right font-normal text-[14px] leading-6 text-card-text max-sm:text-[16px]">
                  12 network confirmations
                </p>
              </div>
              <div className="flex items-start justify-between">
                <p className="font-medium text-[12px] leading-5 text-text max-sm:text-[16px] max-sm:leading-6">
                  Estimated arrival
                </p>
                <p className="font-normal text-[14px] leading-6 text-card-text max-sm:text-[16px]">
                  5-10 minutes
                </p>
              </div>
            </div>
            <p className="font-normal text-[12px] leading-4.5 text-text text-center max-sm:text-[16px] max-sm:leading-7">
              After sending, your deposit will appear once confirmed on the
              blockchain.
            </p>
          </div>
          <div className="px-10 max-sm:mt-auto max-sm:px-0 max-sm:pb-6">
            <Button variant={"secondary"} className="w-full p-4 max-sm:h-14 max-sm:text-[16px]">
              View Deposit History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
