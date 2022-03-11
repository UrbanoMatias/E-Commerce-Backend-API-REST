import dotenv from 'dotenv';
dotenv.config();
export default {
    mongo:{
        url:process.env.MONGO_URL||'mongodb://localhost:27017/proyecto-final'
    },
    session:{
        ADMIN:process.env.ADMIN,
        PASSWORD:process.env.PASSWORD
    },
    jwt:{
        SECRET:process.env.JWT_SECRET,
        COOKIE:process.env.JWT_COOKIE
    },
    twilio:{
        PWD:process.env.APP_PWD,
        TWILIO:process.env.TWILIO_USER,
        SID:process.env.SID,
        TOKEN:process.env.TOKEN
    }
}