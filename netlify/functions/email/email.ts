import { Handler } from "@netlify/functions"
import formData from "form-data"
import Mailgun, { MailgunMessageData } from "mailgun.js"
import { createObjectCsvStringifier } from "csv-writer"
import config from "@/config.json"

const RECIPENT_EMAIL = process.env.DATA_RECIPIENT_EMAIL

const mailgun = new Mailgun(formData)

export interface DataItem {
  id: string
  taxon: keyof typeof config.taxa
  otherTaxon?: string
  idConfidence: number
  notes: string
  density: keyof typeof config.densities
  controlled?: boolean
  size: keyof typeof config.sizes
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
    const MG_API_KEY = process.env.MG_API_KEY
    const MG_DOMAIN = process.env.MG_DOMAIN

    if (!MG_API_KEY) return reject(new Error("No API Key provided"))
    if (!MG_DOMAIN) return reject(new Error("No Mailgun Domain provided"))

    const mg = mailgun.client({
      username: "api",
      key: MG_API_KEY,
    })

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "recorder", title: "Recorder" },
        { id: "taxon", title: "Species" },
        { id: "otherTaxon", title: "Species - Other" },
        { id: "idConfidence", title: "ID Confidence" },
        { id: "density", title: "Density" },
        { id: "size", title: "Size" },
        { id: "controlled", title: "Controlled" },
        { id: "notes", title: "Notes" },
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
        recorder: user.name,
        recorderEmail: user.email,
        taxon: item.taxon ? config.taxa[item.taxon] : "",
        otherTaxon: item.otherTaxon ? item.otherTaxon : "",
        idConfidence: config.idConfidenceLevels[item.idConfidence] ?? "",
        density: item.density ? config.densities[item.density] : "",
        size: item.size ? config.sizes[item.size] : "",
        latitude: item.location?.latitude ? item.location?.latitude : "",
        longitude: item.location?.longitude ? item.location?.longitude : "",
      }
    })

    const mailData: MailgunMessageData = {
      from: `Fieldbook <${process.env.FROM_EMAIL}>`,
      to: [RECIPENT_EMAIL ?? ""],
      subject: "Data from Fieldbook",
      text: dontIndent(`Hi, \n
      Here's some fresh data for from ${user.name}'s latest work with Fieldbook. \n\n
      Enjoy! \n
      🌱 \n\n
      `),
      attachment: [
        {
          data: Buffer.from(
            csvStringifier.getHeaderString() +
              csvStringifier.stringifyRecords(records)
          ),
          filename: `fieldbook-${user.email}-${Date.now()}.csv`,
        },
      ],
    }

    return mg.messages.create(MG_DOMAIN, mailData).then(resolve).catch(reject)
  })
}

const sendSuccessEmail = async ({
  user,
}: {
  user: { email: string; name: string }
}) => {
  return new Promise((resolve, reject) => {
    const MG_API_KEY = process.env.MG_API_KEY
    const MG_DOMAIN = process.env.MG_DOMAIN

    if (!MG_API_KEY) return reject(new Error("No API Key provided"))
    if (!MG_DOMAIN) return reject(new Error("No Mailgun Domain provided"))

    const mg = mailgun.client({
      username: "api",
      key: MG_API_KEY,
    })

    const mailData: MailgunMessageData = {
      from: `Fieldbook <${process.env.FROM_EMAIL}>`,
      to: [user.email ?? ""],
      subject: "Thanks from NCMRR",
      text: dontIndent(`Hi ${user.name}, \n
      Thank you for submitting valuable weed data via the Fieldbook App. This is a quick message to confirm that your data has been received for processing by Nature Conservation Margaret River Region. It is now safe to 'Clear all data' so that you are ready to report on new weeds. \n\n
      If you would like to learn more about identifying priority weeds in our region and how to manage them on your property, please explore the Nature Conservation Knowledge Hub for free online resources at https://natureconservation.org.au/resources/.
      \n\n`),
    }

    return mg.messages.create(MG_DOMAIN, mailData).then(resolve).catch(reject)
  })
}

const handler: Handler = async (event) => {
  try {
    if (!event.body) throw new Error("No email body provided")
    const { data, user } = JSON.parse(event.body)

    await sendEmail({ data, user })
    await sendSuccessEmail({ user })
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Email sent successfully",
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
