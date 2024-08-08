import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";
import { SocketProvider } from "./context/SocketContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  //<React.StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <App />
        <Toaster closeButton />
      </SocketProvider>
    </BrowserRouter>
  //</React.StrictMode>
);
