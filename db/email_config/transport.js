import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // assurez-vous que `secure` est `false` pour le port 587
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    },
    tls: {
        rejectUnauthorized: false, // ajout pour éviter les problèmes SSL si nécessaires
    },
})

// Test de la configuration
transporter.verify((error, success) => {
    if (error) {
        console.error("Erreur de configuration du transporteur :", error)
    } else {
        console.log("Serveur prêt pour envoyer des emails !")
    }
})
