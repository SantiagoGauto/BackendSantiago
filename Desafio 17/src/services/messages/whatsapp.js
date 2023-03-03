import twilio from "twilio";

const accountId = "AC5bbba5597b0a4ef0221961dcc48cf0e0";
const tokenTwilio = "3a29f676f910df94065b67d30e2cad0d";


const twilioWhatsappPhone = "whatsapp:+14155238886";
const adminWhatsappPhone = "whatsapp:+5492604632416";

const twilioClient = twilio(accountId, tokenTwilio);

export {twilioClient, twilioWhatsappPhone, adminWhatsappPhone};