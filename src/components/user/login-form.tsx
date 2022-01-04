import React from "react"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"
import { useHistory, Link } from "react-router-dom"
import { useUserContext } from "app/contexts"
import { useGoogleAnalytics } from "app/hooks"
import { SpinningSubmitFormButton } from "app/common"
import { useSignIn } from "react-supabase"

const schema = Yup.object().shape({
  password: Yup.string().required("This field is required").min(8),
  email: Yup.string().required(),
})

export const LoginForm = () => {
  const { user: existingUser, setUser } = useUserContext()
  const signIn = useSignIn()[1]
  const { sendEvent } = useGoogleAnalytics()
  const history = useHistory()

  const initialValues = {
    email: "",
    password: "",
  }

  return (
    <div className="md:w-2/3 sm:w-screen mx-auto lg:px-10 mt-2">
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={async ({ email, password }, { setStatus }) => {
          if (existingUser) {
            console.log("user exists, replace history")
            history.replace("/")
          }

          signIn({ email, password })
            .then(({ user }) => {
              if (!user) throw new Error("Login failed")
              console.log("signed in user ")
              sendEvent({
                category: "User",
                action: "User logged in",
              })
              // setUser(user)
              history.replace("/")
            })
            .catch((error) => {
              if (error.code && error.code === "auth/user-not-found") {
                setStatus({
                  message:
                    "Either those details were incorrect, or maybe you haven't signed up yet.",
                })
              }
            })
        }}
      >
        {({ isSubmitting, isValid, status }) => (
          <Form className="bg-white shadow-md rounded-lg px-12 py-8 pt-8 relative">
            <div className="pb-4">
              <span>
                <h3 className="text-lg block mb-2">👋 Welcome to Fieldbook</h3>
                <h4>Please log in:</h4>
              </span>
              {status && status.message && (
                <span className="text-red-600 text-md">{status.message}</span>
              )}
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
            </div>
            <div className="grid justify-items-end">
              <SpinningSubmitFormButton
                disabled={!isValid && !isSubmitting}
                spinning={isSubmitting}
              />
            </div>
          </Form>
        )}
      </Formik>
      <Link to="/signup">
        <div className="py-2 px-2 mt-4 mx-6 bg-white rounded border-2 border-purple-500">
          <h3 className="text-lg">🙋 New user?</h3>
          Click here to sign up!
        </div>
      </Link>
    </div>
  )
}
