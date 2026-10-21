import { describe, expect, it } from "vitest";
import {
  findNewDeposits,
  isDepositNotification,
} from "@/lib/depositNotifications";
import { Notification } from "@/lib/types/notification-types";

const notification = (
  overrides: Partial<Notification> & Pick<Notification, "id">,
): Notification => ({
  createdAt: "2026-10-21T09:00:00.000Z",
  isRead: false,
  message: "",
  metadata: null,
  title: "",
  type: "TRANSACTION",
  updatedAt: "2026-10-21T09:00:00.000Z",
  userId: "u1",
  ...overrides,
});

describe("isDepositNotification", () => {
  it("recognises a wallet credit however the backend words it", () => {
    expect(
      isDepositNotification({
        type: "DEPOSIT",
        title: "Deposit successful",
        message: "₦5,000 has been credited to your NGN wallet",
      }),
    ).toBe(true);
    expect(
      isDepositNotification({
        type: "TRANSACTION",
        title: "Wallet funded",
        message: "Your bank transfer of ₦20,000 was confirmed",
      }),
    ).toBe(true);
    expect(
      isDepositNotification({
        type: "TRANSACTION",
        title: "Money received",
        message: "You received ₦1,500 from Ada Obi",
      }),
    ).toBe(true);
  });

  it("ignores money going out and non-money activity", () => {
    expect(
      isDepositNotification({
        type: "TRANSACTION",
        title: "Withdrawal successful",
        message: "₦5,000 was debited from your wallet",
      }),
    ).toBe(false);
    expect(
      isDepositNotification({
        type: "KYC",
        title: "Documents received",
        message: "Your ID request was received and is under review",
      }),
    ).toBe(false);
  });
});

describe("findNewDeposits", () => {
  const older = notification({
    id: "n1",
    title: "Deposit successful",
    message: "₦5,000 credited",
    createdAt: "2026-10-21T08:00:00.000Z",
  });
  const newer = notification({
    id: "n2",
    title: "Deposit successful",
    message: "₦9,000 credited",
    createdAt: "2026-10-21T09:00:00.000Z",
  });
  const login = notification({
    id: "n3",
    type: "SECURITY",
    title: "New login",
    message: "A new device signed in",
  });
  const read = notification({
    id: "n4",
    title: "Deposit successful",
    message: "₦1,000 credited",
    isRead: true,
  });

  it("returns only unseen, unread deposits, newest first", () => {
    const fresh = findNewDeposits(["n1"], [older, login, read, newer]);
    expect(fresh.map((n) => n.id)).toEqual(["n2"]);
  });

  it("orders several new deposits newest first", () => {
    const fresh = findNewDeposits([], [older, newer]);
    expect(fresh.map((n) => n.id)).toEqual(["n2", "n1"]);
  });

  it("copes with an empty or missing feed", () => {
    expect(findNewDeposits(["n1"], undefined)).toEqual([]);
    expect(findNewDeposits([], [])).toEqual([]);
  });
});
