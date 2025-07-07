import express from 'express'
import bcrypt from 'bcrypt'
import db from '../db/db.js'

const router = express.Router()

router.post('/',async(req,res)=>{
    const {email,password} = req.body

    const sql = "SELECT * FROM users WHERE email = ?"

    await db.query(sql,[email],async(err,results)=>{
        if(err) return res.json({message:'Server error'})

        if(results.length === 0){
            console.log(results)
            return res.json({message:"Invalid email or password"})
        }

        const user = results[0]

        const checkpassword = await bcrypt.compare(password,user.password)
        if(!checkpassword){
            return res.json({message:'Invalid email or password'})
        }
        res.json({ name:user.userName,position:user.position})
    })
})
export default router