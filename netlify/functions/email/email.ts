import { Handler } from "@netlify/functions"
import formData from "form-data"
import Mailgun from "mailgun.js"
import { createObjectCsvStringifier } from "csv-writer"

const mailgun = new Mailgun(formData)

export interface DataItem {
  id: string
  taxon: string
  density: string
  notes: string
  location?: GeolocationCoordinates
  date: string
  time: string
}

function dontIndent(str: string): string {
  return ("" + str).replace(/(\n)\s+/g, "$1")
}

const sendEmail = async ({
  user,
  data,
}: {
  user: { email: string; name: string }
  data: DataItem[] | Record<string, DataItem>
}) => {
  return new Promise((resolve, reject) => {
    const mg = mailgun.client({
      username: "api",
      key: import.meta.env.VITE_APP_MG_API_KEY,
    })

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "number", title: "Number" },
        { id: "recorder", title: "Recorder" },
        { id: "taxon", title: "Species" },
        { id: "density", title: "Density" },
        { id: "notes", title: "Notes" },
        { id: "locationDescription", title: "Location Description" },
        { id: "latitude", title: "Latitude" },
        { id: "longitude", title: "Longitude" },
        { id: "date", title: "Date" },
        { id: "time", title: "Time" },
      ],
    })

    const dataArray = Array.isArray(data) ? data : Object.values(data)

    const records = dataArray.map((item) => {
      return {
        ...item,
        recorder: user.email,
        taxon: item.taxon ? item.taxon : "",
        density: item.density ? item.density : "",
        latitude: item.location?.latitude ? item.location?.latitude : "",
        longitude: item.location?.longitude ? item.location?.longitude : "",
      }
    })

    const mailData = {
      from: `Fieldbook <${process.env.FROM_EMAIL}>`,
      to: [user.email],
      subject: "Data from Fieldbook",
      text: dontIndent(`Hi, \n
      Here's some fresh data for from ${user.name}'s latest work with Fieldbook. \n\n
      Enjoy! \n
      🌱
      `),
      attachment: [
        {
          data:
            csvStringifier.getHeaderString() +
            csvStringifier.stringifyRecords(records),
          filename: `fieldbook-${user.email}-${Date.now()}.csv`,
        },
      ],
    }

    return mg.messages
      .create(import.meta.env.VITE_APP_MG_DOMAIN, mailData)
      .then(resolve)
      .catch(reject)
  })
}

const handler: Handler = async (event) => {
  try {
    if (!event.body) throw new Error("No email body provided")
    const { data, user } = JSON.parse(event.body)

    await sendEmail({ data, user })

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Let's become serverless conductors!!!",
      }),
    }
  } catch (e) {
    console.log(e)
    return {
      statusCode: 500,
      body: (e as Error).message,
    }
  }
}

module.exports = { handler }
