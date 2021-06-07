import React from "react"
import { useLocalStorage } from "../hooks"
import useDeepCompareEffect from "use-deep-compare-effect"
import { useDataBaseContext } from "./database"

export interface MetaData {
  version: string
  notifications: Array<string>
}


type MetaProviderProps = {
  meta: MetaData
  setMetaData?: (arg0: MetaData) => void
  loading: boolean
}

const defaultMeta = {
  meta: {
    version: process.env.GIT_SHA || "0.1",
    notifications: [],
  },
  loading: false,
  setLoading: () => null,
}


const MetaContext = React.createContext<MetaProviderProps>(defaultMeta)

const MetaProvider: React.FC = ({ children }) => {
  const [localStoredValue, setLocalStoredValue] = useLocalStorage(
    "meta",
    defaultMeta
  )
  const [metaData, setMetaData] = React.useState<MetaData>(defaultMeta.meta)
  const { loading } = useDataBaseContext()

  useDeepCompareEffect(() => {
    setMetaData(localStoredValue)
  }, [localStoredValue, setMetaData])

  return (
    <MetaContext.Provider
      value={{
        meta: metaData,
        setMetaData: setLocalStoredValue,
        loading,
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

// MetaProvider.whyDidYouRender = true

export { MetaProvider, useMetaContext }
