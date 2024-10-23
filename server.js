import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import selleRoute from './src/routes/User_and_sale/sellerRoute.js'
import userRoute from './src/routes/User_and_sale/userRoute.js'
import storeRoute from './src/routes/User_and_sale/storeRoute.js'
import stationRoute from './src/routes/products/stationRoute.js'
import categoriesRoute from './src/routes/products/categoriesRoutes.js'
import gasBottleRoute from './src/routes/products/gasbottleRoute.js'
const app = express()

app.use(express.json())
app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Controll-Allow-Origin', '*')
    res.setHeader('Access-Controll-Allow-Headers', 'Origin,X-Requested-with,Content,Accept,Content-type,Authorization')
    res.setHeader('Access-Controll-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE')
    next()
})

app.use('/api', userRoute) // user init route
app.use('/api', selleRoute) // seller init route
app.use('/api', storeRoute) // store init route
app.use('/api', stationRoute) // gastation init route
app.use('/api', categoriesRoute) // gasCategories init route
app.use('/api', gasBottleRoute) // gasBottle init route 


app.listen(process.env.PORT, console.log('server is runing'))
