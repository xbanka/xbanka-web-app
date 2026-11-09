// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RecentBillPayments, type RecentBillRow } from "../recent-bill-payments";

afterEach(cleanup);

const row = (i: number, billerId: string, name: string): RecentBillRow => ({
  billerId,
  name,
  number: `0810000000${i}`,
  time: "2 hours ago",
  amount: "₦1,000.00",
  status: "Completed",
  reference: `REF${i}`,
});

const rows = [
  row(1, "mtn", "MTN airtime"),
  row(2, "", "Ikeja Electric prepaid token"),
  row(3, "airtel", "Airtel data 2GB"),
];

describe("RecentBillPayments", () => {
  it("lists the payments and opens the one tapped", () => {
    const onOpen = vi.fn();
    render(<RecentBillPayments rows={rows} isPending={false} isError={false} onOpen={onOpen} />);

    fireEvent.click(screen.getByText("Airtel data 2GB"));
    expect(onOpen).toHaveBeenCalledWith(rows[2]);
  });

  it("filters by the categories present, with All to reset", () => {
    render(<RecentBillPayments rows={rows} isPending={false} isError={false} onOpen={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Electricity" }));
    expect(screen.queryByText("MTN airtime")).toBeNull();
    expect(screen.getByText("Ikeja Electric prepaid token")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "All" }));
    expect(screen.getByText("MTN airtime")).toBeTruthy();
    // Categories with no payments get no chip.
    expect(screen.queryByRole("button", { name: "Betting" })).toBeNull();
  });

  it("shows at most 8 payments", () => {
    const many = Array.from({ length: 12 }, (_, i) => row(i, "mtn", `MTN airtime ${i}`));
    render(<RecentBillPayments rows={many} isPending={false} isError={false} onOpen={vi.fn()} />);
    expect(screen.getAllByText(/^MTN airtime \d+$/)).toHaveLength(8);
  });

  it("has an empty state", () => {
    render(<RecentBillPayments rows={[]} isPending={false} isError={false} onOpen={vi.fn()} />);
    expect(screen.getByText("No bill payments yet")).toBeTruthy();
  });
});
