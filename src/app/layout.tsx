import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import * as Sentry from "@sentry/react"
import * as SentryBrowser from "@sentry/browser"

import { DataProvider, MetaProvider, UserProvider } from "@/contexts"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Fieldbook",
  description: "An app for botanists and ecologists to record field data.",
}

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [new SentryBrowser.BrowserTracing()],
    tracesSampleRate: 0.1,
    initialScope: { tags: { appVersion: "ncmrr" } },
  })
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-br from-purple-600 to-blue-200 bg-fixed h-screen`}
      >
        <DataProvider>
          <MetaProvider>
            <UserProvider>{children}</UserProvider>
          </MetaProvider>
        </DataProvider>
      </body>
    </html>
  )
}
