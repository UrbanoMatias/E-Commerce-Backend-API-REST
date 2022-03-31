import express from 'express';
import sessionControler from "../controllers/session.js"
import { passportCall,checkAuthorization } from '../utils/middlewares.js';
import { uploader } from '../utils/uploader.js';

const router = express.Router();

router.get('/getUser',sessionControler.getUsers)

router.get('/current',passportCall('jwt'),checkAuthorization(["ADMIN","USER"]),sessionControler.current)

router.post('/',uploader.single('avatar'),passportCall('register'),(req,res)=>{
    res.send({message:"Signed up"})
})
router.post('/login',passportCall('login'),sessionControler.login)

router.get('/logout',sessionControler.logout)

export default router;
