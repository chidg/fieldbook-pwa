import React from "react"
import { usePouch, useFind } from "use-pouchdb"
import { useMetaContext } from '../contexts'
export interface DataItem {
  _id: string
  uuid: string
  number: string
  notes: string
  fieldName: string
  location?: GeolocationCoordinates
  timestamp: number
  type: "collection"
  photos?: File[]
}

type CollectionsDBResponse = PouchDB.Find.FindResponse<DataItem> & {
  loading: boolean
}
export type CollectionDoc = PouchDB.Core.ExistingDocument<DataItem>

type CollectionData = {[id: string]: CollectionDoc }
interface DataState {
  data: CollectionData
  saveItem: (arg0: DataItem) => void
}

const DataContext = React.createContext<DataState | undefined>(undefined)

const DataProvider: React.FC = ({ children }) => {
  const db = usePouch() // get the database
  const { setLoading } = useMetaContext()
  const [data, setData] = React.useState<CollectionData>({})
  const { docs: collections }: CollectionsDBResponse = useFind({
    index: {
      fields: ["type"],
    },
    selector: {
      type: "collection",
    },
  })

  const setDataLoading = React.useCallback((value: boolean) => setLoading('data', value), [setLoading])

  React.useEffect(() => {
    const dataById = collections.reduce((result, collection) => {
      result[collection._id] = collection
      return result
    }, {} as CollectionData)
    setData(dataById)
    setDataLoading(false)
  }, [collections, setData, setDataLoading])

  const saveItem = React.useCallback(
    async (item: DataItem) => {
      const newData = { ...item, type: "collection" }
      await db.put(newData)
    },
    [db]
  )

  return (
    <DataContext.Provider
      value={{
        data,
        saveItem,
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

export { DataProvider, useDataContext }
