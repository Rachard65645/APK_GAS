import express from 'express'
import {
    currentUser,
    fetchUser,
    findUniqueUser,
    login,
    refreshToken,
    register,
    updateUser,
} from '../../controllers/Users_and_sale_management/userController.js'
import { loginRequest, registerRequest, updateUserrequest } from '../../validations/userRequest.js'
import { isGrantedAccess } from '../../middlewares/auth.js'
import { role } from '../../utils/utils.js'
import { api } from '../../controllers/Api_managent/testApi.js'

const userRoute = express.Router()

userRoute.post('/register', registerRequest, register)
userRoute.post('/login', loginRequest, login)
userRoute.post('/refresh/token', refreshToken)
userRoute.get('/users', fetchUser)
userRoute.get('/users/:id', findUniqueUser)
userRoute.patch('/users/update/:id', updateUserrequest, updateUser)
userRoute.get('/me', isGrantedAccess([role.USER]), currentUser)

userRoute.post('/api', api)
export default userRoute
