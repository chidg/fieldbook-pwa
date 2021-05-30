import React from "react"
import { usePouch, useAllDocs } from 'use-pouchdb'

export interface DataItem {
  _id: string
  uuid: string
  number: string
  notes: string
  fieldName: string
  location?: GeolocationCoordinates
  timestamp: number
  type: 'collection'
  photos?: File[]
}


type CollectionsDBResponse = PouchDB.Core.AllDocsResponse<DataItem> & { loading: boolean }
export type CollectionDoc = PouchDB.Core.ExistingDocument<DataItem>

type CollectionData = { [id: string]: CollectionDoc }
interface DataState {
  data: CollectionData
  // setData: (arg0: Data) => void,
  loading: boolean
  saveItem: (arg0: DataItem) => void
}

const DataContext = React.createContext<
  DataState | undefined
>(undefined)


const DataProvider: React.FC = ({ children }) => {
  // const [localStoredValue, setLocalStoredValue] = useLocalStorage('data', {})
  const db = usePouch() // get the database
  const [data, setData] = React.useState<CollectionData>(
    {}
  )
  const { rows: collections, loading }: CollectionsDBResponse = useAllDocs({
    include_docs: true, // Load all document bodies
    attachments: true
  })

  React.useEffect(() => {
    const data = collections.reduce((result, item) => {
      if (item.doc && item.doc.type === "collection") result[item.id] = item.doc
      return result
    }, {} as CollectionData)
    setData(data)
  }, [collections])
  
  const saveItem = React.useCallback(async (item: DataItem) => {
    const newData = { ...item, type: 'collection' }
    await db.put(newData)
  }, [db])

  return (
    <DataContext.Provider
      value={{
        data,
        loading,
        saveItem
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

const useDataContext = () => {
  const context = React.useContext(DataContext)
  if (context === undefined) {
    throw new Error(
      "useDataContext must be used within a DataProvider"
    )
  }
  return context
}

export { DataProvider, useDataContext }
