import React from 'react'
import { Formik, Field, Form } from 'formik'
import { useHistory } from "react-router-dom"

import {
  useUserContext,
  useDataContext
} from "../contexts"

const UserForm = () => {
  const { setUser, user } = useUserContext()
  const { setData } = useDataContext()
  const history = useHistory()

  const initialValues = {
    ...{
      name: '',
      initials: '',
      email: '',
    },
    ...user
  }
  
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={values => {
        if (values !== user) {
          setData({})
        }
        setUser(values)
        history.replace('/')
      }}
    >
      <Form className=" bg-white shadow-md rounded px-8 py-8 pt-8">
        <div className="px-4 pb-4">
          <h3 className="text-lg block">👋 Tell us a bit about yourself:</h3>
        </div>
        <div className="px-4 pb-4">
          <label className="text-sm block font-bold pb-2" htmlFor="name">Name</label>
          <Field id="name" name="name" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300" />
        </div>
        <div className="px-4 pb-4">
          <label className="text-sm block font-bold pb-2" htmlFor="initials">Initials</label>
          <Field id="initials" name="initials" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300" />
        </div>

        <div className="px-4 pb-4">
          <label className="text-sm block font-bold pb-2" htmlFor="email">Email</label>
          <Field
            id="email"
            name="email"
            type="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
          />
        </div>

        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
      </Form>
    </Formik>
  )
}

export default UserForm