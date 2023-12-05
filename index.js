import React from "react";
import ReactDOM from "react-dom/client";
import App from "./src/App";

import { AuthStateProvider } from "./src/context/AuthStateContext";
import { LanguageProvider } from "./src/context/LanguageContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthStateProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </AuthStateProvider>
  </React.StrictMode>
);
