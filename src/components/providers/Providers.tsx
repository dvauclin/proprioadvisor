"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { CookieConsentProvider } from "@/contexts/CookieConsentContext";
import { TooltipProvider } from "@/components/ui-kit/tooltip";

interface ProvidersProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    },
  },
});

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <CookieConsentProvider>
        <AuthProvider>
          <FavoritesProvider>
            <TooltipProvider>
              {children}
            </TooltipProvider>
          </FavoritesProvider>
        </AuthProvider>
      </CookieConsentProvider>
    </QueryClientProvider>
  );
};

export default Providers; 

