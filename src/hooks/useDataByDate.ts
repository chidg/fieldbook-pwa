"use client"
import { DataItem, useDataContext } from "@/contexts"
import { useMemo } from "react"

type DateBinnedCollections = { [date: string]: DataItem[] }

export const useDataByDate = (reverse = false) => {
  const { data } = useDataContext()

  return useMemo(() => {
    if (!data) return {}
    const records = Object.values(data)
    if (reverse) records.reverse()
    return records.reduce((result, dataItem) => {
      const dateString = new Date(dataItem.timestamp).toLocaleDateString()
      if (!result[dateString]) result[dateString] = []
      result[dateString].push(dataItem)
      return result
    }, {} as DateBinnedCollections)
  }, [data, reverse])
}
