import AxiosInstance from "../AxiosInstance/AxiosInstance";
import { RevokeSessionsPayload } from "../types/sessions-types";

export const getActiveSessions = async () => {
  const response = await AxiosInstance.get("/security/sessions");

  return response.data;
};

export const RevokeSessions = async (id: string) => {
  const response = await AxiosInstance.post("/security/sessions/revoke", {
    sessionId: id,
  });

  return response.data;
};

export const GetRegisteredDevices = async () => {
  const response = await AxiosInstance.get("/security/devices");

  return response.data;
};

export const RemoveDevice = async (id: string) => {
  const response = await AxiosInstance.post("/security/devices/remove", {
    // deviceId: id,
    sessionId: id,
  });

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};
