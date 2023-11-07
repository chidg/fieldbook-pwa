import React from "react"
import ReactGA from "react-ga"
import { useUserContext } from "../contexts"
import { useSearchParams, usePathname } from "next/navigation"

export const useGoogleAnalytics = () => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { user } = useUserContext()

  React.useEffect(() => {
    if (process.env.REACT_APP_GA_TRACKING_ID) {
      ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID)
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
