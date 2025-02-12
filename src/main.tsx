import React from "react"
import "./styles/tailwind.css"
import App from "./App"
import * as Sentry from "@sentry/react"
import * as SentryBrowser from "@sentry/browser"
import { UserProvider, DataProvider, MetaProvider } from "@/contexts"
import { createRoot } from "react-dom/client"
import { performMigration } from "./migrations/1_convert_config_to_objects"

if (import.meta.env.VITE_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_APP_SENTRY_DSN,
    integrations: [new SentryBrowser.BrowserTracing()],
    tracesSampleRate: 0.1,
    initialScope: { tags: { appVersion: "ncmrr" } },
  })
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data.type === "PERFORM_MIGRATION") {
      const success = performMigration()
      if (success) {
        console.log("Migration success")
        window.location.reload()
      }
    }
  })
  navigator.serviceWorker.register(
    import.meta.env.MODE === "production" ? "/sw.js" : "/dev-sw.js?dev-sw",
    { type: import.meta.env.MODE === "production" ? "classic" : "module" }
  )
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
