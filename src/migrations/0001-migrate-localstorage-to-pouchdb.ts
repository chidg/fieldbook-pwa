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

export const migration_0001 = async (db: PouchDB.Database) => {
  const dataLocal = window.localStorage.getItem("data")
  const dataLocalStoredValue: LocalDataCollection | false = dataLocal
    ? JSON.parse(dataLocal)
    : false

  const userLocal = window.localStorage.getItem("user")
  const userLocalStoredValue: LocalUserDetails | false = userLocal
    ? JSON.parse(userLocal)
    : false

  const migrations: Array<Promise<PouchDB.Core.Response>> = []
  if (dataLocalStoredValue) {
    console.log("dataLocalStoredValue:", dataLocalStoredValue)
    Object.keys(dataLocalStoredValue).forEach(async (key) => {
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
      migrations.push(db.put(pouchItem).catch((error) => new Promise(error)))
    })
  }

  if (userLocalStoredValue && userLocalStoredValue.email) {
    const pouchUser = {
      ...userLocalStoredValue,
      type: "user",
      _id: v4(),
    }
    migrations.push(db.put(pouchUser).catch((error) => new Promise(error)))
  }
  return Promise.all(migrations)
}
