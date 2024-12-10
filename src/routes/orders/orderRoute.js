import express from 'express'
import { createOrder, orderStore, orderUser } from '../../controllers/Orders_management/OrdersController.js'
import { isGrantedAccess } from '../../middlewares/auth.js'
import { role } from '../../utils/utils.js'

const orderRouter = express.Router()

orderRouter.post('/order/:id', isGrantedAccess([role.VENDOR, role.USER]), createOrder)
orderRouter.get('/orders/user', isGrantedAccess([role.VENDOR, role.USER]), orderUser)
orderRouter.get('/orders/store/:id', isGrantedAccess([role.VENDOR, role.USER]), orderStore)

export default orderRouter
