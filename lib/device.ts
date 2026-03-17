import { v4 as uuidv4 } from "uuid";

export function getDeviceId() {
  if (typeof window === "undefined") return "";

  let deviceId = localStorage.getItem("device_id");

  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem("device_id", deviceId);
  }

  return deviceId;
}

export function getDeviceInfo() {
  if (typeof window === "undefined") {
    return {
      deviceName: "unknown",
      deviceType: "web",
    };
  }

  const userAgent = navigator.userAgent;

  let deviceType = "desktop";

  if (/mobile/i.test(userAgent)) {
    deviceType = "mobile";
  }

  if (/tablet/i.test(userAgent)) {
    deviceType = "tablet";
  }

  const deviceName = navigator.platform || "web-browser";

  return {
    deviceName,
    deviceType,
  };
}