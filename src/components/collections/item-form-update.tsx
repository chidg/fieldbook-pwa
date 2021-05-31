import React from 'react'
import { useHistory } from "react-router-dom"
import {
  useDataContext,
} from "../../contexts"
import ItemForm from './item-form'
import { useCollectionInstance } from '../../hooks'

export const ItemFormUpdate: React.FC = () => {
  const history = useHistory()
  const { saveItem } = useDataContext()
  const instance = useCollectionInstance()
  
  const getLocationDisplay = React.useCallback(() => {
    if (instance?.location && Object.keys(instance?.location).length > 0) {
      return `${instance.location.latitude.toPrecision(6)}, ${instance.location.longitude.toPrecision(7)}`
    }
    return "No location recorded"
  }, [instance])

  const onSubmit = React.useCallback((values) => {
    saveItem({ ...values, _id: instance?._id, timestamp: instance!.timestamp, location: instance!.location, _rev: instance?._rev })
    history.replace('/')
  }, [history, instance, saveItem])
  
  const photo = instance && instance.photos && instance.photos.length > 0 ? instance.photos[0].name : ""

  return (
    <ItemForm
      locationDisplay={getLocationDisplay()}
      initialValues={{ photo, fieldName: instance?.fieldName || "", number: instance?.number || "", notes: instance?.notes || "" }}
      onSubmit={onSubmit}
      title="Edit Item"
    />
)}
