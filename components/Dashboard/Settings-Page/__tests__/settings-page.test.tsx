// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SettingsPage from "../settings-page";
import { useSettingsStore } from "@/store/settings.store";
import { useBalanceVisibilityStore } from "@/store/balance-visibility.store";

const nav = vi.hoisted(() => ({ tab: "general", replace: vi.fn() }));
vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace: nav.replace, push: vi.fn() }),
  useSearchParams: () => new URLSearchParams(`tab=${nav.tab}`),
}));
vi.mock("@/lib/services/profile.service", () => ({
  UseProfileUser: () => ({ data: { data: { userId: "465f97b6" } } }),
}));
vi.mock("@/lib/services/support.service", () => ({
  UseSendSupportRequest: () => ({
    mutate: vi.fn(),
    isPending: false,
    isSuccess: false,
    error: null,
    reset: vi.fn(),
  }),
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

afterEach(cleanup);

describe("SettingsPage", () => {
  it("lists African languages and has no date or time format", () => {
    nav.tab = "general";
    render(<SettingsPage />);
    const options = [...(screen.getByLabelText("Language") as HTMLSelectElement).options].map((o) => o.text);
    expect(options.join("|")).toMatch(/Yorùbá/);
    expect(options.join("|")).toMatch(/Hausa/);
    expect(options.join("|")).toMatch(/Kiswahili/);
    expect(screen.queryByText(/date format/i)).toBeNull();
    expect(screen.queryByText(/time format/i)).toBeNull();
    expect(screen.queryByText(/reduce motion/i)).toBeNull();
  });

  it("says when a language isn't translated yet", () => {
    nav.tab = "general";
    render(<SettingsPage />);
    fireEvent.change(screen.getByLabelText("Language"), { target: { value: "yo" } });
    expect(useSettingsStore.getState().language).toBe("yo");
    expect(screen.getByText(/English for now/)).toBeTruthy();
  });

  it("offers in-app and email only, with security email locked on", () => {
    nav.tab = "notifications";
    render(<SettingsPage />);
    expect(screen.queryByText("SMS")).toBeNull();
    const locked = screen.getByLabelText("Security, Email, always on") as HTMLButtonElement;
    expect(locked.disabled).toBe(true);
    expect(locked.getAttribute("aria-checked")).toBe("true");
    fireEvent.click(screen.getByLabelText("News and offers, In app"));
    expect(useSettingsStore.getState().notifications.news.inApp).toBe(true);
  });

  it("hides balances straight away when that privacy switch goes on", () => {
    nav.tab = "privacy";
    useBalanceVisibilityStore.setState({ hidden: false });
    render(<SettingsPage />);
    fireEvent.click(screen.getByLabelText("Hide balances when the app opens"));
    expect(useSettingsStore.getState().hideBalancesOnOpen).toBe(true);
    expect(useBalanceVisibilityStore.getState().hidden).toBe(true);
    fireEvent.click(screen.getByLabelText("Hide amounts in notifications"));
    expect(useSettingsStore.getState().hideAmountsInNotifications).toBe(true);
  });
});
