import { useState } from "react"
import { useDataContext } from "@/contexts"
import Map, { Marker } from "react-map-gl"

import { useViewState } from "@/hooks/useViewState"
import "mapbox-gl/dist/mapbox-gl.css"
import { LeafIcon } from "lucide-react"
import { Popup, useShowPopup } from "../popup"

export const ItemListMap = () => {
  const { data } = useDataContext()

  const initialViewState = useViewState(
    Object.values(data)
      .filter((item) => Boolean(item.location))
      .map((item) => [item.location!.longitude, item.location!.latitude])
  )
  const [viewState, setViewState] = useState(initialViewState)
  const [showPopup, setShowPopup] = useShowPopup()

  return (
    <div className="h-screen">
      <Map
        reuseMaps
        mapboxAccessToken={import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        id="map"
        mapStyle="mapbox://styles/mapbox/satellite-v9"
      >
        {Object.values(data)
          .filter(({ location }) => location)
          .map((item) => (
            <Marker
              key={item.id}
              latitude={item.location!.latitude}
              longitude={item.location!.longitude}
              onClick={(e) => {
                e.originalEvent.stopPropagation()
                setShowPopup(item)
              }}
            >
              <div className="rounded-full bg-white cursor-pointer bg-opacity-60 p-1">
                <LeafIcon className="h-5 w-5 text-purple-500" />
              </div>
            </Marker>
          ))}
        <Popup showPopup={showPopup} setShowPopup={setShowPopup} />
      </Map>
    </div>
  )
}
