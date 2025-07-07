// src/index.js

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // ✅ Tailwind CSS styles
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // ✅ Required for toast styling

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
