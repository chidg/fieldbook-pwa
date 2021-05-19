import { Handler } from "@netlify/functions"
import formData from "form-data"
import Mailgun from "mailgun.js"
import { createObjectCsvStringifier } from "csv-writer"

const mailgun = new Mailgun(formData)

const sendEmail = async ({ user, data }) => {
  return new Promise((resolve, reject) => {
    const mg = mailgun.client({ username: "api", key: process.env.MG_API_KEY })

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: "number", title: "Number" },
        { id: "fieldName", title: "Field Name" },
        { id: "notes", title: "Notes" },
        { id: "location", title: "Location" },
        { id: "time", title: "Time" },
      ],
    })

    const records = Object.keys(data).map((key) => {
      const item = data[key]
      return {
        ...item,
        number: `${user.initials}${item.number}`,
        location:
          item.location && Object.keys(item.location).length > 0
            ? `${item.location?.latitude}, ${item.location?.longitude}`
            : "",
        time: new Date(item.timestamp).toLocaleString(),
      }
    })

    const mailData = {
      from: `Fieldbook <${process.env.FROM_EMAIL}>`,
      to: [user.email],
      subject: "Data from Fieldbook",
      text: JSON.stringify(data),
      attachment: [
        {
          data:
            csvStringifier.getHeaderString() +
            csvStringifier.stringifyRecords(records),
          filename: `fieldbook-${user.initials}-${Date.now()}.csv`,
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
