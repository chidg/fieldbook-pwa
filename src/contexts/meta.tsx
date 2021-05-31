import React from "react"
import { useLocalStorage } from "../hooks"
import useDeepCompareEffect from "use-deep-compare-effect"

export interface MetaData {
  version: string
  notifications: Array<string>
}

type LoadingState = {
  migrations: boolean
  user: boolean
  data: boolean
}

type MetaProviderProps = {
  meta: MetaData
  setMetaData?: (arg0: MetaData) => void
  loading: boolean
  setLoading: (key: keyof LoadingState, value: boolean) => void
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
  console.log("MetaProvider loading")
  const [localStoredValue, setLocalStoredValue] = useLocalStorage(
    "meta",
    defaultMeta
  )
  const [metaData, setMetaData] = React.useState<MetaData>(defaultMeta.meta)
  const [migrationsLoading, setMigrationsLoading] =
    React.useState<boolean>(true)
  const [userLoading, setUserLoading] = React.useState<boolean>(true)
  const [dataLoading, setDataLoading] = React.useState<boolean>(true)

  useDeepCompareEffect(() => {
    setMetaData(localStoredValue)
  }, [localStoredValue, setMetaData])

  const loadingState = React.useMemo((): boolean => {
    // Returns true if any of the values in 'loading' are true
    return migrationsLoading || userLoading || dataLoading
  }, [migrationsLoading, userLoading, dataLoading])

  console.log("loadingState", loadingState)

  const setLoadingByKey = React.useCallback(
    (key: keyof LoadingState, value: boolean) => {
      const setLoadingMap = {
        data: setDataLoading,
        migrations: setMigrationsLoading,
        user: setUserLoading,
      }
      setLoadingMap[key](value)
    },
    [setMigrationsLoading, setUserLoading, setDataLoading]
  )

  return (
    <MetaContext.Provider
      value={{
        meta: metaData,
        setMetaData: setLocalStoredValue,
        loading: loadingState,
        setLoading: setLoadingByKey,
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
