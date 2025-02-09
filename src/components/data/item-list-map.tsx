import { useMemo, useState } from "react"
import config from "@/config.json"
import { DataItem, useDataContext } from "@/contexts"
import Map, { Source, LayerProps, Marker, Popup } from "react-map-gl"

import { useViewState } from "@/hooks/useViewState"
import "mapbox-gl/dist/mapbox-gl.css"
import { LeafIcon, MapPin } from "lucide-react"
import { taxaOptions } from "@/contexts/data"
import { useDensityOptions } from "@/hooks/useDensity"

const layerStyle: LayerProps = {
  id: "point",
  type: "circle",
  paint: {
    "circle-radius": 8,
    "circle-stroke-color": "#7c3aed",
    "circle-color": "#9663ef",
    "circle-stroke-width": 1,
  },
}

export const ItemListMap = () => {
  const { data } = useDataContext()

  const initialViewState = useViewState(
    Object.values(data)
      .filter((item) => Boolean(item.location))
      .map((item) => [item.location!.longitude, item.location!.latitude])
  )
  const [viewState, setViewState] = useState(initialViewState)
  const [showPopup, setShowPopup] = useState<DataItem | null>(null)

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
        {showPopup && (
          <Popup
            onClose={() => setShowPopup(null)}
            latitude={showPopup.location!.latitude}
            longitude={showPopup.location!.longitude}
          >
            <div className="flex flex-col gap-1">
              <span className="text-primary">
                {taxaOptions[showPopup.taxon].name}
              </span>
              <span className="text-primary">
                {config.densities[parseInt(showPopup.density)]}
              </span>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  )
}
