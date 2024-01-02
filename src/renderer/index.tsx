import { createRoot } from "react-dom/client";

import App from "./App";

import "@fontsource/roboto";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootEl);

root.render(<App />);
