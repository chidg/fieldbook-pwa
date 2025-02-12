/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim } from "workbox-core"
import { precacheAndRoute } from "workbox-precaching"
import { registerRoute } from "workbox-routing"
import { StaleWhileRevalidate } from "workbox-strategies"
import { ExpirationPlugin } from "workbox-expiration"
import { CacheableResponsePlugin } from "workbox-cacheable-response"

declare const self: ServiceWorkerGlobalScope

// Migration functionality
// In sw.ts
self.addEventListener("install", (event) => {
  console.log("[Production] Install event received", { event })
})

self.addEventListener("activate", (event) => {
  console.log("[Production] Activate event START", { event })

  event.waitUntil(
    (async () => {
      try {
        const clients = await self.clients.matchAll()
        console.log("[Production] Found clients:", clients.length)

        clients.forEach((client) => {
          console.log(
            "[Production] Sending migration message to client",
            client.id
          )
          client.postMessage({
            type: "PERFORM_MIGRATION",
          })
        })
      } catch (error) {
        console.error("[Production] Migration setup failed:", error)
      }
    })()
  )
})

// Basic PWA setup
clientsClaim()
if (!import.meta.env.DEV) {
  precacheAndRoute(self.__WB_MANIFEST)
}

// Cache mapbox tiles
registerRoute(
  new RegExp(
    /(https:)?(\/\/([^/?#]*)?)(mapbox.com)([^?#]*)(\?([^#]*))?(#(.*))?/g
  ),
  new StaleWhileRevalidate({
    cacheName: "maptiles",
    plugins: [
      new ExpirationPlugin({ maxEntries: 100 }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
)

// Handle skip waiting
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
