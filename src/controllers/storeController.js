import { prisma } from '../../db/db_config/config.js'

// Create the store from curent vendor
export const createStores = async (req, res) => {
    const { name, ville, adress, pseudo, longitude, latitude } = req.body
    const user_id = req.user.id
    const logo = req.file ? `uploads/${req.file.filename} ` : null
    try {
        const parseLongitude = parseFloat(longitude)
        const parseLatitude = parseFloat(latitude)

        if (isNaN(parseLatitude) || isNaN(parseLongitude)) {
            return res.status(400).json({ error: 'longitude end latitude is not correct' })
        }

        const store = await prisma.stores.create({
            data: {
                name,
                ville,
                adress,
                longitude: parseLongitude,
                latitude: parseLatitude,
                pseudo,
                logo,
                user_id,
            },
        })
        res.status(200).json(store)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// get all stores
export const getStores = async (req, res) => {
    try {
        const store = await prisma.stores.findMany({
            select: {
                name: true,
                ville: true,
                adress: true,
                pseudo: true,
                gasbottles: {
                    select: {
                        brand: true,
                        width: true,
                        price: true,
                        stock: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        address: true,
                    },
                },
            },
        })
        res.status(200).json(store)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

// get store by id
export const showStore = async (req, res) => {
    const id = req.params.id
    try {
        const store = await prisma.stores.findUnique({
            where: { id: id },
            select: {
                name: true,
                ville: true,
                adress: true,
                pseudo: true,
                gasbottle: {
                    select: {
                        brand: true,
                        width: true,
                        price: true,
                        stock: true,
                    },
                },
                user: {
                    select: {
                        name: true,
                        address: true,
                    },
                },
            },
        })
        res.status(200).json(store)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }     
}


