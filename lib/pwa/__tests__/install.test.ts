import { test } from "node:test";
import assert from "node:assert/strict";
import { detectInstallState, isIOS, type InstallEnv } from "../install.ts";

const CHROME = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0 Safari/537.36";
const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1";
const MAC_SAFARI = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.5 Safari/605.1.15";

const env = (o: Partial<InstallEnv>): InstallEnv => ({
  userAgent: CHROME,
  displayModeStandalone: false,
  hasDeferredPrompt: false,
  ...o,
});

test("installed when display-mode is standalone", () => {
  assert.equal(detectInstallState(env({ displayModeStandalone: true, hasDeferredPrompt: true })), "installed");
});

test("installed on iOS when navigator.standalone is true", () => {
  assert.equal(detectInstallState(env({ userAgent: IPHONE, navigatorStandalone: true })), "installed");
});

test("promptable when Chrome gave us beforeinstallprompt", () => {
  assert.equal(detectInstallState(env({ hasDeferredPrompt: true })), "promptable");
});

test("ios-manual on iPhone Safari", () => {
  assert.equal(detectInstallState(env({ userAgent: IPHONE })), "ios-manual");
});

test("ios-manual on iPadOS that reports as a Mac", () => {
  assert.equal(detectInstallState(env({ userAgent: MAC_SAFARI, platform: "MacIntel", maxTouchPoints: 5 })), "ios-manual");
});

test("a real Mac (no touch) is not iOS", () => {
  assert.equal(isIOS({ userAgent: MAC_SAFARI, platform: "MacIntel", maxTouchPoints: 0 }), false);
});

test("unavailable on desktop browser without a prompt event", () => {
  assert.equal(detectInstallState(env({})), "unavailable");
});
