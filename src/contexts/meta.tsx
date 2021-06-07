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
  loading: boolean
}

const defaultMeta = {
  meta: {
    version: process.env.GIT_SHA || "0.1",
    notifications: [],
  },
  loading: false,
}


const MetaContext = React.createContext<MetaProviderProps>(defaultMeta)

const MetaProvider: React.FC = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const localStoredValue = useLocalStorage(
    "meta",
    defaultMeta
  )[0]
  const [metaData, setMetaData] = React.useState<MetaData>(defaultMeta.meta)
  const { loading } = useDataBaseContext()

  useDeepCompareEffect(() => {
    setMetaData(localStoredValue)
  }, [localStoredValue, setMetaData])

  return (
    <MetaContext.Provider
      value={{
        meta: metaData,
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
