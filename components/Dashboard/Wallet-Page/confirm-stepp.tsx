import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils";
import { ASSETS } from "./wallet-mock-data";
import { ModalHeader } from "@/components/ui/modal-header";
import { ProgressBar } from "./progress-bar";

export function ConfirmStep({
  amount,
  asset,
  network,
  recipientAddress,
  recipientName,
  onBack,
  onClose,
  onNext,
}: {
  amount: string;
  asset: (typeof ASSETS)[0];
  network: { id: string; name: string; shortName: string; fee: string };
  recipientAddress: string;
  recipientName?: string;
  onBack: () => void;
  onClose: () => void;
  onNext: () => void;
}) {
  const fee = parseFloat(network.fee);
  const total = (parseFloat(amount) + fee).toFixed(2);
  const nairaTotal = (parseFloat(total) * 1600).toLocaleString();
  const shortAddr =
    recipientAddress.length > 12
      ? `${recipientAddress.slice(0, 4)}...${recipientAddress.slice(-4)}`
      : recipientAddress;

  const rows = [
    {
      label: "Asset",
      value: `${asset.name} (${asset.symbol})`,
      icon: asset.color,
    },
    {
      label: "Recipient",
      value: recipientName ? `${recipientName}\n${shortAddr}` : shortAddr,
    },
    { label: "Network", value: network.name },
    {
      label: "Total Deducted",
      value: `${total} ${asset.symbol}`,
      sub: `≈ ₦${nairaTotal}`,
      green: true,
      bold: true,
    },
  ];

  return (
    <Modal className="p-0" onClose={onClose}>
      <ModalHeader
      className="px-8"
        title="Send Crypto"
        subtitle="Transfer assets to external wallets or XBanka users."
        onBack={onBack}
        onClose={onClose}
      />
      <div className="px-8 pb-3">
      <ProgressBar step="confirm" />
      </div>

      <div className="px-8 pt-4 pb-8 space-y-8">
        <div className="space-y-4">
          {/* Amount summary */}
          <div className="border border-input bg-border rounded-[20px] p-5 text-center space-y-2">
            <p className="text-sm font-normal leading-6 text-text">You are sending</p>
            <p className="text-4xl font-bold text-card-text">
              {amount}{" "}
              <span className="text-[24px] font-semibold text-text">
                {asset.symbol}
              </span>
            </p>
            <p className="text-xs font-normal leading-4.5 text-text px-2 py-2.5 bg-input-background rounded-lg w-fit mx-auto">
              ≈ ₦{(parseFloat(amount) * 1600).toLocaleString()}
            </p>
          </div>

          {/* Breakdown */}
          <div className="border border-input bg-border rounded-[20px] p-5 divide-y divide-input">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between p-3 gap-3"
              >
                <span className="text-xs font-normal leading-5.5 text-text shrink-0">{row.label}</span>
                <div className="text-right">
                  {row.icon ? (
                    <div className="flex items-center gap-1.5 justify-end">
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold"
                        style={{ background: row.icon }}
                      >
                        {asset.symbol[0]}
                      </div>
                      <span className="text-xs font-medium text-card-text">
                        {row.value}
                      </span>
                    </div>
                  ) : (
                    <p
                      className={cn(
                        "text-xs whitespace-pre-line",
                        row.green
                          ? "text-Green font-semibold"
                          : "font-medium text-card-text",
                        row.bold && "font-bold",
                      )}
                    >
                      {row.value}
                    </p>
                  )}
                  {row.sub && (
                    <p className="text-[10px] text-text mt-0.5">{row.sub}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2.5 bg-yellow-500/10 border border-yellow-500/25 rounded-xl px-3 py-3">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-xs text-text leading-relaxed">
              Please verify the recipient address and network carefully.
              Transactions cannot be reversed once confirmed on the blockchain.
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="flex-1"
            onClick={onBack}
          >
            Back
          </Button>
          <Button size="lg" className="flex-3" onClick={onNext}>
            Confirm & Send
          </Button>
        </div>
      </div>
    </Modal>
  );
}
