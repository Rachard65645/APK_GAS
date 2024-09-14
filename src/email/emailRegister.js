import 'dotenv'
import ejs from 'ejs'
import { transporter } from '../../db/email_config/transport.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const sendEmail = async (name, email, adress) => {
    ejs.renderFile(__dirname + '/template/registerMail.ejs', { name, email, adress }, (err, data) => {
        if (err) {
            console.log(err)
        } else {
            var mailOption = {
                from: process.env.USER,
                to: email,
                subject: 'Allo Gas',
                html: data,
            }

            transporter.sendMail(mailOption, (error, info) => {
                if (error) {
                    console.log(error)
                }
                console.log('success')
            })
        }
    })
}
