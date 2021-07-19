import { Handler } from "@netlify/functions"
import formData from "form-data"
import Mailgun from "mailgun.js"

import { createObjectCsvStringifier } from "csv-writer"

const mailgun = new Mailgun(formData)

export interface DataItem {
  id: string
  taxon: string
  notes: string
  density: number
  location?: GeolocationCoordinates
  timestamp: number
  date: string
  time: string
}

function dontIndent(str: string): string {
  return ("" + str).replace(/(\n)\s+/g, "$1")
}

const sendEmail = async ({ user, data }: { user: any; data: DataItem[] }) => {
  return new Promise((resolve, reject) => {
    const mg = mailgun.client({ username: "api", key: process.env.MG_API_KEY })

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "taxon", title: "Species" },
        { id: "density", title: "Density" },
        { id: "notes", title: "Notes" },
        { id: "latitude", title: "Latitude" },
        { id: "longitude", title: "Longitude" },
        { id: "date", title: "Time" },
        { id: "time", title: "Time" },
      ],
    })

    const records = data.map((item) => {
      return {
        ...item,
        latitude: item.location?.latitude ? item.location?.latitude : "",
        longitude: item.location?.longitude ? item.location?.longitude : "",
      }
    })

    const mailData = {
      from: `Fieldbook <${process.env.FROM_EMAIL}>`,
      to: [user.email],
      subject: "Data from Fieldbook",
      text: dontIndent(`Hi ${user.name}, \n
      Here's some fresh data for you from your latest work with Fieldbook. \n\n
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
      .create(process.env.MG_DOMAIN, mailData)
      .then(resolve)
      .catch(reject)
  })
}

const handler: Handler = async (event) => {
  try {
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
      body: e.message,
    }
  }
}

module.exports = { handler }
