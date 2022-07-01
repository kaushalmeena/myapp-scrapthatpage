import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "material-icons/iconfont/material-icons.css";
import "typeface-roboto/index.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Failed to find the root element");
}

const root = ReactDOM.createRoot(rootEl);

root.render(<App />);
