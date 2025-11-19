import express from 'express'
import db from '../db/db.js'
import verifyToken from './authentication.js'

const router = express.Router()
// getting number of notifications
router.get('/pendingcount', verifyToken, (req, res) => {
       db.query("SELECT COUNT(*) AS count FROM requests WHERE status = 'pending'", (error, results) => {
         if (error) {
           console.error(error);
           return res.status(500).json({ error: "Database error" });
         }
         const count = results && results[0] ? results[0].count : 0;
         res.json({ count });
       });
     });
     

export default router;
