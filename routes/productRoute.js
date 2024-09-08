import express from 'express'
import { createProduct, getProducts } from '../controllers/productController.js'
import { isGrantedAccess } from '../midelwares/auth.js'
import { role } from '../utils/utils.js'

const productRoute = express.Router()

productRoute.post('/products/create', isGrantedAccess([role.USER]), createProduct)
productRoute.get('/products/get/:id', getProducts)

export default productRoute
