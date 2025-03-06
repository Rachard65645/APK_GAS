import { prisma } from '../../../db/db_config/config.js'

export const createBottle = async (req, res) => {
    const { gasStation_id, bottlesCategories_id } = req.body
    const files = req.files

    if (!gasStation_id || typeof gasStation_id !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing gasStation_id' })
    }

    if (!bottlesCategories_id || typeof bottlesCategories_id !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing bottlesCategories_id' })
    }

    try {
        const station = await prisma.gasStation.findUnique({
            where: { id: gasStation_id },
        })
        
        if (!station) {
            return res.status(404).json({ error: 'Station does not exist !!' })
        }

        const category = await prisma.bottlesCategories.findUnique({
            where: { id: bottlesCategories_id },
        })

        if (!category) {
            return res.status(404).json({ error: 'Category does not exist !!' })
        }

        const image = files?.image ? `uploads/${files.image[0].filename}` : null

        const bottle = await prisma.gasBottles.create({
            data: {
                image,
                gasStation_id,
                bottlesCategories_id,
            },
        })

        res.status(200).json(bottle)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const getBottle = async (req, res) => {
    try {
        const bottle = await prisma.gasBottles.findMany({
            select: {
                id:true,
                image: true,
                gasStations: {
                    select: {
                        name: true,
                    },
                },
                bottlesCategories: {
                    select: {
                        weigth: true,
                    },
                },
            },
        })
        res.status(200).json({bottles:bottle})
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const updateBotle = async (req, res) => {
    const { gasStation_id, bottlesCategories_id } = req.body
    const files = req.files
    const id = req.params.id

    try {
        const bottle = await prisma.gasBottles.findUnique({ where: { id } })

        if (!bottle) {
            return res.status(404).json({ error: 'bottle does not exist !!' })
        }

        const image = files?.image ? `uploads/${files.image[0].filename}` : null

        const myData = {
            gasStation_id,
            bottlesCategories_id,
            ...(image && { image }),
        }

        const bottleUpdate = await prisma.gasBottles.update({
            where: { id },
            data: myData,
        })

        res.status(200).json(bottleUpdate)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}



export const getStoresByGasBottle = async (req, res) => {
    try {
      const { gasBottleId } = req.params;
  
      if (!gasBottleId) {
        return res.status(400).json({ error: 'L\'ID de la bouteille de gaz est requis.' });
      }
  
      
      const stores = await prisma.stores.findMany({
        where: {
          Stocks: {
            some: {
              gasBottle_id: gasBottleId,
            },
          },
        },
        select: {
            id: true,
            name: true,
            city: true,
            address: true,
            statusStore: true,
            logo: true
        }
        // include: {
        //   Stocks: {
        //     where: {
        //       gasBottle_id: gasBottleId,
        //     },
        //     include: {
        //       gasBottles: true, 
        //     },
        //   },
        // },
      });
  
      
      res.status(200).json(stores);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };