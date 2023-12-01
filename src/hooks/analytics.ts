"use client"
import React from "react"
import ReactGA from "react-ga"
import { useSearchParams, usePathname } from "next/navigation"
import { useUser } from "./useUser"

export const useGoogleAnalytics = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { user } = useUser()

  React.useEffect(() => {
    if (import.meta.env.VITE_APP_GA_TRACKING_ID) {
      ReactGA.initialize(import.meta.env.VITE_APP_GA_TRACKING_ID)
    }
  }, [])

  React.useEffect(() => {
    ReactGA.set({
      userId: user?.email,
    })
  }, [user?.email])

  React.useEffect(() => {
    const currentPath = pathname + searchParams
    ReactGA.set({ page: currentPath })
    ReactGA.pageview(currentPath)
  }, [pathname, searchParams])

  const sendEvent = React.useCallback((payload: ReactGA.EventArgs) => {
    ReactGA.event(payload)
  }, [])

  return { sendEvent }
}
