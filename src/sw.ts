/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching"
import { NavigationRoute, registerRoute } from "workbox-routing"
import { StaleWhileRevalidate } from "workbox-strategies"
import { ExpirationPlugin } from "workbox-expiration"
import { CacheableResponsePlugin } from "workbox-cacheable-response"

declare const self: ServiceWorkerGlobalScope

// Let workbox handle the precaching
if (!import.meta.env.DEV) {
  precacheAndRoute(self.__WB_MANIFEST)
}

const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$")

const navigationRoute = new NavigationRoute(
  createHandlerBoundToURL("/index.html"),
  {
    denylist: [fileExtensionRegexp],
  }
)
registerRoute(navigationRoute)

// Skip waiting immediately during installation
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting())
})

// Handle activation and migration
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        // Claim clients
        await self.clients.claim()

        // Attempt migration
        const clients = await self.clients.matchAll()
        clients.forEach((client) => {
          client.postMessage({
            type: "PERFORM_MIGRATION",
          })
        })
      } catch (error) {
        console.error("[SW] Migration failed:", error)
      }
    })()
  )
})

// Cache mapbox tiles
registerRoute(
  new RegExp(
    /(https:)?(\/\/([^/?#]*)?)(mapbox.com)([^?#]*)(\?([^#]*))?(#(.*))?/g
  ),
  new StaleWhileRevalidate({
    cacheName: "maptiles",
    plugins: [
      new ExpirationPlugin({ maxEntries: 500 }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
)

// Skip waiting on message
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})
