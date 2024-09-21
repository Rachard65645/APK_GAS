import express from 'express'
import { createStores, getStores, showStore} from '../controllers/storeController.js'
import upload from '../upload/upload.js'

const storeRoute = express.Router()

storeRoute.post('/store/create', upload.single('logo'), createStores)
storeRoute.get('/store/show/:id', showStore)
storeRoute.get('/store/get', getStores)

export default storeRoute
   