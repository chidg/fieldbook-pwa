/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { clientsClaim, RouteHandlerCallbackOptions } from "workbox-core"
import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching"
import { NavigationRoute, registerRoute } from "workbox-routing"
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies"
import { ExpirationPlugin } from "workbox-expiration"
import { CacheableResponsePlugin } from "workbox-cacheable-response"

declare const self: ServiceWorkerGlobalScope

// Migration functionality
self.addEventListener("install", (event) => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
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
          if (clients.length > 0) {
            clients.forEach((client) => {
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
      new ExpirationPlugin({ maxEntries: 500 }),
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
)

const isDev = import.meta.env.DEV

const navigationHandler = async (params: RouteHandlerCallbackOptions) => {
  // First try to get the actual request
  try {
    const response = await fetch(params.request)
    if (response.ok) {
      return response
    }
  } catch (error) {
    console.log("Navigation fetch failed, falling back to index.html", error)
  }

  // Fall back to index.html
  return isDev
    ? await fetch("/index.html")
    : await createHandlerBoundToURL("/index.html")(params)
}

const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$")
const navigationRoute = new NavigationRoute(navigationHandler, {
  denylist: [fileExtensionRegexp],
})

registerRoute(navigationRoute)

// IMPORTANT: Handle Google Analytics first, before any other routes
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("google-analytics.com")) {
    event.respondWith(
      fetch(event.request.clone(), {
        mode: "cors", // Try cors first
        credentials: "omit",
      })
        .catch(() =>
          // If cors fails, try no-cors as fallback
          fetch(event.request.clone(), {
            mode: "no-cors",
            credentials: "omit",
          })
        )
        .catch(() => {
          // If both attempts fail, return an empty response
          // This prevents the service worker from throwing errors
          return new Response(null, {
            status: 200,
            statusText: "OK",
            headers: new Headers({
              "Content-Type": "application/javascript",
            }),
          })
        })
    )
    return // Important: stop event propagation
  }
})

// Add specific handling for assets
registerRoute(
  ({ request }) =>
    request.destination === "style" || request.destination === "image",
  new StaleWhileRevalidate({
    cacheName: "assets",
  })
)

// Handle other external scripts - MODIFIED to exclude analytics
registerRoute(
  ({ request, url }) =>
    request.destination === "script" &&
    url.hostname !== self.location.hostname &&
    url.hostname !== "www.google-analytics.com",
  new StaleWhileRevalidate({
    cacheName: "external-scripts",
    plugins: [
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
