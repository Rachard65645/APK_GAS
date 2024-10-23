import { prisma } from "../../../db/db_config/config.js"

export const createStation = async (req, res) => {
    const {name} = req.body
    try {
        const station = await prisma.gasStation.create({
            data: {
                name
            }
        })
        res.status(200).json(station)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export const updateStation = async (req, res) => {
    const {name} = req.body 
    const id = req.params.id
    try {
        const station = await prisma.gasStation.findUnique({where: {id}})
        if (!station) {
            res.status(500).json({error: 'station not fount !!'})
        }

        const updateStation = await prisma.gasStation.update({
            where: {id},
            data: {
                name
            }
        })

        res.status(200).json(updateStation)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export const stationCollection = async (req, res) =>{
    try {
        const station = await prisma.gasStation.findMany({
            select: {
                id: true,
                name:true,
                createdAt: true,
                updatedAt: true
            }
        })
        res.status(200).json(station)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export const fetchStation = async (req, res) =>{
    const id = req.params.id
    try {
        
        const station = await prisma.gasStation.findUnique({
            where: {id}, 
            select: {
                id: true,
                name:true,
                createdAt: true,
                updatedAt: true
            }
        })
        res.status(200).json(station)
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export const deleteStation = async (req, res) => {
    const id = req.params.id

    try {
        const station = await prisma.gasStation.findUnique({where: {id}})
        if (!station) {
            res.status(500).json({error: 'station not fount !!'})
        }

        await prisma.gasStation.delete({where: {id}})

        res.status(200).json({error: 'station delete !! success '})
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}