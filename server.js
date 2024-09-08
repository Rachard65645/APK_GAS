import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import productRoute from './routes/productRoute.js'
import userRoute from './routes/userRoute.js'

const app = express()

app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Controll-Allow-Origin', '*')
    res.setHeader('Access-Controll-Allow-Headers', 'Origin,X-Requested-with,Content,Accept,Content-type,Authorization')
    res.setHeader('Access-Controll-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    next()
})
app.use('/api', productRoute)
app.use('/api', userRoute)

app.listen(process.env.PORT, console.log('server is runing to port 6000'))
