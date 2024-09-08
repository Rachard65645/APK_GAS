import nodemailer from 'nodemailer'
import 'dotenv/config'


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

export const info = async (email, name) => {
    try {
        await transporter.sendMail({
            from: process.env.USER,
            to: email, 
            subject: 'Allo Gas', 
            html: ''
        })
    } catch (err) {
        console.log('not send')
    }

}
