import axios from 'axios'
import { prisma } from '../../../db/db_config/config.js'
import { role, STATUS } from '../../utils/utils.js'
import { configuration } from '../Api_managent/testApi.js'

// Create stores
export const CreateStore = async (req, res) => {
    const { name, pseudo, city, address, statusStore, aboutStore} = req.body
    const files = req.files
    const user_id = req.user.id

    try {
        const user = await prisma.users.findUnique({ where: { id: user_id }, include: { Seller: true } })
        if (!user) {
            return res.status(500).json({ error: 'user not found' })
        }

        const hasAcceptedSeller =
            user.Seller && user.Seller.some((Seller) => Seller.status == STATUS.ACCEPTED) && user.roles == role.VENDOR

        if (!hasAcceptedSeller) {
            return res.status(500).json({ error: 'User does not have an accepted seller' })
        }

        const logo = files?.logo ? `uploads/${files.logo[0].filename}` : null

        const store = await prisma.stores.create({
            data: {
                name,
                pseudo,
                city,
                address,
                logo,
                statusStore,
                aboutStore,
                seller_id: user.Seller[0].id,
            },
        })

        res.status(200).json(store)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Get collection stores
export const filterStore = async (req, res) => {
    const filter = {}

    if (req.query.name) {
        filter.name = { contains: req.query.name, mode: 'insensitive' }
    }
    if (req.query.address) {
        filter.address = { contains: req.query.address, mode: 'insensitive' }
    }

    const pageSize = 10
    const page = parseInt(req.query.page) || 1

    try {
        const stores = await prisma.stores.findMany({
            where: filter,
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: {
                name: 'asc',
            },
            select: {
                id: true,
                name: true,
                address: true,
                city: true,
                logo: true,
                pseudo: true,
                statusStore:true,
                aboutStore: true,
                Covers: {
                    select: {
                        name: true,
                    },
                },
            },
        })

        const totalStores = await prisma.stores.count({ where: filter })

        res.status(200).json({
            stores,
            totalPages: Math.ceil(totalStores / pageSize),
            currentPage: page,
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const getById = async (req, res) => {
    const id = req.params.id
    try {
        const store = await prisma.stores.findUnique({
            where: { id },
            select: {
                name: true,
                logo: true,
                city: true,
                pseudo: true,
                aboutStore: true,
                statusStore: true,
                about: true,
                sellers: {
                    select: {
                        status: true,
                        users: {
                            select: {
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        })
        res.status(200).json(store)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

export const currentStore = async (req, res) => {
    const userId = req.user.id
    const pageSize = 10
    const cursor = req.query.cursor || null
    const backCursor = req.query.backCursor || null
    let currentPage = 1

    try {
        const user = await prisma.users.findUnique({ where: { id: userId } })
        if (!user) {
            return res.status(400).json({ error: 'User not found' })
        }

        const response = await axios(configuration)
        const { city } = response.data

        const totalStores = await prisma.stores.count({
            where: { address: city },
        })

        const totalPages = Math.ceil(totalStores / pageSize)

        let stores
        if (backCursor) {
            stores = await prisma.stores.findMany({
                where: { address: city },
                take: pageSize + 1,
                skip: 0,
                cursor: { id: backCursor },
                orderBy: { id: 'desc' },
            })
            stores.reverse()
            currentPage = Math.max(1, currentPage - 1)
        } else {
            stores = await prisma.stores.findMany({
                where: { address: city },
                take: pageSize + 1,
                skip: cursor ? 1 : 0,
                cursor: cursor ? { id: cursor } : undefined,
                orderBy: { id: 'asc' },
            })
            currentPage = cursor ? currentPage + 1 : 1
        }

        const hasMore = stores.length > pageSize

        if (hasMore) stores.pop()

        const nextCursor = hasMore ? stores[stores.length - 1].id : null
        const prevCursor = stores.length > 0 ? stores[0].id : null

        res.status(200).json({
            stores,
            pagination: {
                currentPage,
                pageSize,
                totalPages,
                totalStores,
                nextCursor,
                prevCursor,
                hasMore,
            },
        })
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}

//GET by id store
export const fetchStoreById = async (req, res) => {
    const id = req.params.id
    try {
        const store = await prisma.stores.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                logo: true,
                city: true,
                statusStore: true,
                aboutStore: true,
                address: true,
                Stocks: { 
                    select: {  
                        quantity: true,
                        price: true,
                        gasBottles: {
                            select: {
                                image: true,
                                gasStations: {
                                    select: {
                                        name: true,
                                    },
                                },
                                bottlesCategories: {
                                    select: {
                                        brand: true,
                                        weigth: true,
                                    },
                                },
                            },
                        },
                    },
                },
                pseudo: true,
                sellers: {
                    select: {
                        status: true,
                        users: {
                            select: {
                                email: true,
                                phone: true,
                            },
                        },
                    },
                },
            },
        })
        res.status(200).json({ stores: store })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

//Update store
export const UpdateStore = async (req, res) => {
    const { name, pseudo } = req.body
    const id = req.params.id
    const files = req.files

    try {
        const store = await prisma.stores.findUnique({ where: { id } })

        if (!store) {
            return res.status(500).json({ error: 'store not found !!' })
        }

        const logo = files?.logo ? `uploads/${files.logo[0].filename}` : null

        const updateData = {
            name,
            pseudo,
        }

        if (logo) {
            updateData.logo = logo
        }

        const updatedStore = await prisma.stores.update({
            where: { id },
            data: updateData,
        })

        res.status(200).json(updatedStore)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

//store for user

export const MyStore = async (req, res) => {
    const user_id = req.user.id
    try {
        const user = await prisma.users.findUnique({
            where: { id: user_id },
        })
        if (!user) {
            return res.status(400).json({ error: 'user not found' })
        }

        const seller = await prisma.seller.findFirst({ where: { user_id } })

        if (!seller) {
            return res.status(400).json({ error: 'seller not found' })
        }

        const store = await prisma.stores.findMany({ where: { seller_id: seller.id } })

        res.status(200).json(store)
    } catch (err) {
        res.status(400).json({ error: err.message })
    }
}
