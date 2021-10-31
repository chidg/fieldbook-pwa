import React from "react"

interface MetaState {
  newestFirst: boolean,
  setNewestFirst: (value: boolean) => void
}

const MetaContext = React.createContext<MetaState | undefined>(undefined)

const MetaProvider: React.FC = ({ children }) => {
  const [newestFirst, setNewestFirst] = React.useState<boolean>(false)

  return (
    <MetaContext.Provider
      value={{
        newestFirst,
        setNewestFirst
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
