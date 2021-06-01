import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { CollectionDoc, useDataContext } from "../contexts"

export const useCollectionInstance = (): CollectionDoc | undefined => {
  const history = useHistory()

  const { data } = useDataContext()
  const { id: instanceId }: { id: string } = useParams()
  const [instance, setInstance] =
    React.useState<CollectionDoc | undefined>(undefined)

  React.useEffect(() => {
    const item = data[instanceId]
    if (item) {
      setInstance(item)
    } else {
      console.log("no item with id", instanceId)
      history.replace("/")
    }
  }, [setInstance, data, instanceId, history])

  return instance
}
