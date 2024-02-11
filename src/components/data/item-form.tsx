import { Field, Form, Formik, FormikConfig } from "formik"
import React, { ReactNode, useCallback } from "react"
import Select from "react-select"
import * as Yup from "yup"
import config from "@/config.json"
import { useBack } from "@/hooks/useBack"

const ItemValidation = Yup.object().shape({
  density: Yup.string().required("Required"),
  idConfidence: Yup.string(),
})

export type ItemFormValues = {
  taxon: (typeof config.taxa)[number]
  otherTaxon: string
  idConfidence: string
  density: string
  size: (typeof config.sizes)[number]
  notes: string
}

interface ItemFormProps extends FormikConfig<ItemFormValues> {
  title: string
  locationDisplay?: string
  locationAccuracy?: number | null
  children?: ReactNode
}

const transformConfigToSelect = (
  configType: keyof typeof config,
  itemId: string
) => ({
  label: config[configType][parseInt(itemId)],
  value: itemId,
})

const getOptionsForConfig = (configType: keyof typeof config) =>
  config[configType].map((option, index) => ({
    label: option,
    value: index.toString(),
  }))

const ItemForm: React.FC<ItemFormProps> = ({
  title,
  locationDisplay,
  locationAccuracy,
  initialValues,
  onSubmit,
  children,
}) => {
  const back = useBack()
  console.log({ initialValues })
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={ItemValidation}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, values }) => {
        const getSelectValue = useCallback(
          (
            configType: keyof typeof config,
            fieldName: keyof NonNullable<ItemFormValues>
          ) => {
            return transformConfigToSelect(
              configType,
              values[fieldName] !== undefined
                ? values[fieldName]
                : initialValues[fieldName]
            )
          },
          [values, initialValues]
        )

        return (
          <Form className=" bg-white shadow-md rounded px-12 py-8 pt-8">
            <div className="pb-4">
              <h3 className="text-lg block">🌱 {title}</h3>
            </div>

            <div className="pb-4">
              <label className="text-sm block font-bold pb-2" htmlFor="taxon">
                Species
              </label>
              <Select
                value={getSelectValue("taxa", "taxon")}
                options={getOptionsForConfig("taxa")}
                onChange={(value) => setFieldValue("taxon", value?.value)}
              />
            </div>

            {parseInt(values.taxon) === config.taxa.length - 1 && (
              <div className={`pb-4 transition duration-500`}>
                <label
                  className="text-sm block font-bold pb-2"
                  htmlFor="otherTaxon"
                >
                  Other Species
                </label>
                <Field
                  id="otherTaxon"
                  name="otherTaxon"
                  type="text"
                  className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
                />
              </div>
            )}

            <div className="pb-4">
              <label
                className="text-sm block font-bold pb-2"
                htmlFor="idConfidence"
              >
                ID Confidence
              </label>
              <Select
                value={getSelectValue("idConfidenceLevels", "idConfidence")}
                options={getOptionsForConfig("idConfidenceLevels")}
                onChange={(value) => {
                  setFieldValue("idConfidence", value?.value)
                }}
              />
            </div>

            <div className="pb-4">
              <label className="text-sm block font-bold pb-2" htmlFor="density">
                Density
              </label>
              <Select
                value={getSelectValue("densities", "density")}
                options={getOptionsForConfig("densities")}
                onChange={(value) => {
                  setFieldValue("density", value?.value)
                }}
              />
            </div>

            <div className="pb-4">
              <label className="text-sm block font-bold pb-2" htmlFor="size">
                Size
              </label>
              <Select
                value={getSelectValue("sizes", "size")}
                options={getOptionsForConfig("sizes")}
                onChange={(value) => {
                  setFieldValue("size", value?.value)
                }}
              />
            </div>

            <div className="pb-4">
              <label className="text-sm block font-bold pb-2" htmlFor="notes">
                Notes (Optional)
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
                <label
                  className="text-sm block font-bold pb-2"
                  htmlFor="location"
                >
                  Location{" "}
                  {locationAccuracy && (
                    <span className="font-light px-2">
                      accuracy: {locationAccuracy.toFixed(1)}m
                    </span>
                  )}
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

            <div className="pb-4 flex justify-between mt-2">
              <button
                type="button"
                className="border-2 border-gray-500 hover:bg-gray-500 hover:text-white text-gray-500 py-1 px-2 rounded focus:outline-none focus:shadow-outline"
                onClick={back}
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
            {children}
          </Form>
        )
      }}
    </Formik>
  )
}

export default ItemForm
