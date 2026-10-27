// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { OtpInput } from "../otp-input";

afterEach(cleanup);

const boxes = () => screen.getAllByLabelText(/Digit \d of 4/) as HTMLInputElement[];

describe("OtpInput mask", () => {
  it("shows the digits by default (email and app codes)", () => {
    render(<OtpInput length={4} />);
    for (const box of boxes()) expect(box.type).toBe("text");
  });

  it("hides the digits when masked but keeps the numeric keypad", () => {
    render(<OtpInput length={4} mask />);
    for (const box of boxes()) {
      expect(box.type).toBe("password");
      expect(box.inputMode).toBe("numeric");
      expect(box.autocomplete).toBe("off");
    }
  });

  it("still reports the real PIN to onChange when masked", () => {
    const onChange = vi.fn();
    render(<OtpInput length={4} mask onChange={onChange} />);
    const [a, b, c, d] = boxes();
    fireEvent.change(a, { target: { value: "1" } });
    fireEvent.change(b, { target: { value: "2" } });
    fireEvent.change(c, { target: { value: "3" } });
    fireEvent.change(d, { target: { value: "4" } });
    expect(onChange).toHaveBeenLastCalledWith("1234");
  });

  it("still accepts a pasted PIN when masked", () => {
    const onChange = vi.fn();
    render(<OtpInput length={4} mask onChange={onChange} />);
    fireEvent.paste(boxes()[0], { clipboardData: { getData: () => "9876" } });
    expect(onChange).toHaveBeenLastCalledWith("9876");
  });

  it("spreads a full code inserted without a paste event (autofill, IME)", () => {
    const onChange = vi.fn();
    render(<OtpInput length={4} onChange={onChange} />);
    fireEvent.change(boxes()[0], { target: { value: "9876" } });
    expect(onChange).toHaveBeenLastCalledWith("9876");
    expect(boxes().map((box) => box.value)).toEqual(["9", "8", "7", "6"]);
  });

  it("replaces the digit when typing into a filled box", () => {
    const onChange = vi.fn();
    render(<OtpInput length={4} onChange={onChange} />);
    fireEvent.change(boxes()[0], { target: { value: "1" } });
    fireEvent.change(boxes()[0], { target: { value: "12" } });
    expect(onChange).toHaveBeenLastCalledWith("2");
  });
});
