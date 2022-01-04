import React from "react"

interface MetaState {
  newestFirst: boolean
  setNewestFirst: (value: boolean) => void
  setLoading: (value: boolean) => void
  setSyncing: (value: boolean) => void
  loading: boolean
  syncing: boolean
}

const MetaContext = React.createContext<MetaState | undefined>(undefined)

const MetaProvider: React.FC = ({ children }) => {
  // Loading needs to be true on init to enable the DB query time to return the user
  // This prevents a race condition which would otherwise cause a redirect to the login screen
  const [loading, setLoading] = React.useState<boolean>(true)
  const [newestFirst, setNewestFirst] = React.useState<boolean>(false)
  const [syncing, setSyncing] = React.useState<boolean>(false)

  const memoisedState = React.useMemo(
    () => ({
      loading,
      syncing,
    }),
    [loading, syncing]
  )

  return (
    <MetaContext.Provider
      value={{
        newestFirst,
        setNewestFirst,
        setLoading,
        setSyncing,
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
