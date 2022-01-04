import { useMetaContext } from "../contexts"

export const useSyncingStatus = () => {
  const { syncing, setSyncing } = useMetaContext()

  return { syncing, setSyncing }
}
