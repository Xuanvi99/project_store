import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import "swiper/css";
import "rc-slider/assets/index.css";
import "react-toastify/dist/ReactToastify.css";
import "react-lazy-load-image-component/src/effects/blur.css";
import App from "./App.tsx";
import { store } from "./stores/index.ts";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App></App>
    </Provider>
  </React.StrictMode>
);
