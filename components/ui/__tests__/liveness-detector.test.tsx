// @vitest-environment happy-dom
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Face turns: left (dir 10), then right (dir -2), then keeps moving.
let frame = 0;
const face = (dir: number) => {
  frame += 1;
  const lm = Array.from({ length: 400 }, () => ({ x: frame * 0.01, y: 0, z: 0 }));
  lm[33] = { x: dir, y: 0, z: 1 };
  lm[362] = { x: 0, y: 0, z: 0 };
  return { faceLandmarks: [lm] };
};
let directions: number[] = [];
vi.mock("@mediapipe/tasks-vision", () => ({
  FilesetResolver: { forVisionTasks: async () => ({}) },
  FaceLandmarker: {
    createFromOptions: async () => ({
      detectForVideo: () => face(directions.shift() ?? 0),
    }),
  },
}));

const verifySelfie = vi.fn();
vi.mock("@/lib/services/onboarding.service", () => ({
  useVerifySelfie: () => ({ mutate: verifySelfie, isPending: false, error: null }),
  useSkipStep: () => ({ mutate: vi.fn(), isPending: false, error: null }),
}));
vi.mock("@/lib/base64ToFile", () => ({
  base64ToFile: (_: string, name: string) => new File(["x"], name, { type: "image/jpeg" }),
}));

import LivenessDetector from "../LivenessDetector";

const flush = async (ms = 0) => {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(ms);
  });
};

/** Open the camera and walk the face through left, right and the countdown. */
async function takePhoto() {
  directions = [10, -2];
  fireEvent.click(screen.getByText("Open Camera"));
  await flush();
  const video = document.querySelector("video") as HTMLVideoElement;
  await act(async () => {
    await video.onloadedmetadata?.(new Event("loadedmetadata"));
  });
  await flush(1000); // detection loop: left, then right
  await flush(1000);
  await flush(1000);
  await flush(1000); // countdown 3, 2, 1, 0 -> capture
  await flush(100);
}

beforeEach(() => {
  vi.useFakeTimers();
  frame = 0;
  verifySelfie.mockReset();
  Object.defineProperty(navigator, "mediaDevices", {
    configurable: true,
    value: { getUserMedia: async () => ({ getTracks: () => [{ stop: vi.fn() }] }) },
  });
  HTMLMediaElement.prototype.play = vi.fn(async () => {});
  Object.defineProperty(HTMLMediaElement.prototype, "srcObject", {
    configurable: true,
    set() {},
    get() {
      return null;
    },
  });
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ({ drawImage: vi.fn() })) as never;
  HTMLCanvasElement.prototype.toDataURL = vi.fn(() => "data:image/jpeg;base64,AAAA");
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("LivenessDetector", () => {
  it("shows the preview after the photo is taken without sending it", async () => {
    render(<LivenessDetector userId="u1" onSuccess={vi.fn()} />);
    await takePhoto();

    expect(screen.getByAltText("Captured selfie")).toBeTruthy();
    expect(verifySelfie).not.toHaveBeenCalled();
  });

  it("sends the selfie exactly once when the user clicks Next", async () => {
    render(<LivenessDetector userId="u1" sessionId="s1" onSuccess={vi.fn()} />);
    await takePhoto();

    fireEvent.click(screen.getByText("Next"));

    expect(verifySelfie).toHaveBeenCalledTimes(1);
    const form = verifySelfie.mock.calls[0][0] as FormData;
    expect(form.get("userId")).toBe("u1");
    expect(form.get("sessionId")).toBe("s1");
    expect((form.get("selfieImage") as File).name).toBe("selfie.jpg");
  });

  it("Retake sends nothing and takes a new photo", async () => {
    render(<LivenessDetector userId="u1" onSuccess={vi.fn()} />);
    await takePhoto();

    fireEvent.click(screen.getByText("Retake"));
    await flush();
    expect(screen.queryByAltText("Captured selfie")).toBeNull();

    directions = [10, -2];
    const video = document.querySelector("video") as HTMLVideoElement;
    await act(async () => {
      await video.onloadedmetadata?.(new Event("loadedmetadata"));
    });
    for (let i = 0; i < 5; i++) await flush(1000);

    expect(screen.getByAltText("Captured selfie")).toBeTruthy();
    expect(verifySelfie).not.toHaveBeenCalled();
  });
});
