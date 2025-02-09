import { Link } from "react-router-dom"

import { useDataContext, useMetaContext, useUserContext } from "@/contexts"
import { useState } from "react"
import { DataList } from "./item-list"
import { ItemListMap } from "./item-list-map"

export const Home = () => {
  const { data } = useDataContext()
  const { user } = useUserContext()
  const { viewType, setViewType } = useMetaContext()

  const dataItemsCount = Object.keys(data || {}).length

  return (
    <div className="flex flex-col h-screen">
      {/* Header section */}
      <div className="flex-none">
        {!dataItemsCount && (
          <div className="grid row mx-10">
            <div className="border-2 border-white text-white rounded px-4 py-2">
              <p>Hi {user?.name}, welcome to Fieldbook!</p>
              <p>Hit the 🌱 below to start adding weed records.</p>
            </div>
          </div>
        )}
        <div className="px-1 mb-2">
          <button
            className="text-white text-sm px-1 rounded border-white border"
            onClick={() => {
              setViewType(viewType === "list" ? "map" : "list")
            }}
          >
            {viewType === "list" ? "Show map" : "Show list"}
          </button>
        </div>
      </div>

      {/* Main content section */}
      <div className="flex-1 relative">
        {viewType === "list" && <DataList />}
        {viewType === "map" && (
          <div className="absolute inset-0">
            <ItemListMap />
          </div>
        )}
      </div>

      {/* FAB - now sits above the map due to higher z-index */}
      <Link to="data/new" className="z-50">
        <div className="fab bg-gradient-to-br from-purple-800 to-purple-500">
          🌱
        </div>
      </Link>
    </div>
  )
}
