import { ReactNode, createContext, useState, useContext } from "react"

interface MetaState {
  newestFirst: boolean
  setNewestFirst: (value: boolean) => void
  viewType: "list" | "map"
  setViewType: (value: "list" | "map") => void
}

const MetaContext = createContext<MetaState | undefined>(undefined)

const MetaProvider = ({ children }: { children: ReactNode }) => {
  const [newestFirst, setNewestFirst] = useState<boolean>(false)
  const [viewType, setViewType] = useState<"list" | "map">("list")

  return (
    <MetaContext.Provider
      value={{
        newestFirst,
        setNewestFirst,
        viewType,
        setViewType,
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
