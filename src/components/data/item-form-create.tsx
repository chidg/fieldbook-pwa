import React from "react"
import { v4 } from "uuid"
import { useNavigate } from "react-router-dom"
import { useDataContext } from "@/contexts"
import { useGoogleAnalytics } from "@/hooks"
import { useGeoLocation, useGeoLocationDisplay } from "@/hooks/location"
import ItemForm from "./item-form"

export const ItemFormCreate: React.FC = () => {
  const navigate = useNavigate()
  const { saveItem, taxa } = useDataContext()
  const { sendEvent } = useGoogleAnalytics()
  const [geoLocation] = useGeoLocation()

  const locationDisplay = useGeoLocationDisplay()

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
          density: values.density,
          id: v4(),
          timestamp: Date.now(),
          location: geoLocation,
        })
        sendEvent({
          category: "Observation",
          action: "Created weed observation",
        })
        navigate("/")
      }}
      title="New Observation"
    />
  )
}
