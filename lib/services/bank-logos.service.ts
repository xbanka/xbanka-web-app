import { useQuery } from "@tanstack/react-query";
import { getBankLogos } from "../actions/bank-logos";

/**
 * Bank logos keyed by CBN code and normalised name. Cached aggressively — the
 * list changes rarely and every consumer falls back to an initials badge, so a
 * stale or failed fetch is never user-visible as an error.
 */
export const useGetBankLogos = () => {
  return useQuery({
    queryKey: ["bank-logos"],
    queryFn: getBankLogos,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24,
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
