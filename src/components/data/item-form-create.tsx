"use client"
import React from "react"
import { v4 } from "uuid"
import { useDataContext } from "../../contexts"
import { useGoogleAnalytics } from "../../hooks"
import { useGeoLocation, useGeoLocationDisplay } from "../../hooks/location"
import { useRouter } from "next/navigation"
import ItemForm from "./item-form"
import { useLatestDataItem } from "@/hooks/useLatestDataItem"

export const ItemFormCreate: React.FC = () => {
  const { replace } = useRouter()
  const { saveItem } = useDataContext()
  const { sendEvent } = useGoogleAnalytics()
  const [geoLocation] = useGeoLocation()
  const locationDisplay = useGeoLocationDisplay()
  const latestItem = useLatestDataItem()

  return (
    <ItemForm
      locationDisplay={locationDisplay}
      locationAccuracy={geoLocation?.accuracy}
      initialValues={{
        density: "1",
        notes: "",
        taxon: latestItem?.taxon || "0",
      }}
      onSubmit={(values) => {
        saveItem({
          ...values,
          id: v4(),
          timestamp: Date.now(),
          location: geoLocation,
        })
        sendEvent({
          category: "Observation",
          action: "Created weed observation",
        })
        replace("/")
      }}
      title="New Observation"
    />
  )
}
