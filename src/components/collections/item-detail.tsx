import React from 'react'
import { useHistory, useParams, Link } from "react-router-dom"
import {
  DataItem,
  useDataContext,
  useUserContext
} from "../../contexts"

type ItemDetailProps = {
}


export const ItemDetail: React.FC<ItemDetailProps> = () => {
  const history = useHistory()
  
  const { user } = useUserContext()
  const { data } = useDataContext()
  const [instance, setInstance] = React.useState<DataItem | undefined>(undefined)
  const { id: instanceId }: { id: string } = useParams()

  React.useEffect(() => {
    const item = data[instanceId]
    if (item) {
      setInstance(item)
    } else {
      history.replace('/')
    }
  }, [setInstance, data, instanceId, history])
  
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
  </div>
)}