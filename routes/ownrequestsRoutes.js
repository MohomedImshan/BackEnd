
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

    router.get("/:empNum/:id", (req, res) => {
        const empNum = req.params.empNum;
        const id = req.params.id
      
        db.query("SELECT * FROM requests WHERE empNum = ? AND id=?", [empNum,id], (err, results) => {
          if (err) {
            console.error("Fetch request error:", err);
            return res.status(500).json({ error: "Database error", details: err.message });
          }
      
          if (!results || results.length === 0) {
            return res.status(404).json({ error: "Request not found" });
          }
      
          const request = results[0];
      
          let spareParts=[]
          try{
            spareParts=request.parts?JSON.parse(request.parts):[]
          }catch(parseErr){
            console.error("Error parsing parts JSON:",parseErr)
          }
          res.json({...request,spareParts})
        });
      });

export default router;
