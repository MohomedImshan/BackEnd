import express  from "express";
import bcrypt from 'bcrypt'
import db from "../db/db.js"
import verifyToken from "../routes/authentication.js";
import addLog from "../routes/Service/logService.js";
const router = express.Router()

//details about users
router.get("/", verifyToken,async (req, res) => {
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
//register new user
router.post('/', verifyToken,async (req, res) => {
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
        addLog(req.user.empNum,"Register","New user Registered")

    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

// update details
router.put('/:empNum', verifyToken,async (req, res) => {
    
    const empNum = req.params.empNum;
    const { userName,email,position,status } = req.body;
    console.log("Received update for empNum:", empNum, "with status:", status);

    const sql = "UPDATE users SET userName = ? ,email = ? ,position = ?, status=? WHERE empNum=?";
    
    db.query(sql, [userName,email,position,status,empNum], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        addLog(req.user.empNum,"UPDATE STATUS",`Updated the status of Employee Number ${empNum}`)
        return res.json({ message: "User status  updated" });
    });
});

//delete user
router.delete('/:empNum',verifyToken,async (req, res) => {
    const  empNum  = req.params.empNum;
    const loggedInUser = req.user.empNum

    if(parseInt(empNum) === loggedInUser){
        return res.status(403).json({message:"You cannot delete your own account"})
    }

    const sql = "DELETE FROM users WHERE empNum=?";
    db.query(sql, [empNum], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "User deleted successfully" });
    });
});


export default router