import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

import './auth/passport'; 
import authRoute from './auth/authRoutes'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json()); 

//routes
app.use("/auth", authRoute); 

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`)); 