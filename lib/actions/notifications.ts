import AxiosInstance from "../AxiosInstance/AxiosInstance";

export const getNotifications = async () => {
  const response = await AxiosInstance.get("/notifications");

  return response.data;
};

export const readAllNotifications = async () => {
  const response = await AxiosInstance.patch("/notifications/read-all");

  return response.data;
};

export const readSingleNotification = async (id: string) => {
  const response = await AxiosInstance.patch(`/notifications/${id}/read`);

  return response.data;
};
