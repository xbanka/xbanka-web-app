import { useQuery } from "@tanstack/react-query";
import { handleApiError } from "../errors/error";
import { getDashboardData, getDashboardPayoutTrend } from "../actions/dashboard";

export const UseGetDashboardData = () => {
  return useQuery({
    queryKey: ["dashboard-data"],
    queryFn: async () => {
      try {
        const response = await getDashboardData();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};

export const UseGetDashboardPayoutTrend = () => {
  return useQuery({
    queryKey: ["dashboard-payout-trend"],
    queryFn: async () => {
      try {
        const response = await getDashboardPayoutTrend();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};