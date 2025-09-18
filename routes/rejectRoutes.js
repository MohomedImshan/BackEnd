import express from 'express'
import db from '../db/db.js'
import verifyToken from './authentication.js'
const router = express.Router()

router.get('/',verifyToken, async (req, res) => {
    const sql = "SELECT * FROM requests WHERE status='Rejected' AND approved_date>=DATE_SUB(NOW(), INTERVAL 14 DAY)";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({reject: data});
    });
})
router.get('/protected',verifyToken,(req,res)=>{
    res.json({message:"You are authorized",user:req.user})
})

export default router