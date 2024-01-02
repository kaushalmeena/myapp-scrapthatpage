import { createRoot } from "react-dom/client";

import App from "./App";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Failed to find the root element");
}

const root = createRoot(rootEl);

root.render(<App />);
