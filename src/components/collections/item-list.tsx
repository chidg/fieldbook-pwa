import React from "react"
import { Link } from "react-router-dom"
import useDeepCompareEffect from "use-deep-compare-effect"
import format from 'date-fns/format'

import { DataItem, Taxon, useDataContext, useUserContext } from "../../contexts"

const DataListItem = ({ item, taxon }: { item: DataItem, taxon: Taxon }) => {
  
  return (
    <div className="flex justify-start items-center bg-gray-200 bg-opacity-20 text-white focus:text-blue-400 focus:bg-blue-100 rounded-sm px-2 py-2 my-1">
      <div className="font-sm px-2">
        {format(new Date(item.timestamp), 'H:mm')}
      </div>
      <div className="font-sm font-semibold px-2">
        {taxon.name}
      </div>
      <div className="flex-grow font-medium px-2">Density: {item.density}</div>
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
  const { data, taxa } = useDataContext()
  const { name } = useUserContext().user!
  const [oldestFirst, setOldestFirst] = React.useState<boolean>(true)

  const [displayData, setDisplayData] = React.useState<DateBinnedCollections>(
    {}
  )

  useDeepCompareEffect(() => {
    let records: DataItem[] = []
    records = Object.values(data)
    if (!oldestFirst) records = records.reverse()
    setDisplayData(getDataByDate(records))
  }, [data, oldestFirst])

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
          <div
            className="flex justify-end text-white text-sm px-1"
            onClick={() => {setOldestFirst(!oldestFirst)}}
          >
            <span className="rounded px-1 border-white border-2">
                <>
                  {oldestFirst && <>Showing oldest first</>}
                  {!oldestFirst && <>Showing newest first</>}
                </>
            </span>
          </div>
        </div>
      )}
      {!dataItemsExist && (
        <div className="grid row mx-10">
          <div className="border-2 border-white text-white rounded px-4 py-2">
            <p>Hi {name}, welcome to Fieldbook!</p>
            <p>Hit the 🌱 below to start adding weed records.</p>
          </div>
        </div>
      )}
      {Object.keys(displayData).map((dateString) => (
        <div key={`collection-${dateString}`}>
          <div
            className="bg-white bg-opacity-80 text-gray-600 text-sm font-medium px-1"
            
          >
            {dateString}
          </div>
          {displayData[dateString].map((collection) => (
            <DataListItem item={collection} taxon={taxa[collection.taxon]} key={collection.id} />
          ))}
        </div>
      ))}
    </>
  )
}

DataList.whyDidYouRender = true
