import nodeMailer from 'nodeMailer'
import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAILAPPGMAIL,
    pass: process.env.PASSAPPGMAIL
  }
}

export const sendMail = async ({email, subject, html}) => {

  const msgConfig = {
    from: process.env.EMAILAPPGMAIL,
    to: email,
    subject,
    html
  }
  const transporter = nodeMailer.createTransport(config);
  try {
    const info = await transporter.sendMail(msgConfig)
    return info
  } catch (error) {
    console.log(error)
  }
  

}