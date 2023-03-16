import nodemailer from 'nodemailer';


const testMail = 'kenny81@ethereal.email';
const testPass = 'Dd2xTPnd1qgweR6DPF';

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: testMail,
        pass: testPass
    },
    secure:false,
    tls:{
        rejectUnauthorized:false
    }
});

export {transporter, testMail};