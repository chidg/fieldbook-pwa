import React, { ReactNode, useEffect } from "react"
import { useLocalStorage } from "@uidotdev/usehooks"
import config from "@/config.json"

export interface Taxon {
  id: string
  name: string
}

type Taxa = Record<string, Taxon>

export const taxaOptions: Taxa = Object.fromEntries(
  Object.entries(config.taxa).map(([key, value]) => [
    key,
    { name: value, id: key },
  ])
)

export interface DataItem {
  id: string
  taxon: keyof typeof config.taxa
  otherTaxon?: string
  idConfidence: number
  notes: string
  density: keyof typeof config.densities
  size?: keyof typeof config.sizes
  location?: GeolocationCoordinates
  timestamp: number
}

export type Data = Record<string, DataItem>

interface DataState {
  data: Data
  setData: (arg0: Data) => void
  hasNewData: boolean
  setHasNewData: (arg0: boolean) => void
  saveItem: (arg0: DataItem) => void
  deleteItem: (id: string) => void
}

const DataContext = React.createContext<DataState | undefined>(undefined)

const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useLocalStorage<Data>("data", {})
  const [hasNewData, setHasNewData] = useLocalStorage<boolean>(
    "hasNewData",
    false
  )

  const saveItem = React.useCallback(
    (item: DataItem) => {
      setHasNewData(true)
      setData((existing) => ({ ...existing, [item.id]: item }))
    },
    [data, setData]
  )

  const deleteItem = React.useCallback(
    async (id: string) => {
      const { [id]: deleted, ...newData } = data
      setData(newData)
    },
    [data, setData]
  )

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        hasNewData,
        setHasNewData,
        saveItem,
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
