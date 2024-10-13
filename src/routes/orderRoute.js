import express from 'express'
import { CreateOrder } from '../controllers/orderController.js'
import { isGrantedAccess } from '../middlewares/auth.js'
import { role } from '../utils/utils.js'


const orderRouter = express.Router()

orderRouter.post('/order/add', isGrantedAccess([role.VENDOR]), CreateOrder)

export default orderRouter  