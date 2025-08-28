import express from 'express'
import bcrypt from 'bcrypt'
import db from '../db/db.js'
import jwt from 'jsonwebtoken'
import { addLog } from './Service/logService.js'


const router = express.Router()
const SECRET_KEY = '12345';

router.post('/',async(req,res)=>{
    const {email,password} = req.body
    

    const sql = "SELECT * FROM users WHERE email = ?"

    await db.query(sql,[email],async(err,results)=>{
        if(err) return res.json({message:'Server error'})

        if(results.length === 0){
            console.log(results)
            addLog(email,"LOGIN_FAILED","Invalid email")
            return res.json({message:"Invalid email or password"})
        }

        const user = results[0]

        try{const checkpassword = await bcrypt.compare(password,user.password)
        if(!checkpassword){
            addLog(user.empNum,"LOGIN_FAILED",`wrong password for email:${email}`)
            return res.json({message:'Invalid email or password'})
        }
        const token = jwt.sign(
            {
                empNum:user.empNum,position:user.position,userName:user.userName
            },
            SECRET_KEY,{expiresIn:'1h'}
        )
        addLog(user.empNum,"LOGIN","User logged IN")
        res.json({
            token,
            empNum: user.empNum,
            position: user.position,
            userName: user.userName})
    }catch(eror){
        return res.status(500).json({ message: 'Error during login' })
    }
    })
})
export default router