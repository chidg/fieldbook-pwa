import React from 'react'
import axios from 'axios'
import { useHistory } from "react-router-dom"
import {
  useUserContext,
  useDataContext
} from "../contexts"


const SettingsUpdateForm: React.FC = () => {
  const history = useHistory()
  const user = useUserContext()
  const data = useDataContext()

  const sendStuff = () => {
    axios.post(`/.netlify/functions/email`, { data, user }, {
      responseType: "json",
    })
  }
  
  return (
    <div className="text-white rounded px-8 py-8 pt-8">
      <h3 className="text-lg block">Settings</h3>
      <hr />
      <div onClick={() => history.goBack()} className="pt-2 text-sm cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg> Back
      </div>
      <p>
        <span className="pt-2 text-sm cursor-pointer" onClick={sendStuff}>EXPORT DATA</span>
      </p>
    </div>
  )
}

export default SettingsUpdateForm