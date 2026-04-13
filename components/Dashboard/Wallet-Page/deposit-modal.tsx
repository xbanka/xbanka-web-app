import { useState } from "react";
import { Copy } from "lucide-react";
import { useGenerateAddress } from "@/lib/services/wallet.service";
import { SelectField } from "@/components/ui/select";
import { Modal } from "@/components/ui/Modal";
import { CloseBtn } from "./verify-bvn-modal";
import { Button } from "@/components/ui/button";
import { ErrorField } from "@/components/ui/field-error";

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
  const [addressData, setAddressData] = useState<any>(null);

  const { mutate, isPending, error } = useGenerateAddress();

  const networkOptions =
    currency && CRYPTO_NETWORKS[currency as keyof typeof CRYPTO_NETWORKS]
      ? CRYPTO_NETWORKS[currency as keyof typeof CRYPTO_NETWORKS].map((n) => ({
          label: n,
          value: n,
        }))
      : [];

  const handleGenerate = () => {
    if (!currency || !network) return;

    console.log(currency, network)
    mutate(
      { currency, network },
      {
        onSuccess: (data) => {
          setAddressData(data);
        },
      },
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(addressData?.address);
  };

  return (
    <Modal onClose={onClose}>
      <div className="space-y-3">
        <div className="py-6">
          <div className="">
            <h1 className="font-semibold leading-8 text-2xl text-card-text">
              Deposit Crypto
            </h1>
            <p className="text-[16px] font-normal text-text">
              Select an currency and pick a network to fund to your wallet.
            </p>
          </div>
          <CloseBtn onClose={onClose} />
        </div>

        {/* Currency */}
        <SelectField
          id="currency"
          placeholder="Select Currency"
          options={CURRENCY_OPTIONS}
          value={currency}
          onChange={(e) => {
            setCurrency(e.target.value);
            setNetwork(""); // reset network
            setAddressData(null);
          }}
        />

        {/* Network */}
        {currency && (
          <SelectField
            id="network"
            placeholder="Select Network"
            options={networkOptions}
            value={network}
            onChange={(e) => {
              setNetwork(e.target.value);
              setAddressData(null);
            }}
          />
        )}

        {/* Generate Button */}
        {currency && network && !addressData && (
          <div className="flex w-full gap-4">
            <Button variant={"outline"} type="button" className="flex-2">
              Cancel
            </Button>
            <Button onClick={handleGenerate} className="flex-4">
              {isPending ? "Generating..." : "Generate Address"}
            </Button>
          </div>
        )}

        { error && <ErrorField message={error.message} />}

        {/* Address Display */}
        {addressData && (
          <div className="p-4 bg-muted rounded-lg space-y-3">
            <p className="text-sm text-gray-400">Deposit Address</p>

            <div className="flex items-center justify-between bg-black/30 p-3 rounded-lg">
              <span className="text-sm break-all">{addressData.address}</span>

              <button onClick={handleCopy}>
                <Copy size={16} />
              </button>
            </div>

            {addressData.memo && (
              <p className="text-xs text-yellow-400">
                Memo: {addressData.memo}
              </p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
