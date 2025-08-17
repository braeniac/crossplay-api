import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
const bodyParser = require("body-parser");
import './auth/passport'; 
import authRoute from './auth/authRoutes'; 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

//routes
app.use("/auth", authRoute); 

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`)); 