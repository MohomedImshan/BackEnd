import db from "../../db/db.js"

export const addLog = (empNum,action,details = "")=>{
    const query = "INSERT INTO user_logs (empNum,action,details) values (?,?,?)"
    db.query(query,[empNum,action,details],(err)=>{
        if(err)
        {
            console.error("Error writing log",err)
        }
    })
}

export default addLog