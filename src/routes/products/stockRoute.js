import express from 'express'
import { Create, findStocks } from '../../controllers/Products_management/stockController.js'

const StocksRouter = express.Router()

StocksRouter.post('/stock/add/:id' , Create)
StocksRouter.get('/stock', findStocks)

export default StocksRouter