import express from  'express'
import { createBottle } from '../../controllers/Products_management/gasbottleController.js'


const gasBottleRoute = express.Router()

gasBottleRoute.post('/bottle/add', createBottle)


export default gasBottleRoute
