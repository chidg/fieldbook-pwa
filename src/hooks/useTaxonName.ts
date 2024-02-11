import { DataItem } from "@/contexts"
import { useMemo } from "react"
import { taxa } from "@/config.json"

export const useTaxonName = (dataItem?: DataItem) => {
  return useMemo(() => {
    if (!dataItem) return ""
    const taxonId = parseInt(dataItem.taxon)
    return taxonId === taxa.length - 1 ? dataItem.otherTaxon : taxa[taxonId]
  }, [dataItem?.taxon])
}
