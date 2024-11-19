import axios from 'axios'
import { prisma } from '../../../db/db_config/config.js'

const BASE_URL = process.env.MONETBIL_BASE_URL
const SERVICE_ID = process.env.MONETBIL_SERVICE_ID
const VERSION = process.env.MONETBIL_VERSION


export const Payment = async (req, res, amount) => {
    const user_id = req.user.id

    try {
        const user = await prisma.users.findUnique({ where: { id: user_id } })
        if (!user) {
            return res.status(400).json({error: 'user not found'})
        }
        const response = await axios.post(`${BASE_URL}${VERSION}/${SERVICE_ID}`, {
            phone: user.phone,
            email: user.email,
            amount: amount,
            payment_ref: '',
            locale: 'fr',
            currency: 'XAF',
            country: 'CM',
            first_name: user.name,

        })         

        res.status(200).json(response.data)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}
