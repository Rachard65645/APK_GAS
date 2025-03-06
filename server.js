import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import selleRoute from './src/routes/User_and_sale/sellerRoute.js';
import userRoute from './src/routes/User_and_sale/userRoute.js';
import storeRoute from './src/routes/User_and_sale/storeRoute.js';
import stationRoute from './src/routes/products/stationRoute.js';
import categoriesRoute from './src/routes/products/categoriesRoutes.js';
import gasBottleRoute from './src/routes/products/gasbottleRoute.js';
import path from 'path'
import StocksRouter from './src/routes/products/stockRoute.js';
import orderRouter from './src/routes/orders/orderRoute.js';
import morgan from 'morgan';

const app = express();
const PORT =  4000;
const host = '172.20.10.2'

app.use(express.json());
app.use(cors());
app.use(morgan('dev'))

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    next();
});

app.use('/api', userRoute);  
app.use('/api', selleRoute); 
app.use('/api', storeRoute); 
app.use('/api', stationRoute); 
app.use('/api', categoriesRoute); 
app.use('/api', gasBottleRoute); 
app.use('/api', StocksRouter)
app.use('/api', orderRouter)
app.use('/api/uploads', express.static(path.resolve('public/uploads')));



app.listen(PORT, host, () => {
    console.log(`Server is running on http://${host}:${PORT}`);
});
