import { ReactNode, createContext, useState, useContext } from "react"

interface MetaState {
  newestFirst: boolean
  setNewestFirst: (value: boolean) => void
}

const MetaContext = createContext<MetaState | undefined>(undefined)

const MetaProvider = ({ children }: { children: ReactNode }) => {
  const [newestFirst, setNewestFirst] = useState<boolean>(false)

  return (
    <MetaContext.Provider
      value={{
        newestFirst,
        setNewestFirst,
      }}
    >
      {children}
    </MetaContext.Provider>
  )
}

const useMetaContext = () => {
  const context = useContext(MetaContext)
  if (context === undefined) {
    throw new Error("useMetaContext must be used within a MetaProvider")
  }
  return context
}

export { MetaProvider, useMetaContext }
