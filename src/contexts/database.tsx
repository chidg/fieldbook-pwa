import React from "react"
import useDeepCompareEffect from "use-deep-compare-effect"
import { usePouch, useAllDocs } from "use-pouchdb"
import { areEqual } from "@essentials/are-equal"

import { useMetaContext } from "./meta"

export interface CollectionItem {
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

export interface UserDetails {
  initials?: string
  name?: string
  email?: string
  type: "user"
}

type MigrationDBRecord = {
  _id: string
  applied: boolean
  type: "migration"
}

export type UserDoc = PouchDB.Core.Document<UserDetails>
export type ExistingUserDoc = PouchDB.Core.ExistingDocument<UserDetails>
export type UserState = UserDetails & { _id?: string, _rev?: string }

type ExistingMigration = PouchDB.Core.ExistingDocument<MigrationDBRecord>

type DBItem = CollectionItem | ExistingUserDoc | ExistingMigration

type CollectionsDBResponse = PouchDB.Core.AllDocsResponse<DBItem> & {
  state: string
}

export type CollectionDoc = PouchDB.Core.ExistingDocument<CollectionItem>

type CollectionData = { [id: string]: CollectionDoc }
type MigrationsData = { [id: string]: ExistingMigration }

interface DataState {
  collections: CollectionData
  user: UserState | undefined
  setUser: (arg0: UserState) => void
  saveCollection: (arg0: CollectionItem) => void
}

const DataBaseContext = React.createContext<DataState | undefined>(undefined)

const DataBaseProvider: React.FC = ({ children }) => {
  const db = usePouch() // get the database
  const { setLoading } = useMetaContext()

  const [collections, setCollections] = React.useState<CollectionData>({})
  const [user, setUser] = React.useState<UserState | undefined>(undefined)
  const [migrations, setMigrations] =
    React.useState<MigrationsData | undefined>(undefined)
  const { rows, state }: CollectionsDBResponse = useAllDocs({
    attachments: true,
    include_docs: true,
  })

  useDeepCompareEffect(() => {
    if (state !== "done") return
    setLoading(true)

    const collectionsRows: CollectionData = {}
    const migrationsRows: MigrationsData = {}
    rows.forEach((row) => {
      switch (row.doc?.type) {
        case "collection":
          collectionsRows[row.id] = row.doc!
          return null
        case "user":
          if (!user || !areEqual(user, row.doc!)) {
            setUser(row.doc!)
          }
          return null
        case "migration":
          migrationsRows[row.id] = row.doc!
          return null
      }
    })
    if (!areEqual(collections, collectionsRows)) setCollections(collectionsRows)
    if (!migrations || !areEqual(migrations, migrationsRows))
      setMigrations(migrationsRows)
    setLoading(false)
  }, [rows, state, setUser, setCollections, setLoading])

  const saveCollection = React.useCallback(
    async (item: CollectionItem) => {
      const newData = { ...item, type: "collection" }
      await db.put(newData)
    },
    [db]
  )

  return (
    <DataBaseContext.Provider
      value={{
        collections,
        user,
        setUser,
        saveCollection,
      }}
    >
      {children}
    </DataBaseContext.Provider>
  )
}

const useDataBaseContext = () => {
  const context = React.useContext(DataBaseContext)
  if (context === undefined) {
    throw new Error("useDataBaseContext must be used within a DataBaseProvider")
  }
  return context
}

// DataBaseProvider.whyDidYouRender = true

export { DataBaseProvider, useDataBaseContext }
