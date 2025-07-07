import express  from "express";
import db from "../db/db.js"
const router = express.Router()

router.get("/Engineer", async (req, res) => {
    try {
        
        const sqlUser = "SELECT * FROM users ";
        // const userData = await new Promise((resolve, reject) => {
        //     db.query(sqlUser, (err, data) => {
        //         if (err) return reject(err);
        //         resolve(data);
        //     });
        // });
        db.query(sqlUser,(err,data)=>{
            if(err){
                console.error("Error fetchiing notification",err.message)
                return res.json({error:"Error"})
            }
            return res.json({ users: data })
        })

        

        

    } catch (err) {
        console.error("Unexpected server error :", err.message);
        return res.status(500).json({ error: err.message });
    }
})

export default router