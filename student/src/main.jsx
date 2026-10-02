import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./Store/store.js";
import {Provider} from 'react-redux'
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 2000,
          style: {
            borderRadius: "12px",
            background: "#1e293b",
            color: "#fff",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </Provider>
  </BrowserRouter>,
);
