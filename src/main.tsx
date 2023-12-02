import React from "react"
import "./styles/tailwind.css"
import App from "./App"
import * as Sentry from "@sentry/react"
import * as SentryBrowser from "@sentry/browser"
import { UserProvider, DataProvider, MetaProvider } from "@/contexts"
import { createRoot } from "react-dom/client"

if (import.meta.env.VITE_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_APP_SENTRY_DSN,
    integrations: [new SentryBrowser.BrowserTracing()],
    tracesSampleRate: 0.1,
    initialScope: { tags: { appVersion: "ncmrr" } },
  })
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <DataProvider>
        <MetaProvider>
          <App />
        </MetaProvider>
      </DataProvider>
    </UserProvider>
  </React.StrictMode>
)
