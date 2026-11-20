import { create } from "zustand";
import type { BankDeposit } from "@/lib/bank-deposit";

/**
 * The Add Fund (bank transfer) flow, shared app-wide.
 *
 * One host (components/Dashboard/BankDeposit/deposit-flow-host.tsx) is mounted
 * in the dashboard layout and renders whichever screen is set here, so "Add
 * Fund" on any page and "View status" on the pending banner open the same
 * flow.
 */
export type DepositScreen =
  /** Resolved by the host to in_progress / add_account / amount. */
  | { name: "entry" }
  | { name: "add_account"; back: "amount" | null }
  | { name: "amount" }
  | { name: "details" }
  | { name: "quick_confirm" }
  | { name: "in_progress" }
  | { name: "another_prompt" }
  | { name: "status"; depositId: string }
  | { name: "result"; depositId: string };

interface DepositFlowState {
  screen: DepositScreen | null;
  /** As typed, e.g. "2,000". */
  amount: string;
  sourceId: string | null;
  /** The deposit just declared, until the transaction list includes it. */
  declared: BankDeposit | null;
  open: () => void;
  go: (screen: DepositScreen) => void;
  openStatus: (depositId: string) => void;
  openResult: (depositId: string) => void;
  setAmount: (amount: string) => void;
  setSourceId: (id: string | null) => void;
  setDeclared: (deposit: BankDeposit | null) => void;
  /** Clears the draft (amount, source) for a fresh deposit. */
  startNew: () => void;
  close: () => void;
}

export const useDepositFlowStore = create<DepositFlowState>((set) => ({
  screen: null,
  amount: "",
  sourceId: null,
  declared: null,
  open: () => set({ screen: { name: "entry" } }),
  go: (screen) => set({ screen }),
  openStatus: (depositId) => set({ screen: { name: "status", depositId } }),
  openResult: (depositId) => set({ screen: { name: "result", depositId } }),
  setAmount: (amount) => set({ amount }),
  setSourceId: (sourceId) => set({ sourceId }),
  setDeclared: (declared) => set({ declared }),
  startNew: () => set({ amount: "" }),
  close: () => set({ screen: null, amount: "" }),
}));
