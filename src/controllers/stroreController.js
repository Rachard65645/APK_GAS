import { prisma } from '../../db/db_config/config.js'
import { role } from '../utils/utils.js'

export const CreateStore = async (req, res) => {
    const { name, pseudo, city, address } = req.body
    const file = req.file
    const user_id = req.user.id
    const logo = file ? `uploads/${file.filename}` : null
    try {
        const store = await prisma.stores.create({
            data: {
                name,
                pseudo,
                address,
                city,
                logo,
                user_id: user_id,
            },
        })
        if (store) {
            await prisma.users.update({
                where: { id: user_id },
                data: {
                    roles: [role.VENDOR],
                },
            })
        }
        res.status(200).json(store)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

export const UpdateStore = async (req, res) => {
    const { name, pseudo, city, address } = req.body
    const store_id = req.params.store_id
    const file = req.file
    const logo = file ? `uploads/${file.filename}` : null
    const user_id = req.user.id

    try {
        const store = await prisma.stores.findUnique({ where: { id: parseInt(store_id) } })
        if (!store) {
            res.status(404).json({ error: 'Store not found' })
            return
        }

        if (user_id !== store.user_id) {
            res.status(404).json({ error: 'access denied' })
            return
        }

        const update = await prisma.stores.update({
            where: { id: parseInt(store_id) },
            data: {
                name,
                pseudo,
                city,
                address,
                logo: logo ? `uploads/${file.filename}` : null,
            },
        })

        res.status(200).json(update)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }
}

export const filterStore = async (req, res) => {
    const filter = {}
    if (req.query.name) {
        filter.name = { contains: req.query.name }
    }
    if (req.query.address) {
        filter.address = { contains: req.query.address }
    }
    const pageSize = 10
    const page = req.query.page || 1
    try {
        const store = await prisma.stores.findMany({
            where: filter,
            skip: (page - 1) * pageSize,
            take: pageSize,
            select: {
                id: true,
                name: true,
                address: true,
                city: true,
                logo: true,
                pseudo: true,
                user: {
                    select: {
                        phone: true,
                    },
                },
                product: {
                    select: {
                        name: true,
                        brand: true,
                        price: true,
                        width: true,
                    },
                },
            },
        })
        res.status(200).json(store)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const fetchStoreById = async (req, res) => {
    const id = req.params.id
    try {
        const store = await prisma.stores.findUnique({
            where: { id:parseInt(id) },
            select: {
                name: true,
                address: true,
                city: true,
                logo: true,
                pseudo: true,
                user: {
                    select: {
                        phone: true,
                    },
                },
                product: {
                    select: {
                        name: true,
                        brand: true,
                        price: true,
                        width: true,
                    },
                },
            },
        })
        res.status(200).json(store)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const DeleteStore = async (req, res)=> {
    const store_id = req.params.id
    try {
        const store = await prisma.stores.findUnique({where: {id:parseInt(store_id)}})
        if (!store) {
            res.status(400).json({error: 'store not found'})
        }
        await prisma.stores.delete({where:{id:parseInt(store_id)}})
        res.status(200).json({error: 'store remove'})
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}