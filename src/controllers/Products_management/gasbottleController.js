import { prisma } from '../../../db/db_config/config.js'

export const createBottle = async (req, res) => {
    const {name, weigth} = req.body
    const files = req.files
    try {

        const station = await prisma.gasStation.findUnique({where: {name}})
         
        if (!station) {
            res.status(500).json({error: 'station not exist !!'})
        }

        const category = await prisma.bottlesCategories.findUnique({where: {weigth}})

        if (!category) {
            res.status(500).json({error: 'category not exist !!'})
        }

        const image = files?.image ? `uploads/${files.image[0].filename}` : null

        const bottle = await prisma.gasBottles.create({
            data: {
                image,
                gasStation_id: station.id,
                bottlesCategories_id: category.id
            }
        })
        res.status(200).json(bottle)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}
