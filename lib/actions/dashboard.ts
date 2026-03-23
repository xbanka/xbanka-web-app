import AxiosInstance from "../AxiosInstance/AxiosInstance";

export const getDashboardData = async() => {
  const response = await AxiosInstance.get("/dashboard/overview");

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};

export const getDashboardPayoutTrend = async() => {
  const response = await AxiosInstance.get("/dashboard/payout-trend");

  return {
    success: true,
    data: response.data,
    status: response.status,
  };
};