import express from 'express'
import { 
    CreateStore, 
    currentStore, 
    fetchStoreById, 
    filterStore, 
    MyStore, 
    UpdateStore
} from '../../controllers/Users_and_sale_management/storeController.js'
import { isGrantedAccess} from '../../middlewares/auth.js'
import { role} from '../../utils/utils.js'
import { uploadFiles } from '../../upload/upload.js'

const storeRoute = express.Router()

storeRoute.get('/stores', filterStore)
storeRoute.get('/my_store', isGrantedAccess([role.USER, role.VENDOR]), MyStore)
storeRoute.get('/store', isGrantedAccess([role.USER, role.VENDOR]), currentStore)
storeRoute.get('/store/:id', fetchStoreById)
storeRoute.patch('/store/update/:id', uploadFiles, UpdateStore)
storeRoute.post('/store/add', isGrantedAccess([role.USER, role.VENDOR]),uploadFiles, CreateStore)



export default storeRoute