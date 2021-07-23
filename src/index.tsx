import React from "react"
import ReactDOM from "react-dom"
import "./styles/tailwind.css"
import App from "./App"
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"
import reportWebVitals from "./reportWebVitals"
import * as Sentry from "@sentry/react"
import { Integrations } from "@sentry/tracing"
import { UserProvider, DataProvider } from "./contexts"

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 0.1,
    initialScope: { tags: { appVersion: 'main' } }
  })
}

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
