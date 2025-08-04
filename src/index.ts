
import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());

//routes
app.get('/', (req: Request, res: Response) => {
  res.send("In working order!");
})

//start server
app.listen(PORT, () => {
  console.log(`server running on PORT: ${PORT}`)
});
