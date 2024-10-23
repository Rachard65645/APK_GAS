import { prisma } from '../../../db/db_config/config.js'
import { role, STATUS } from '../../utils/utils.js'

// Create the Sellers
export const CraeteSeller = async (req, res) => {
    const user_id = req.user.id
    const files = req.files
    try {
        const CNI = files?.CNI ? `uploads/${files.CNI[0].filename}` : null
        const RCCM = files?.RCCM ? `uploads/${files.RCCM[0].filename}` : null
        const Patente = files?.Patente ? `uploads/${files.Patente[0].filename}` : null
        const CC = files?.CC ? `uploads/${files.CC[0].filename}` : null

        const user = await prisma.users.findUnique({ where: { id: user_id } })

        if (!user) {
            return res.status(500).json({ error: 'user not found' })
        }

        const seller = await prisma.seller.create({
            data: {
                users: {
                    connect: {
                        id: user_id,
                    },
                },
                CNI,
                RCCM,
                Patente,
                CC,
                status: STATUS.LOADING,
            },
        })

        res.status(200).json(seller)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Find many sellers
export const SellerCollection = async (req, res) => {
    try {
        const seller = await prisma.seller.findMany({
            select: {
                id: true,
                CNI: true,
                RCCM: true,
                Patente: true,
                CC: true,
                status: true,
            },
        })
        res.status(200).json({ Sellers: seller })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Find by one seller
export const fetchSeller = async (req, res) => {
    const id = req.params.id
    try {
        const seller = await prisma.seller.findUnique({
            where: { id },
            select: {
                id: true,
                CNI: true,
                RCCM: true,
                Patente: true,
                CC: true,
                status: true,
            },
        })
        if (!seller) {
            return res.status(500).json({ error: 'seller not existe' })
        }
        res.status(200).json({ Sellers: seller })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Validate the seller
export const SuccessSeller = async (req, res) => {
    const id = req.params.id

    try {
        const seller = await prisma.seller.findUnique({ where: { id } })
        if (!seller) {
            return res.status(500).json({ error: 'seller not existe' })
        }
        const validSeller = await prisma.seller.update({ 
            where: { id }, 
            data: {      
                status: STATUS.ACCEPTED,
                 users: {
                    update: {
                        roles: [role.VENDOR]
                    }
                 }
            } 
        })
        res.status(200).json({ Sellers: validSeller })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

// Refuse the seller 
export const RefuseSeller = async (req, res) => {
    const id = req.params.id

    try {
        const seller = await prisma.seller.findUnique({ where: { id } })
        if (!seller) {
            return res.status(500).json({ error: 'seller not existe' })
        }
        const validSeller = await prisma.seller.update({ where: { id }, data: { status: STATUS.REFUSE } })
        res.status(200).json({ Sellers: validSeller })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

//Delete seller
export const DeleteSeller = async (req,res)=>{
    const id = req.params.id

    try {
        const seller = await prisma.seller.findUnique({ where: { id } })
        if (!seller) {
            return res.status(500).json({ error: 'seller not existe' })
        }
        await prisma.seller.delete({where: {id}})
        res.status(200).json({success: 'seller delete success'})
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}