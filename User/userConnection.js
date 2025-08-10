import express  from "express";
import bcrypt from 'bcrypt'
import db from "../db/db.js"
const router = express.Router()

router.get("/", async (req, res) => {
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

        res.status(201).json({ message: "User registered successfully!" });

    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: 'Server error' });
    }
});



export default router