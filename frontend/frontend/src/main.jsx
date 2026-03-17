import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // keep this empty or minimal for now

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);