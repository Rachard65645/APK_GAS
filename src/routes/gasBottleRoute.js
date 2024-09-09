import express from 'express'
import { createBottle } from '../controllers/gasBottleController.js'

const gasBottleRoute = express.Router()

gasBottleRoute.post('/gasBottles/create/:store_id', createBottle)

export default gasBottleRoute