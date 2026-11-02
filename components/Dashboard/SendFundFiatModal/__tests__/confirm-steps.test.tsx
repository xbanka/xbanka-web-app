// @vitest-environment happy-dom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConfirmStep } from "../confirm-step";
import { ConfirmXbankaUserStep } from "../confirm-step-xbanka-users";

vi.mock("@/components/ui/bank-logo", () => ({ BankLogo: () => null }));
vi.mock("@/lib/services/profile.service", () => ({
  UseProfileUser: () => ({
    data: { data: { firstName: "Ada", lastName: "Obi" } },
    error: null,
    isPending: false,
  }),
}));

const DEBIT_NOTICE = /debited directly from your selected bank account/i;

const handlers = () => ({ onBack: vi.fn(), onClose: vi.fn(), onConfirm: vi.fn() });

afterEach(cleanup);

describe("send money confirm steps", () => {
  it("bank account send shows no debit notice", () => {
    render(
      <ConfirmStep
        amount="5,000"
        sourceLabel="GTBank 0123456789"
        accountName="JOHN DOE"
        fee="10"
        {...handlers()}
      />,
    );
    expect(screen.getByText("Review & Confirm Transaction")).toBeTruthy();
    expect(screen.queryByText(DEBIT_NOTICE)).toBeNull();
  });

  it("Xbanka user send shows no debit notice", () => {
    render(
      <ConfirmXbankaUserStep
        amount="5,000"
        sourceLabel="Wallet"
        accountName="JOHN DOE"
        fee="0"
        {...handlers()}
      />,
    );
    expect(screen.getByText("JOHN DOE")).toBeTruthy();
    expect(screen.queryByText(DEBIT_NOTICE)).toBeNull();
  });
});
