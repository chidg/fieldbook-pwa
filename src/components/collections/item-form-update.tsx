import React from "react"
import { useHistory } from "react-router-dom"
import { useDataContext } from "../../contexts"
import ItemForm from "./item-form"
import { useCollectionInstance } from "../../hooks"

export const ItemFormUpdate: React.FC = () => {
  const history = useHistory()
  const { saveItem } = useDataContext()
  const instance = useCollectionInstance()

  const getLocationDisplay = React.useCallback(() => {
    if (instance?.location && Object.keys(instance?.location).length > 0) {
      return `${instance.location.latitude.toPrecision(
        6
      )}, ${instance.location.longitude.toPrecision(7)}`
    }
    return "No location recorded"
  }, [instance])

  const onSubmit = React.useCallback(
    (values) => {
      // transform array of new photos to PouchDB attachments shape
      const attachments = values.newPhotos.reduce(
        (result: PouchDB.Core.Attachments, photo: File) => {
          result[photo.name] = {
            content_type: photo.type,
            data: photo,
          }
          return result
        },
        {}
      )
      // Re-save only the existing photos that we're keeping
      values.existingPhotos.reduce(
        (result: PouchDB.Core.Attachments, photo: string) => {
          const existingPhoto = instance?._attachments![photo]
          if (existingPhoto) result[photo] = existingPhoto
          return result
        },
        attachments
      )

      saveItem({
        ...values,
        _id: instance?._id,
        timestamp: instance!.timestamp,
        location: instance!.location,
        _attachments: attachments,
        _rev: instance?._rev,
      })
      history.replace("/")
    },
    [history, instance, saveItem]
  )

  // const photos = instance && instance.photos && instance.photos.length > 0 ? instance.photos[0].name : ""

  return (
    <>
      {instance && (
        <ItemForm
          locationDisplay={getLocationDisplay()}
          initialValues={{
            newPhotos: [],
            existingPhotos: instance._attachments ? Object.keys(instance._attachments) : [],
            fieldName: instance.fieldName,
            number: instance.number,
            notes: instance.notes,
          }}
          photos={instance._attachments}
          onSubmit={onSubmit}
          title="Edit Item"
        />
      )}
    </>
  )
}
