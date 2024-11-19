import express from 'express'
import { createOrder } from '../../controllers/Orders_management/OrdersController.js'
import { isGrantedAccess } from '../../middlewares/auth.js'
import { role } from '../../utils/utils.js'

const orderRouter = express.Router()

orderRouter.post('/order/:id', isGrantedAccess([role.VENDOR]), createOrder)

export default orderRouter
