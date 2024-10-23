import { prisma } from '../../../db/db_config/config.js'
import { role, STATUS } from '../../utils/utils.js'

// Create stores 
export const CreateStore = async (req, res) => {
    const { name, pseudo, city, address } = req.body
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

//GET by id store
export const fetchStoreById = async (req, res) => {
    const id = req.params.id
    try {
        const store = await prisma.stores.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                address: true,
                city: true,
                logo: true,
                pseudo: true,
            },
        })
        res.status(200).json(store)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

//Update store 
export const UpdateStore = async (req, res) => {
    const { name, pseudo } = req.body;
    const id = req.params.id;
    const files = req.files;
    
    try {
        const store = await prisma.stores.findUnique({ where: { id } });
        
        if (!store) {
            return res.status(500).json({ error: 'store not found !!' });
        }

        const logo = files?.logo ? `uploads/${files.logo[0].filename}` : null;

        const updateData = {
            name,
            pseudo,
        }

        if (logo) {
            updateData.logo = logo;
        }

        const updatedStore = await prisma.stores.update({
            where: { id },
            data: updateData,
        });

        res.status(200).json(updatedStore);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

