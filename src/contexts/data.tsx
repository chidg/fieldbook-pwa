import React from "react"
import { usePouch, useFind } from "use-pouchdb"
import { useMetaContext, useDataBaseContext } from '../contexts'
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
  const { collections, saveCollection } = useDataBaseContext()

  // const setDataLoading = React.useCallback((value: boolean) => setLoading('data', value), [setLoading])

  return (
    <DataContext.Provider
      value={{
        data: collections,
        saveItem: saveCollection,
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
