import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import userConnection from './User/userConnection.js'
import EngineerConnection from './User/EngineerConnection.js'
import registerRoutes from './routes/registerRoutes.js'
import loginRoutes from './routes/loginRoutes.js'
import db from './db/db.js'


const app = express()
const port = 8800

app.use(express.json())
app.use(cors())
//app.use(bodyParser.json())

app.use('/User',userConnection)
app.use('/Engineer',EngineerConnection)
app.use('/api/register',registerRoutes)
app.use('/api/login',loginRoutes)



app.listen(port,()=>console.log(`Listen on ${port}`))