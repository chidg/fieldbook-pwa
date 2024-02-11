import React, { ReactNode, useEffect } from "react"
import { useLocalStorage } from "@uidotdev/usehooks"
import config from "@/config.json"

export interface Taxon {
  id: string
  name: string
}

type Taxa = Record<string, Taxon>

export const taxaOptions: Taxa = Object.fromEntries(
  config.taxa.map((t, i) => [i.toString(), { name: t, id: i.toString() }])
)

export interface DataItem {
  id: string
  taxon: string
  otherTaxon?: string
  idConfidence: number
  notes: string
  density: (typeof config.densities)[number]
  size: (typeof config.sizes)[number]
  location?: GeolocationCoordinates
  timestamp: number
}

type Data = Record<string, DataItem>

interface DataState {
  data: Data
  setData: (arg0: Data) => void
  hasNewData: boolean
  setHasNewData: (arg0: boolean) => void
  saveItem: (arg0: DataItem) => void
  saveTaxon: (arg0: Taxon) => void
  deleteItem: (id: string) => void
}

const DataContext = React.createContext<DataState | undefined>(undefined)

const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useLocalStorage<Data>("data", {})
  const [customTaxa, setCustomTaxa] = useLocalStorage<Taxa>("taxa", {})
  const [hasNewData, setHasNewData] = React.useState<boolean>(false)
  const initialisedRef = React.useRef<boolean>(false)

  useEffect(() => {
    if (initialisedRef.current) return
    // migration to remove custom taxa entirely
    const newTaxa = Object.fromEntries(
      Object.entries(customTaxa).filter(([id]) => !(id in taxaOptions))
    )

    Object.values(data).forEach((item) => {
      if (item.taxon in Object.keys(newTaxa)) {
        item.otherTaxon = newTaxa[item.taxon].name
        item.taxon = (config.taxa.length - 1).toString()
      }
    })

    initialisedRef.current = true
  }, [data, setData, customTaxa, setCustomTaxa])

  const saveItem = React.useCallback(
    (item: DataItem) => {
      setHasNewData(true)
      setData((existing) => ({ ...existing, [item.id]: item }))
    },
    [data, setData]
  )

  const saveTaxon = React.useCallback(
    (taxon: Taxon) => {
      setCustomTaxa((existing) => ({
        ...existing,
        [taxon.id]: taxon,
      }))
    },
    [setCustomTaxa]
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
