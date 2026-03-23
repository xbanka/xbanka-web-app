import { useQuery } from "@tanstack/react-query";
import { getAvailableGiftCards } from "../actions/giftcards";
import { handleApiError } from "../errors/error";

export const UseGetAllWalletBalances = () => {
  return useQuery({
    queryKey: ["all-wallet-balances"],
    queryFn: async () => {
      try {
        const response = await getAvailableGiftCards();
        return response;
      } catch (err) {
        handleApiError(err);
      }
    },
  });
};