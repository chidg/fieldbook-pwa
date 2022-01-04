import { useMemo } from "react"
import { DataItem } from "../contexts"
import { useHistory } from "react-router-dom"
import { useCollections } from "../hooks/"

export const useCollectionById = (id: string): DataItem | undefined => {
  const data = useCollections()
  const history = useHistory()

  return useMemo(() => {
    const item = data[id]
    if (!item) history.replace("/")

    return item
  }, [data, id, history])
}
