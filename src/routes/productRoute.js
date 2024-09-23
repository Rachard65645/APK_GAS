import express from 'express'
import { CreateProduct, FetchProduct } from '../controllers/productController.js'
import { isGrantedAccess } from '../middlewares/auth.js'
import { role } from '../utils/utils.js'
import { productRequest } from '../validations/productRequest.js'

const productRoute = express.Router()

productRoute.post('/products/add/:id', productRequest, isGrantedAccess([role.VENDOR]), CreateProduct)
productRoute.get('/products/findMany', FetchProduct)

export default  productRoute
