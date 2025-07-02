import express from 'express'
import bcrypt from 'bcrypt'
import db from "../db/db.js";
const router = express.Router()

router.post('/',async (req,res)=>{
    const {userName,email,password,position} = req.body

    try{
        const existingUser = await db.query("SELECT * FROM users WHERE email = ?",[email])
        // console.log(existingUser);

        if(existingUser.length > 0){
            return res.json({message:'Email is already registered'})
        }
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(password,saltRounds)
        console.log(hashedPassword);

        const sql = "INSERT INTO user_table (userName,email,password,position) VALUES (?,?,?,?)"
        await db.query(sql,[userName,email,hashedPassword,position])

        res.json({message:"User registered successfully!"})
    }catch(err){
        console.log("Error registering user : ",err)
        res.json({message:'Server error'})
    }
})

export default router