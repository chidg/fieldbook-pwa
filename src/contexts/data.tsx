import React from "react"
import { useLocalStorage } from "../hooks"

export const densityOptions: Array<string> = [
  "Absent",
  "Light - isolated plants, individuals are scarce or scattered, small clumps may occur",
  "Medium - many plants scattered across a large area, large clumps",
  "Heavy - large dense infestation (less than 1 hectare)",
  "Heavy - very large dense infestation (greater than 1 hectare)",
]

export interface Taxon {
  id: string
  name: string
}

export interface Taxa {
  [id: string]: Taxon
}
export interface DataItem {
  id: string
  taxon: string
  notes: string
  density: number
  location?: GeolocationCoordinates
  timestamp: number
}

interface Data {
  [id: string]: DataItem
}

interface DataState {
  data: Data
  setData: (arg0: Data) => void
  taxa: Taxa
  setTaxa: (arg0: Taxa) => void
  saveItem: (arg0: DataItem) => void
  saveTaxon: (arg0: Taxon) => void
  deleteItem: (id: string) => void
}

const DataContext = React.createContext<DataState | undefined>(undefined)

const DataProvider: React.FC = ({ children }) => {
  const [localStoredDataValue, setLocalStoredDataValue] = useLocalStorage(
    "data",
    {}
  )
  const [localStoredTaxaValue, setLocalStoredTaxaValue] = useLocalStorage(
    "taxa",
    {}
  )
  const [data, setData] = React.useState<Data>({})
  const [taxa, setTaxa] = React.useState<Taxa>({})

  React.useEffect(() => {
    setData(localStoredDataValue)
  }, [localStoredDataValue])

  React.useEffect(() => {
    setTaxa(localStoredTaxaValue)
  }, [localStoredTaxaValue])

  const saveItem = React.useCallback(
    async (item: DataItem) => {
      const newData = { ...data, [item.id]: item }
      setLocalStoredDataValue(newData)
      // Results in update to `data` due to effect above
    },
    [data, setLocalStoredDataValue]
  )

  const saveTaxon = React.useCallback(
    async (taxon: Taxon) => {
      const newTaxa = { ...taxa, [taxon.id]: taxon }
      setLocalStoredTaxaValue(newTaxa)
      // Results in update to `taxa` due to effect above
    },
    [taxa, setLocalStoredTaxaValue]
  )

  const deleteItem = React.useCallback(
    async (id: string) => {
      const { [id]: deleted, ...newData } = data
      setLocalStoredDataValue(newData)
    },
    [data]
  )

  return (
    <DataContext.Provider
      value={{
        data,
        setData: setLocalStoredDataValue,
        taxa,
        setTaxa: setLocalStoredTaxaValue,
        saveItem,
        saveTaxon,
        deleteItem,
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
