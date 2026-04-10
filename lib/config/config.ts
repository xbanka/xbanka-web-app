import type { QueryClientConfig } from "@tanstack/react-query";

export const queryClientConfig: QueryClientConfig = {
   defaultOptions: {
      queries: {
         refetchOnWindowFocus: true,
         retry: 2,
      },
   },
};