import axios from 'axios'
import { prisma } from '../../../db/db_config/config.js'
import { role, STATUS } from '../../utils/utils.js'
import { configuration } from '../Api_managent/testApi.js'

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
                Covers: {
                    select: {
                        name: true
                    }
                },
                
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


export const currentStore = async (req, res) => {
    const userId = req.user.id;
    const pageSize = 10; // Nombre de magasins par page
    const cursor = req.query.cursor || null; // Curseur pour la page actuelle
    const backCursor = req.query.backCursor || null; // Curseur pour la page précédente
    let currentPage = 1; // Page actuelle, que nous calculerons après.
  
    try {
      // Vérifiez si l'utilisateur existe
      const user = await prisma.users.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(400).json({ error: 'User not found' });
      }
  
      // Obtenez la ville de l'utilisateur
      const response = await axios(configuration);
      const { city } = response.data;
  
      // Récupérez le nombre total de magasins dans la ville pour le calcul de pagination
      const totalStores = await prisma.stores.count({
        where: { address: city },
      });
  
      // Calcul du nombre total de pages
      const totalPages = Math.ceil(totalStores / pageSize);
  
      // Récupérez les magasins avec pagination par curseur
      let stores;
      if (backCursor) {
        // Si `backCursor` est fourni, récupérer les magasins en arrière
        stores = await prisma.stores.findMany({
          where: { address: city },
          take: pageSize + 1, // Charge un élément supplémentaire pour vérifier `hasMore`
          skip: 0, // On ne saute pas de magasins
          cursor: { id: backCursor }, // Curseur pour la page précédente
          orderBy: { id: 'desc' }, // Trier les résultats dans l'ordre inverse
        });
        stores.reverse(); // Inverser les résultats pour revenir à l'ordre normal
        currentPage = Math.max(1, currentPage - 1); // Calculer la page précédente
      } else {
        // Sinon, récupérer les magasins de la page suivante
        stores = await prisma.stores.findMany({
          where: { address: city },
          take: pageSize + 1, // Charge un élément supplémentaire pour vérifier `hasMore`
          skip: cursor ? 1 : 0, // Ignorez un magasin si un curseur est présent
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: { id: 'asc' }, // Trier les résultats par ordre ascendant
        });
        currentPage = cursor ? currentPage + 1 : 1; // Calculer la page suivante
      }
  
      // Vérifiez s'il y a une page suivante
      const hasMore = stores.length > pageSize;
  
      // Supprimez l'élément supplémentaire si `hasMore` est vrai
      if (hasMore) stores.pop();
  
      // Définissez le curseur pour la page suivante ou précédente
      const nextCursor = hasMore ? stores[stores.length - 1].id : null;
      const prevCursor = stores.length > 0 ? stores[0].id : null; // Pour la page précédente
  
      // Réponse avec les magasins et les détails de pagination
      res.status(200).json({
        stores,
        pagination: {
          currentPage,
          pageSize,
          totalPages,
          totalStores,
          nextCursor,
          prevCursor,
          hasMore,
        },
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  
  
  
  
  
  
  
  
  


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

