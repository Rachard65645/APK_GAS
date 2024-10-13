import axios from 'axios'
import { prisma } from '../../db/db_config/config.js'
import { STRATEGY } from '../../db/payments/paymentConfig.js'

const URL = 'https://api-checkout.cinetpay.com/v2/payment'

export const CreateOrder = async (req, res) => {
    const { product_id, quantity } = req.body
    const user_id = req.user.id
    try {
        const product = await prisma.products.findUnique({ where: { id: parseInt(product_id) } })

        if (!product) {
            res.status(400).json({ error: 'product not found' })
        }

        const user = await prisma.users.findUnique({ where: { id: parseInt(user_id) } })

        if (!product) {
            res.status(400).json({ error: 'user not found' })
        }

        const orderItem = await prisma.ordersItems.create({
            data: {
                products: {
                    connect: {
                        id: parseInt(product_id),
                    },
                },
                quantity: parseInt(quantity),
                aggregator: {
                    connect: {
                        id: 1,
                    },
                },
                orders: {
                    create: {
                        total_price: parseFloat(quantity * product.price),
                        status: 'EN_COURS',
                        payment_status: 'PENDING',
                        delivery_status: 'EN_ATTENTE',
                        user_id: parseInt(user.id),
                    },
                },
            },
            include: {
                aggregator: true,
            },
        })

        if (orderItem.quantity > product.stock) {
            await prisma.$transaction(async (prisma) => {
                const order = await prisma.ordersItems.findUnique({ where: { id: parseInt(orderItem.id) } })
                if (order) {
                    await prisma.ordersItems.delete({ where: { id: parseInt(orderItem.id) } })
                    await prisma.orders.delete({ where: { id: parseInt(orderItem.order_id) } })
                }
            })
            res.status(400).json({ error: 'quantity not possible plaese change' })
        }

        const strategy = orderItem.aggregator.strategy

        if (strategy == !STRATEGY.CINETPAY) {
            res.status(400).json({ error: 'not strategy' })
        }
        const data = JSON.stringify({
            apikey: process.env.HASH,
            site_id: process.env.ID,
            transaction_id: Math.floor(Math.random() * 100000000).toString(),
            amount: parseFloat(quantity * product.price),
            currency: 'XAF',
            description: 'TEST INTEGRATION',
            channels: 'ALL',
            customer_name: user.name,
            customer_email: user.email,
            customer_phone_number: user.phone,
            customer_address: user.address,
            customer_city: user.city,
            notify_url: 'https://localhost:8000/finance',
            return_url: 'https://8b9f-102-244-221-24.ngrok-free.app/api/docs',
        })
        const config = {
            method: 'post',
            url: URL,
            headers: {
                'Content-Type': 'application/json',
            },
            data: data,
        }

        const response = await axios(config)
        res.status(200).json(response.data)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}
