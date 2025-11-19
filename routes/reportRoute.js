import express from 'express'
import db from '../db/db.js'
import verifyToken from './authentication.js'
const router = express.Router()

//getting the approved requests
router.get('/',verifyToken, async (req, res) => {
    const sql = "SELECT * FROM requests WHERE status='Approved' AND created_at>=DATE_SUB(NOW(), INTERVAL 14 DAY)";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({report: data});
    });
})
router.get('/protected',verifyToken,(req,res)=>{
    res.json({message:"You are authorized",user:req.user})
})
router.get('/stockreport',verifyToken, async (req, res) => {
    const sql = "SELECT * FROM spare_parts_tbl ";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({stockReport: data});
    });
})
router.get('/protected',verifyToken,(req,res)=>{
    res.json({message:"You are authorized",user:req.user})
})

export default router