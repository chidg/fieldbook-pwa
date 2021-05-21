import React, { useState } from 'react'
import axios from 'axios'
import { useHistory } from "react-router-dom"
import {
  useUserContext,
  useDataContext
} from "../contexts"


const SettingsUpdateForm: React.FC = () => {
  const history = useHistory()
  const { user } = useUserContext()
  const { data, setData } = useDataContext()
  const [exporting, setExporting] = useState(false)
  const [clearing, setClearing] = useState(false)

  const sendStuff = async () => {
    setExporting(true)
    const response = await axios.post('.netlify/functions/email', { data, user }, {
      responseType: "json",
    }).catch(() => setExporting(false))
    console.log(response)
    setExporting(false)
  }

  const clearData = React.useCallback(async () => {
    setData({})
    setClearing(false)
  }, [setData, setClearing])
  
  return (
    <div className="text-white px-4 h-500">
      <h3 className="text-lg block">Settings</h3>
      <hr />
      <div onClick={() => history.goBack()} className="flex pt-1 text-xs cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="4 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
        </svg> Back
      </div>

      <div className="flex flex-col content-between">
        <div className="flex-col bg-gray-200 bg-opacity-20 rounded px-2 pb-6 my-1">
          <h4>Export</h4>
          <div className="flex justify-center">
            {exporting && <span className="pt-2 text-sm">Exporting...</span>}
            {!exporting && 
              <button type="button" className="border-2 bg-green-500 rounded px-4 py-2" onClick={sendStuff} disabled={exporting}>
                {!exporting && <span>Export Data 🎉</span>}
                {exporting && <span>Exporting...</span>}
              </button>
            }
          </div>
        </div>

        <div className="flex-col bg-red-400 bg-opacity-20 rounded px-2 pb-6 my-1">
          <h4>Danger Zone</h4>
          <div className="flex justify-center">
            <button type="button" className="border-2 border-white bg-red-600 rounded px-4 py-2" disabled={clearing} onClick={() => {
              setClearing(true)
              setTimeout(() => {
                const confirm = window.confirm("This will permanently delete all data from Fieldbook. Are you sure?")
                if (confirm) clearData()
                else { setClearing(false) }
              }, 500)
            }}>
              {!clearing && <span>Clear all data 🗑</span>}
              {clearing && <span>Confirming...</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsUpdateForm