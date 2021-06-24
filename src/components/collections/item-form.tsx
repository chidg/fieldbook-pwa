import React from "react"
import {
  Field,
  FieldProps,
  FieldArray,
  Form,
  Formik,
  FormikConfig,
} from "formik"
import { useHistory } from "react-router-dom"
import * as Yup from "yup"
import { useUserContext, FullAttachments } from "../../contexts"

const ItemValidation = Yup.object().shape({
  fieldName: Yup.string().required("Required"),
  number: Yup.string().required("Required"),
})

type ItemFormValues = {
  fieldName: string
  number: string
  notes: string
  newPhotos: File[]
  existingPhotos?: string[]
}

interface ItemFormProps extends FormikConfig<ItemFormValues> {
  title: string
  photos?: FullAttachments
  locationDisplay?: string
}

const ItemForm: React.FC<ItemFormProps> = ({
  title,
  locationDisplay,
  initialValues,
  photos,
  onSubmit,
}) => {
  const history = useHistory()
  const { initials } = useUserContext().user!

  const newFileUploadInput = React.useRef<HTMLInputElement>(null)

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={ItemValidation}
      onSubmit={onSubmit}
    >
      {({ values }) => (
        <Form className=" bg-white shadow-md rounded px-12 py-8 pt-8">
          <div className="pb-4">
            <h3 className="text-lg block">🌱 {title}</h3>
          </div>
          <div className="pb-4">
            <label className="text-sm block font-bold pb-2" htmlFor="number">
              Number
            </label>

            <Field
              id="number"
              name="number"
              component={({ field }: FieldProps) => (
                <div className="flex flex-wrap items-stretch w-full relative">
                  <div className="flex -mr-px">
                    <span className="flex items-center leading-normal bg-grey-lighter rounded rounded-r-none border border-r-0 border-blue-300 px-3 whitespace-no-wrap text-grey-dark text-sm">
                      {initials}
                    </span>
                  </div>
                  <input
                    type="text"
                    className="flex-shrink flex-grow flex-auto leading-normal w-px border h-10 border-blue-300 rounded rounded-l-none px-3 relative focus:border-blue focus:shadow"
                    {...field}
                  />
                </div>
              )}
            />
          </div>

          <div className="pb-4">
            <label className="text-sm block font-bold pb-2" htmlFor="fieldName">
              Field Name
            </label>
            <Field
              id="fieldName"
              autoFocus={true}
              name="fieldName"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
            />
          </div>

          <div className="pb-4">
            <label className="text-sm block font-bold pb-2" htmlFor="notes">
              Notes
            </label>
            <Field
              id="notes"
              name="notes"
              type="text"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
            />
          </div>

          <div className="pb-4">
            <div className="flex justify-between items-center">
              <label className="text-sm block font-bold pb-2" htmlFor="notes">
                Location
              </label>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => window.alert(locationDisplay)}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <input
              disabled
              id="location"
              name="location"
              type="text"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-900 bg-gray-100 leading-tight cursor-pointer"
              value={locationDisplay}
            />
          </div>
          {process.env.REACT_APP_UPLOADCARE_PUBLICKEY && (
            <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
              {photos && <FieldArray
                name="existingPhotos"
                render={({ remove }) => (
                  <>
                    {values.existingPhotos?.map((photoName, index) => (
                      <div
                        key={`existing-photo-${index}`}
                        className="square-image-container border-2 rounded border-gray-500"
                      >
                        <img
                          src={`data:${photos[photoName].content_type};base64, ${photos[photoName].data}`}
                          alt=""
                        />
                        <span className="absolute top-0 right-0 text-white bg-opacity-70 rounded bg-gray-400 cursor-pointer" onClick={() => remove(index)}>x</span>
                      </div>
                    ))}
                  </>
                )}
              />}

              <FieldArray
                name="newPhotos"
                render={({ insert }) => (
                  <>
                    {values.newPhotos.map((photo, index) => (
                      <div
                        key={`new-photo-${index}`}
                        className="square-image-container border-2 rounded border-gray-500"
                      >
                        <img src={URL.createObjectURL(photo)} alt="" />
                      </div>
                    ))}
                    <div
                      className="square-image-container border-2 border-purple-500 text-purple-500 flex justify-center items-center rounded"
                      onClick={() => {
                        newFileUploadInput?.current?.click()
                      }}
                    >
                      <input
                        hidden
                        ref={newFileUploadInput}
                        type="file"
                        onChange={(event) => {
                          if (
                            event.currentTarget.files &&
                            event.currentTarget.files[0]
                          ) {
                            insert(
                              values.newPhotos.length,
                              event.currentTarget.files[0]
                            )
                          }
                        }}
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 absolute top-1/3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                  </>
                )}
              />
            </div>
          )}

          <div className="pb-4 flex justify-between mt-2">
            <button
              type="button"
              className="border-2 border-gray-500 hover:bg-gray-500 hover:text-white text-gray-500 py-1 px-2 rounded focus:outline-none focus:shadow-outline"
              onClick={() => {
                history.goBack()
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="border-2 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 py-1 px-2 rounded focus:outline-none focus:shadow-outline"
            >
              Save
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}

export default ItemForm
