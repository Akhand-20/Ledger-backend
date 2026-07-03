import { configDotenv } from "dotenv";
configDotenv();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    // type: 'OAuth2',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
    // clientId: process.env.CLIENT_ID,
    // clientSecret: process.env.CLIENT_SECRET,
    // refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export async function sendRegisterationEmail(userEmail,username){
    const subject= 'Welcome to our app';
    const text=`Hello ${username},\n\n Thank You for registering.`
    const html=`<p>Hello ${username}</p><p>Thank You for registering.</p>`

    await sendEmail(userEmail,subject,text,html);
}

//for successful transaction
export async function sendTransactionEmail(userEmail,username,amount,toAccount){
    const subject = `₹${amount} Transfer Successful`;

    const text = `Hello ${username},\n\nWe are pleased to inform you that your transaction was completed successfully.\n\nAmount: ₹${amount}\nRecipient: ${toAccount}\n\nThank you for using Ledger App.`;

    const html = `
        <p>Hello ${username},</p>
        <p>We are pleased to inform you that your transaction was completed successfully.</p>
        <ul>
            <li><strong>Amount:</strong> ₹${amount}</li>
            <li><strong>Recipient:</strong> ${toAccount}</li>
        </ul>
        <p>Thank you for using Ledger App.</p>
    `;
    await sendEmail(userEmail,subject,text,html)
}
//for failure of trasaction
export async function sendTransactionFailureEmail(userEmail, username, amount, toAccount) {
    const subject = `₹${amount} Transfer Failed`;

    const text = `Hello ${username},\n\nUnfortunately your transaction of ₹${amount} to ${toAccount} could not be completed.\n\nPlease try again or contact support.\n\nThank you for using Ledger App.`;

    const html = `
        <p>Hello ${username},</p>
        <p>Unfortunately your transaction could not be completed.</p>
        <ul>
            <li><strong>Amount:</strong> ₹${amount}</li>
            <li><strong>Recipient:</strong> ${toAccount}</li>
        </ul>
        <p>Please try again or contact support.</p>
        <p>Thank you for using Ledger App.</p>
    `;

    await sendEmail(userEmail, subject, text, html);
}