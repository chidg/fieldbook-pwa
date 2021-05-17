import { Handler } from "@netlify/functions"
import formData from "form-data"
import Mailgun from "mailgun.js"
const mailgun = new Mailgun(formData)

const sendEmail = async ({ user, data }) => {
  return new Promise((resolve, reject) => {
    const mg = mailgun.client({ username: "api", key: process.env.MG_API_KEY })

    const mailData = {
      from: `Fieldbook <${process.env.FROM_EMAIL}>`,
      to: [user.email],
      subject: "Data from Fieldbook",
      text: JSON.stringify(data),
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
