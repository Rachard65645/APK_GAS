import { prisma } from "../../db/db_config/config.js"

export const subscribeService = async (req, res)=>{
    const user = req.user 
    try {
        const transaction = await prisma.transaction.create({
            data: {
                users: {
                    connect: {
                        id: user.id
                    }
                },
                

            }
        })
    } catch (err) {
        
    }
}