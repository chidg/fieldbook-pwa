export {}
// import React from "react"
// import { Formik, Field, Form } from "formik"
// import * as Yup from "yup"
// import axios from "axios"
// import { useHistory } from "react-router-dom"

// import { useUserContext } from "app/contexts"
// import "firebase/auth"
// import { useGoogleAnalytics } from "app/hooks"
// import { SpinningSubmitFormButton } from "app/common"

// const schema = Yup.object().shape({
//   password: Yup.string().required("This field is required").min(8),
//   password2: Yup.string().when("password", {
//     is: (val: string) => (val && val.length > 0 ? true : false),
//     then: Yup.string().oneOf(
//       [Yup.ref("password")],
//       "Both passwords must be the same"
//     ),
//   }),
// })

// export const ConvertUserForm = () => {
//   const { oldUser: user, setSettings } = useUserContext()
//   const { sendEvent } = useGoogleAnalytics()
//   const history = useHistory()
//   const firebase = useFirebaseApp()
//   const initialValues = {
//     name: user?.name || "",
//     email: user?.email || "",
//     password: "",
//     password2: "",
//   }

//   return (
//     <div className="md:w-2/3 sm:w-screen mx-auto lg:px-10 mt-2">
//       <Formik
//         initialValues={initialValues}
//         validationSchema={schema}
//         onSubmit={async (values) => {
//           const fbUser = await firebase
//             .auth()
//             .createUserWithEmailAndPassword(values.email, values.password)
//             .then((userCredentials) => {
//               sendEvent({
//                 category: "User",
//                 action: "Converted user to Firebase User",
//               })
//               return userCredentials.user
//             })
//           if (fbUser) {
//             setSettings({ prefix: user.initials || "" })
//             await fbUser.updateProfile({
//               displayName: values.name,
//             })
//             // Now delete the local storage user
//             window.localStorage.removeItem("user")
//             await axios.post(
//               ".netlify/functions/signedup",
//               { fbUser },
//               {
//                 responseType: "json",
//               }
//             )
//             history.push("/")
//           }
//         }}
//       >
//         {({ errors, isValid, isSubmitting }) => (
//           <Form className="bg-white shadow-md rounded-lg px-12 py-8 pt-8 relative">
//             <div className="pb-4">
//               <span>
//                 <h3 className="text-lg block mb-2">
//                   👋 Welcome back to Fieldbook
//                 </h3>
//                 <h4 className="block">
//                   We've got a bit of an upgrade for you.
//                 </h4>
//               </span>
//               <p className="text-md pt-2">
//                 To use Fieldbook, you now need to register as a user. This means
//                 we can bring you nice new features like the ability to store and
//                 upload photos.
//               </p>
//               <p className="text-md pt-2">
//                 Your data will be retained and available to use once you have
//                 signed up.
//               </p>
//             </div>
//             <div className="pb-4">
//               <label className="text-sm block font-bold pb-2" htmlFor="name">
//                 Name
//               </label>
//               <Field
//                 id="name"
//                 name="name"
//                 required={true}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
//               />
//             </div>

//             <div className="pb-4">
//               <label className="text-sm block font-bold pb-2" htmlFor="email">
//                 Email
//               </label>
//               <Field
//                 id="email"
//                 name="email"
//                 type="email"
//                 required={true}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
//               />
//             </div>

//             <div className="pb-4">
//               <label
//                 className="text-sm block font-bold pb-2"
//                 htmlFor="password"
//               >
//                 Password
//               </label>
//               <Field
//                 id="password"
//                 name="password"
//                 type="password"
//                 required={true}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
//               />
//               {errors.password && (
//                 <span className="text-sm text-red-400">{errors.password}</span>
//               )}
//             </div>
//             <div className="pb-4">
//               <label
//                 className="text-sm block font-bold pb-2"
//                 htmlFor="password2"
//               >
//                 Password again
//               </label>
//               <Field
//                 id="password2"
//                 name="password2"
//                 type="password"
//                 required={true}
//                 className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
//               />
//               {errors.password2 && (
//                 <span className="text-sm text-red-400">{errors.password2}</span>
//               )}
//             </div>
//             <div className="pb-4 flex justify-between mt-2">
//               <SpinningSubmitFormButton
//                 disabled={!isValid && !isSubmitting}
//                 spinning={isSubmitting}
//               />
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   )
// }
