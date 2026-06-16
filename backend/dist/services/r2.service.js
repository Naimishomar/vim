"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromR2 = exports.uploadToR2 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const s3 = new client_s3_1.S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});
const uploadToR2 = async (file, folder) => {
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${folder}/${(0, uuid_1.v4)()}.${fileExt}`;
    const command = new client_s3_1.PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    });
    await s3.send(command);
    // Return both the public URL and the S3 Key
    return {
        url: `${process.env.R2_PUBLIC_URL}/${fileName}`,
        s3Key: fileName,
    };
};
exports.uploadToR2 = uploadToR2;
const deleteFromR2 = async (key) => {
    try {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME,
            Key: key,
        });
        await s3.send(command);
        console.log(`[R2 Service] Successfully deleted ${key}`);
    }
    catch (error) {
        console.error(`[R2 Service] Failed to delete ${key}:`, error);
    }
};
exports.deleteFromR2 = deleteFromR2;
//# sourceMappingURL=r2.service.js.map