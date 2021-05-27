import React from 'react'
import { useHistory, useParams } from "react-router-dom"
import {
  DataItem,
  useDataContext,
} from "../../contexts"
import ItemForm from './item-form'


export const ItemFormUpdate: React.FC = () => {
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

  const getLocationDisplay = React.useCallback(() => {
    if (instance?.location && Object.keys(instance?.location).length > 0) {
      return `${instance.location.latitude.toPrecision(6)}, ${instance.location.longitude.toPrecision(7)}`
    }
    return "No location recorded"
  }, [instance])

  const onSubmit = React.useCallback((values) => {
    saveItem({ ...values, id: instanceId, timestamp: instance!.timestamp, location: instance!.location })
    history.replace('/')
  }, [history, instance, instanceId, saveItem])
  
  const photo = instance && instance.photos && instance.photos.length > 0 ? instance.photos[0].name : ""

  return (
    <ItemForm
      locationDisplay={getLocationDisplay()}
      initialValues={{ photo, fieldName: instance?.fieldName || "", number: instance?.number || "", notes: instance?.notes || "" }}
      onSubmit={onSubmit}
      title="Edit Item"
    />
)}
