import React from 'react'
import { v4 } from 'uuid'
import { useHistory } from "react-router-dom"
import {
  useDataContext,
} from "../../contexts"
import ItemForm from './item-form'


export const ItemFormCreate: React.FC = () => {
  const history = useHistory()
  const { saveItem, data } = useDataContext()
  const [geoLocation, setGeoLocation] = React.useState<GeolocationCoordinates | undefined>(undefined)
  const [geoLocationWarning, setGeoLocationWarning] = React.useState<number | undefined>(undefined)

  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(({ coords }) => {
        // Necessary to do this transformation because the coords object is a prototype with getters rather than a normal object
        setGeoLocation({
          accuracy: coords.accuracy,
          altitude: coords.altitude,
          altitudeAccuracy: coords.altitudeAccuracy,
          heading: coords.heading,
          latitude: coords.latitude,
          longitude: coords.longitude,
          speed: coords.speed
        })
      }, (err) => {
        setGeoLocationWarning(err.code)
      }, { enableHighAccuracy: true });
    }
  }, [setGeoLocation])

  const getLocationDisplay = React.useCallback(() => {
    if (geoLocation) {
      return `${geoLocation.latitude.toPrecision(6)}, ${geoLocation.longitude.toPrecision(7)}`
    } else if (geoLocationWarning) {
      switch (geoLocationWarning) {
        case 1:
          return "Permission denied. Please check your permissions to use the location functionality."
        default:
          return "Unable to get location"
      }
    }
    return "Accessing location..."
  }, [geoLocation, geoLocationWarning])

  const initialValues = React.useCallback(() => {
    // calculate the initial collection number
    let number = 1
    const itemIds = Object.keys(data)
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
      locationDisplay={getLocationDisplay()}
      initialValues={initialValues()}
      onSubmit={(values) => {
        console.log('saving lo', geoLocation)
        saveItem({ ...values, id: v4(), timestamp: Date.now(), location: geoLocation })
        history.replace('/')
      }}
      title="New Item"
      />
)}