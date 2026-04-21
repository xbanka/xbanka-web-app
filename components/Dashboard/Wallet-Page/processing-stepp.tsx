import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { ASSETS } from "./wallet-mock-data";

export function ProcessingStep({ amount, asset, network, recipientName, recipientAddress }: {
  amount: string;
  asset: typeof ASSETS[0];
  network: { id: string; name: string; shortName: string; fee: string };
  recipientName?: string;
  recipientAddress: string;
}) {
  const shortAddr = `${recipientAddress.slice(0, 4)}...${recipientAddress.slice(-4)}`;
  return (
    <Modal onClose={() => {}}>
      <div className="py-10 flex flex-col items-center gap-5 text-center">
        <Spinner size={52} />
        <div>
          <h3 className="text-lg font-semibold text-card-text">Processing your request...</h3>
          <p className="text-sm text-text mt-1">This usually takes a few seconds. Please don't close this window</p>
        </div>
        <div className="w-full bg-background border border-border rounded-xl divide-y divide-border text-left">
          {[
            { label: "Amount", value: `${amount} ${asset.symbol}`, green: true },
            { label: "From", value: recipientName ? `${recipientName} (${shortAddr})` : shortAddr },
            { label: "Network fee", value: `${network.fee} ${asset.symbol}` },
          ].map((r) => (
            <div key={r.label} className="flex items-center justify-between px-4 py-2.5 text-xs">
              <span className="text-text">{r.label}</span>
              <span className={cn("font-medium", r.green ? "text-Green" : "text-card-text")}>{r.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}