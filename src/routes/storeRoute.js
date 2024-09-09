import express from 'express'
import { createStores, getStores, showStore, updateStore } from '../controllers/storeController.js'
import { isGrantedAccess } from '../midelwares/auth.js'
import { role } from '../utils/utils.js'

const storeRoute = express.Router()

storeRoute.post('/stores/create', isGrantedAccess([role.USER]), createStores)
storeRoute.get('/store/show/:id', showStore)
storeRoute.get('/store/get', getStores)
storeRoute.patch('/store/patch/:id',isGrantedAccess([role.USER]), updateStore)

export default storeRoute