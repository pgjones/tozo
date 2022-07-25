import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import Error from "src/pages/Error";
import * as serviceWorkerRegistration from "src/serviceWorkerRegistration";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://519ef886b6114df4a5173591c8ee4b1d@o1333443.ingest.sentry.io/6599027",
    integrations: [new BrowserTracing()],
    tracesSampleRate: 0.2,
  });
}

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Sentry.ErrorBoundary fallback={<Error />}>
      <App />
    </Sentry.ErrorBoundary>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

serviceWorkerRegistration.register();
