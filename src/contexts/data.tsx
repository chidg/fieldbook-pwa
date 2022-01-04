import React from "react"
import {
  useLocalStorage,
  useOnlineStatus,
  useSyncingStatus,
  useUploadCollection,
} from "../hooks"
import { useDelete } from "react-supabase"
export interface DataItem {
  id: string
  number: string
  prefix?: string
  notes: string
  fieldName: string
  location?: GeolocationCoordinates
  timestamp: string
  synchronisedAt?: boolean | number
}

export interface DataItemToUpload extends DataItem {
  synchronisedAt: false
}
export interface Data {
  [id: string]: DataItem
}
export interface DataToUpload {
  [id: string]: DataItemToUpload
}

interface DataState {
  data: Data
  setData: (arg0: Data) => void
  saveItem: (arg0: DataItem) => void
  deleteItem: (id: string) => void
}

const DataContext = React.createContext<DataState | undefined>(undefined)

const DataProvider: React.FC = ({ children }) => {
  const [localStoredValue, setLocalStoredValue] = useLocalStorage<Data>(
    "data",
    {}
  )
  const online = useOnlineStatus()
  const { syncing, setSyncing } = useSyncingStatus()
  const upload = useUploadCollection()
  const deleteCollection = useDelete("collections")[1]

  // When a data item changes, we write the change directly to local storage
  // When local storage changes, this useEffect stores the data in the provider state
  // When the provider state changes, unsynchronised items are queued for upload.

  React.useEffect(() => {
    if (!online || syncing) return

    const unsynchronised = Object.values(localStoredValue).filter(
      (item) => !item.synchronisedAt
    )

    if (unsynchronised.length > 0) {
      setSyncing(true)

      upload(unsynchronised)
        .then((results) => {
          if (!results) return

          if (results.error) console.error(results.error)
          if (!results.data) return
          const dataResults = results.data as DataItem[] // solves TS bug

          const newData = dataResults.reduce((collection, item) => {
            if (item)
              collection[item.id] = {
                ...item,
                synchronisedAt: Date.now(),
              }
            return collection
          }, {} as Data)
          setLocalStoredValue({ ...localStoredValue, ...newData })
          setSyncing(false)
        })
        .catch(() => setSyncing(false))
    }
  }, [
    online,
    upload,
    setSyncing,
    syncing,
    setLocalStoredValue,
    localStoredValue,
  ])

  const saveItem = React.useCallback(
    async (item: DataItem) => {
      // const uploadResult = await upload([item])
      // if (uploadResult.error) throw new Error(uploadResult.error.message)
      // console.log({ uploadResult })
      const newData = {
        ...localStoredValue,
        [item.id]: { ...item, synchronisedAt: false },
      }
      setLocalStoredValue(newData)
    },
    [localStoredValue, setLocalStoredValue]
  )

  const deleteItem = React.useCallback(
    async (id: string) => {
      const { [id]: deleted, ...newData } = localStoredValue
      setLocalStoredValue(newData)
      setSyncing(true)
      deleteCollection((query) => query.eq("id", id)).then(() =>
        setSyncing(false)
      )
    },
    [localStoredValue, setLocalStoredValue, deleteCollection, setSyncing]
  )

  return (
    <DataContext.Provider
      value={{
        data: localStoredValue,
        setData: setLocalStoredValue,
        saveItem,
        deleteItem,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

const useDataContext = () => {
  const context = React.useContext(DataContext)
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider")
  }
  return context
}

DataProvider.whyDidYouRender = false

export { DataProvider, useDataContext }
