import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />

    <Toaster position="top-right" />

    <ToastContainer
      position="top-right"
      autoClose={3000}
      theme="light"
    />
  </StrictMode>
);