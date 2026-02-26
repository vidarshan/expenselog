import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/charts/styles.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { HelmetProvider } from "react-helmet-async";
import { store } from "./store/index.js";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <AuthProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </AuthProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
