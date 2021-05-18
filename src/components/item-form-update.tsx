import React from 'react'
import { useHistory, useParams } from "react-router-dom"
import {
  DataItem,
  useDataContext,
} from "../contexts"
import ItemForm from './item-form'


const ItemFormUpdate: React.FC = () => {
  const history = useHistory()
  const { saveItem, data } = useDataContext()
  const [instance, setInstance] = React.useState<DataItem | undefined>(undefined)
  const { id: instanceId }: { id: string } = useParams()

  React.useEffect(() => {
    const item = data[instanceId]
    if (item) {
      setInstance(item)
    } else {
      history.replace('/')
    }
  }, [setInstance, data, instanceId, history])

  const onSubmit = React.useCallback((values) => {
    saveItem({ ...values, id: instanceId, timestamp: instance!.timestamp, location: instance!.location })
    history.replace('/')
  }, [history, instance, instanceId, saveItem])

  return (
    <ItemForm
      initialValues={{ fieldName: instance?.fieldName || "", number: instance?.number || "", notes: instance?.notes || "" }}
      onSubmit={onSubmit}
      title="Edit Item"
    />
)}

export default ItemFormUpdate