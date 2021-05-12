import React from 'react'
import { v4 } from 'uuid'
import { Formik, Field, Form } from 'formik'
import * as Yup from 'yup';
import { useHistory, useParams } from "react-router-dom"
import {
  DataItem,
  useDataContext,
  useUserContext
} from "../contexts"

const ItemValidation = Yup.object().shape({
  fieldName: Yup.string().required('Required'),
  number: Yup.string().required('Required'),
})

const ItemForm: React.FC = (props) => {
  const history = useHistory()
  const { saveItem, data } = useDataContext()
  const [instance, setInstance] = React.useState<DataItem | undefined>(undefined)
  const [geoLocation, setGeoLocation] = React.useState<GeolocationPosition | undefined>(undefined)
  const { initials } = useUserContext().user!
  const { id: instanceId }: { id: string } = useParams()

  console.log('instance', instance)

  React.useEffect(() => {
    const item = instanceId ? data[instanceId] : undefined
    if (item) {
      setInstance(item)
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(setGeoLocation, console.error, { enableHighAccuracy: true });
    }
  }, [setGeoLocation, setInstance, data, instanceId])

  const initialValues = React.useMemo(() => {
    if (instance) return { fieldName: instance.fieldName, number: instance.number, notes: instance.notes }
    else return {
      fieldName: '',
      number: (Object.keys(data).length + 1).toString().padStart(3, '0'),
      notes: '',
    }
  }, [instance, data])

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      validationSchema={ItemValidation}
      onSubmit={(values) => {
        const location = instance ? instance.location : geoLocation?.coords
        const timestamp = instance ? instance.timestamp! : Date.now()
        const id = instanceId ? instanceId : v4()
        saveItem({ ...values, id, timestamp, location })
        history.replace('/')
      }}
      >
      {({ initialValues }) => (
        <Form className=" bg-white shadow-md rounded px-8 py-8 pt-8">
          <div className="px-4 pb-4">
            <h3 className="text-lg block">🌱 New Item</h3>
          </div>
          <div className="px-4 pb-4">
            <label className="text-sm block font-bold pb-2" htmlFor="number">Number</label>

            <Field id="number" name="number" 
              component={() => (
                <div className="flex flex-wrap items-stretch w-full relative">
                  <div className="flex -mr-px">
                    <span className="flex items-center leading-normal bg-grey-lighter rounded rounded-r-none border border-r-0 border-blue-300 px-3 whitespace-no-wrap text-grey-dark text-sm">{initials}</span>
                  </div>	
                  <input type="text" className="flex-shrink flex-grow flex-auto leading-normal w-px border h-10 border-blue-300 rounded rounded-l-none px-3 relative focus:border-blue focus:shadow" defaultValue={initialValues.number} />
                </div>	
              )} />
            </div>	
            
          <div className="px-4 pb-4">
            <label className="text-sm block font-bold pb-2" htmlFor="fieldName">Field Name</label>
            <Field id="fieldName" name="fieldName" className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300" />
          </div>

          <div className="px-4 pb-4">
            <label className="text-sm block font-bold pb-2" htmlFor="notes">Notes</label>
            <Field
              id="notes"
              name="notes"
              type="text"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
            />
          </div>
          <div className="px-4 pb-4 flex justify-between">
            <button type="button" className="bg-white border-blue-500 border-solid hover:bg-orange-300 text-blue-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => {
              history.goBack()
            }}>Cancel</button>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Submit</button>
          </div>
        </Form>
      )}
    </Formik>
)}

export default ItemForm