import express from "express";
import db from "../db/db.js"
import bcrypt from "bcrypt"
import addLog from "../routes/Service/logService.js";
import verifyToken from "../routes/authentication.js";

const router = express.Router()

router.get("/Engineer",verifyToken, async (req, res) => {
    try {

        const sqlUser = "SELECT * FROM users ";
        
        db.query(sqlUser, (err, data) => {
            if (err) {
                console.error("Error fetchiing notification", err.message)
                return res.json({ error: "Error" })
            }
            return res.json({ users: data })
        })





    } catch (err) {
        console.error("Unexpected server error :", err.message);
        return res.status(500).json({ error: err.message });
    }
})
router.get("/:empNum",verifyToken, async (req, res) => {
    const empNum = req.params.empNum
    const sql = "SELECT * FROM users WHERE empNum = ?"

    db.query(sql,[empNum],(err,data)=>{
        if(err){
            console.error(`Error fetching user with empNum ${empNum}:`, err.message);
            return res.status(500).json({ error: "Failed to fetch user" });
        }
        if(data.length === 0){
            return res.status(404).json({message:"User not found"})
        }
        return res.json({users:data})
    })
})
router.put("/:empNum",async(req,res)=>{
        const empNum = req.params.empNum
        const {userName,email}=req.body
        try{

            const sql = "UPDATE users SET userName = ?,email = ?   WHERE empNum = ?";
            await db.query(sql,[userName,email,empNum])
            addLog(empNum,"Update Details",`Changed User details of ${userName}` )
            res.status(200).json({message:"User update successfully"})
        }catch(err){
            console.error("Updare failed",err)
            res.status(500).json({error:"Update faile   d",details:err.message})
        }
})
router.put("/:empNum/changepassword",async(req,res)=>{
    const empNum = req.params.empNum
    
    const {confirmpassword}=req.body
    try{
        

        

        const hashedpassword = await bcrypt.hash(confirmpassword,10)

        const sql = "UPDATE users SET password = ? WHERE empNum=?"
        await db.query(sql,[hashedpassword,empNum])

        addLog(empNum,"Update Details","Changed the user password")

        res.status(200).json({message:"Password updated successfully"})
    }catch(err){
        console.error("Update failed", err);
        res.status(500).json({ error: "Update failed", details: err.message });
    }
})





export default router