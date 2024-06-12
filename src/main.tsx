import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

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
