import React from "react"
import { useHistory } from "react-router-dom"
import { useMetaContext } from "../contexts"
import { useGoogleAnalytics } from "../hooks"

type UpdatingScreenProps = {
  acknowledgeUpdate: () => void
}

const UpdatingScreen: React.FC<UpdatingScreenProps> = ({
  acknowledgeUpdate,
}) => {
  const history = useHistory()
  const { updating } = useMetaContext()
  const { sendEvent } = useGoogleAnalytics()

  return (
    <>
      <nav className="flex items-center justify-between flex-wrap p-4">
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <span className="font-semibold text-xl tracking-tight">
            Fieldbook 📒
          </span>
        </div>
      </nav>

      <div className="container mx-auto lg:px-10 mt-2">
        <div className="grid max-h-screen place-items-center from-gray-300 to-white bg-gradient-to-br bg-opacity-70 rounded p-5 mx-2">
          <div className="text-6xl">💐</div>
          <div className="text-2xl mt-2">Fieldbook has been updated</div>
          {!updating && (
            <button
              type="button"
              className="bg-green-500 rounded px-4 py-2 mt-2"
              onClick={() => {
                acknowledgeUpdate()
                sendEvent({
                  category: "Meta",
                  action: process.env.REACT_APP_GIT_SHA || "",
                  label: "Update version"
                })
                history.replace("/")
              }}
            >
              AWESOME
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default UpdatingScreen
