import express from 'express'
import { login, refreshToken, register } from '../controllers/userController.js'

const userRoute = express.Router()

userRoute.post('/register', register)
userRoute.post('/login', login)
userRoute.post('/refresh/token', refreshToken)

export default userRoute
