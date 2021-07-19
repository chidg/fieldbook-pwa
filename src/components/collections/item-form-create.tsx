import React from 'react'
import { v4 } from 'uuid'
import { useHistory } from "react-router-dom"
import {
  useDataContext,
} from "../../contexts"
import { useGoogleAnalytics } from '../../hooks'
import ItemForm from './item-form'


export const ItemFormCreate: React.FC = () => {
  const history = useHistory()
  const { saveItem, taxa } = useDataContext()
  const { sendEvent } = useGoogleAnalytics()

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

  console.log('Object.keys(taxa).length > 0', Object.keys(taxa).length > 0)

  return (
    <ItemForm
      locationDisplay={getLocationDisplay()}
      initialValues={{
        density: '0',
        notes: '',
        taxon: Object.keys(taxa).length > 0 ? Object.keys(taxa)[0] : ''
      }}
      onSubmit={(values) => {
        saveItem({ ...values, density: parseInt(values.density), id: v4(), timestamp: Date.now(), location: geoLocation })
        sendEvent({
          category: 'Observation',
          action: 'Created weed observation'
        })
        history.replace('/')
      }}
      title="New Observation"
      />
)}