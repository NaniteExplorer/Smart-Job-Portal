import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "./store";
import App from "./App";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: { borderRadius: "10px", background: "#0f172a", color: "#fff" },
        }}
      />
    </Provider>
  </React.StrictMode>
);
