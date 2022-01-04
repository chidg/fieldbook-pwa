import { useDataContext } from "../contexts/"

export const useCollections = () => {
  const { data } = useDataContext()

  return data
}
