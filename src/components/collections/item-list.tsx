import React from "react"
import Fuse from "fuse.js"
import { Link } from "react-router-dom"
import useDeepCompareEffect from "use-deep-compare-effect"

import { DataItem, useDataContext, useUserContext, useMetaContext } from "../../contexts"

const DataListItem = (item: DataItem) => {
  const { initials } = useUserContext().user!

  return (
    <div className="flex justify-start items-center bg-gray-200 bg-opacity-20 text-white focus:text-blue-400 focus:bg-blue-100 rounded-sm px-2 py-2 my-1">
      <div className="font-sm px-2">
        {item.prefix ? item.prefix : initials}
        {item.number}
      </div>
      <div className="flex-grow font-medium px-2">{item.fieldName}</div>
      <div className="font-normal tracking-wide">
        <Link
          to={{
            pathname: `/${item.id}/`,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </div>
  )
}

type DateBinnedCollections = { [date: string]: DataItem[] }

const getDataByDate = (data: DataItem[]): DateBinnedCollections =>
  data.reduce((result, dataItem) => {
    const dateString = new Date(dataItem.timestamp).toLocaleDateString()
    if (!result[dateString]) result[dateString] = []
    result[dateString].push(dataItem)
    return result
  }, {} as DateBinnedCollections)

export const DataList = () => {
  const { data } = useDataContext()
  const { name } = useUserContext().user!
  const { newestFirst, setNewestFirst } = useMetaContext()

  const [displayData, setDisplayData] = React.useState<DateBinnedCollections>(
    {}
  )
  const [searchQuery, setSearchQuery] = React.useState<string>("")
  const [fuse, setFuse] = React.useState<Fuse<DataItem> | undefined>(undefined)

  useDeepCompareEffect(() => {
    let localfuse = fuse
    if (fuse === undefined) {
      localfuse = new Fuse(Object.values(data), {
        keys: ["fieldName", "notes"],
      })
      setFuse(localfuse)
    }
  }, [data, fuse, setFuse])

  // useEffect for Search and initialisation of display data
  useDeepCompareEffect(() => {
    let collections: DataItem[] = []
    let binByDate = false
    if (searchQuery.trim().length === 0) {
      collections = Object.values(data)
      binByDate = true
      if (!newestFirst) collections = collections.reverse()
    } else {
      const results = fuse?.search(searchQuery)
      if (results) collections = results.map((result) => result.item)
    }

    const result = binByDate
      ? getDataByDate(collections)
      : { Results: collections }

    setDisplayData(result)
  }, [searchQuery, fuse, data, newestFirst])

  const dataItemsCount = Object.keys(data).length
  const dataItemsExist = React.useMemo(
    () => dataItemsCount > 0,
    [dataItemsCount]
  )

  return (
    <>
      <Link to="/new">
        <div className="fab bg-gradient-to-br from-purple-800 to-purple-500">
          🌱
        </div>
      </Link>

      {/* Search bar */}
      {dataItemsExist && (
        <div className="mb-1">
          <div className="flex items-center bg-white rounded-md mb-1">
            <div className="px-2 py-2 flex">
              <svg
                className="fill-current text-gray-500 w-6 h-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path
                  className="heroicon-ui"
                  d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                />
              </svg>
            </div>
            <input
              className="w-full text-gray-700 leading-tight focus:outline-none py-2"
              id="search"
              type="text"
              autoCapitalize="false"
              autoComplete="false"
              autoCorrect="false"
              aria-autocomplete="none"
              autoFocus={false}
              placeholder="Search"
              value={searchQuery}
              onChange={({ currentTarget }) =>
                setSearchQuery(currentTarget.value)
              }
            />
            {searchQuery && (
              <div className="px-2 py-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  onClick={() => setSearchQuery("")}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            )}
          </div>
          <div
            className="flex justify-end text-white text-sm px-1"
            onClick={() => {
              if (!searchQuery) setNewestFirst(!newestFirst) 
            }}
          >
            <span className="rounded px-1 border-white border-2">
              {searchQuery && <>Showing search results</>}
              {!searchQuery && (
                <>
                  {newestFirst && <>Showing oldest first</>}
                  {!newestFirst && <>Showing newest first</>}
                </>
              )}
            </span>
          </div>
        </div>
      )}
      {!dataItemsExist && (
        <div className="grid row mx-10">
          <div className="border-2 border-white text-white rounded px-4 py-2">
            <p>Hi {name}, welcome to Fieldbook!</p>
            <p>Hit the 🌱 below to start adding collection records.</p>
          </div>
        </div>
      )}
      {Object.keys(displayData as DateBinnedCollections).map((dateString) => (
        <>
          <div
            className="bg-white bg-opacity-80 text-gray-600 text-sm font-medium px-1"
            key={`collection-${dateString}`}
          >
            {dateString}
          </div>
          {(displayData as DateBinnedCollections)[dateString].map(
            (collection) => (
              <DataListItem {...collection} key={collection.id} />
            )
          )}
        </>
      ))}
    </>
  )
}

DataList.whyDidYouRender = true
