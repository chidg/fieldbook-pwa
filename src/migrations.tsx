import PouchDB from "pouchdb-browser"
import { migration_0001 } from "./migrations/0001-migrate-localstorage-to-pouchdb"

type MigrationRecord = {
  type: string
  applied: boolean
}

type MigrationDBRecord = PouchDB.Core.Document<MigrationRecord>

const db = new PouchDB<MigrationDBRecord>("fieldbook")

export const runMigrations = async () => {
  const { rows } = await db.allDocs({
    include_docs: true,
  })
  const migrations = rows
    .filter((row) => row.doc?.type === "migration")
    .map((row) => row.doc)
  console.log("migrations in runmigrations", migrations)
  if (migrations === undefined) return

  const migrationFiles: Array<
    (
      db: PouchDB.Database<{}>
    ) => Promise<(PouchDB.Core.Response | PouchDB.Core.Error)[]>
  > = [migration_0001]

  const migrationPromises: Array<any> = []
  migrationFiles.forEach((migration, index) => {
    if (!migrations[index]?.applied) {
      console.log(`Applying migration ${index}`)
      migration(db)
        .then((result) => {
          const record = {
            _id: index.toString(),
            type: "migration",
            applied: true,
          }
          db.put(record)
          migrationPromises.push()
        })
        .catch((error) => {
          console.error(`Failed migration ${index}`)
          console.error(error)
        })
    }
  })
  if (migrationPromises.length === 0) console.log("No migrations to apply")
  return Promise.all(migrationPromises)
    .then((result) => {
      console.log("Migrations successful")
      console.log(result)
    })
    .catch((err) => {
      console.log(err)
    })
}