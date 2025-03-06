import { prisma } from '../../../db/db_config/config.js'

export const Create = async (req, res) => {
    const { quantity, price, gasBottle_id } = req.body;
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ error: "Store ID is required" });
    }

    try {
        const store = await prisma.stores.findUnique({ where: { id } });

        if (!store) {
            return res.status(404).json({ error: "Store not found" });
        }

        const stock = await prisma.stocks.create({
            data: {
                quantity,
                price,
                store_id: store.id,
                gasBottle_id,
            },
        });

        res.status(200).json(stock);
    } catch (err) {
        res.status(500).json({ error: "An error occurred: " + err.message });
    }
};

export const findStocks = async(req, res) => {
    const id = req.params.id
    try {

        const store = await prisma.stores.findUnique({where: {id}})

        if (!store) {
            return res.status(400).json({error: 'store not found'})
        }

        const stocks = await prisma.stocks.findMany(
            {
                where: {store_id: store.id},
                select: {
                    quantity: true,
                    price: true,
                    stores: {
                        select: {
                            name: true,
                        }
                    },
                    gasBottles: {
                        select: {
                            image: true,
                            bottlesCategories: {
                                select: {
                                    weigth: true,
                                    brand: true
                                }
                            },
                            gasStations: {
                                select: {
                                    name: true,
                                }
                            }
                        }
                    }
                }
            }
        )
        res.status(200).json(stocks);
    } catch (err) {
        res.status(500).json({ error: "An error occurred: " + err.message });
    }
}


