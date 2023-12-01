import { useDataContext } from "@/contexts"
import { useMemo } from "react"

export const useLatestDataItem = () => {
  const { data } = useDataContext()
  return useMemo(() => {
    if (!data) return null
    const records = Object.values(data)
    records.sort((a, b) => b.timestamp - a.timestamp)
    return records[0]
  }, [data])
}
