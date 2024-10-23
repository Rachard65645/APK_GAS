import express from 'express'
import { 
    createCategory, 
    fetchCategory, 
    getCategory, 
    updateCategory 
}
     from '../../controllers/Products_management/categoryBottleController.js'
import { isGrantedAccess } from '../../middlewares/auth.js'
import { role } from '../../utils/utils.js'


const categoriesRoute = express.Router()

categoriesRoute.get('/bottleCategories', getCategory)
categoriesRoute.get('/bottleCategory/:id', fetchCategory)
categoriesRoute.patch('/bottleCategory/update/:id', isGrantedAccess([role.VENDOR]), updateCategory)
categoriesRoute.post('/bottleCategory/add', isGrantedAccess([role.VENDOR]), createCategory)


export default categoriesRoute
