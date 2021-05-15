import React from 'react'
import { v4 } from 'uuid'
import { useHistory } from "react-router-dom"
import {
  useDataContext,
} from "../contexts"
import ItemForm from './item-form'


const ItemFormCreate: React.FC = () => {
  const history = useHistory()
  const { saveItem, data } = useDataContext()
  const [geoLocation, setGeoLocation] = React.useState<GeolocationPosition | undefined>(undefined)

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setGeoLocation, console.error, { enableHighAccuracy: true });
    }
  }, [setGeoLocation])

  const initialValues = React.useCallback(() => {
    // calculate the initial collection number
    const itemIds = Object.keys(data)
    let number = itemIds.length + 1
    if (itemIds.length) {
      const lastItem = data[itemIds[itemIds.length - 1]]
      const numbStrings = lastItem.number.match(/\d+$/)
      if (numbStrings) {
        number = parseInt(numbStrings[numbStrings.length - 1]) + 1
      }
    }
    
    return {
      fieldName: '',
      notes: '',
      number: number.toString().padStart(3, '0'),
    }
  }, [data])

  return (
    <ItemForm
      initialValues={initialValues()}
      onSubmit={(values) => {
        saveItem({ ...values, id: v4(), timestamp: Date.now(), location: geoLocation?.coords })
        history.replace('/')
      }}
      title="New Item"
      />
)}

export default ItemFormCreate