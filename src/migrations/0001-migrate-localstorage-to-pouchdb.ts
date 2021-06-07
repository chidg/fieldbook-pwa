import { v4 } from "uuid"

type LocalDataItem = {
  id: string
  number: string
  notes: string
  fieldName: string
  location?: GeolocationCoordinates
  timestamp: number
}

type PouchDBDataItem = {
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

type LocalDataCollection = { [id: string]: LocalDataItem }

type LocalUserDetails = {
  initials?: string
  name?: string
  email?: string
}

type PouchDBUserItem = {
  initials?: string
  name?: string
  email?: string
  _id: string
  type: "user"
}

export const migration_0001 = async (db: PouchDB.Database) => {
  const dataLocal = window.localStorage.getItem("data")
  const dataLocalStoredValue: LocalDataCollection | false = dataLocal
    ? JSON.parse(dataLocal)
    : false

  const userLocal = window.localStorage.getItem("user")
  const userLocalStoredValue: LocalUserDetails | false = userLocal
    ? JSON.parse(userLocal)
    : false

  const docs: Array<PouchDBDataItem | PouchDBUserItem> = []

  if (dataLocalStoredValue) {
    const collectionDocs = Object.keys(dataLocalStoredValue).map((key) => {
      const localCollectionItem = dataLocalStoredValue[key]
      const pouchItem: PouchDBDataItem = {
        _id: localCollectionItem.number.toString(),
        uuid: localCollectionItem.id,
        number: localCollectionItem.number,
        notes: localCollectionItem.notes,
        fieldName: localCollectionItem.fieldName,
        location: localCollectionItem.location,
        timestamp: localCollectionItem.timestamp,
        type: "collection",
      }
      return pouchItem
    })
    docs.concat(collectionDocs)
  }

  if (userLocalStoredValue && userLocalStoredValue.email) {
    const pouchUser: PouchDBUserItem = {
      ...userLocalStoredValue,
      type: "user",
      _id: v4(),
    }
    docs.push(pouchUser)
  }

  const migrations = db.bulkDocs(docs)

  return migrations
}
