import React from "react"
import { Formik, Field, Form } from "formik"
import { useHistory } from "react-router-dom"

import { useUserContext } from "../../contexts"

import { useGoogleAnalytics } from "../../hooks"

export const UserForm = () => {
  const { user, settings, setSettings, updateProfile, updateEmail } =
    useUserContext()
  const { sendEvent } = useGoogleAnalytics()
  const history = useHistory()

  const initialValues = {
    name: user?.displayName,
    prefix: settings.collectionPrefix,
    email: user?.email,
  }

  return (
    <div className="md:w-2/3 sm:w-screen mx-auto lg:px-10 mt-2">
      <Formik
        initialValues={initialValues}
        onSubmit={async ({ email, prefix, name }) => {
          if (email && email !== user!.email) {
            await updateEmail(user!, email)
          }
          if (name && name !== user?.displayName) {
            await updateProfile(user!, { displayName: name })
          }
          if (prefix && prefix !== settings.collectionPrefix) {
            setSettings({ collectionPrefix: prefix })
          }
          sendEvent({
            category: "User",
            action: "Updated user details",
          })
          history.replace("/")
        }}
      >
        <Form className="bg-white shadow-md rounded-lg px-12 py-8 pt-8 relative">
          <div className="pb-4">
            {!user && (
              <span>
                <h3 className="text-lg block mb-2">👋 Welcome to Fieldbook</h3>
                <h4>Tell us a bit about yourself:</h4>
              </span>
            )}
            {user && (
              <span>
                <h3 className="text-lg block mb-2">🙋 Update your details</h3>
              </span>
            )}
          </div>
          <div className="pb-4">
            <label className="text-sm block font-bold pb-2" htmlFor="name">
              Name
            </label>
            <Field
              id="name"
              name="name"
              required={true}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
            />
          </div>
          <div className="pb-4">
            <label className="text-sm block font-bold pb-2" htmlFor="prefix">
              Collection Number Prefix
            </label>
            <Field
              id="prefix"
              name="prefix"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
            />
          </div>

          <div className="pb-4">
            <label className="text-sm block font-bold pb-2" htmlFor="email">
              Email
            </label>
            <Field
              id="email"
              name="email"
              type="email"
              required={true}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
            />
          </div>
          <div className="pb-4 flex justify-between mt-2">
            {user && (
              <button
                type="button"
                className="border-2 border-gray-500 hover:bg-gray-500 hover:text-white text-gray-500 py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                onClick={() => {
                  history.goBack()
                }}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="border-2 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 py-1 px-2 rounded focus:outline-none focus:shadow-outline"
            >
              {!user && <span>Get Started!</span>}
              {user && <span>Save</span>}
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  )
}
