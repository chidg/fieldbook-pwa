import React from 'react'
import { useHistory, useParams, Link } from "react-router-dom"
import {
  DataItem,
  useDataContext,
  useUserContext
} from "../../contexts"
import ReactMapGL, { ViewportProps } from 'react-map-gl'

type ItemDetailProps = {
}


export const ItemDetail: React.FC<ItemDetailProps> = () => {
  const history = useHistory()
  
  const { user } = useUserContext()
  const { data } = useDataContext()
  const { id: instanceId }: { id: string } = useParams()
  const [instance, setInstance] = React.useState<DataItem | undefined>(undefined)

  const [viewport, setViewport] = React.useState<ViewportProps | undefined>(undefined);

  React.useEffect(() => {
    const item = data[instanceId]
    if (item) {
      setInstance(item)
    } else {
      history.replace('/')
    }
  }, [setInstance, data, instanceId, history])
  
  React.useEffect(() => {
    if (instance?.location && Object.keys(instance?.location).length > 0) {
      console.log("instance.location", instance.location)
      const { latitude, longitude } = instance.location
      setViewport({
        latitude,
        longitude,
        zoom: 8
      })
    }
  }, [instance])

  console.log(viewport)

  return (
    <div className="text-white rounded px-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg flex-1">{ user?.initials }{ instance?.number } {instance?.fieldName}</h3>
        <Link
          to={{
            pathname: `/${instance?.id}/edit`,
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
    
    <div className="flex-col bg-gray-200 bg-opacity-20 rounded px-2 pb-6 my-1">
      {instance && <div className="grid grid-cols-3 text-sm">
        <div>Recorded at:</div><div className="col-span-2 justify-end">{ new Date(instance.timestamp).toLocaleString() }</div>
        {instance.notes && 
          <><div>Notes:</div><div className="col-span-2 justify-end">{ instance.notes }</div></>
        }
      </div>}

      {viewport && 
        <div style={{ height: "400px" }}>
          <ReactMapGL
            {...viewport}
            width="100%"
            height="100%"
            mapStyle="mapbox://styles/mapbox/light-v9"
            onViewportChange={(viewport: ViewportProps) => setViewport(viewport)}
            />
        </div>
      }
    </div>
  </div>

)}