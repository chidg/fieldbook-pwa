import React from 'react'
import { Formik, Field, Form, FormikConfig, FieldProps } from 'formik'
import * as Yup from 'yup';
import { useHistory } from "react-router-dom"
import {
  useUserContext,
} from "../contexts"

const ItemValidation = Yup.object().shape({
  fieldName: Yup.string().required('Required'),
  number: Yup.string().required('Required'),
})

type ItemFormValues = {
  fieldName: string
  number: string
  notes: string
}

interface ItemFormProps extends FormikConfig<ItemFormValues> {
  title: string
}

const ItemForm: React.FC<ItemFormProps> = ({ title, initialValues, onSubmit }) => {
  const history = useHistory()
  const { initials } = useUserContext().user!
  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={ItemValidation}
      onSubmit={onSubmit}
      >
      {() => (
        <Form className=" bg-white shadow-md rounded px-12 py-8 pt-8">
          <div className="pb-4">
            <h3 className="text-lg block">🌱 {title}</h3>
          </div>
          <div className="pb-4">
            <label className="text-sm block font-bold pb-2" htmlFor="number">Number</label>

            <Field id="number" name="number" component={({ field }: FieldProps) => (
              <div className="flex flex-wrap items-stretch w-full relative">
                <div className="flex -mr-px">
                  <span className="flex items-center leading-normal bg-grey-lighter rounded rounded-r-none border border-r-0 border-blue-300 px-3 whitespace-no-wrap text-grey-dark text-sm">{initials}</span>
                </div>	
                <input type="text" className="flex-shrink flex-grow flex-auto leading-normal w-px border h-10 border-blue-300 rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" {...field} />
              </div>	
            )} />
            </div>	
            
          <div className="pb-4">
            <label className="text-sm block font-bold pb-2" htmlFor="fieldName">Field Name</label>
            <Field id="fieldName" name="fieldName" autoCorrect="off" autoCapitalize="off" spellCheck="false" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300" />
          </div>

          <div className="pb-4">
            <label className="text-sm block font-bold pb-2" htmlFor="notes">Notes</label>
            <Field
              id="notes"
              name="notes"
              type="text"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
            />
          </div>
          <div className="pb-4 flex justify-between mt-2">
            <button type="button" className="border-2 border-gray-500 hover:bg-gray-500 hover:text-white text-gray-500 py-1 px-2 rounded focus:outline-none focus:shadow-outline" onClick={() => {
              history.goBack()
            }}>Cancel</button>
            <button type="submit" className="border-2 border-blue-500 hover:bg-blue-500 hover:text-white text-blue-500 py-1 px-2 rounded focus:outline-none focus:shadow-outline">Save</button>
          </div>
        </Form>
      )}
    </Formik>
)}

export default ItemForm