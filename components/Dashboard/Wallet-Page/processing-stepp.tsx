import { Modal } from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { ASSETS } from "./wallet-mock-data";
import { ArrowLeftRight } from "lucide-react";

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
      <div className="py-10 flex flex-col items-center gap-5 text-center space-y-6">
        <Spinner icon={ArrowLeftRight} size={64} />
        <div className="space-y-2">
          <h3 className="text-[24px] leading-8 font-semibold text-card-text">Processing your request...</h3>
          <p className="text-base font-normal leading-6 text-text">This usually takes a few seconds. Please don't close this <br/>window</p>
        </div>
      </div>
    </Modal>
  );
}