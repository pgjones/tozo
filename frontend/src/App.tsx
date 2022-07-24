import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Container from "@mui/material/Container";
import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

import ThemeProvider from "src/ThemeProvider";

const App = () => {
  return (
    <HelmetProvider>
      <Helmet>
        <title>Tozo</title>
      </Helmet>
      <ThemeProvider>
        <Container maxWidth="md"></Container>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
