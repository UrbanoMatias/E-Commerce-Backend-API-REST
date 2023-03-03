import { fileURLToPath } from "url";
import { dirname } from "path";

const filename = fileURLToPath(import.meta.url);
const __dirname = dirname(filename);

export default __dirname;

import aws from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import config from "./config/config.js";
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: config.aws.ACCESS_KEY,
    secretAccessKey: config.aws.SECRET,
  },
  sslEnabled: false,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

export const uploader = multer({
  storage: multerS3({
    s3: s3,
    bucket: "urbanoeccomercebucket",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString() + file.originalname);
    },
  }),
});
