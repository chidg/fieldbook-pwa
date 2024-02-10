import React from "react"
import { v4 } from "uuid"
import { useNavigate } from "react-router-dom"
import { useDataContext } from "@/contexts"
import { useGoogleAnalytics } from "@/hooks"
import { useGeoLocation, useGeoLocationDisplay } from "@/hooks/location"
import ItemForm, { ItemFormValues } from "./item-form"
import { useLatestDataItem } from "@/hooks/useLatestDataItem"

export const ItemFormCreate: React.FC = () => {
  const navigate = useNavigate()
  const { saveItem, taxa } = useDataContext()
  const { sendEvent } = useGoogleAnalytics()
  const [geoLocation] = useGeoLocation()
  const locationDisplay = useGeoLocationDisplay()
  const latest = useLatestDataItem()

  const onSubmit = React.useCallback(
    (values: ItemFormValues) => {
      saveItem({
        ...values,
        idConfidence: parseInt(values.idConfidence),
        id: v4(),
        timestamp: Date.now(),
        location: geoLocation,
      })
      sendEvent({
        category: "Observation",
        action: "Created weed observation",
      })
      navigate("/")
    },
    [geoLocation, navigate, saveItem, sendEvent]
  )

  return (
    <ItemForm
      locationDisplay={locationDisplay}
      locationAccuracy={geoLocation?.accuracy}
      initialValues={{
        density: "0",
        notes: "",
        idConfidence: "2",
        taxon: latest
          ? latest.taxon
          : Object.keys(taxa).length > 0
          ? Object.keys(taxa)[0]
          : "",
      }}
      onSubmit={onSubmit}
      title="New Observation"
    />
  )
}
