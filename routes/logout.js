import express from 'express'
import { addLog } from './Service/logService.js'
import verifyToken from './authentication.js'

const router = express.Router()
//logout from the system
router.post('/',verifyToken,async(req,res)=>{
    try{
        const empNum = req.user.empNum
        await addLog(empNum,'LOGOUT','User logged out')
        res.json({message:'Logout succesfully'})

    }catch(err){
        console.error(err)
        res.status(500).json({message:'Logout failed'})
    }
})
export default router