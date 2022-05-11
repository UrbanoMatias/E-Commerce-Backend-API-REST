import aws from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import config from '../config/config.js';

const s3 = new aws.S3({
    accessKeyId:config.aws.ACCESS_KEY,
    secretAccessKey:config.aws.SECRET
})

export const uploader = multer({
    storage:multerS3({
        s3:s3,
        bucket:'e-commerce-urbano',
        metadata:(req,file,cb)=>{
            cb(null,{fieldName:file.fieldname})
        },
        key:(req,file,cb)=>{
            cb(null,Date.now().toString()+file.originalname)
        }
    })
})