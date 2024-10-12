import express from 'express'
import { CreateStore, DeleteStore, fetchStoreById, filterStore, UpdateStore } from '../controllers/stroreController.js'
import { isGrantedAccess } from '../middlewares/auth.js'
import { role } from '../utils/utils.js'

const storeRoute = express.Router()

storeRoute.get('/stores', filterStore)
storeRoute.get('/stores/:id', fetchStoreById)
storeRoute.post('/stores/add', isGrantedAccess([role.USER]), CreateStore)
storeRoute.patch('/stores/patch/:store_id', isGrantedAccess([role.VENDOR]), UpdateStore)
storeRoute.delete('/stores/delete/:id', isGrantedAccess([role.ADMIN]), DeleteStore)



export default storeRoute
   