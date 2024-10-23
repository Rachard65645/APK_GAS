import { prisma } from '../../../db/db_config/config.js'

export const Create = async(req,res) => {
    try {
        const { quantity, price, gasBottle_id } = req.body
        const store_id = req.params.id

        const store = await prisma.stores.findUnique({ where: { id: store_id } })

        if (!store) {
            return res.status(500).json({ error: 'store not found' })
        }

        const stock = await prisma.stocks.create({
            data: {
              quantity,
              price,
              store_id: store_id,
              gasBottles: {
                
              }  
            },
        })
    } catch (err) {}
}
