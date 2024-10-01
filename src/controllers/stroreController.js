import { prisma } from "../../db/db_config/config.js";

export const CreateStore = async (req,res)=>{
    const {name, pseudo, city, address } = req.body
    const file = req.file
    const logo = file? `uploads/${file.filename}` : null;
    try {
        const store = await prisma.stores.create({
            data: {
                name,
                pseudo,
                address,
                city,
                logo
            }
        })
        res.status(200).json(store)
    } catch (err) {
        res.status(400).json({error: err.message})
    }
}

export const UpdateStore = async (req, res) => {
    const { name, pseudo, city, address } = req.body;
    const id = req.params.id;
    const file = req.file;
    const logo = file ? `uploads/${file.filename}` : null;
  
    try {
      const store = await prisma.stores.findUnique({ where: { id } });
      if (!store) {
        res.status(404).json({ error: "Store not found" });
        return;
      }
  
      const updatedStore = await prisma.stores.update({
        where: { id },
        data: {
          name,
          pseudo,
          city,
          address,
          logo: logo ? `uploads/${file.filename}` : null,
        },
      });
      res.status(200).json(updatedStore);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
}


export const filterStore = async(req, res)=>{
    const filter = {};
    if (req.query.name) {
        filter.name = {contains: req.query.name}
    }
    if (req.query.address) {
        filter.address = {contains: req.query.address}
    }
    const pageSize = 10;
    const page = req.query.page || 1;
    try {
        const store = await prisma.stores.findMany({
            where: filter,
            skip: (page-1)*pageSize,
            take: pageSize,
            select:{
                name: true,
                address: true,
                city: true,
                logo: true,
                pseudo: true,
                user: {
                    select:{
                      phone: true,
                    }
                },
                product:{
                    select:{
                        name: true,
                        brand: true,
                        price: true,
                        width: true,     
                    },
                
                }
            }
        })
        res.status(200).json(store);
    } catch (err) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}











