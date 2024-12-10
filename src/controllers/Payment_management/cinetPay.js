import axios from "axios";
import { prisma } from "../../../db/db_config/config.js";

 const BASE_URL = process.env.CINETPAY_URL
 const APIKEY = process.env.CINETPAY_API_KEY
 const SITEId = process.env.CINETPAY_SITE_ID

export const PaymentCinet = async (req, res, amount, transaction_id) => {
    const userId = req.user.id 
    try {
        const user = await prisma.users.findUnique({where: {id: userId}})

        if (!user) {
            return res.status(400).json({error: 'user not found'})
        }

        const response = await axios.post(`${BASE_URL}`, {
            apikey: APIKEY,
            site_id: SITEId,
            transaction_id: transaction_id,
            amount: amount,
            currency: 'XAF',
            description: 'description',
            notify_url : 'https://localhost:8000/api',
            return_url: 'https://localhost:8000/api',
            channels: 'MOBILE_MONEY',
            customer_name: user.name,
            customer_surname: user.name,
            customer_phone_number : user.phone,
            customer_email: user.email,
            customer_address: user.address,
            customer_country: 'CM'


        })  

        res.status(200).json(response.data)

    } catch (err) {
        res.status(500).json({error: err.message})
    }
}