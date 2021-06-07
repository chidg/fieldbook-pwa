import React from "react"
import useDeepCompareEffect from "use-deep-compare-effect"
import { usePouch, useAllDocs } from "use-pouchdb"

import { migration_0001 } from "../migrations/0001-migrate-localstorage-to-pouchdb"

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

interface UserDetails {
  _id: string
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

type ExistingUserDoc = PouchDB.Core.ExistingDocument<UserDetails>
type ExistingMigration = PouchDB.Core.ExistingDocument<MigrationDBRecord>

type DBItem = CollectionItem | UserDetails | ExistingMigration

type CollectionsDBResponse = PouchDB.Core.AllDocsResponse<DBItem> & {
  state: string
}

export type CollectionDoc = PouchDB.Core.ExistingDocument<CollectionItem>

type CollectionData = { [id: string]: CollectionDoc }
type MigrationsData = { [id: string]: ExistingMigration }

interface DataState {
  collections: CollectionData
  user: ExistingUserDoc | undefined
  // migrations: MigrationsData
  loading: boolean
  saveCollection: (arg0: CollectionItem) => void
}

const DataBaseContext = React.createContext<DataState | undefined>(undefined)

const DataBaseProvider: React.FC = ({ children }) => {
  const db = usePouch() // get the database

  const [loading, setLoading] = React.useState<boolean>(true)
  const [collections, setCollections] = React.useState<CollectionData>({})
  const [user, setUser] = React.useState<ExistingUserDoc | undefined>(undefined)
  const [migrations, setMigrations] = React.useState<MigrationsData| undefined>(undefined)
  const { rows, state }: CollectionsDBResponse = useAllDocs({
    attachments: true,
    include_docs: true,
  })

  useDeepCompareEffect(() => {
    if (state !== 'done') return 

    console.log('got rows', rows)
    const collections: CollectionData = {}
    const migrations: MigrationsData = {}
    rows.forEach((row) => {
      switch (row.doc?.type) {
        case "collection":
          collections[row.id] = row.doc!
          return null
        case "user":
          setUser(row.doc!)
          return null
        case "migration":
          migrations[row.id] = row.doc!
          return null
      }
    })
    setCollections(collections)
    setMigrations(migrations)
    console.log("setting migrations")
    setLoading(false)
  }, [rows, state, setUser, setCollections, setLoading])

  const saveCollection = React.useCallback(
    async (item: CollectionItem) => {
      const newData = { ...item, type: "collection" }
      await db.put(newData)
    },
    [db]
  )

  React.useEffect(() => {
    if (migrations === undefined) return 

    const migrationFiles: Array<
      (
        db: PouchDB.Database<{}>
      ) => Promise<(PouchDB.Core.Response | PouchDB.Core.Error)[]>
    > = [migration_0001]

    const startup = async () => {
      setLoading(true)

      const migrationPromises: Array<any> = []
      migrationFiles.forEach((migration, index) => {
        if (!migrations[index]?.applied) {
          console.log(`Applying migration ${index}`)
          migration(db as PouchDB.Database<MigrationDBRecord>)
            .then((result) => {
              const record: MigrationDBRecord = {
                _id: index.toString(),
                type: "migration",
                applied: true,
              }
              migrationPromises.push(db.put(record))
            })
            .catch((error) => {
              console.error(`Failed migration ${index}`)
              console.error(error)
            })
        }
      })
      if (migrationPromises.length === 0) console.log("No migrations to apply")
      Promise.all(migrationPromises)
        .then((result) => {
          console.log("Migrations successful")
          console.log(result)
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }

    console.log("Migrations starting")
    console.log(migrations)
    startup()
  }, [db, setLoading, migrations])

  return (
    <DataBaseContext.Provider
      value={{
        collections,
        user,
        // migrations,
        saveCollection,
        loading,
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

DataBaseProvider.whyDidYouRender = true

export { DataBaseProvider, useDataBaseContext }
