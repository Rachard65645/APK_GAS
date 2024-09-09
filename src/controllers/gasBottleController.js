import { prisma } from "../../db/db_config/config.js"


export const createBottle = async (req, res) => {
    const {brand, width, stock, price, description} = req.body
    const store_id = req.params.store_id
    try {
        const store = await prisma.stores.findUnique({where:{id: store_id}})
        if (!store) {
            res.status(401).json({"error":" The store is not found"})
        }

        const bottle =  await prisma.gasBottles.create({
            data: {
                brand,
                width: parseFloat(width),
                price: parseFloat(price),
                description,
                stock: parseInt(stock),
                store_id, 
                }
            })
      
        res.status(200).json(bottle)
    } catch (err) {
        res.status(403).json({error: err.message})
    }
}