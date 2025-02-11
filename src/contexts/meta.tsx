import {
  ReactNode,
  createContext,
  useState,
  useContext,
  useEffect,
} from "react"
import { useDataContext } from "./data"

type ViewTypes = "list" | "map" | "empty"
interface MetaState {
  newestFirst: boolean
  setNewestFirst: (value: boolean) => void
  viewType: ViewTypes
  setViewType: (value: ViewTypes) => void
}

const MetaContext = createContext<MetaState | undefined>(undefined)

const MetaProvider = ({ children }: { children: ReactNode }) => {
  const [newestFirst, setNewestFirst] = useState<boolean>(false)
  const { data } = useDataContext()
  const [viewType, setViewType] = useState<ViewTypes>(
    Object.keys(data).length > 0 ? "list" : "empty"
  )

  useEffect(() => {
    if (viewType === "empty" && Object.keys(data).length > 0)
      setViewType("list")
  }, [viewType, data])

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
