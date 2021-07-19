import React from 'react'
import { Formik, Field, Form } from 'formik'
import { useHistory } from "react-router-dom"

import {
  useUserContext,
} from "../contexts"

import {
  useGoogleAnalytics
} from "../hooks"

const UserForm = () => {
  const { setUser, user } = useUserContext()
  const { sendEvent } = useGoogleAnalytics()
  const history = useHistory()

  const initialValues = {
    ...{
      name: '',
      email: '',
    },
    ...user
  }
  
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={values => {
        setUser(values)
        sendEvent({
          category: 'User',
          action: `${user ? 'Updated' : 'Created'} user details`
        })
        history.replace('/')
      }}
    >
      <Form className="bg-white shadow-md rounded-lg px-12 py-8 pt-8 relative">
        <div className="pb-4">
          {!user &&
            <span>
              <h3 className="text-lg block mb-2">👋 Welcome to Fieldbook</h3>
              <h4>Tell us a bit about yourself:</h4>
            </span>
          }
          {user &&
            <span>
              <h3 className="text-lg block mb-2">🙋 Update your details</h3>
            </span>
          }
        </div>
        <div className="pb-4">
          <label className="text-sm block font-bold pb-2" htmlFor="name">Name</label>
          <Field id="name" name="name" required={true} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300" />
        </div>
        <div className="pb-4">
          <label className="text-sm block font-bold pb-2" htmlFor="email">Email</label>
          <Field
            id="email"
            name="email"
            type="email"
            required={true}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
          />
        </div>
        <div className="pb-4 flex justify-between mt-2">
          <button type="button" className="border-2 border-gray-500 hover:bg-gray-500 hover:text-white text-gray-500 py-1 px-2 rounded focus:outline-none focus:shadow-outline" onClick={() => {
            history.goBack()
          }}>Cancel</button>
          <button type="submit" className="border-2 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 py-1 px-2 rounded focus:outline-none focus:shadow-outline">
            {!user && <span>Get Started!</span>}
            {user && <span>Save</span>}
          </button>
        </div>
      </Form>
    </Formik>
  )
}

export default UserForm