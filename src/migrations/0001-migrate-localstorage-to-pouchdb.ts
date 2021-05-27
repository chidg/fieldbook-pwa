import { v4 } from "uuid"
import { usePouch } from "use-pouchdb"
import { useLocalStorage } from "../../hooks"

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

export const useMigration_0001 = async () => {
  const dataLocalStoredValue: LocalDataCollection = useLocalStorage(
    "data",
    {}
  )[0]

  const userLocalStoredValue: LocalUserDetails = useLocalStorage("user", {})[0]

  const db = usePouch()

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

  if (userLocalStoredValue.email) {
    const pouchUser = {
      ...userLocalStoredValue,
      type: "user",
      _id: v4(),
    }
    await db.put(pouchUser)
  }
}
