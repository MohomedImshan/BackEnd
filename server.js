import express from "express";
import cors from "cors";

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

const app = express();
const port = 8800;


app.use(express.json());
app.use(cors());

app.use('/User', userConnection);
app.use('/Engineer', EngineerConnection);
app.use('/Register', registerRoutes);
app.use('/login', loginRoutes);
app.use('/Add-Employee', AddEmployeeRoute);
app.use('/requests', requestRoutes);
app.use('/notifications', notificationRoutes);
app.use('/api/spareparts', sparePartsRoutes);
app.use('/report', reportRoute);
app.use('/reject', rejectRoutes);


app.listen(port, () => console.log(`Listening on port ${port}`));
