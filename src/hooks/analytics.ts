import React from "react"
import ReactGA from "react-ga"
import { useUser } from "./useUser"
import { useLocation, useSearchParams } from "react-router-dom"

export const useGoogleAnalytics = () => {
  const searchParams = useSearchParams()
  const { pathname } = useLocation()
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
