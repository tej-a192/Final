import fs from "fs-extra";
import path from "path";
import cron from "node-cron";
import s3 from "../config/aws.mjs";
import BackupSchedule from "../models/BackupSchedule.js";
import { encryptFile } from "../utils/encrypt.js";
import jwt from "jsonwebtoken"
import FileModel from "../models/fileModel.js";

// Track active cron jobs
const activeJobs = new Map();

// Upload file to S3
const uploadToS3 = async (filePath, bucketName) => {
    try {
        const fileStream = fs.createReadStream(filePath);
        const params = {
            Bucket: bucketName,
            Key: `backups/${path.basename(filePath)}`,
            Body: fileStream,
        };

        const uploadResult = await s3.upload(params).promise();
        console.log(`✅ Successfully uploaded: ${uploadResult.Location}`);

    } catch (error) {
        console.error(`❌ Failed to upload ${filePath} to S3`, error);
    }
};



export const getFileFromS3 = async (req, res) => {
    try {
        // Get token from request headers
        const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // Verify token and extract user ID
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decoded.id; // Extract user ID

        // Find the latest uploaded file by the user in MongoDB
        const fileRecord = await FileModel.findOne({ userId }).sort({ createdAt: -1 }); // Get most recent file
        if (!fileRecord) {
            return res.status(404).json({ error: "No files found for this user" });
        }

        const fileName = fileRecord.name; // Get file name from DB
        console.log(fileName);
        
        const fileKey = `backups/${fileName}`; // Construct S3 path
        const localDownloadPath = path.join("downloads", fileName); // Local save path

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileKey,
        };

        // Ensure the local folder exists
        if (!fs.existsSync("downloads")) {
            fs.mkdirSync("downloads");
        }

        const fileStream = fs.createWriteStream(localDownloadPath);
        const s3Stream = s3.getObject(params).createReadStream();

        s3Stream.pipe(fileStream);

        fileStream.on("finish", () => {
            console.log(`✅ File downloaded successfully to: ${localDownloadPath}`);
            res.status(200).json({ message: "File downloaded", localPath: localDownloadPath });
        });

        fileStream.on("error", (error) => {
            console.error("❌ Error writing file:", error);
            res.status(500).json({ error: "Failed to write file locally" });
        });

    } catch (error) {
        console.error("❌ Error retrieving file from S3:", error);
        res.status(500).json({ error: "Failed to fetch file from S3" });
    }
};

export const listFilesInS3 = async (req, res) => {
    try {
        const params = { Bucket: process.env.AWS_S3_BUCKET_NAME };
        const { Contents } = await s3.listObjectsV2(params).promise();
        const fileKeys = Contents.map(file => file.Key);
        res.json({ files: fileKeys });
    } catch (error) {
        console.error("Error listing files:", error);
        res.status(500).json({ error: "Failed to list files in S3" });
    }
};


// Convert user-defined frequency into cron format
const getCronExpression = (frequency, interval) => {
    switch (frequency) {
        case "seconds": return `*/${interval} * * * * *`;
        case "minutes": return `*/${interval} * * * *`;
        case "hours": return `0 */${interval} * * *`;
        case "days": return `0 0 */${interval} * *`;
        case "weeks": return `0 0 * * ${interval}`; // 1 = Sunday, 2 = Monday, etc.
        default: throw new Error("Invalid frequency");
    }
};

// Execute backup logic
const executeBackup = async (backup) => {
    console.log(`📂 Running backup for user: ${backup.userId}`);
    
    const files = fs.readdirSync(backup.folderPath);
    for (const file of files) {
        const filePath = path.join(backup.folderPath, file);
    
        // Skip already encrypted files
        if (file.endsWith(".enc")) {
            console.log(`⚠️ Skipping already encrypted file: ${filePath}`);
            continue;
        }
    
        if (fs.statSync(filePath).isFile()) {
            console.log(`🔐 Encrypting file: ${filePath}`);
            const encryptedFile = encryptFile(filePath);
    
            console.log(`🚀 Uploading to S3: ${encryptedFile}`);
            await uploadToS3(encryptedFile, process.env.AWS_S3_BUCKET_NAME);
        }
    }
    
    backup.lastBackup = new Date();
    await backup.save();
    console.log(`✅ Backup completed for ${backup.userId} at ${backup.lastBackup}`);
};

// Schedule backups dynamically
const scheduleBackup = async (req, res) => {
    
    const { userId, folderPath, frequency, interval } = req.body;
    console.log(userId);
    
    try {
        if (!userId || !folderPath || !frequency || !interval) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        const cronExpression = getCronExpression(frequency, interval);
        const backup = new BackupSchedule({ userId, folderPath, frequency, interval });
        await backup.save();
        
        console.log(`📅 Backup scheduled for user ${userId} every ${interval} ${frequency}`);
        
        // Start cron job for this user
        if (activeJobs.has(userId)) {
            activeJobs.get(userId).stop(); // Stop existing job
        }
        
        const job = cron.schedule(cronExpression, async () => {
            await executeBackup(backup);
        });
        activeJobs.set(userId, job);
        
        res.status(201).json({ message: "Backup scheduled successfully" });
    } catch (error) {
        console.error("Error scheduling backup:", error);
        res.status(500).json({ error: "Failed to schedule backup" });
    }
};

export { scheduleBackup };
