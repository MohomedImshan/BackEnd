import express from 'express'
import bcrypt from 'bcrypt'
import db from '../db/db.js'
import addLog from './Service/logService.js';

const router = express.Router()
//register a new user
router.post('/', async (req, res) => {
    const { userName, email, password, position } = req.body;

    if (!userName || !email || !password || !position) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email is already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (userName, email, password, position) VALUES (?, ?, ?, ?)";
        await db.query(sql, [userName, email, hashedPassword, position]);
        addLog(req.user.empNum,"Register",`${userName} Registered`)
        res.status(201).json({ message: "User registered successfully!" });

    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
