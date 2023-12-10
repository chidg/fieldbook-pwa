import { Field, Form, Formik, FormikConfig } from "formik"
import React, { ChangeEvent, ReactNode } from "react"
import CreatableSelect from "react-select/creatable"
import Select from "react-select"
import * as Yup from "yup"
import { useDataContext, Taxon } from "@/contexts"
import { v4 } from "uuid"
import config from "@/config.json"
import { useBack } from "@/hooks/useBack"

const densityOptions = config.densities
const idConfidenceOptions = config.idConfidenceLevels

const ItemValidation = Yup.object().shape({
  density: Yup.string().required("Required"),
  idConfidence: Yup.string(),
})

export type ItemFormValues = {
  taxon: string
  idConfidence: string
  density: string
  locationDescription: string
  notes: string
}

interface ItemFormProps extends FormikConfig<ItemFormValues> {
  title: string
  prefix?: string
  locationDisplay?: string
  locationAccuracy?: number | null
  children?: ReactNode
}

const transformTaxonToSelect = (taxon: Taxon) => ({
  label: taxon.name,
  value: taxon.id,
})

const transformDensityToSelect = (densityIdx: string) => ({
  label: densityOptions[parseInt(densityIdx)],
  value: densityIdx,
})

const ItemForm: React.FC<ItemFormProps> = ({
  title,
  locationDisplay,
  locationAccuracy,
  initialValues,
  onSubmit,
  children,
}) => {
  const back = useBack()
  const { saveTaxon, taxa } = useDataContext()

  const saveNewTaxon = React.useCallback(
    (name: string) => {
      const newTaxon = { id: v4(), name }
      saveTaxon(newTaxon)
      return newTaxon
    },
    [saveTaxon]
  )

  const getTaxonById = React.useCallback(
    (taxonId: string) => {
      const taxon = taxa[taxonId]
      return transformTaxonToSelect(taxon)
    },
    [taxa]
  )

  const creatableSelectOptions = React.useMemo(
    () => Object.keys(taxa).map(getTaxonById),
    [taxa, getTaxonById]
  )

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={ItemValidation}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form className=" bg-white shadow-md rounded px-12 py-8 pt-8">
          <div className="pb-4">
            <h3 className="text-lg block">🌱 {title}</h3>
          </div>

          <div className="pb-4">
            <div className="flex gap-2 align-middle mb-2">
              <label className="text-sm block font-bold" htmlFor="taxon">
                Species
              </label>
              <span className="text-xs bg-gray-100 border border-gray-400 rounded px-2">
                ℹ️ Select existing or type to add new
              </span>
            </div>
            <CreatableSelect
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  // create new
                  const newTaxon = saveNewTaxon(
                    (e.currentTarget as HTMLInputElement).value
                  )
                  setFieldValue("taxon", newTaxon.id)
                }
              }}
              onCreateOption={(value) => {
                const newTaxon = saveNewTaxon(value)
                setFieldValue("taxon", newTaxon.id)
              }}
              value={
                values.taxon && taxa[values.taxon]
                  ? getTaxonById(values.taxon)
                  : initialValues.taxon
                  ? getTaxonById(initialValues.taxon)
                  : null
              }
              options={creatableSelectOptions}
              onChange={(value) => setFieldValue("taxon", value?.value)}
            />
          </div>

          <div className="pb-4">
            <label
              className="text-sm block font-bold pb-2"
              htmlFor="idConfidence"
            >
              ID Confidence
            </label>
            <Select
              value={{
                label: idConfidenceOptions[parseInt(values.idConfidence)],
                value: values.idConfidence,
              }}
              // options={idConfidenceOptions.map((option) => option)}
              options={idConfidenceOptions.map((option, index) => ({
                label: option,
                value: index.toString(),
              }))}
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
              value={
                values.density
                  ? transformDensityToSelect(values.density)
                  : transformDensityToSelect(initialValues.density)
              }
              options={densityOptions.map((option, index) => ({
                label: option,
                value: index.toString(),
              }))}
              onChange={(value) => {
                setFieldValue("density", value?.value)
              }}
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
            <label
              className="text-sm block font-bold pb-2"
              htmlFor="locationDescription"
            >
              Location Description
            </label>
            <Field
              id="locationDescription"
              name="locationDescription"
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
      )}
    </Formik>
  )
}

export default ItemForm
