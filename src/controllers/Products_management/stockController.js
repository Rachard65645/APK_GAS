import { prisma } from '../../../db/db_config/config.js'

export const Create = async(req,res) => {
    try {
        const { quantity, price, gasBottle_id } = req.body
        const store_id = req.params.id

        const store = await prisma.stores.findUnique({ where: { id: store_id } })

        if (!store) {
            return res.status(404).json({ error: 'store not found' })
        }

        const bottle = await prisma.gasStation.findUnique({
            where: { id: gasBottle_id },
        })

        if (!bottle) {
            return res.status(404).json({ error: 'bottle does not exist !!' })
        }

        const stock = await prisma.stocks.create({
            data: {
              quantity,
              price,
              store_id: store_id,
              gasBottle_id, 
            },
        })

        res.status(200).json(stock)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}




//"http://192.168.1.77:4000/api/uploads/undefined_1729416738223.png"