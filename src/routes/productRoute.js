import express from 'express'
import { CreateProduct, DeleteProduct, FetchProduct, UpdateProduct } from '../controllers/productController.js'
import { isGrantedAccess } from '../middlewares/auth.js'
import { role } from '../utils/utils.js'

const productRoute = express.Router()

productRoute.get('/products', FetchProduct)
productRoute.post('/products/add/:store_id', isGrantedAccess([role.VENDOR]), CreateProduct)
productRoute.patch('/products/update/:product_id', isGrantedAccess([role.VENDOR]), UpdateProduct)
productRoute.delete('/products/delete/:product_id', isGrantedAccess([role.VENDOR]),  DeleteProduct)

export default productRoute
