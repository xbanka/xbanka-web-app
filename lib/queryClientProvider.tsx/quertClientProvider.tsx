"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { queryClientConfig } from "../config/config";

interface QueryClientProviderTypes {
  children: React.ReactNode;
}

const QueryProvider = ({ children }: QueryClientProviderTypes) => {
  const queryClient = new QueryClient(queryClientConfig);
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default QueryProvider;
