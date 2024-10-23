import { prisma } from '../../../db/db_config/config.js'

// create category
export const createCategory = async (req, res) => {
    const { brand, weigth } = req.body
    try {
        const category = await prisma.bottlesCategories.create({
            data: {
                brand,
                weigth,
            },
        })
        res.status(200).json(category)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// get collection 
export const getCategory = async (req, res)=>{
    try {
        const category = await prisma.bottlesCategories.findMany({
            select: {
                id: true,
                brand: true,
                weigth: true,
                updatedAt: true
            }
        })
        res.status(200).json(category)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// get by id
export const fetchCategory = async (req, res)=>{
    const id = req.params.id
    try {
        const category = await prisma.bottlesCategories.findUnique({where: {id}, select: { brand: true, weigth: true}})
        res.status(200).json(category)
    } catch (err) {
        res.status(200).json({error: err.message})
    }
   
}

// update
export const updateCategory = async (req, res) => {
    const { brand, weigth } = req.body
    const id = req.params.id
    try {
        const category = await prisma.bottlesCategories.findUnique({ where: { id } })

        if (!category) {
            res.status(500).json({ error: 'category is not found !!' })
        }

        const updateData = {
            brand,
            weigth,
        }

        const updateCategory = await prisma.bottlesCategories.update({
            where: { id },
            data: updateData,
        })

        res.status(200).json(updateCategory)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// delete
export const deleteCategory = async (req, res) => {
    const id = req.params.id

    try {
        const station = await prisma.bottlesCategories.findUnique({where: {id}})
        if (!station) {
            res.status(500).json({error: 'station not fount !!'})
        }

        await prisma.bottlesCategories.delete({where: {id}})

        res.status(200).json({error: 'station delete !! success '})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}



