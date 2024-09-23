import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import userRoute from './src/routes/userRoute.js'
import productRoute from './src/routes/productRoute.js'
const app = express()

app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Controll-Allow-Origin', '*')
    res.setHeader('Access-Controll-Allow-Headers', 'Origin,X-Requested-with,Content,Accept,Content-type,Authorization')
    res.setHeader('Access-Controll-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    next()
})
app.use('/api', userRoute)
app.use('/api', productRoute)

app.listen(process.env.PORT, console.log('server is runing to port 6000'))
