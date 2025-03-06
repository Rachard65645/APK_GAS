import express from 'express'
import { Create, findStocks } from '../../controllers/Products_management/stockController.js'
import { isGrantedAccess } from '../../middlewares/auth.js'
import { role } from '../../utils/utils.js'

const StocksRouter = express.Router()

StocksRouter.post('/stock/add/:id', isGrantedAccess([role.VENDOR]), Create)
StocksRouter.get('/stock/store/:id', isGrantedAccess([role.VENDOR]), findStocks)

export default StocksRouter