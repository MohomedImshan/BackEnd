import express from 'express'
import bcrypt from 'bcrypt'
import db from '../db/db.js'
import jwt from 'jsonwebtoken'
import { addLog } from './Service/logService.js'


const router = express.Router()
const SECRET_KEY = '12345';
//login to the system using email or password
router.post('/',async(req,res)=>{
    const {identifier,password} = req.body
    
    const isEmail = identifier.includes('@')
    const sql = isEmail
                ? "SELECT * FROM users WHERE email= ? "
                :"SELECT * FROM users WHERE userName = ?"
   

    await db.query(sql,[identifier],async(err,results)=>{
        if(err) return res.json({message:'Server error'})

        if(results.length === 0){
            console.log(results)
            addLog(identifier,"LOGIN_FAILED","Invalid email")
            return res.json({message:"Invalid email or password"})
        }

        const user = results[0]

        if(user.status !== "Active"){
            addLog(user.empNum,'Login Failed',`Attempted login but account is ${user.status}`)
            return res.status(403).json({message:"Your account us not active,Contact admin..."})
        }

        try{
            //comparing the password
            const checkpassword = await bcrypt.compare(password,user.password)
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