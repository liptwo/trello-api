const brevo = require('@getbrevo/brevo')
import { ENV } from '~/config/environment'

let apiInstance = new brevo.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
apiKey.apiKey = ENV.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, customHtmlContent) => {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.sender = { 
      email: ENV.ADMIN_EMAIL_BREVO,
      name: ENV.ADMIN_NAME_BREVO
    };
    sendSmtpEmail.to = [{ email: recipientEmail }];
    sendSmtpEmail.subject = customSubject;
    sendSmtpEmail.htmlContent = customHtmlContent;

    console.log('Sending email with payload:', JSON.stringify(sendSmtpEmail, null, 2));
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Brevo API response:', response)
    return response;
  } catch (error) {
    console.error('Brevo API error details:', {
      status: error.status,
      response: error.response?.body,
      headers: error.response?.headers
    })
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

export const BrevoProvider = {
  sendEmail
}


