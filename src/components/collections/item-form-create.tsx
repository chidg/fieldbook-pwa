import React from "react"
import { v4 } from "uuid"
import { useHistory } from "react-router-dom"
import { useDataContext } from "../../contexts"
import { useGoogleAnalytics } from "../../hooks"
import { useGeoLocation, useGeoLocationDisplay } from "../../hooks/location"
import ItemForm from "./item-form"

export const ItemFormCreate: React.FC = () => {
  const history = useHistory()
  const { saveItem, taxa } = useDataContext()
  const { sendEvent } = useGoogleAnalytics()
  const [geoLocation] = useGeoLocation()

  const locationDisplay = useGeoLocationDisplay()

  console.log("Object.keys(taxa).length > 0", Object.keys(taxa).length > 0)

  return (
    <ItemForm
      locationDisplay={locationDisplay}
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
