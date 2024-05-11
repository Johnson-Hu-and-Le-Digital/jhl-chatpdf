// pages/api/contact.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import * as nodemailer from 'nodemailer';
// import SMTPTransport from "nodemailer";

// Nodemailer docs: // https://nodemailer.com/about/
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // https://nodemailer.com/smtp/
  const transporter = nodemailer.createTransport({
    // service: 'smtp',
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: false, // use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  } as nodemailer.TransportOptions);

  // // verify connection configuration
  // transporter.verify(function (error, success) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Server is ready to take our messages");
  //   }
  // });


  // const { name, email, message } = req.body;
  // if (!message || !name || !message) {
  //   return res
  //     .status(400)
  //     .json({ message: 'Please fill out the necessary fields' });
  // }

  console.log(req.body);

  const { yourname, phonenumber, email, interested_engaging, otherMessage } = req.body;

  // console.log('yourname', yourname);
  // console.log('phonenumber', phonenumber);
  // console.log('email', email);
  // console.log('interested_engaging', interested_engaging);
  // console.log('otherMessage', otherMessage);


  function commaSeparatedStringToArray(str: string): string[] {
    return str.split(',').map((item) => item.trim()) as string[];
  }

  const interested_engaging_Array = commaSeparatedStringToArray(interested_engaging);
  interested_engaging_Array.sort((a, b) => a.localeCompare(b));

  let interested_engaging_html = '';
  interested_engaging_Array.forEach((item) => {
    interested_engaging_html = interested_engaging_html+item+'<br>';
  });

  let html = `<p>Dear Admin,</p>
      <p>I user has just submitted the engaging form, details as following:</p>
      <p>Name: ${yourname}<br>
      Phone: ${phonenumber}<br>
      Email: ${email}<br>
      </p>
      <p>I am interested in engaging JHL for:<br>
      ${interested_engaging_html}</p>
      <p>Other:<br>
      ${otherMessage}</p>
      <p>JHL Formula System notification</p>`;
  // https://nodemailer.com/message/#common-fields
  const mailData = {
    from: process.env.SMTP_FROM,
    to: process.env.CONTACT_EMAIL,
    subject: process.env.CONTACT_SUBJECT,
    // text: `${message} | Sent from: ${email}`,
    html: html,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailData, (err: Error | null, info) => {
      if (err) {
        reject(err);
        return res
          .status(500)
          .json({ error: err.message || 'Something went wrong' });
      } else {
        // resolve(info.accepted);
        res.status(200).json({ message: 'Message sent!' });
      }
    });
  });

  return;
}
