import { useQuery } from "@tanstack/react-query";
import { getActiveSessions, GetRegisteredDevices } from "../actions/sessions";
import { handleApiError } from "../errors/error";

export const UseGetActiveSessions = () => {
  return useQuery({
    queryKey: ["active-sessions"],
    queryFn: async () => {
      try {
        const response = await getActiveSessions();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};

export const UseGetRegisteredDevices = () => {
  return useQuery({
    queryKey: ["registered-devices"],
    queryFn: async () => {
      try {
        const response = await GetRegisteredDevices();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};