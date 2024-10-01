import express from 'express'
import { CreateStore, filterStore, UpdateStore } from '../controllers/stroreController.js'
import { isGrantedAccess } from '../middlewares/auth.js'
import { role } from '../utils/utils.js'

const storeRoute = express.Router()

storeRoute.post('/stores/add', isGrantedAccess([role.VENDOR]), CreateStore)
storeRoute.patch('/stores/patch/:id', UpdateStore)
storeRoute.get('/stores/get', filterStore)

export default storeRoute
   