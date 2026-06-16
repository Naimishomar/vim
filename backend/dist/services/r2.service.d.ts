export declare const uploadToR2: (file: Express.Multer.File, folder: "profiles" | "ephemeral") => Promise<{
    url: string;
    s3Key: string;
}>;
export declare const deleteFromR2: (key: string) => Promise<void>;
//# sourceMappingURL=r2.service.d.ts.map