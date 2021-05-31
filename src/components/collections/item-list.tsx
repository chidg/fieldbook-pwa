import React from 'react'
import {
  DataItem,
  useDataContext,
  useUserContext
} from "../../contexts"
import { Link } from 'react-router-dom'

const DataListItem = (item: DataItem) => {
  const { initials } = useUserContext().user!

  return (
    <div className="flex justify-start items-center bg-gray-200 bg-opacity-20 text-white focus:text-blue-400 focus:bg-blue-100 rounded-sm px-2 py-2 my-1">
      <div className="font-sm px-2">{initials}{item.number}</div>
      <div className="flex-grow font-medium px-2">{item.fieldName}</div>
      <div className="font-normal tracking-wide">
        <Link
          to={{
            pathname: `/${item._id}/`,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>
    </div>
  )
}

export const DataList = () => {
  const { data } = useDataContext()
  const { name } = useUserContext().user!

  return (
    <>
      <Link
          to="/new"
        >
        <div className="fab bg-gradient-to-br from-purple-800 to-purple-500">🌱</div>
      </Link>
      
      {/* Search bar */}
      {/* <div className="flex items-center bg-gray-200 rounded-md mb-8">
        <div className="px-2">
          <svg className="fill-current text-gray-500 w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path className="heroicon-ui" d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
          </svg>
        </div>
        <input className="w-full rounded-md bg-gray-200 text-gray-700 leading-tight focus:outline-none py-2" id="search" type="text" placeholder="Search" />
      </div> */}
      {data.length === 0 && (
        <div className="grid row mx-10">
          <div className="border-2 border-white text-white rounded px-4 py-2">
            <p>Hi { name }, welcome to Fieldbook!</p>
            <p>Hit the 🌱 below to start adding collection records.</p>
          </div>
        </div>
      )}
      {data.map(collection => <DataListItem { ...collection } key={collection._id} />)}
    </>
  )
}