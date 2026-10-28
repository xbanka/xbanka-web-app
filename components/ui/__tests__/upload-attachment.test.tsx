// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AttachmentUpload } from "../UploadAttachment";

const toastError = vi.fn();
vi.mock("sonner", () => ({ toast: { error: (...a: unknown[]) => toastError(...a) } }));

const MB = 1024 * 1024;
const fileOf = (name: string, type: string, bytes: number) => {
  const f = new File(["x"], name, { type });
  Object.defineProperty(f, "size", { value: bytes });
  return f;
};

const pick = (file: File) => {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  fireEvent.change(input, { target: { files: [file] } });
};

const ID_ACCEPT = "image/jpeg,image/png,application/pdf";

beforeEach(() => {
  toastError.mockReset();
  globalThis.URL.createObjectURL = vi.fn(() => "blob:preview");
});
afterEach(cleanup);

describe("AttachmentUpload", () => {
  it("shows an inline error, not a toast, for a 6 MB ID and does not attach it", () => {
    const onChange = vi.fn();
    render(<AttachmentUpload onChange={onChange} maxSizeMB={5} accept={ID_ACCEPT} />);

    pick(fileOf("passport.jpg", "image/jpeg", 6 * MB));

    expect(screen.getByRole("alert").textContent).toBe(
      '"passport.jpg" is too large (6.0 MB). The maximum size is 5 MB.',
    );
    expect(toastError).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows an inline error for an unsupported type", () => {
    const onChange = vi.fn();
    render(<AttachmentUpload onChange={onChange} accept={ID_ACCEPT} />);

    pick(fileOf("id.gif", "image/gif", MB));

    expect(screen.getByRole("alert").textContent).toContain("not a supported file");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("accepts a PDF under 5 MB and clears an earlier error", () => {
    const onChange = vi.fn();
    render(<AttachmentUpload onChange={onChange} maxSizeMB={5} accept={ID_ACCEPT} />);

    pick(fileOf("big.pdf", "application/pdf", 6 * MB));
    expect(screen.getByRole("alert")).toBeTruthy();

    pick(fileOf("id.pdf", "application/pdf", 4 * MB));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(onChange).toHaveBeenCalledWith([
      expect.objectContaining({ file: expect.objectContaining({ name: "id.pdf" }) }),
    ]);
  });

  it("accepts a file of exactly 5 MB", () => {
    const onChange = vi.fn();
    render(<AttachmentUpload onChange={onChange} maxSizeMB={5} accept={ID_ACCEPT} />);

    pick(fileOf("edge.png", "image/png", 5 * MB));
    expect(screen.queryByRole("alert")).toBeNull();
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
