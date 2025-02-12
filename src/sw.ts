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
        // First claim clients
        clientsClaim()

        // Then try to get clients multiple times with a delay
        let attempts = 0
        const maxAttempts = 3

        while (attempts < maxAttempts) {
          const clients = await self.clients.matchAll()
          console.log(
            "[Production] Found clients (attempt " + (attempts + 1) + "):",
            clients.length
          )

          if (clients.length > 0) {
            clients.forEach((client) => {
              console.log(
                "[Production] Sending migration message to client",
                client.id
              )
              client.postMessage({
                type: "PERFORM_MIGRATION",
              })
            })
            break
          }

          // Wait a bit before trying again
          await new Promise((resolve) => setTimeout(resolve, 1000))
          attempts++
        }

        if (attempts === maxAttempts) {
          console.log(
            "[Production] No clients found after " + maxAttempts + " attempts"
          )
        }
      } catch (error) {
        console.error("[Production] Migration setup failed:", error)
      }
    })()
  )
})

// Basic PWA setup
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
