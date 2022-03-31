import config from "../config/config.js";

export default class PersistenceFactory{
    static getPersistence = async() =>{
        switch(config.app.persistence){
            case "ARRAY":
                let {default:UsersDaoArray} = await import("./usersDaoArray.js")
                return new UsersDaoArray();
            case "FILE":
                let {default:UserDaoFile} = await import("./usersDaoFile.js");
                return new UserDaoFile();
    
        }  
    }
}