import React from "react"

import { DataItem, useDataContext } from "@/contexts"
import Map, { LayerProps, Marker, ViewState } from "react-map-gl"
import config from "@/config.json"
import { useNavigate, Link, useParams } from "react-router-dom"
import { useTaxonName } from "@/hooks/useTaxonName"
import "mapbox-gl/dist/mapbox-gl.css"
import { Popup, useShowPopup } from "../popup"
import { LeafIcon } from "lucide-react"

type MapDetails = {
  viewport: Partial<ViewState>
}

export const ItemDetail = () => {
  const nav = useNavigate()
  const [showPopup, setShowPopup] = useShowPopup()

  const { data } = useDataContext()
  const { id: instanceId } = useParams()
  const [instance, setInstance] = React.useState<DataItem>()

  const [mapDetails, setMapDetails] = React.useState<MapDetails | undefined>(
    undefined
  )

  React.useEffect(() => {
    if (instanceId === undefined) return
    const item = data[instanceId]
    if (item) {
      setInstance(item)
    } else {
      nav("/")
    }
  }, [setInstance, data, instanceId, history])

  React.useEffect(() => {
    if (instance?.location && Object.keys(instance?.location).length > 0) {
      const { latitude, longitude } = instance.location
      setMapDetails({
        viewport: {
          latitude,
          longitude,
          zoom: 12,
        },
      })
    }
  }, [instance, setMapDetails])

  const taxonName = useTaxonName(instance)

  if (!instance) return null

  return (
    <div className="text-white px-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg flex-1">{taxonName}</h3>
        <Link
          to={{
            pathname: `/data/${instance?.id}/edit`,
          }}
        >
          <button
            type="button"
            className="hover:bg-gray-200 hover:text-blue-500 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
        </Link>
      </div>
      <div className="w-fit">
        <button
          type="button"
          onClick={() => nav(-1)}
          className="inline-flex items-center text-white text-sm px-1 rounded border-white border"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="4 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15 19l-7-7 7-7"
            />
          </svg>{" "}
          <span>Back</span>
        </button>
      </div>
      <hr />

      <div className="flex-col bg-gray-200 bg-opacity-20 rounded p-2">
        {instance && (
          <div className="grid grid-cols-3 text-sm">
            <div>Recorded at:</div>
            <div className="col-span-2 justify-end">
              {new Date(instance.timestamp).toLocaleString()}
            </div>
            {instance.density && (
              <>
                <div>Density:</div>
                <div className="col-span-2 justify-end">
                  {config.densities[instance.density]}
                </div>
              </>
            )}
            {instance.size && (
              <>
                <div>Size:</div>
                <div className="col-span-2 justify-end">
                  {config.sizes[instance.size]}
                </div>
              </>
            )}
            <>
              <div>Controlled:</div>
              <div className="col-span-2 justify-end">
                {instance.controlled ? "Yes" : "No"}
              </div>
            </>
            {instance.idConfidence !== undefined && (
              <>
                <div>ID Confidence:</div>
                <div className="col-span-2 justify-end">
                  {config.idConfidenceLevels[instance.idConfidence]}
                </div>
              </>
            )}
            {instance.notes && (
              <>
                <div>Notes:</div>
                <div className="col-span-2 justify-end">{instance.notes}</div>
              </>
            )}
          </div>
        )}

        {mapDetails && (
          <div style={{ height: "400px" }}>
            <Map
              reuseMaps
              mapboxAccessToken={import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN}
              initialViewState={mapDetails.viewport}
              style={{ width: "100%", height: "100%" }}
              mapStyle="mapbox://styles/mapbox/satellite-v9"
            >
              <Marker
                key={instance.id}
                latitude={instance.location!.latitude}
                longitude={instance.location!.longitude}
                onClick={(e) => {
                  e.originalEvent.stopPropagation()
                  setShowPopup(instance)
                }}
              >
                <div className="rounded-full bg-white cursor-pointer bg-opacity-60 p-1">
                  <LeafIcon className="h-5 w-5 text-purple-500" />
                </div>
              </Marker>
              <Popup setShowPopup={setShowPopup} showPopup={showPopup} />
            </Map>
          </div>
        )}
      </div>
    </div>
  )
}
