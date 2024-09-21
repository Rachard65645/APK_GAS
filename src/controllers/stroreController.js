import { prisma } from "../../db/db_config/config.js";



export const CreateStore = async (req,res)=>{
    const {name, pseudo, city, address, } = req.body
    const file = req.file
    const logo = file? `uploads/${file.filename}` : null;
    try {
        const store = await prisma.stores.create({
            data: {
                name,
                pseudo,
                address,
                city,
                logo,
            }
        })
        res.status(200).json(store)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}












