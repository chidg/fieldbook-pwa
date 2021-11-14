import React, { useState } from "react"
import { useHistory, Link } from "react-router-dom"
import { useUserContext, useDataContext, useMetaContext } from "app/contexts"

export const SettingsUpdateForm: React.FC = () => {
  const history = useHistory()
  const { online } = useMetaContext()
  const { user, signOut } = useUserContext()
  const [exporting, setExporting] = useState(false)
  const [clearing, setClearing] = useState(false)

  const clearData = React.useCallback(async () => {
    setClearing(false)
  }, [setClearing])

  return (
    <div className="text-white px-4 h-500">
      <h3 className="text-lg block">Settings</h3>
      <hr />
      <div
        onClick={() => history.goBack()}
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

      <div className="flex flex-col content-between">
        <div className="flex-col bg-gray-200 bg-opacity-20 rounded px-2 pb-6 my-1">
          <h4>Update Your Details</h4>
          <div className="flex justify-center mt-2">
            {online && (
              <Link to="/settings/user">
                <button
                  type="button"
                  className="border-2 bg-green-500 rounded px-4 py-2"
                >
                  Update your details 🙋
                </button>
              </Link>
            )}
            {!online && (
              <button
                type="button"
                className="border-2 bg-gray-500 rounded px-4 py-2"
              >
                Not available offline 🧑‍💻
              </button>
            )}
          </div>
        </div>

        <div className="flex-col bg-gray-200 bg-opacity-20 rounded px-2 pb-6 my-1">
          <h4>Export</h4>
          <div className="text-sm text-gray-100 border-2 border-opacity-25 bg-opacity-20 bg-gray-200 border-gray-200 rounded p-2 my-2">
            This button will send the data to the email address {user?.email}.
          </div>
          <div className="flex justify-center mt-2">
            {online && (
              <button
                type="button"
                className="border-2 bg-green-500 rounded px-4 py-2"
                onClick={() => window.alert("Already synced")}
                disabled={exporting}
              >
                {!exporting && <span>Export Data 🎉</span>}
                {exporting && <span>Exporting...</span>}
              </button>
            )}
            {!online && (
              <button
                type="button"
                className="border-2 bg-gray-500 rounded px-4 py-2"
              >
                Not available offline 🧑‍💻
              </button>
            )}
          </div>
        </div>

        <div className="flex-col bg-gray-200 bg-opacity-20 rounded px-2 pb-6 my-1">
          <h4>Log out</h4>
          <div className="flex justify-center mt-2">
            <button
              type="button"
              className="border-2 bg-green-500 rounded px-4 py-2"
              onClick={() => {
                signOut()
                history.replace("/")
              }}
              disabled={exporting}
            >
              <span>Log out 👋</span>
            </button>
          </div>
        </div>

        <div className="flex-col bg-red-400 bg-opacity-20 rounded px-2 pb-6 my-1">
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
      </div>
    </div>
  )
}
