import React from "react"
import { useLocalStorage } from "../hooks"
import useDeepCompareEffect from "use-deep-compare-effect"

export interface MetaData {
  version: string
  loading: boolean
  setLoading: (arg0: boolean) => void
  updating: boolean
  completeUpdate: () => void
}

const defaultMeta = {
  version: process.env.GIT_SHA || "0.1",
  loading: false,
  setLoading: () => null,
  updating: false,
  completeUpdate: () => null,
}

const MetaContext = React.createContext<MetaData>(defaultMeta)

const MetaProvider: React.FC = ({ children }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [localStoredMeta, setLocalStoredMeta] = useLocalStorage(
    "meta",
    defaultMeta
  )
  const [version, setVersion] = React.useState<string>(defaultMeta.version)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [updating, setUpdating] = React.useState<boolean>(false)


  useDeepCompareEffect(() => {
    setVersion(localStoredMeta)
    if (localStoredMeta.version !== process.env.REACT_APP_GIT_SHA) {
      console.log("start updating")
      setUpdating(true)
    } else {
      console.log("version the same, do not update")
      setUpdating(false)
    }
  }, [localStoredMeta.version, setVersion, setUpdating])

  // React.useEffect(() => {

  //   setLocalStoredMeta({ version: process.env.REACT_APP_GIT_SHA })
  // }, [version, setLocalStoredMeta])

  const completeUpdate = React.useCallback(() => {
    setLocalStoredMeta({ version: process.env.REACT_APP_GIT_SHA })
  }, [setLocalStoredMeta])

  const memoisedState = React.useMemo(
    () => ({
      version,
      loading,
      updating,
      completeUpdate
    }),
    [version, loading, updating, completeUpdate]
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

// MetaProvider.whyDidYouRender = true

export { MetaProvider, useMetaContext }
