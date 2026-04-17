import { useEffect, useState } from "react";
import { AlertTriangle, Copy } from "lucide-react";
import { useGenerateAddress } from "@/lib/services/wallet.service";
import { SelectField } from "@/components/ui/select";
import { Modal } from "@/components/ui/Modal";
import { CloseBtn } from "./verify-bvn-modal";
import { Button } from "@/components/ui/button";
import { ErrorField } from "@/components/ui/field-error";
import { WalletAccount } from "@/lib/types/wallet-types";
import Image from "next/image";
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

export const DepositModal = ({ onClose }: { onClose: () => void }) => {
  const [currency, setCurrency] = useState("");
  const [network, setNetwork] = useState("");
  // const [addressData, setAddressData] = useState<WalletAccount | null>(null);

  // const { mutate, isPending, error } = useGenerateAddress();
  const {
    data: addressData,
    isLoading,
    error,
  } = useGenerateAddress(currency, network);

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
    <Modal onClose={onClose} className="p-0 pb-8">
      <div className="space-y-8">
        <div className="py-6 px-10 border-b border-input">
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

        <div className="px-10 space-y-6">
          {/* Currency */}
          <div>
            <SelectField
              label="Select a coin"
              id="currency"
              placeholder="Select Currency"
              options={CURRENCY_OPTIONS}
              value={currency}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setCurrency(e.target.value);
                setNetwork(""); // reset network
              }}
            />
            <div className="flex gap-2 mt-2">
              {["USDT", "BTC", "ETH"].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-lg py-2.5 px-4 bg-[#202225]"
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
            <SelectField
              label="Select Network"
              id="network"
              placeholder="Select Network"
              options={networkOptions}
              value={network}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                setNetwork(e.target.value);
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
              {addressData?.address ? (
                <QRCode
                  value={addressData.address}
                  size={100}
                  bgColor="transparent"
                  fgColor="#000000"
                />
              ) : (
                <div className="w-25 h-25 bg-gray-200 animate-pulse rounded" />
              )}
            </div>
            <div className="w-full space-y-1">
              <p className="font-medium text-[12px] leading-5 text-card-text">
                Wallet address
              </p>
              <div className="flex items-center gap-2">
                <div className="w-full flex items-center h-10 break-all py-2.5 px-4 bg-[#202225] border border-input rounded-lg text-[14px] font-normal leading-6 text-text">
                  {isLoading
                    ? "Generating address..."
                    : addressData?.address || "No address available"}
                </div>
                <button
                  onClick={handleCopy}
                  className="flex h-10 items-center gap-1 px-4 py-2.5 bg-[#0F766E] border border-[#042F2E] rounded-lg"
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

      {/* Generate Button */}
      {/* {currency && network && !addressData && (
        <div className="flex w-full gap-4">
          <Button variant={"outline"} type="button" className="flex-2">
            Cancel
          </Button>
          <Button onClick={handleGenerate} className="flex-4">
            {isPending ? "Generating..." : "Generate Address"}
          </Button>
        </div>
      )} */}

      {/* Address Display */}
    </Modal>
  );
};
