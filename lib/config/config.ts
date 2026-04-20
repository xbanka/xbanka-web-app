import type { QueryClientConfig } from "@tanstack/react-query";

export const queryClientConfig: QueryClientConfig = {
   defaultOptions: {
      queries: {
         refetchOnWindowFocus: false,
         retry: 2,
         staleTime: 1000 * 60, // 1 minute
      },
   },
};