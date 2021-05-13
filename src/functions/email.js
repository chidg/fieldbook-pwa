const Mailgun = require("mailgun-js")

const sendEmail = async ({ user, data }) => {
  return new Promise((resolve, reject) => {
    const { MG_API_KEY: apiKey, MG_DOMAIN: domain } = process.env
    const mailgun = Mailgun({
      apiKey,
      domain,
    })

    const mailData = {
      from: "Fieldbook",
      to: user.email,
      subject: "Data from Fieldbook",
      text: JSON.stringify(data),
    }

    mailgun.messages().send(mailData, (err) => {
      if (err) return reject(err)

      resolve()
    })
  })
}

exports.handler = async (event) => {
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
      body: e.mssage,
    }
  }
}
