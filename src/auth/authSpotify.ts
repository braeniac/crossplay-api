import express, { Response, Request } from "express"; 
const router = express.Router(); 


import ProviderAccount from "../models/ProviderAccount";
import User from "../models/User";


//@route     GET /auth/spotify
//@desc      Redirect to spotify
//@access    Public
router.get("/spotify", (req : Request, res : Response) => {



})

export default router; 