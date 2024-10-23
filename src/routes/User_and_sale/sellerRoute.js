import express from 'express'
import { isGrantedAccess } from '../../middlewares/auth.js'
import { role } from '../../utils/utils.js'
import { 
    CraeteSeller,
    DeleteSeller,
    fetchSeller,
    RefuseSeller,
    SellerCollection,
    SuccessSeller
    } from '../../controllers/Users_and_sale_management/sellerController.js'
import { uploadFiles } from '../../upload/upload.js'

const selleRoute = express.Router()

selleRoute.get('/seller', SellerCollection)
selleRoute.get('/seller/:id', fetchSeller)
selleRoute.patch('/seller/validate/:id', isGrantedAccess([role.ADMIN]), SuccessSeller)
selleRoute.patch('/seller/refuse/:id',isGrantedAccess([role.ADMIN]), RefuseSeller)
selleRoute.delete('/seller/delete/:id', isGrantedAccess([role.ADMIN]),  DeleteSeller)
selleRoute.post('/seller/add', isGrantedAccess([role.USER]), uploadFiles , CraeteSeller)

export default selleRoute