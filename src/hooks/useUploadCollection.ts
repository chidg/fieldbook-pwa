import { useCallback, useMemo } from "react"
import { useUpsert } from "react-supabase"
import { useUserContext } from "../contexts"
import { DataItem } from "../contexts"

const useUploadCollection = () => {
  const upsert = useUpsert<DataItem[]>("collections")[1]
  const { user } = useUserContext()

  const user_id = useMemo(() => user?.id, [user])

  const fn = useCallback(
    (collections: DataItem[]) => {
      const uploadable = collections.map(({ synchronisedAt, ...rest }) => ({
        ...rest,
        user_id,
      }))
      return upsert(uploadable, { returning: "representation" })
    },

    [upsert, user_id]
  )
  return fn
}

useUploadCollection.whyDidYouRender = true
export { useUploadCollection }
