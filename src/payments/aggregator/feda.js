import { Transaction } from 'fedapay'
import { prisma } from '../../../db/db_config/config.js'

export const feda = async (req, res) => {
    const user_id = req.user.id
    try {
        const user = await prisma.users.findUnique({
            where: {id: parseInt(user_id)},
        })
        const transactions = await Transaction.create({
            description: 'Description',
            amount: 2000,
            callback_url: 'https://maplateforme.com/callback',
            currency: {
                iso: 'XOF',
            },
            customer: {
                firstname: user.name,
                email: user.email,
                phone_number: {
                    number: '97808080',
                    country: 'BJ'
                }
            }
        })
        const token = await transactions.generateToken()
       
        res.status(200).json(token)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}
