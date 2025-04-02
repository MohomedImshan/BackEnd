import express from "express"
import bodyParser from "body-parser"
import cors from "cors"


const app = express()
const port = 8800

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())






app.listen(8800,()=>console.log(`Listen on ${port}`))