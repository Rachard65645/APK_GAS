import express from 'express'
import { login, refreshToken, register } from '../controllers/userController.js'
import { loginRequest, registerRequest } from '../validations/userRequest.js'

const userRoute = express.Router()

userRoute.post('/register', registerRequest, register)
userRoute.post('/login', loginRequest, login)
userRoute.post('/refresh/token', refreshToken)

export default userRoute
