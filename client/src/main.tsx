import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";

import "@styles/index.scss";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

let modalRoot = document.getElementById("modalRoot");
if (!modalRoot) {
  modalRoot = document.createElement("div");
  modalRoot.id = "modalRoot";

  document.body.appendChild(modalRoot);
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
