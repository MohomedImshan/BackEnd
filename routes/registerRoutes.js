import express from 'express'
import bcrypt from 'bcrypt'
import db from '../db/db.js'

const router = express.Router()

router.post('/', async (req, res)=> {
   // console.log("POST /register hit")
    //console.log("Request body received:",req.body);
    const { userName, email, password, position } = req.body;

    // if (!userName || !email || !password || !position) {
    //     return res.status(400).json({ message: "All fields are required" });
    // }

    try {
        const existingUser = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (existingUser.length > 0) {
            return res.json({ message: "Email is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const sql = "INSERT INTO users (userName, email, password, position) VALUES (?, ?, ?, ?)"
        await db.query(sql, [userName, email, hashedPassword, position])
        res.json({ message: "User registered successfully!" })

    } catch (err) {
        console.log("Registration error:", err);
        res.json({ message: 'Server error' });
    }
});

export default router
