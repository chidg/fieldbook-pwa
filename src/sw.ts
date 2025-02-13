/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { RouteHandlerCallbackOptions } from "workbox-core"
import { createHandlerBoundToURL, precacheAndRoute } from "workbox-precaching"
import { NavigationRoute, registerRoute } from "workbox-routing"
import { NetworkFirst, StaleWhileRevalidate } from "workbox-strategies"
import { ExpirationPlugin } from "workbox-expiration"
import { CacheableResponsePlugin } from "workbox-cacheable-response"

declare const self: ServiceWorkerGlobalScope

// Precache must be first, before any event listeners
if (!import.meta.env.DEV) {
  precacheAndRoute(self.__WB_MANIFEST)
}

self.addEventListener("install", (event) => {
  console.log("[Production] Install event received", { event })
  console.log("Precache manifest:", self.__WB_MANIFEST)
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  console.info("[SW] Activation started")

  event.waitUntil(
    (async () => {
      try {
        // First claim clients
        await self.clients.claim()

        // Give a small delay for claim to take effect
        await new Promise((resolve) => setTimeout(resolve, 500))

        let success = false
        let attempts = 0
        const maxAttempts = 5
        const retryDelay = 2000 // 2 seconds between attempts

        while (attempts < maxAttempts && !success) {
          console.info(`[SW] Attempt ${attempts + 1} to find clients`)

          // Get all clients
          const allClients = await self.clients.matchAll({
            includeUncontrolled: true, // Important: get even uncontrolled clients
            type: "window", // We only care about window clients
          })
          if (allClients.length > 0) {
            console.info("[SW] Found clients, sending migration message")

            await Promise.all(
              allClients.map(async (client) => {
                try {
                  client.postMessage({
                    type: "PERFORM_MIGRATION",
                  })
                  console.info(
                    "[SW] Sent migration message to client",
                    client.id
                  )
                } catch (err) {
                  console.error(
                    "[SW] Failed to send message to client",
                    client.id,
                    err
                  )
                }
              })
            )

            success = true
            break
          }

          console.info(
            `[SW] No controlled clients found, waiting ${retryDelay}ms before retry`
          )
          await new Promise((resolve) => setTimeout(resolve, retryDelay))
          attempts++
        }

        if (!success) {
          console.warn(
            `[SW] Failed to find controlled clients after ${maxAttempts} attempts`
          )
        }
      } catch (error) {
        console.error("[SW] Migration setup failed:", error)
        console.error(error) // Log the full error object
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

const isDev = import.meta.env.DEV

const navigationHandler = async (params: RouteHandlerCallbackOptions) => {
  try {
    const response = await fetch(params.request)
    if (response.ok) {
      return response
    }
  } catch (error) {
    console.log("Navigation fetch failed, falling back to index.html", error)
  }

  return isDev
    ? await fetch("/index.html")
    : await createHandlerBoundToURL("/index.html")(params)
}

// Improved file extension regex that explicitly includes CSS
const fileExtensionRegexp = new RegExp(
  "/[^/?]+\\.(css|js|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$"
)
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
  ({ request }) => request.destination === "image",
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
