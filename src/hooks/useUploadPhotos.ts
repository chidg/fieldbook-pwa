import { useCallback, useMemo } from "react"
import { useClient } from "react-supabase"
import { useUserContext } from "../contexts"
import { DataItem } from "../contexts"

export const useUploadPhotos = (photos: File[]) => {
  const client = useClient()
  const { user } = useUserContext()

  const file = photos[0]
  const fileExt = file.name.split(".").pop()
  const fileName = `${Math.random()}.${fileExt}`

  return client.storage
    .from("fieldbook-photos")
    .upload(`${user}/${fileName}`, photos[0], {
      cacheControl: "3600",
      upsert: false,
    })
}
