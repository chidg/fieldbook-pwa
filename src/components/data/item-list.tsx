import { Link } from "react-router-dom"
import format from "date-fns/format"

import { DataItem, useMetaContext } from "@/contexts"
import { useDataByDate } from "@/hooks/useDataByDate"
import { useDensityOptions } from "@/hooks/useDensity"
import { useTaxonName } from "@/hooks/useTaxonName"
import { Data } from "@/contexts/data"

const DataListItem = ({ item }: { item: DataItem }) => {
  const densities = useDensityOptions()
  const taxonName = useTaxonName(item)

  return (
    <div className="flex justify-start items-center bg-gray-200 bg-opacity-20 text-white focus:text-blue-400 focus:bg-blue-100 rounded-sm px-2 py-1 my-1">
      <div className="font-sm px-2">
        {format(new Date(item.timestamp), "H:mm")}
      </div>
      <div className="font-sm font-semibold px-2">{taxonName}</div>
      <div className="flex-grow font-medium px-2">
        {item.density && <span>{densities[item.density]}</span>}
      </div>
      <div className="font-normal tracking-wide">
        <Link
          to={{
            pathname: `/data/${item.id}/`,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
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

export const DataList = () => {
  const { setNewestFirst, newestFirst } = useMetaContext()
  const displayData = useDataByDate(newestFirst)

  return (
    <>
      <div className="mb-1 flex justify-end px-1">
        <button
          className="text-white text-sm px-1 rounded border-white border"
          onClick={() => {
            setNewestFirst(!newestFirst)
          }}
        >
          {newestFirst && <>Showing oldest first</>}
          {!newestFirst && <>Showing newest first</>}
        </button>
      </div>
      {Object.keys(displayData).map((dateString) => (
        <div key={`collection-${dateString}`}>
          <div className="bg-white bg-opacity-80 text-gray-600 text-sm font-medium px-1">
            {dateString}
          </div>
          {displayData[dateString].map((collection) => (
            <DataListItem item={collection} key={collection.id} />
          ))}
        </div>
      ))}
    </>
  )
}
