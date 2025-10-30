import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import userConnection from './User/userConnection.js';
import EngineerConnection from './User/EngineerConnection.js';
import registerRoutes from './routes/registerRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import AddEmployeeRoute from './User/AddEmployeeRoute.js';
import requestRoutes from './routes/requestRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import sparePartsRoutes from './routes/sparePartsRoutes.js';
import reportRoute from './routes/reportRoute.js'
import rejectRoutes from './routes/rejectRoutes.js' 
import assistentengineerroutes from './User/assistentengineerroutes.js'
import technicianRoutes from './User/technicianRoutes.js'
import ownrequestsRoutes from './routes/ownrequestsRoutes.js'
import logfileRoute from './routes/logfileRoute.js'
import transaction from './routes/transactionRoute.js'
import logout from './routes/logout.js'
import headerroute from './routes/headerroute.js'
//import  AddTransaction from './routes/Service/transactionService.js'

const app = express()
const port = 8800

app.use(express.json())
app.use(cors())
app.use(bodyParser.json())

app.use('/User',userConnection)
app.use('/EngineerDashboard',EngineerConnection)
app.use('/Register',registerRoutes)
app.use('/login',loginRoutes)
app.use('/Add-Employee',AddEmployeeRoute)
app.use('/User',userConnection);
app.use('/Engineer',EngineerConnection);
app.use('/api/register',registerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/spareparts', sparePartsRoutes);
app.use('/report', reportRoute);
app.use('/reject', rejectRoutes);
app.use('/ownrequests', ownrequestsRoutes);
app.use('/Assistant-Engineer', assistentengineerroutes);
app.use('/Technician', technicianRoutes);
app.use('/logfile',logfileRoute);
app.use('/transaction',transaction);
app.use('/logout',logout)
app.use('/header',headerroute)
//app.use('/AddTransaction',AddTransaction)


app.listen(port, () => console.log(`Listening on port ${port}`));