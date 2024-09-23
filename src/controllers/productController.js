import { prisma } from "../../db/db_config/config.js"

export const CreateProduct = async(req, res)=>{
    const {brand, width, price, stock, type, name, description}=req.body
    const id = req.params.id

    try {
        const store_id = await prisma.stores.findUnique({where: id})

        if (!store_id) {
            return res.status(400).json({error: 'store not fount'})
        }

        const product = await prisma.products.create({
            data: {
                name,
                brand,
                width,
                price,
                stock,
                type,
                description,
            }
        })
        
        res.status(200).json(product)
    } catch (err) {
        res.status(400).json({erro: err.message})
    }
}

export const FetchProduct = async (req, res)=>{
    try {
        const product = await prisma.products.findMany({
            select : {
                name: true,
                brand: true,
                width: true,
                price: true,
                stock: true,
                type: true,
                description: true,
                store: {
                    select:{
                        name: true,
                        address: true,
                        pseudo: true,
                        user: {
                            select: {
                                phone: true,
                            }
                        }
                    }
                }
            }
        })
        res.status(200).json(product)
    } catch (err) {
        res.status(400).json({erro: err.message})
    }
}




