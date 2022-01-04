import React from "react"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import axios from "axios"
import { useSignUp } from "react-supabase"
import { useHistory, Link } from "react-router-dom"

import { useUserContext } from "app/contexts"
import { useGoogleAnalytics } from "app/hooks"
import { SpinningSubmitFormButton } from "app/common"

const schema = Yup.object().shape({
  password: Yup.string().required("This field is required").min(8),
  password2: Yup.string().when("password", {
    is: (val: string) => (val && val.length > 0 ? true : false),
    then: Yup.string().oneOf(
      [Yup.ref("password")],
      "Both passwords must be the same"
    ),
  }),
})

export const SignupForm = () => {
  const signUp = useSignUp()[1]
  const { setSettings } = useUserContext()
  const { sendEvent } = useGoogleAnalytics()
  const history = useHistory()
  const initialValues = {
    name: "",
    email: "",
    password: "",
    password2: "",
    collectionPrefix: "",
  }

  return (
    <div className="md:w-2/3 sm:w-screen mx-auto lg:px-10 mt-2">
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={async (values) => {
          signUp(
            { email: values.email, password: values.password },
            {
              // function looks like this will work, even though it is not typed to handle it
              // @ts-ignore
              data: {
                displayName: values.name,
              },
            }
          )
            .then(({ error, session, user }) => {
              if (error) throw new Error(error.message)

              sendEvent({
                category: "User",
                action: "Converted user to Firebase User",
              })

              setSettings({
                collectionPrefix: values.collectionPrefix,
              })

              axios.post(
                ".netlify/functions/signedup",
                { user: user },
                {
                  responseType: "json",
                }
              )

              return user
            })
            .then(() => {
              history.push("/")
            })
        }}
      >
        {({ errors, isValid, isSubmitting }) => (
          <Form className="bg-white shadow-md rounded-lg px-12 py-8 pt-8 relative">
            <div className="pb-4">
              <span>
                <h3 className="text-lg block mb-2">👋 Welcome to Fieldbook</h3>
              </span>
              <p className="text-md pt-2">
                Fieldbook is a data collection app for botanists. Sign up here
                to use it in your next field trip.
              </p>
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

            <div className="pb-4">
              <label
                className="text-sm block font-bold pb-2"
                htmlFor="password"
              >
                Password
              </label>
              <Field
                id="password"
                name="password"
                type="password"
                required={true}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
              />
              {errors.password && (
                <span className="text-sm text-red-400">{errors.password}</span>
              )}
            </div>
            <div className="pb-4">
              <label
                className="text-sm block font-bold pb-2"
                htmlFor="password2"
              >
                Password again
              </label>
              <Field
                id="password2"
                name="password2"
                type="password"
                required={true}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
              />
              {errors.password2 && (
                <span className="text-sm text-red-400">{errors.password2}</span>
              )}
            </div>
            <div className="pb-4 flex justify-between mt-2">
              <SpinningSubmitFormButton
                disabled={!isValid && !isSubmitting}
                spinning={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>

      <Link to="/login">
        <div className="py-2 px-2 mt-4 mx-6 bg-white rounded border-2 border-purple-500">
          <h3 className="text-lg">🙋 Already have an account?</h3>
          Click here to log in!
        </div>
      </Link>
    </div>
  )
}
