import React from "react"
import { useHistory, useParams } from "react-router-dom"
import { DataItem, useDataContext } from "../../contexts"
import ItemForm from "./item-form"

export const ItemFormUpdate: React.FC = () => {
  const history = useHistory()
  const { saveItem, data, deleteItem, taxa } = useDataContext()
  const [confirmingDelete, setConfirmingDelete] = React.useState<boolean>(false)
  const { id: instanceId }: { id: string } = useParams()
  const [instance, setInstance] = React.useState<DataItem>(data[instanceId])

  console.log("Object.keys(taxa).length > 0", Object.keys(taxa).length > 0)

  React.useEffect(() => {
    const item = data[instanceId]
    if (item) {
      setInstance(item)
    } else {
      history.replace("/")
    }
  }, [setInstance, data, instanceId, history])

  const getLocationDisplay = React.useCallback(() => {
    if (instance.location && Object.keys(instance.location).length > 0) {
      return `${instance.location.latitude.toPrecision(
        6
      )}, ${instance.location.longitude.toPrecision(7)}`
    }
    return "No location recorded"
  }, [instance])

  const onSubmit = React.useCallback(
    (values) => {
      saveItem({
        ...values,
        id: instanceId,
        timestamp: instance!.timestamp,
        location: instance!.location,
      })
      history.replace("/")
    },
    [history, instance, instanceId, saveItem]
  )

  return (
    <ItemForm
      locationDisplay={getLocationDisplay()}
      initialValues={{
        density: instance.density.toString(),
        taxon: instance.taxon,
        notes: instance.notes || "",
      }}
      onSubmit={onSubmit}
      title="Edit Item"
    >
      <div className="flex-col bg-red-400 bg-opacity-20 rounded px-2 py-4 my-1">
        <div className="flex justify-center mt-2">
          <button
            type="button"
            className="border-2 border-red-600 rounded px-4 py-2"
            disabled={confirmingDelete}
            onClick={() => {
              setConfirmingDelete(true)
              setTimeout(() => {
                const confirm = window.confirm(
                  "This will permanently delete this record. Are you sure?"
                )
                if (confirm) deleteItem(instanceId)
                else {
                  setConfirmingDelete(false)
                }
              }, 500)
            }}
          >
            {!confirmingDelete && <span>Delete this record 🗑</span>}
            {confirmingDelete && <span>Confirming...</span>}
          </button>
        </div>
      </div>
    </ItemForm>
  )
}
