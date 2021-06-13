import React from "react"

export interface MetaData {
  loading: boolean
  setLoading: (arg0: boolean) => void
  updating: boolean
}

const defaultMeta = {
  // version: process.env.GIT_SHA || "0.1",
  loading: true,
  setLoading: () => null,
  updating: false,
}

const MetaContext = React.createContext<MetaData>(defaultMeta)

const MetaProvider: React.FC = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  // Loading needs to be true on init to enable the DB query time to return the user
  // This prevents a race condition which would otherwise cause a redirect to the login screen 
  const [loading, setLoading] = React.useState<boolean>(true)  
  const [updating, setUpdating] = React.useState<boolean>(false)
  const channel = React.useRef(new BroadcastChannel("fieldbook-messages"))

  React.useEffect(() => {
    if (channel && channel.current) {
      channel.current.onmessage = (e) => {
        if (e.data.hasOwnProperty("updating")) {
          setUpdating(e.data.updating)
        }
      }
    }
    const currentChannel = channel.current
    return function cleanup() {
      if (currentChannel) {
        currentChannel.close()
      }
    }
  }, [])

  const memoisedState = React.useMemo(
    () => ({
      loading,
      updating,
    }),
    [loading, updating]
  )

  return (
    <MetaContext.Provider
      value={{
        ...memoisedState,
        setLoading,
      }}
    >
      {children}
    </MetaContext.Provider>
  )
}

const useMetaContext = () => {
  const context = React.useContext(MetaContext)
  if (context === undefined) {
    throw new Error("useMetaContext must be used within a MetaProvider")
  }
  return context
}

MetaProvider.whyDidYouRender = true

export { MetaProvider, useMetaContext }
