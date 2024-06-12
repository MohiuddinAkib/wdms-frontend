import React from "react";
import { theme } from "@/theme";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import { ApplicationError } from "@/types/app-contract";
import { StyledEngineProvider, ThemeProvider } from "@mui/material";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApplicationError;
  }
}

function AllTheProviders({ children }: React.PropsWithChildren) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>{children}</BrowserRouter>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default AllTheProviders;
