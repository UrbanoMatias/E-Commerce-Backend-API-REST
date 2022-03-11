import mongoose from 'mongoose';

let Schema = mongoose.Schema;

export default class User{
    constructor(data){
        this.data = data;
    }
    static get model(){
        return 'Users';
    }
    static get schema(){
        return {
            first_name:{
                type:String,
                required:true,
            },
            last_name:{
                type:String,
                required:true,
            },
            username:{
                type:String,
                required:true,
                unique:true,
                default:"avatar"
            },
            address:{
                type:String,
                required:true
            },
            age:{
                type:Number,
                required:true
            },
            phone:{
                type:String,
                required:true
            },
            role:{
                type:String,
                required:true
            },
            avatar:{
                type:String,
            },
            cart:[{
                type:Array
            }],
            email:{
                type:String,
                required:true,
                unique:true
            },
            password:{
                type:String,
                required:true
            }

        }
    }
}