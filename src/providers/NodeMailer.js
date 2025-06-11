const { ENV } = require('~/config/environment')
const nodemailer = require('nodemailer')

export const notifyAdmin = async (recipientEmail, customSubject, customHtmlContent) => {
  let transporter = nodemailer.createTransport({
    host: 'live.smtp.mailtrap.io',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'api', // generated ethereal user
      pass: ENV.MAILTRAP_KEY // generated ethereal password
    }
  })

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'liptwotrello@demomailtrap.co', // sender addres
    to: recipientEmail, // list of receivers
    subject: customSubject, // Subject line
    text: 'Liptwo Trello verify!!!', // plain text body
    html: customHtmlContent// html body
  })
  console. log('Message sent: %s', info.messageId)
}