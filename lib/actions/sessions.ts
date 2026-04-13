import AxiosInstance from "../AxiosInstance/AxiosInstance";

export const getActiveSessions = async () => {
  const response = await AxiosInstance.get("/security/sessions");

  return response.data;
};

export const RevokeSessions = async () => {
  const response = await AxiosInstance.post("/security/sessions/revoke");

  return response.data;
};

export const GetRegisteredDevices = async () => {
  const response = await AxiosInstance.get("/security/devices");

  return response.data;
};

export const RemoveDevice = async () => {
  const response = await AxiosInstance.post("/security/devices/remove");

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};
