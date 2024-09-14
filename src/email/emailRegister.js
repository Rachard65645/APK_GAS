import 'dotenv/config'
import ejs from 'ejs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { promisify } from 'util'
import { transporter } from '../../db/email_config/transport.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const renderFile = promisify(ejs.renderFile)

export const sendEmail = async (name, email, address) => {
    try {
        const templatePath = __dirname + '/template/registerMail.ejs'

        const htmlContent = await renderFile(templatePath, { name, email, address })

        const mailOptions = {
            from: {
                name: 'Allo GAS !',
                address: process.env.USER,
            },
            to: email,
            subject: 'Welcome',
            html: htmlContent,
        }

        const info = await transporter.sendMail(mailOptions)
        console.log('Email envoyé :', info.response)
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'email :", error)
    }
}
