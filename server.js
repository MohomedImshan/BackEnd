import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import userConnection from './User/userConnection.js'
import EngineerConnection from './User/EngineerConnection.js'
import registerRoutes from './routes/registerRoutes.js'
import db from './db/db.js'
import sparePartsRoutes from './routes/sparePartsRoutes.js';

const app = express()
const port = 8801

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

app.use('/User',userConnection)
app.use('/Engineer',EngineerConnection)
app.use('/api/register',registerRoutes)

app.use('/api/spareparts', sparePartsRoutes);

app.listen(8801,()=>console.log(`Listen on ${port}`))