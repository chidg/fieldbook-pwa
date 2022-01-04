import React from "react"
import { v4 } from "uuid"
import { useHistory } from "react-router-dom"
import { useDataContext, useUserContext } from "../../contexts"
import { useGoogleAnalytics, useGeoLocation } from "../../hooks"
import { ItemForm } from "./item-form"

const ItemFormCreate = () => {
  const history = useHistory()
  const { collectionPrefix } = useUserContext().settings!
  const { saveItem, data } = useDataContext()
  const { sendEvent } = useGoogleAnalytics()
  const [geoLocation, geoLocationWarning] = useGeoLocation()

  const getLocationDisplay = React.useMemo(() => {
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
      fieldName: "",
      notes: "",
      number: number.toString().padStart(3, "0"),
    }
  }, [data])

  const onSubmit = React.useCallback(
    async (values) => {
      await saveItem({
        ...values,
        id: v4(),
        prefix: collectionPrefix,
        timestamp: new Date().toISOString(),
        location: geoLocation || null,
      })
      sendEvent({
        category: "Collection",
        action: "Created collection",
      })
      history.replace("/")
    },
    [collectionPrefix, history, geoLocation, saveItem, sendEvent]
  )

  return (
    <ItemForm
      locationDisplay={getLocationDisplay}
      locationAccuracy={geoLocation?.accuracy}
      initialValues={initialValues()}
      onSubmit={onSubmit}
      title="New Item"
    />
  )
}

ItemFormCreate.whyDidYouRender = true
export { ItemFormCreate }
