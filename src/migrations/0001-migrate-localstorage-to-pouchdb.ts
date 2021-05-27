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

  if (dataLocalStoredValue)
    Object.keys(dataLocalStoredValue).forEach(async (key) => {
      const localCollectionItem = dataLocalStoredValue[key]
      const pouchItem: PouchDBDataItem = {
        _id: localCollectionItem.id,
        number: localCollectionItem.number,
        notes: localCollectionItem.notes,
        fieldName: localCollectionItem.fieldName,
        location: localCollectionItem.location,
        timestamp: localCollectionItem.timestamp,
        type: "collection",
      }
      await db.put(pouchItem)
    })

  if (userLocalStoredValue && userLocalStoredValue.email) {
    const pouchUser = {
      ...userLocalStoredValue,
      type: "user",
      _id: v4(),
    }
    await db.put(pouchUser)
  }
}
