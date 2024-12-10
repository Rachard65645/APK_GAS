import { prisma } from '../../../db/db_config/config.js';
import { STRATEGY, TransactionType } from '../../utils/utils.js';
import { PaymentCinet } from '../Payment_management/cinetPay.js';
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
        if (!price || price <= 0) {
            return res.status(400).json({ error: 'Invalid stock price.' });
        }

        const order = await prisma.orders.create({
            data: {
                user_id: userId,
                store_id: storeId,
                status: 'pending',
            },
        });

        const orderItem = await prisma.orderItems.create({
            data: {
                price: price * parsedQuantity,
                orders: { connect: { id: order.id } },
                gasBottles: { connect: { id: gasBottle_id } },
                quantity: parsedQuantity,
                AggregatorMethods: { connect: { id: aggregator_method_id } },
            },
            include: {
                AggregatorMethods: {
                    include: {
                        agregatorServices: {
                            include: {
                                aggregators: { select: { strategy: true } },
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
                users: { connect: { id: userId } },
                amount: parsedQuantity * price,
                status: 'init',
                message: 'Transaction initiated.',
                code: 'code',
                type: TransactionType.ACHAT,
            },
        });

        const strategy = orderItem.AggregatorMethods.agregatorServices.aggregators.strategy;

        try {
            switch (strategy) {
                case STRATEGY.MONETBIL:
                    await Payment(req, res, orderItem?.price);
                    break;
                case STRATEGY.CINETPAY:
                    await PaymentCinet(req, res, orderItem?.price, transaction.id);
                    break;
                default:
                    throw new Error(`Unsupported strategy: ${strategy}`);
            }
        } catch (paymentError) {
            console.error('Payment error:', paymentError);
            return res.status(500).json({ error: 'Failed to process payment.' });
        }

        const session = `session_${Date.now()}`;
        await prisma.waittingWebhook.create({
            data: {
                transaction_id: transaction.id,
                aggregatorMethod_id: orderItem.AggregatorMethods.id,
                session,
            },
        });

        

    } catch (err) {
        console.error('Error creating order:', err.message, err.stack);
        res.status(500).json({ error: 'An error occurred while processing your order.' });
    }
};



export const orderUser = async (req, res) => {
    const user_id = req.user.id
    try {
        const user = await prisma.users.findUnique({where: {id: user_id}})
        if (!user) {
            return res.status(400).json({error: 'user not found'})
        }
        const orders = await prisma.orders.findMany({where: {user_id: user.id}, 
        select: {
            status:true,
            stores: {
                select: {
                    name: true,
                    address: true,
                    city: true,
                }
            },
            OrderItems: {
                select: {
                    gasBottles: {
                        select: {
                            gasStations: {
                                select: {
                                    name: true
                                }
                            },
                            bottlesCategories: {
                                select: {
                                    weigth: true
                                }
                            }
                        }
                    },
                    price: true,
                    quantity: true
                }
            }
        }
        })

        res.status(200).json(orders)

    } catch (err) {
        res.status(400).json({error: err.message})
    }
}


export const orderStore = async (req, res) => {
    const id = req.params.id
    try {
        const store = await prisma.stores.findUnique({where: {id: id}})
        if (!store) {
            return res.status(400).json({error: 'store not found'})
        }
        const orders = await prisma.orders.findMany({where: {store_id: store.id}, 
        select: {
            status:true,
            users: {
                  select: {
                    name: true,
                    phone: true,
                    address: true
                  }
            },
            OrderItems: {
                select: {
                    gasBottles: {
                        select: {
                            gasStations: {
                                select: {
                                    name: true
                                }
                            },
                            bottlesCategories: {
                                select: {
                                    weigth: true
                                }
                            }
                        }
                    },
                    price: true,
                    quantity: true
                }
            }
        }
        })

        res.status(200).json(orders)

    } catch (err) {
        res.status(400).json({error: err.message})
    }
}