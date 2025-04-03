import mysql from 'mysql'

const db = mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'',
    database:'spare-parts-management-system'
})
db.connect((err)=>{
    if(err){
        console.error("Database connection failed : "+err.message)
    }else{
        console.log("Connected to mysql database")
    }
})
export default db