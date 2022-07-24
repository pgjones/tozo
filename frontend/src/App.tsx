import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Container from "@mui/material/Container";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import { AuthContextProvider } from "src/AuthContext";
import Toasts from "src/components/Toasts";
import Router from "src/Router";
import ThemeProvider from "src/ThemeProvider";
import { ToastContextProvider } from "src/ToastContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <HelmetProvider>
          <Helmet>
            <title>Tozo</title>
          </Helmet>
          <ThemeProvider>
            <ToastContextProvider>
              <Container maxWidth="md">
                <Toasts />
                <Router />
              </Container>
            </ToastContextProvider>
          </ThemeProvider>
        </HelmetProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
};

export default App;
