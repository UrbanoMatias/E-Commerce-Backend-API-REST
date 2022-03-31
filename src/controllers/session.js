import config from '../config/config.js';
import UsersService from '../services/userServicepersistence.js'
import jwt from 'jsonwebtoken';
import UserDTO from '../dtos/userDTO.js'

const userService = new UsersService();

const getUsers = async(req,res)=>{
    let result = await userService.getUsers();
    let resultDTO = result.map(user=>new UserDTO(user));
    res.send(resultDTO);
} 

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
    getUsers,
    current,
    login,
    logout
}