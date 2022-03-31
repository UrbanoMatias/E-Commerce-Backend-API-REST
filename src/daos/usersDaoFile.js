import __dirname from "../utils.js";
import fs from "fs";

export default class UserDaoFile{
    constructor(){
        this.path = __dirname+"/files/users.json"
        this.init();
    }
    init = async () =>{
        if(!fs.existsSync(this.path)) await fs.promises.writeFile(this.path,JSON.stringify([]))
    }
    readFile = async() =>{
        let data = await fs.promises.readFile(this.path,"utf-8");
        return JSON.parse(data)
    }
    getAll = async()=>{
        return await this.readFile();
    }
    save =async(user) =>{
        try {
            let users = await this.readFile();
            if(users.length===0) user.id = 1;
            else user.id = users[users.lenght-1].id+1;
            users.push(user);
            await fs.promises.writeFile(this.path,JSON.stringify(users,null,"\t"));
            return user;
        } catch (error) {
            console.log(error);
            return new Error("Cannot read file")
        }
        
    }
}