import React from "react"

interface MetaState {
  newestFirst: boolean
  setNewestFirst: (value: boolean) => void
  setLoading: (value: boolean) => void
  online: boolean
  loading: boolean
}

const MetaContext = React.createContext<MetaState | undefined>(undefined)

const MetaProvider: React.FC = ({ children }) => {
  // Loading needs to be true on init to enable the DB query time to return the user
  // This prevents a race condition which would otherwise cause a redirect to the login screen
  const [loading, setLoading] = React.useState<boolean>(true)
  const [newestFirst, setNewestFirst] = React.useState<boolean>(false)
  const [online, setOnline] = React.useState(window.navigator.onLine)

  window.addEventListener("offline", () => setOnline(false))
  window.addEventListener("online", () => setOnline(true))

  const memoisedState = React.useMemo(
    () => ({
      loading,
      online: online,
    }),
    [loading, online]
  )

  return (
    <MetaContext.Provider
      value={{
        newestFirst,
        setNewestFirst,
        setLoading,
        ...memoisedState,
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

export { MetaProvider, useMetaContext }
