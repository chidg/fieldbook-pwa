import { Handler } from "@netlify/functions"
import FormData from "form-data"
import Mailgun, { MailgunMessageData } from "mailgun.js"

import { createObjectCsvStringifier } from "csv-writer"

const mailgun = new Mailgun(FormData)

const RECIPIENT_EMAIL = "data@natureconservation.org.au"

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

const apiKey = process.env.MG_API_KEY
if (!apiKey) throw new Error("No mailgun api key present")
const mgDomain = process.env.MG_DOMAIN
if (!mgDomain) throw new Error("No mailgun domain present")

const sendEmail = async ({ user, data }: { user: any; data: DataItem[] }) => {
  return new Promise((resolve, reject) => {
    const mg = mailgun.client({
      username: "api",
      key: apiKey,
    })

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "taxon", title: "Species" },
        { id: "density", title: "Density" },
        { id: "notes", title: "Notes" },
        { id: "latitude", title: "Latitude" },
        { id: "longitude", title: "Longitude" },
        { id: "date", title: "Date" },
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

    const mailData: MailgunMessageData = {
      from: `Fieldbook <${process.env.FROM_EMAIL}>`,
      to: [RECIPIENT_EMAIL],
      subject: "Data from Fieldbook",
      text: dontIndent(`Hi, \n
      Here's some fresh data sent from ${user.name}'s latest work with Fieldbook. \n\n
      To get in touch with ${user.name}, you can email them at ${user.email}. \n\n
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

    return mg.messages.create(mgDomain, mailData).then(resolve).catch(reject)
  })
}

const handler: Handler = async (event) => {
  try {
    if (!event.body) throw new Error("No data in event")
    const { data, user } = JSON.parse(event.body)

    await sendEmail({ data, user })

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data export sent successfully",
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
