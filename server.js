import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import userConnection from './User/userConnection.js'
//Paba
import requestRoutes from './routes/requestRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js'


import EngineerConnection from './User/EngineerConnection.js'
import registerRoutes from './routes/registerRoutes.js'
import loginRoutes from './routes/loginRoutes.js'
import db from './db/db.js'
import sparePartsRoutes from './routes/sparePartsRoutes.js';
import AddEmployeeRoute from './User/AddEmployeeRoute.js'



const app = express()
const port = 8800

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

app.use('/User',userConnection)
app.use('/EngineerDashboard',EngineerConnection)
app.use('/Register',registerRoutes)
app.use('/login',loginRoutes)
app.use('/Add-Employee',AddEmployeeRoute)

app.use('/User',userConnection);
app.use('/Engineer',EngineerConnection);
app.use('/api/register',registerRoutes);
//paba
app.use('/api/requests', requestRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/spareparts', sparePartsRoutes);
app.listen(8800,()=>console.log(`Listen on ${port}`));




