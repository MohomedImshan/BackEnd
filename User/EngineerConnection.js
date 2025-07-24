import express from "express";
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
router.get("/:empNum", async (req, res) => {
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
    const {userName,email,position} = req.body
    const sql = "UPDATE users SET userName = ?,email = ? ,position = ? WHERE empNum = ?"

    try{
        db.query(sql,[userName,email,position,empNum])
        res.status(200).json({message:"User update successfully"})
    }catch(err){
        res.status(500).json({error:"Update failed"})
    }
})
router.put("/:empNum",async(req,res)=>{
    const empNum = req.params.empNum
    const {status} = req.body
    const sql = "UPDATE users SET status=? WHERE empNum = ?"

    try{
        db.query(sql,[status,empNum])
        res.status(200).json({message:"Status update successfully"})
    }catch(err){
        res.status(500).json({error:"Update failed"})
    }
})
router.delete("/:empNum", async (req, res) => {
    const empNum = req.params.empNum;
    try {
        await db.query("DELETE FROM Engineer WHERE empNum = ?", [empNum]);
        res.status(200).send({ message: "User deleted" });
    } catch (err) {
        res.status(500).send({ error: "Delete failed", details: err });
    }
});
export default router