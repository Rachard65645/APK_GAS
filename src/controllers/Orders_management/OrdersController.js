import { prisma } from '../../../db/db_config/config.js';
import { STRATEGY } from '../../utils/utils.js';
import { Payment } from '../Payment_management/monetBil.js';

export const createOrder = async (req, res) => {
    const { quantity, gasBottle_id, aggregator_method_id } = req.body;
    const userId = req.user.id; 
    const storeId = req.params.id;

    if (!gasBottle_id || typeof gasBottle_id !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing gasBottle_id' });
    }

    try {

        const aggregator_method = await prisma.aggregatorMethods.findUnique({
            where: { id: aggregator_method_id },
        });

        if (!aggregator_method) {
            return res.status(404).json({ error: 'Aggregator method does not exist.' });
        }

        
        const bottle = await prisma.gasBottles.findUnique({
            where: { id: gasBottle_id },
        });

        if (!bottle) {
            return res.status(404).json({ error: 'Gas bottle does not exist.' });
        }

        
        const parsedQuantity = parseInt(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be a positive integer.' });
        }

        
        const user = await prisma.users.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        
        const store = await prisma.stores.findUnique({ where: { id: storeId } });
        if (!store) {
            return res.status(404).json({ error: 'Store not found.' });
        }

        
        const stock = await prisma.stocks.findFirst({
            where: {
                gasBottle_id: gasBottle_id,
                store_id: storeId,
            },
        });

        if (!stock || stock.quantity < parsedQuantity) {
            return res.status(400).json({ error: 'Insufficient stock available.' });
        }

        const price = stock.price;

        
        const order = await prisma.orders.create({
            data: {
                user_id: userId,
                store_id: storeId,
                status: 'pending',
            },
        });

    
        const orderItem = await prisma.orderItems.create({
            data: {
                price: parseInt(price) * parsedQuantity,
                orders: {
                    connect: {
                        id: order.id,
                    },
                },
                gasBottles: {
                    connect: {
                        id: gasBottle_id,
                    },
                },
                quantity: parsedQuantity,
                AggregatorMethods: {
                    connect: {
                        id: aggregator_method_id,
                    },
                },
            },
            include: {
                AggregatorMethods: {
                    include: {
                        agregatorServices: {
                            include: {
                                aggregators: {
                                    select: {
                                        strategy: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        
        await prisma.stocks.update({
            where: { id: stock.id },
            data: { quantity: stock.quantity - parsedQuantity },
        });

        
        const transaction = await prisma.transaction.create({
            data: {
                users: {
                    connect: {
                        id: userId,
                    },
                },
                amount: parsedQuantity * price,
                status: 'init',
                message: 'Transaction initiated.',
                code: 'code',
                type: ''
            },
        });

        
        const strategy = orderItem.AggregatorMethods.agregatorServices.aggregators.strategy;

        switch (strategy) {
            case STRATEGY.MONETBIL:
                await Payment(req, res, orderItem?.price)
                break;

            default:
                return res.status(400).json({ error: `Unsupported strategy: ${strategy}` });
        }

        
        await prisma.waittingWebhook.create({
            data: {
                transaction_id: transaction.id,
                aggregatorMethod_id: orderItem.AggregatorMethods.id,
                session: 'some_session_value', 
            },
        });

        

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};









