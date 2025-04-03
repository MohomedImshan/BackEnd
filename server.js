import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import userConnection from './User/userConnection.js'
import db from './db/db.js'


const app = express()
const port = 8801

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

app.use('/User',userConnection)



app.listen(8801,()=>console.log(`Listen on ${port}`))