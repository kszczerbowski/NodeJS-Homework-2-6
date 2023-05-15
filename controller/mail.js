import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = (addressee, link = "mylink.com") => {
  return {
    to: addressee,
    from: "kszczerbowski223@gmail.com",
    subject: "Please verify you e-mail address",
    text: `Please click on this link to verify your e-mail: ${link}`,
    html: `<strong>Please click on this link to verify your e-mail: ${link}</strong>`,
  };
};

export { sgMail, msg };
