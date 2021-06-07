import React from "react"
import { usePouch } from "use-pouchdb"
import { useMetaContext } from '../contexts'
import { migration_0001 } from "../migrations/0001-migrate-localstorage-to-pouchdb"

type MigrationDBRecord = {
  _id: string
  applied: boolean
  type: "migration"
}

type MigrationDoc = PouchDB.Core.Document<MigrationDBRecord>

const migrations: Array<
  (db: PouchDB.Database<{}>) => Promise<(PouchDB.Core.Response | PouchDB.Core.Error)[][]>
> = [migration_0001]

export const useMigrations = () => {
  const { setLoading } = useMetaContext()
  const db: PouchDB.Database<MigrationDoc> = usePouch()
  
  const setMigrationsLoading = React.useCallback((value: boolean) => setLoading('migrations', value), [setLoading])
  // On application init, check the DB for applied migrations
  React.useEffect(() => {
    const startup = async () => {
      setMigrationsLoading(true)
      const index = await db.createIndex({
        index: {
          fields: ["type"],
        },
      })
      db.find({
        use_index: index.name,
        selector: { type: "migration" },
        fields: ["_id", "applied"],
      })
        .then((dbMigrations) =>
          dbMigrations.docs.reduce((result, dbMig) => {
            result[parseInt(dbMig._id)] = dbMig.applied
            return result
          }, {} as { [id: number]: boolean })
        )
        .then((migrationsById) => {
          const migrationPromises: Array<any> = []
          migrations.forEach((migration, index) => {
            if (!migrationsById[index]) {
              console.log(`Applying migration ${index}`)
              migration(db)
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
          return migrationPromises
        })
        .then((result) => {
          console.log("Migrations successful")
          console.log(result)
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          setMigrationsLoading(false)
        })
    }
    console.log('Migrations starting')
    startup()

  }, [db, setMigrationsLoading])
}
