import { DataItem } from "@/contexts"
import { useMemo } from "react"
import { taxa } from "@/config.json"

export const useTaxonName = (dataItem?: DataItem) => {
  return useMemo(() => {
    if (!dataItem) return ""
    return dataItem.taxon === "other"
      ? dataItem.otherTaxon
      : taxa[dataItem.taxon]
  }, [dataItem?.taxon])
}
