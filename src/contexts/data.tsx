import React from "react"
import { useDataBaseContext } from '../contexts'
export interface DataItem {
  _id: string
  uuid: string
  number: string
  notes: string
  fieldName: string
  location?: GeolocationCoordinates
  timestamp: number
  type: "collection"
}


export type FullAttachments = {
    [attachmentId: string]: PouchDB.Core.FullAttachment;
}

type AllDocsFullAttachmentsMeta = PouchDB.Core.AllDocsMeta & {
  _attachments?: FullAttachments
}

export type PutCollectionDoc = PouchDB.Core.PutDocument<DataItem>
export type ExistingCollectionDoc = PouchDB.Core.ExistingDocument<DataItem & AllDocsFullAttachmentsMeta>


type CollectionData = {[id: string]: ExistingCollectionDoc }
interface DataState {
  data: CollectionData
  saveItem: (arg0: PutCollectionDoc) => void
}

const DataContext = React.createContext<DataState | undefined>(undefined)

const DataProvider: React.FC = ({ children }) => {
  const { collections, saveCollection } = useDataBaseContext()

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
