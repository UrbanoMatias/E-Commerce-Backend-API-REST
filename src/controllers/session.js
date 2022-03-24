import config from '../config/config.js';
import {userService} from '../services/services.js';
import jwt from 'jsonwebtoken';

const current = async(req,res)=>{
    let user = req.user;
    res.send(user);
}

const login = async(req,res)=>{
    let user = req.user;
    let token = jwt.sign(user,config.jwt.SECRET);
    res.cookie(config.jwt.COOKIE,token,{
        httpOnly:true,
        maxAge:1000*60*60
    })
    res.send({status:"success",message:"Logged in"})
}

const logout = async(req,res)=>{
    res.clearCookie(config.jwt.COOKIE)
    res.send({message:"Logged Out"})
}

export default {
    current,
    login,
    logout
}