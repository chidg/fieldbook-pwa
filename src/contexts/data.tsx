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
  taxa: Taxa
  setTaxa: (arg0: Taxa) => void
  saveItem: (arg0: DataItem) => void
  saveTaxon: (arg0: Taxon) => void
  deleteItem: (id: string) => void
}

const DataContext = React.createContext<DataState | undefined>(undefined)

const DataProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useLocalStorage<Data>("data", {})
  const [customTaxa, setCustomTaxa] = useLocalStorage<Taxa>("taxa", {})
  const initialisedRef = React.useRef<boolean>(false)

  useEffect(() => {
    // migration to remove standard taxa from the custom taxa
    if (initialisedRef.current) return
    // delete taxa that are now provided by the config
    const newTaxa = Object.fromEntries(
      Object.entries(customTaxa).filter(([id]) => !(id in taxaOptions))
    )
    setCustomTaxa(newTaxa)
    initialisedRef.current = true
  }, [data, setData, customTaxa, setCustomTaxa])

  const saveItem = React.useCallback(
    (item: DataItem) => {
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

  const taxa = { ...taxaOptions, ...customTaxa }

  return (
    <DataContext.Provider
      value={{
        data,
        setData,
        taxa,
        setTaxa: setCustomTaxa,
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
