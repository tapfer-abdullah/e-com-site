import nodemailer from "nodemailer";
const { NODEMAILER_PASS, EMAIL_ADDRESS } = process.env;

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_ADDRESS,
        pass: NODEMAILER_PASS,
    }
})
