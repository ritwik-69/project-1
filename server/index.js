import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import clientRoutes from './routes/client.route.js'
import generalRoutes from './routes/general.route.js'
import managementRoutes from './routes/management.route.js'
import salesRoutes from './routes/sales.route.js'


// data imports 
import User from "./models/user.model.js"
import {dataUser} from "./data/index.js"


//config


dotenv.config();
const app = express();
app.use(express.json())
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({limit: "30mb",extended: true}));
app.use(bodyParser.urlencoded({limit:"30mb", extended:true}))
app.use(cors())


// routes

app.use("/client",clientRoutes)

app.use("/general",generalRoutes)
app.use("/management",managementRoutes)
app.use("sales",salesRoutes )


// mongoose setup 

const port = process.env.PORT || 9000;

mongoose.connect(process.env.MONGO_URL).then(()=>{
    app.listen(port , ()=>{console.log("server port",`${port}`)});
    User.insertMany(dataUser)
}).catch((error)=>{console.log(`mongodb error : ${error}`)})

