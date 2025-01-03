
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { configureStore } from "@reduxjs/toolkit";
import globalReducer from "./state/index";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { HelmetProvider } from "react-helmet-async";
import { StoreProvider } from "./store";
import { store } from "state/store";

// import { api } from './state/api';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <StoreProvider>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </StoreProvider>
    </Provider>
  </React.StrictMode>
);
