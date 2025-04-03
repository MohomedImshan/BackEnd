import express  from "express";
import db from "../db/db.js"
const router = express.Router()

router.get("/User", async (req, res) => {
    try {
        
        const sqlUser = "SELECT * FROM users";
        const userData = await new Promise((resolve, reject) => {
            db.query(sqlUser, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });
        

        return res.json({ users: userData });

    } catch (err) {
        console.error("Error occurred while fetching user data:", err.message);
        return res.status(500).json({ error: err.message });
    }
})

export default router