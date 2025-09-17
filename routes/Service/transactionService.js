import db from "../../db/db.js"

export const AddTransaction = (action,item_id,item_name,quantity = "")=>{
    const query = "INSERT INTO transaction (action,item_id,item_name,quantity) values (?,?,?,?)"
    db.query(query,[action,item_id,item_name,quantity],(err)=>{
        if(err)
        {
            console.error("Error writing log",err)
        }
    })
}

export default AddTransaction