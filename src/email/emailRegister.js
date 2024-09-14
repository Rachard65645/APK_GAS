import 'dotenv/config'
import ejs from 'ejs'
import nodemailer from 'nodemailer'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { promisify } from 'util'

const __dirname = dirname(fileURLToPath(import.meta.url))

const renderFile = promisify(ejs.renderFile)

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    },
})

export const sendEmail = async (name, email, address) => {
    try {
        const templatePath = __dirname + '/template/registerMail.ejs'

        const htmlContent = await renderFile(templatePath, { name, email, address })

        const mailOptions = {
            from: {
                name: 'Rich',
                address: process.env.USER,
            },
            to: email,
            subject: 'Allo GAS !',
            html: htmlContent,
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('Email envoyé :', info.response)
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error)
    }
}
