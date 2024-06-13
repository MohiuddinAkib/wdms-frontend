import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import "@/index.css";
import React from "react";
import App from "@/App.tsx";
import { root } from "./theme";
import { CssBaseline } from "@mui/material";
import AllTheProviders from "@components/AllTheProviders.tsx";

root.render(
  <React.StrictMode>
    <AllTheProviders>
      <CssBaseline />
      <App />
    </AllTheProviders>
  </React.StrictMode>
);
