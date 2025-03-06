import express from  'express'
import { 
    createBottle, 
    getBottle, 
    getStoresByGasBottle, 
    updateBotle 
} from '../../controllers/Products_management/gasbottleController.js'
import { uploadFiles } from '../../upload/upload.js'


const gasBottleRoute = express.Router()

gasBottleRoute.get('/bottles', getBottle)
gasBottleRoute.patch('/botle/update/:id', uploadFiles, updateBotle)
gasBottleRoute.get('/bottle/:gasBottleId', getStoresByGasBottle)
gasBottleRoute.post('/bottle/add',uploadFiles, createBottle)


export default gasBottleRoute
