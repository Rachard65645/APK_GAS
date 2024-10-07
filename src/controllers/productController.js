import { prisma } from '../../db/db_config/config.js'

export const CreateProduct = async (req, res) => {
    const { brand, width, price, stock, type, name, description } = req.body
    const store_id = req.params.store_id

    try {
        const store = await prisma.stores.findUnique({ where: { id: parseInt(store_id) } })

        if (!store) {
            return res.status(400).json({ error: 'store not fount' })
        }

        const product = await prisma.products.create({
            data: {
                name,
                brand,
                width: parseFloat(width),
                price: parseFloat(price),
                stock,
                type,
                description,
                store_id: parseInt(store_id),
            },
        })

        res.status(200).json(product)
    } catch (err) {
        res.status(400).json({ erro: err.message })
    }
}

export const FetchProduct = async (req, res) => {
    try {
        const product = await prisma.products.findMany({
            select: {
                name: true,
                brand: true,
                width: true,
                price: true,
                stock: true,
                type: true,
                description: true,
                store: {
                    select: {
                        name: true,
                        address: true,
                        pseudo: true,
                        user: {
                            select: {
                                phone: true,
                            },
                        },
                    },
                },
            },
        })
        res.status(200).json(product)
    } catch (err) {
        res.status(400).json({ erro: err.message })
    }
}
