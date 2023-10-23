import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "remixicon/fonts/remixicon.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { AppProvider } from "./context/AuthContext";
import { Provider } from "react-redux";
import store from "./store/index.js";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Provider store={store}>
        <App />
        </Provider>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);
