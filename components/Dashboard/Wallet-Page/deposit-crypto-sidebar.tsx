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
        className={`absolute right-0 top-0 h-full w-full md:max-w-150 bg-card-background px-10 pb-10 border-8 border-border rounded-[20px] shadow-2xl animate-in fade-in zoom-in-95 duration-150 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* your content */}
        <div className="space-y-8">
          <div className="py-6 px-10 flex items-start justify-between border-b border-input">
            <div className="">
              <h1 className="font-semibold leading-8 text-2xl text-card-text">
                Deposit Crypto
              </h1>
              <p className="text-[16px] font-normal text-text">
                Protect your account with a PIN
              </p>
            </div>
            <CloseBtn onClose={onClose} />
          </div>

          <div className="px-10 space-y-6 overflow-y-auto">
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
              <div className="flex gap-2 mt-2">
                {["USDT", "BTC", "ETH"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 rounded-lg py-2.5 px-4 bg-input-background"
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
                  </div>
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
              <div className="bg-background text-text py-3 px-4 rounded-lg flex items-center gap-4 mt-2">
                <AlertTriangle className="w-4 h-4 text-text" />
                <h1 className="font-normal text-[12px] leading-4.5">
                  Only send USDT via the selected network. Sending via the wrong
                  network may result in permanent loss of funds.
                </h1>
              </div>
            </div>
            {error && <ErrorField message={error.message} />}
          </div>

          <div className="px-10 space-y-4">
            <h1 className="font-medium text-[12px] leading-5 text-card-text">
              Deposit address
            </h1>
            <div className="flex items-start gap-4">
              <div>
                {addressData?.data?.address ? (
                  <QRCode
                    value={addressData.data.address}
                    size={160}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                  />
                ) : (
                  <div className="w-25 h-25 bg-gray-200 animate-pulse rounded" />
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-medium text-[12px] leading-5 text-card-text">
                  Wallet address
                </p>
                <div className="flex items-center gap-2 w-full max-w-full">
                  <div className="w-full min-w-0 flex items-center h-10 py-2.5 px-4 bg-input-background border border-input rounded-lg text-[14px] font-normal leading-6 text-text truncate">
                    <span className="truncate block w-full">
                    {isLoading
                      ? "Generating address..."
                      : addressData?.data.address || "No address available"}
                      </span>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="flex flex-shrink-0 h-10 items-center gap-1 px-4 py-2.5 bg-[#0F766E] border border-[#042F2E] rounded-lg"
                  >
                    <Copy className="w-4 h-4 text-Green" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="px-10 space-y-4">
            <div className="rounded-lg bg-background p-4 space-y-2">
              <div className="flex items-start justify-between">
                <p className="font-medium text-[12px] leading-5 text-text">
                  Minimum amount
                </p>
                <p className="font-normal text-[14px] leading-6 text-card-text">
                  10 USDT
                </p>
              </div>
              <div className="flex items-start justify-between">
                <p className="font-medium text-[12px] leading-5 text-text">
                  Confirmation required
                </p>
                <p className="font-normal text-[14px] leading-6 text-card-text">
                  12 network confirmations
                </p>
              </div>
              <div className="flex items-start justify-between">
                <p className="font-medium text-[12px] leading-5 text-text">
                  12 network confirmations
                </p>
                <p className="font-normal text-[14px] leading-6 text-card-text">
                  5-10 minutes
                </p>
              </div>
            </div>
            <h1 className="font-normal text-[12px] leading-4.5 text-text text-center">
              After sending, your deposit will appear once confirmed on the
              blockchain.
            </h1>
          </div>
          <div className="px-10">
            <Button variant={"secondary"} className="w-full p-4">
              View Deposit History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
