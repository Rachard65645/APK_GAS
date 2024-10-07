import { prisma } from '../../../db/db_config/config.js'
import { feda } from '../aggregator/feda.js'

export const subscribe = async (req, res) => {
    const currentUseruser = req.user.id
    const { order_id, aggregatorMethod_id } = req.body
    try {
        const order = await prisma.orders.findUnique({ where: { id: parseInt(order_id) } })
        if (!order) {
            res.status(400).json({ error: 'not order' })
        }
        const aggregatorMethod = await prisma.aggregatorMethods.findUnique({
            where: { id: parseInt(aggregatorMethod_id) },
        })
        if (!aggregatorMethod) {
            res.status(400).json({ error: 'not aggregator' })
        }
        const subscribe = await prisma.subscribes.create({
            data: {
                aggregatorMethods: {
                    connect: { id: parseInt(aggregatorMethod_id) },
                  },
                transactions: {
                    create: {
                        user_id: currentUseruser,
                        amount: parseFloat(order.total_price),
                        status: 'INIT',
                        type: 'ACHAT',
                    },
                },
                orders: {
                    connect: { id: parseInt(order_id) },
                  },
            },
            include:{
                aggregatorMethods: {
                    include: {
                       aggregator:{
                        include:{
                            aggregator:true
                        }
                       }
                    }
                }
            }
        })    
        const strategy = subscribe.aggregatorMethods.aggregator.aggregator.strategy
        switch (strategy) {
            case 'FIDA':
                await feda(req, res)
                break
        }
        const webhook = await prisma.waitingWebhook.create({
            data: {
                transaction_id: parseInt(subscribe.transaction_id),
                session: parseInt(order_id),
                aggregatorMethod_id: parseInt(aggregatorMethod_id),
            },
        })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}
