import express from 'express'
import { 
    createStation, 
    deleteStation, 
    fetchStation, 
    stationCollection, 
    updateStation
} from '../../controllers/Products_management/stationGasController.js'
import { isGrantedAccess } from '../../middlewares/auth.js'
import { role } from '../../utils/utils.js'

const stationRoute = express.Router()

stationRoute.get('/stations',  stationCollection)
stationRoute.get('/station/:id', fetchStation)
stationRoute.patch('/station/update/:id', isGrantedAccess([role.VENDOR]), updateStation)
stationRoute.delete('/station/delete/:id', deleteStation)
stationRoute.post('/station/add', isGrantedAccess([role.VENDOR]), createStation)

export default stationRoute