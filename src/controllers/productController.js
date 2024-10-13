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
    const filter = {}
    if (req.query.name) {
        filter.name = { contains: req.query.name }
    }
    if (req.query.brand) {
        filter.brand = { contains: req.query.brand }
    }
    const pageSize = 10
    const page = req.query.page || 1
    try {
        const product = await prisma.products.findMany({
            where: filter,
            skip: (page - 1) * pageSize,
            take: pageSize,
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
        res.status(200).json({ products: product })
    } catch (err) {
        res.status(400).json({ erro: err.message })
    }
}

export const UpdateProduct = async (req, res) => {
    try {
      const { brand, width, price, stock, type, name, description } = req.body;
      const product_id = req.params.product_id;
  
      if (!product_id) {
        return res.status(400).json({ error: 'product_id manquant' });
      }
  
      const product = await prisma.products.findUnique({
        where: { id: parseInt(product_id) }
      });
  
      if (!product) {
        return res.status(404).json({ error: 'Produit non trouvé' });
      }

      const dataToUpdate = {};
      if (name) dataToUpdate.name = name;
      if (brand) dataToUpdate.brand = brand;
      if (width !== undefined) dataToUpdate.width = parseFloat(width);
      if (price !== undefined) dataToUpdate.price = parseFloat(price);
      if (stock !== undefined) dataToUpdate.stock = stock;
      if (type) dataToUpdate.type = type;
      if (description) dataToUpdate.description = description;
  
      const updatedProduct = await prisma.products.update({
        where: { id: parseInt(product_id) },
        data: dataToUpdate
      });
  
      res.status(200).json(updatedProduct);
    } catch (err) {
      res.status(500).json({ error: 'Erreur interne du serveur' });
    }
  };

export const DeleteProduct = async (req, res) =>{
    try {
        const product_id = req.params.product_id;
        if (!product_id) {
            return res.status(400).json({ error: 'product_id manquant' });
        }
        const product = await prisma.products.findUnique({where: {id: parseInt(product_id)}})
        if (!product) {
            res.status(400).json({error: 'product not  found '})
        }
        const deleteproduct = await prisma.products.delete({where: {id:parseInt(product_id)}});
        res.status(200).json(deleteproduct);
    } catch (err) {
        res.status(500).json({ error: err.message});
    }
}