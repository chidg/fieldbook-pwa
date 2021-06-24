import React from 'react'
import { v4 } from 'uuid'
import PouchDB from 'pouchdb-browser'
import { useHistory } from "react-router-dom"
import {
  useDataContext,
} from "../../contexts"
import { useGoogleAnalytics } from '../../hooks'
import ItemForm from './item-form'


export const ItemFormCreate: React.FC = () => {
  const history = useHistory()
  const { saveItem, data } = useDataContext()
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

  const initialValues = React.useCallback(() => {
    // calculate the initial collection number
    let number = 1
    const itemIds = Object.keys(data)
    const itemCount = itemIds.length
    
    if (itemCount) {
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
      newPhotos: []
    }
  }, [data])

  return (
    <ItemForm
      locationDisplay={getLocationDisplay()}
      initialValues={initialValues()}
      onSubmit={(values) => {

        // transform array of photos to PouchDB attachments shape
        const attachments = values.newPhotos.reduce((result: PouchDB.Core.Attachments, photo: File) => {
            result[photo.name] = {
              content_type: photo.type,
              data: photo
            }
            return result
        }, {})

        saveItem({ ...values, _id: values.number, uuid: v4(), timestamp: Date.now(), location: geoLocation, type: 'collection', _attachments: attachments })
        sendEvent({
          category: 'Collection',
          action: 'Created collection'
        })
        history.replace('/')
      }}
      title="New Item"
      />
)}