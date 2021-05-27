import React from "react"
import { useFind, usePouch } from 'use-pouchdb'

import { migration_0001 } from '../migrations/0001-migrate-localstorage-to-pouchdb'

type MigrationDBRecord = {
  _id: string
  applied: boolean
  type: 'migration'
}

type MigrationDoc = PouchDB.Core.ExistingDocument<MigrationDBRecord>

const migrations: [(db: PouchDB.Database<{}>) => (void)] = [
  migration_0001,
]

export const useMigrations = () => {
  const db: PouchDB.Database<{}> = usePouch()
  // On application init, check the DB for outstanding migrations
  const { docs: dbMigrations, loading } = useFind({
    // Ensure that this index exist, create it if not. And use it.
    index: {
      fields: ['type', '_id'],
    },
    selector: {
      type: 'story',
    },
    sort: ['_id'],
    fields: ['_id', 'applied'],
  })

  React.useEffect(() => {
    console.log('loading migrations')
    console.log(loading)
    if (!loading) {
      const migrationsById = (dbMigrations as Array<MigrationDoc>).reduce((result, dbMig) => {
        result[parseInt(dbMig._id)] = dbMig.applied
        return result
      }, {} as { [id: number]: boolean })
      
      console.log('got migrations', migrationsById)

      try {
        migrations.forEach(async (migration, index) => {
          if (!migrationsById[index]) {
            console.log(`Applying migration ${index}`)
            await migration(db)
            const record: MigrationDBRecord = { _id: index.toString(), type: 'migration', applied: true }
            await db.put(record)
          }
        })
      } catch (error) {
        console.error("Migrations failed")
        console.error(error)
      }
    }
  })


}