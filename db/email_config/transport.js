import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    host: process.env.HOST,
    port: process.env.PORT_EMAIL,
    secure: false,
    ignoreTLS: true,
    auth: {
        user: '',
        pass: '',
    },
})
