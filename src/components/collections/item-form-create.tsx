import React from "react"
import { v4 } from "uuid"
import { useHistory } from "react-router-dom"
import { useDataContext } from "../../contexts"
import { useGoogleAnalytics, useGeoLocation } from "../../hooks"
import ItemForm from "./item-form"

export const ItemFormCreate: React.FC = () => {
  const history = useHistory()
  const { saveItem, taxa } = useDataContext()
  const { sendEvent } = useGoogleAnalytics()
  const [geoLocation, geoLocationWarning] = useGeoLocation()

  const getLocationDisplay = React.useCallback(() => {
    if (geoLocation) {
      return `${geoLocation.latitude.toPrecision(
        6
      )}, ${geoLocation.longitude.toPrecision(7)}`
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

  console.log("Object.keys(taxa).length > 0", Object.keys(taxa).length > 0)

  return (
    <ItemForm
      locationDisplay={getLocationDisplay()}
      locationAccuracy={geoLocation?.accuracy}
      initialValues={{
        density: "0",
        notes: "",
        taxon: Object.keys(taxa).length > 0 ? Object.keys(taxa)[0] : "",
      }}
      onSubmit={(values) => {
        saveItem({
          ...values,
          density: parseInt(values.density),
          id: v4(),
          timestamp: Date.now(),
          location: geoLocation,
        })
        sendEvent({
          category: "Observation",
          action: "Created weed observation",
        })
        history.replace("/")
      }}
      title="New Observation"
    />
  )
}
