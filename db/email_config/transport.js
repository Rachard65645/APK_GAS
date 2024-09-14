import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    service: 'gmail',

    auth: {
        user: 'richardhemba55@gmail.com',
        pass: 'e g h o h g z v k r v m l k c g',
    },
})
