import React from "react"
import ReactGA from "react-ga"
import { useLocation } from "react-router-dom"
import { useUserContext } from "../contexts"

export const useGoogleAnalytics = () => {
  const location = useLocation()
  const { user } = useUserContext()
  const [initialised, setInitialised] = React.useState(false)

  React.useEffect(() => {
    if (process.env.REACT_APP_GA_TRACKING_ID) {
      ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID)
      setInitialised(true)
    }
  }, [setInitialised])

  React.useEffect(() => {
    initialised &&
      ReactGA.set({
        userId: user?.email,
      })
  }, [initialised, user?.email])

  React.useEffect(() => {
    if (initialised) {
      const currentPath = location.pathname + location.search
      ReactGA.set({ page: currentPath })
      ReactGA.pageview(currentPath)
    }
  }, [location, initialised])

  const sendEvent = React.useCallback(
    (payload) => {
      initialised && ReactGA.event(payload)
    },
    [initialised]
  )

  return { sendEvent }
}
