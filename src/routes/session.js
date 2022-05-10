import express from 'express';
import sessionControler from "../controllers/session.js"
import { passportCall } from '../utils/middlewares.js';
import { uploader } from '../utils/uploader.js';

const router = express.Router();

router.get('/current',passportCall('jwt'),sessionControler.current)
router.post('/register',uploader.single('profile_picture'),passportCall('register'),(req,res)=>{
    res.send({message:"Signed up"})
})
router.post('/login',passportCall('login'),sessionControler.login)
router.get('/logout',sessionControler.logout)

export default router;
