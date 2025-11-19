import express from 'express'
import db from '../db/db.js'
import verifyToken from './authentication.js'

const router = express.Router()
//Getting the log files
//if needed between days
router.get('/', verifyToken, (req, res) => {
    const { from, to } = req.query;

    let sql = "SELECT * FROM user_logs";
    let params = [];

    if (from && to) {
        sql += " WHERE timestamp BETWEEN ? AND ?";
        params.push(from + " 00:00:00", to + " 23:59:59");
    } 
    else if (from) {
        sql += " WHERE timestamp >= ?";
        params.push(from + " 00:00:00");
    }
    else if (to) {
        sql += " WHERE timestamp <= ?";
        params.push(to + " 23:59:59");
    }

    sql += " ORDER BY id DESC";

    db.query(sql, params, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ log: data });
    });
});

export default router 