import React from 'react'
import { useHistory, Link } from "react-router-dom"
import ReactMapGL, { ViewportProps, Source, Layer, LayerProps } from 'react-map-gl'
import {
  useUserContext
} from "../../contexts"
import { useCollectionInstance } from '../../hooks'


const layerStyle: LayerProps = {
  id: 'point',
  type: 'circle',
  paint: {
    'circle-radius': 8,
    "circle-stroke-color": "#7c3aed",
    'circle-color': '#9663ef',
    'circle-stroke-width': 1
  }
}

type MapDetails = {
  viewport: ViewportProps,
  geoJson: GeoJSON.FeatureCollection<GeoJSON.Geometry>
}

export const ItemDetail: React.FC = () => {
  const instance = useCollectionInstance()
  const { user } = useUserContext()
  const history = useHistory()
  
  const [mapDetails, setMapDetails] = React.useState<MapDetails | undefined>(undefined)

  React.useEffect(() => {
    if (instance?.location && Object.keys(instance?.location).length > 0) {
      const { latitude, longitude } = instance.location
      setMapDetails({
        viewport: {
          latitude,
          longitude,
          zoom: 12
        },
        geoJson: {
          type: 'FeatureCollection',
          features: [
            {type: 'Feature', geometry: {type: 'Point', coordinates: [longitude, latitude]}, properties: {}}
          ]
        }
      })
    }
  }, [instance, setMapDetails])

  return (
    <div className="text-white rounded px-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg flex-1">{ user?.initials }{ instance?.number } {instance?.fieldName}</h3>
        <Link
          to={{
            pathname: `/${instance?._id}/edit`,
          }}
        >
          <button type="button" className="hover:bg-gray-200 hover:text-blue-500 text-white py-1 px-2 rounded focus:outline-none focus:shadow-outline">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
      </Link>
    </div>
    <hr />
    <div onClick={() => history.goBack()} className="flex pt-2 text-xs cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="4 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
      </svg> Back
    </div>
    
    <div className="flex-col bg-gray-200 bg-opacity-20 rounded px-2 pb-6 my-2">
      {instance && <div className="grid grid-cols-3 text-sm">
        <div>Recorded at:</div><div className="col-span-2 justify-end">{ new Date(instance.timestamp).toLocaleString() }</div>
        {instance.notes && 
          <><div>Notes:</div><div className="col-span-2 justify-end">{ instance.notes }</div></>
        }
      </div>}

      {mapDetails &&
        <div style={{ height: "400px" }}>
          <ReactMapGL
            { ...mapDetails.viewport }
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/mapbox/satellite-v9"
            onViewportChange={(viewport: ViewportProps) => setMapDetails({ ...mapDetails, viewport })}
            >
            <Source id="item-location" type="geojson" data={mapDetails.geoJson}>
              <Layer {...layerStyle} />
            </Source>
          </ReactMapGL>
        </div>
      }
    </div>
  </div>

)}