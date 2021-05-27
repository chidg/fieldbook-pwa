import React from "react"
import { useFind } from 'use-pouchdb'

import { useMigration_0001 } from '../migrations/0001-migrate-localstorage-to-pouchdb'

type Migration = {
  id: number
  function: () => void
}

type MigrationDBRecord = Pick<Migration, 'function'> & {
  _id: number
  applied: boolean
  type: 'migration'
}

type MigrationDoc = PouchDB.Core.ExistingDocument<MigrationDBRecord>

const migrations: [() => void] = [
  useMigration_0001,
]

export const useMigrations = () => {
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
    if (!loading) {
      const migrationsById = (dbMigrations as Array<MigrationDoc>).reduce((result, dbMig) => {
        result[dbMig._id] = dbMig.applied
        return result
      }, {} as { [id: number]: boolean })
      
      try {
        migrations.forEach(async (migration, index) => {
          if (migrationsById[index] === false) {
            console.log(`Applying migration ${index}`)
            await migration()
          }
        })
      } catch (error) {
        console.error("Migrations failed")
        console.error(error)
      }
    }
  }, [loading, dbMigrations])


}