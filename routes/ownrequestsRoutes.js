
import express from 'express';
import db from '../db/db.js';
const router = express.Router();


router.get('/:empNum', (req, res) => {
    const empNum=req.params.empNum
    const sql = 'SELECT * FROM requests WHERE empNum=? ORDER BY created_at DESC ';
    db.query(sql, [empNum],(err, results) => {
            if (err) {
                console.error('Select Error:', err);
                return res.status(500).send({ error: 'Select failed', details: err.message });
        }
        res.send(results);
    });
    });



export default router;
