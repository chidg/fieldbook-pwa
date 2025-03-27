import { Link } from "react-router-dom"

import { useDataContext, useMetaContext, useUserContext } from "@/contexts"
import { useState } from "react"
import { DataList } from "./item-list"
import { ItemListMap } from "./item-list-map"

export const Home = () => {
  const { user } = useUserContext()
  const { viewType, setViewType } = useMetaContext()

  return (
    <div className="flex flex-col gap-2">
      {/* Header section */}
      <div>
        {viewType === "empty" && (
          <div className="grid row mx-10">
            <div className="border-2 border-white text-white rounded px-4 py-2">
              <p>Hi {user?.name}, welcome to Fieldbook!</p>
              <p>Hit the 🌱 below to start adding weed records.</p>
            </div>
          </div>
        )}
        {viewType !== "empty" && (
          <div className="px-1">
            <button
              className="text-white text-sm px-1 rounded border-white border"
              onClick={() => {
                setViewType(viewType === "list" ? "map" : "list")
              }}
            >
              {viewType === "list" ? "Show map" : "Show list"}
            </button>
          </div>
        )}
      </div>

      {/* Main content section */}
      <div>
        {viewType === "list" && <DataList />}
        {viewType === "map" && <ItemListMap />}
        <Link to="data/new" className="z-50">
          <div className="fab bg-gradient-to-br from-purple-800 to-purple-500">
            🌱
          </div>
        </Link>
      </div>
    </div>
  )
}
