"use client"
import React, { ReactNode } from "react"
import { useLocalStorage } from "@uidotdev/usehooks"

export const densityOptions: Record<string, string> = {
  "0": "Absent",
  "1": "Light - isolated plants, individuals are scarce or scattered, small clumps may occur",
  "2": "Medium - many plants scattered across a large area, large clumps",
  "3": "Heavy - large dense infestation (less than 1 hectare)",
  "4": "Heavy - very large dense infestation (greater than 1 hectare)",
}

export interface Taxon {
  id: string
  name: string
}

type Taxa = Record<string, Taxon>

export interface DataItem {
  id: string
  taxon: string
  notes: string
  density: string
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
  const [taxa, setTaxa] = useLocalStorage<Taxa>("taxa", {})

  const saveItem = React.useCallback(
    async (item: DataItem) => {
      const newData = { ...data, [item.id]: item }
      setData(newData)
    },
    [data, setData]
  )

  const saveTaxon = React.useCallback(
    async (taxon: Taxon) => {
      const newTaxa = { ...taxa, [taxon.id]: taxon }
      setTaxa(newTaxa)
      // Results in update to `taxa` due to effect above
    },
    [taxa, setTaxa]
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
        taxa,
        setTaxa,
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
