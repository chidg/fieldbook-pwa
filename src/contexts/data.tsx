import React from "react"
import { useLocalStorage } from "../hooks"

export interface DataItem {
  id: string
  number: string
  prefix?: string
  notes: string
  fieldName: string
  location?: GeolocationCoordinates
  timestamp: number
}

interface Data {
  [id: string]: DataItem
}

interface DataState {
  data: Data
  setData: (arg0: Data) => void
  saveItem: (arg0: DataItem) => void
  deleteItem: (id: string) => void
}

const DataContext = React.createContext<DataState | undefined>(undefined)

const DataProvider: React.FC = ({ children }) => {
  const [localStoredValue, setLocalStoredValue] = useLocalStorage("data", {})
  const [data, setData] = React.useState<Data>({})

  React.useEffect(() => {
    setData(localStoredValue)
  }, [setData, localStoredValue])

  const saveItem = React.useCallback(
    async (item: DataItem) => {
      const newData = { ...data, [item.id]: item }
      setLocalStoredValue(newData)
      // Results in update to `data` due to effect above
    },
    [data, setLocalStoredValue]
  )

  const deleteItem = React.useCallback(
    async (id: string) => {
      const { [id]: deleted, ...newData } = data
      setLocalStoredValue(newData)
    },
    [data, setLocalStoredValue]
  )

  return (
    <DataContext.Provider
      value={{
        data,
        setData: setLocalStoredValue,
        saveItem,
        deleteItem
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

const useDataContext = () => {
  const context = React.useContext(DataContext)
  if (context === undefined) {
    throw new Error("useDataContext must be used within a DataProvider")
  }
  return context
}

export { DataProvider, useDataContext }
