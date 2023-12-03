import React, { useState, useMemo } from "react"
import axios from "axios"
import { useUserContext, useDataContext } from "@/contexts"
import { useGeoLocation, useHasGeoLocationPermission } from "@/hooks/location"
import { useNetworkState } from "@uidotdev/usehooks"
import { useNavigate, Link } from "react-router-dom"

const GeoLocationInfoPanel = () => {
  const hasGeoLocationPerm = useHasGeoLocationPermission()
  const [location] = useGeoLocation()
  const text = useMemo(() => {
    switch (hasGeoLocationPerm) {
      case "granted":
        return "🌏 You have given Fieldbook permission to access your location."
      case "denied":
        return "⚠️ You have not given Fieldbook permission to access your location. Please grant permission to use this feature."
      case "prompt":
        if (location)
          return "🌏 You have given Fieldbook permission to access your location."

        return (
          <div className="flex gap-2 items-center">
            <span>
              ⏳ Fieldbook is waiting for you to grant permission to access your
              location.
            </span>
            <button
              type="button"
              className="border-2 bg-green-500 rounded px-4 py-2"
              onClick={() => {
                navigator.geolocation.getCurrentPosition(() => {})
              }}
            >
              Try again 🌎
            </button>
          </div>
        )
      default:
        return "⚠️ Fieldbook is unable to access your location. Please check your browser settings."
    }
  }, [hasGeoLocationPerm, location])

  return (
    <div className="text-sm text-gray-100 border-2 border-opacity-25 bg-opacity-20 bg-gray-200 border-gray-200 rounded p-2 my-2">
      {text}
    </div>
  )
}

const SettingsUpdateForm = () => {
  const nav = useNavigate()
  const { online } = useNetworkState()
  const {
    user,
    settings: { watchLocation },
    setSettings,
  } = useUserContext()
  const { data, setData, taxa } = useDataContext()
  const [exporting, setExporting] = useState(false)
  const [clearing, setClearing] = useState(false)

  const sendStuff = async () => {
    setExporting(true)
    const formattedData = Object.values(data).map((d) => ({
      ...d,
      taxon: taxa[d.taxon].name,
      date: new Date(d.timestamp).toLocaleDateString(),
      time: new Date(d.timestamp).toLocaleTimeString(),
    }))

    await axios
      .post(
        ".netlify/functions/email",
        { data: formattedData, user },
        {
          responseType: "json",
        }
      )
      .catch(() => setExporting(false))
    setExporting(false)
  }

  const clearData = React.useCallback(async () => {
    setData({})
    setClearing(false)
  }, [setData, setClearing])

  return (
    <div className="text-white px-4 h-500 lg:mx-52">
      <div className="mb-2">
        <h3 className="text-lg block">Settings</h3>
        <hr />
        <div
          onClick={() => nav(-1)}
          className="flex pt-1 text-xs cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="4 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M15 19l-7-7 7-7"
            />
          </svg>{" "}
          Back
        </div>
      </div>
      <div className="flex flex-col gap-2 content-between">
        <div className="flex-col bg-gray-200 bg-opacity-20 rounded px-2 pb-6">
          <h4>Location</h4>
          <div className="flex justify-center mt-2">
            <label htmlFor="watch-location">
              Watch location at all times (greater accuracy, more battery
              consumption)
              <input
                type="checkbox"
                id="watch-location"
                className="ml-2"
                checked={watchLocation}
                onChange={(event) =>
                  setSettings({ watchLocation: !watchLocation })
                }
              />
            </label>
          </div>
          <GeoLocationInfoPanel />
        </div>

        <div className="flex-col bg-gray-200 bg-opacity-20 rounded px-2 pb-6">
          <h4>Update Your Details</h4>
          <div className="flex justify-center mt-2">
            <Link to="/settings/user">
              <button
                type="button"
                className="border-2 bg-green-500 rounded px-4 py-2"
              >
                Update your details 🙋
              </button>
            </Link>
          </div>
        </div>

        <div className="flex-col bg-gray-200 bg-opacity-20 rounded px-2 pb-6">
          <h4>Export</h4>
          <div className="text-sm text-gray-100 border-2 border-opacity-25 bg-opacity-20 bg-gray-200 border-gray-200 rounded p-2 my-2">
            <p>
              This button will send your data to Nature Conservation Margaret
              River Region.
            </p>{" "}
            {!online && (
              <p className="text-orange-200">
                ⛔️ It appears your device is offline. Please make sure you have
                internet reception before attempting to send.
              </p>
            )}
          </div>
          <div className="flex justify-center mt-2">
            <button
              type="button"
              className="border-2 bg-green-500 rounded px-4 py-2 disabled:bg-green-200"
              onClick={sendStuff}
              disabled={exporting || !online}
            >
              {!exporting && <span>Export Data 🎉</span>}
              {exporting && <span>Exporting...</span>}
            </button>
          </div>
        </div>

        <div className="flex-col bg-red-400 bg-opacity-20 rounded px-2 pb-6">
          <h4>Danger Zone</h4>
          <div className="flex justify-center mt-2">
            <button
              type="button"
              className="border-2 border-white bg-red-600 rounded px-4 py-2"
              disabled={clearing}
              onClick={() => {
                setClearing(true)
                setTimeout(() => {
                  const confirm = window.confirm(
                    "This will permanently delete all data from Fieldbook. Are you sure?"
                  )
                  if (confirm) clearData()
                  else {
                    setClearing(false)
                  }
                }, 500)
              }}
            >
              {!clearing && <span>Clear all data 🗑</span>}
              {clearing && <span>Confirming...</span>}
            </button>
          </div>
        </div>

        <div className="flex-col bg-gray-400 bg-opacity-20 rounded px-2 py-2 my-1 text-sm">
          Fieldbook version: {import.meta.env.COMMIT_REF}
        </div>
      </div>
    </div>
  )
}

export default SettingsUpdateForm
