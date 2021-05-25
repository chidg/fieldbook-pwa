import React from "react"
import ReactGA from "react-ga"
import { useLocation } from "react-router-dom"

export const useGoogleAnalytics = () => {
  const location = useLocation()

  React.useEffect(() => {
    if (process.env.REACT_APP_GA_TRACKING_ID) {
      ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID)
    }
  }, [])

  React.useEffect(() => {
    const currentPath = location.pathname + location.search
    ReactGA.set({ page: currentPath })
    ReactGA.pageview(currentPath)
  }, [location])

  const sendEvent = React.useCallback((payload) => {
    ReactGA.event(payload)
  }, [])

  return { sendEvent }
}
